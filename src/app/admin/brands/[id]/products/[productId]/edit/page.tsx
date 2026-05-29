"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload, X, Plus, Minus, FileText, Download, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import slugify from "slugify";
import type { Brand, ProductResource } from "@/lib/types";

const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;
const MAX_UPLOAD_MB = MAX_UPLOAD_BYTES / 1024 / 1024;

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
import type { JSONContent } from "@tiptap/react";
import RichTextEditor from "@/components/editor/RichTextEditor";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const brandId = params.id as string;
  const productId = params.productId as string;
  const imageInputRef = useRef<HTMLInputElement>(null);
  const resourceInputRef = useRef<HTMLInputElement>(null);

  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [description, setDescription] = useState<JSONContent | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [published, setPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  // Resources
  const [resources, setResources] = useState<ProductResource[]>([]);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [uploadingResource, setUploadingResource] = useState(false);
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch brand
      const { data: brandData } = await supabase
        .from("brands")
        .select("*")
        .eq("id", brandId)
        .single();

      if (!brandData) {
        router.push("/admin/brands");
        return;
      }
      setBrand(brandData);

      // Fetch product
      const { data: product, error } = await supabase
        .from("brand_products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error || !product) {
        alert("Product not found");
        router.push(`/admin/brands/${brandId}/edit`);
        return;
      }

      setName(product.name);
      setSlug(product.slug);
      setModelNumber(product.model_number || "");
      setDescription(product.description || null);
      setImageUrl(product.image_url || "");
      setPublished(product.published);
      setDisplayOrder(product.display_order);

      // Convert specs object to array
      if (product.specs && typeof product.specs === "object") {
        const specsArray = Object.entries(product.specs).map(([key, value]) => ({
          key,
          value: String(value),
        }));
        setSpecs(specsArray);
      }

      // Fetch product resources
      const { data: resourcesData } = await supabase
        .from("product_resources")
        .select("*")
        .eq("product_id", productId)
        .order("display_order", { ascending: true });

      setResources(resourcesData || []);

      setLoading(false);
    };

    fetchData();
  }, [brandId, productId, router]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === slugify(name, { lower: true, strict: true })) {
      setSlug(slugify(value, { lower: true, strict: true }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const uniqueName = `products/${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("brands")
        .upload(uniqueName, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("brands").getPublicUrl(uniqueName);

      setImageUrl(publicUrl);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
    }

    setUploadingImage(false);
  };

  const clearImage = () => {
    setImageUrl("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_UPLOAD_BYTES) {
      alert(
        `File is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is ${MAX_UPLOAD_MB} MB. Please compress the PDF and try again.`
      );
      if (resourceInputRef.current) resourceInputRef.current.value = "";
      return;
    }

    const title = newResourceTitle.trim() || file.name.replace(/\.[^.]+$/, "");

    setUploadingResource(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const uniqueName = `datasheets/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 11)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("brands")
        .upload(uniqueName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("brands").getPublicUrl(uniqueName);

      const response = await fetch(`/api/products/${productId}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          file_url: publicUrl,
          file_size: file.size,
          file_type: file.type || fileExt || null,
          display_order: resources.length,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save resource");
      }

      const created: ProductResource = await response.json();
      setResources([...resources, created]);
      setNewResourceTitle("");
      if (resourceInputRef.current) resourceInputRef.current.value = "";
    } catch (err) {
      console.error("Resource upload error:", err);
      alert(err instanceof Error ? err.message : "Failed to upload resource");
    }

    setUploadingResource(false);
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm("Delete this resource?")) return;

    setDeletingResourceId(resourceId);
    const response = await fetch(`/api/product-resources/${resourceId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setResources(resources.filter((r) => r.id !== resourceId));
    }
    setDeletingResourceId(null);
  };

  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    setSaving(true);

    const specsObj: Record<string, string> = {};
    specs.forEach((spec) => {
      if (spec.key.trim()) {
        specsObj[spec.key.trim()] = spec.value.trim();
      }
    });

    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        model_number: modelNumber || null,
        description: description || null,
        image_url: imageUrl || null,
        specs: Object.keys(specsObj).length > 0 ? specsObj : null,
        published,
        display_order: displayOrder,
      }),
    });

    if (response.ok) {
      router.push(`/admin/brands/${brandId}/edit`);
    } else {
      const error = await response.json();
      alert(error.error || "Failed to update product");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-steel-400">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href={`/admin/brands/${brandId}/edit`}
            className="p-2 text-steel-400 hover:text-steel-200 hover:bg-steel-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-steel-100">Edit Product</h1>
            <p className="text-steel-400 mt-1">
              Update product details for {brand?.name}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Product Image
              </label>
              {imageUrl ? (
                <div className="flex items-center justify-between p-4 bg-steel-800 border border-steel-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-steel-700 flex items-center justify-center">
                      <Image
                        src={imageUrl}
                        alt="Product image"
                        width={64}
                        height={64}
                        className="object-contain p-1"
                      />
                    </div>
                    <p className="text-steel-100 font-medium">Image uploaded</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="px-3 py-1.5 text-sm text-accent-400 hover:text-accent-300 border border-accent-500/30 hover:border-accent-500/50 rounded-lg transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="p-2 text-steel-400 hover:text-red-400 rounded transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-steel-700 hover:border-accent-500/50 rounded-lg p-8 text-center cursor-pointer transition-colors"
                >
                  <Upload className={`h-10 w-10 text-steel-500 mx-auto mb-4 ${uploadingImage ? "animate-pulse" : ""}`} />
                  <p className="text-steel-300 mb-1">
                    {uploadingImage ? "Uploading..." : "Click to upload product image"}
                  </p>
                  <p className="text-steel-500 text-sm">PNG, JPG, WebP recommended</p>
                </div>
              )}
              <input
                ref={imageInputRef}
                type="file"
                onChange={handleImageChange}
                className="hidden"
                accept=".png,.jpg,.jpeg,.webp"
              />
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                placeholder="e.g. Quick Connect Coupling"
                required
              />
            </motion.div>

            {/* Slug */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                URL Slug *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 bg-steel-800 border border-r-0 border-steel-700 rounded-l-lg text-steel-500 text-sm">
                  /brands/{brand?.slug}/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-r-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                  placeholder="product-slug"
                  required
                />
              </div>
            </motion.div>

            {/* Model Number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Model / Part Number
              </label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                placeholder="e.g. VEP-12-08-F"
              />
            </motion.div>

            {/* Description (Rich Text) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Description
              </label>
              <RichTextEditor
                content={description}
                onChange={setDescription}
                placeholder="Product description..."
              />
            </motion.div>

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Specifications
              </label>
              <div className="space-y-3">
                {specs.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => updateSpec(index, "key", e.target.value)}
                      className="flex-1 px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                      placeholder="Specification name"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => updateSpec(index, "value", e.target.value)}
                      className="flex-1 px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                      placeholder="Value"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="p-3 text-steel-400 hover:text-red-400 hover:bg-steel-800 rounded-lg transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpec}
                  className="inline-flex items-center px-4 py-2 text-sm text-accent-400 hover:text-accent-300 border border-accent-500/30 hover:border-accent-500/50 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Display Order */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-steel-900 border border-steel-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-steel-100 mb-4">
                Display Order
              </h3>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 outline-none transition-colors"
                min="0"
              />
            </motion.div>

            {/* Visibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-steel-900 border border-steel-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-steel-100 mb-4">
                Visibility
              </h3>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-5 h-5 rounded border-steel-600 bg-steel-800 text-accent-500 focus:ring-accent-500 focus:ring-offset-steel-900"
                />
                <span className="text-steel-300">Published</span>
              </label>
            </motion.div>

            {/* Save Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              type="submit"
              disabled={saving || !name || !slug}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 disabled:from-steel-700 disabled:to-steel-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25 disabled:shadow-none"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </motion.button>
          </div>
        </div>
      </form>

      {/* Documents Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-steel-100">
            Documents &amp; Brochures
          </h2>
          <p className="text-steel-400 mt-1">
            Datasheets, spec sheets, install manuals, and other downloads shown
            on the public product page
          </p>
        </div>

        {/* Add Resource */}
        <div className="bg-steel-900 border border-steel-700 rounded-xl p-6 mb-4">
          <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Title (optional)
              </label>
              <input
                type="text"
                value={newResourceTitle}
                onChange={(e) => setNewResourceTitle(e.target.value)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                placeholder="Defaults to filename if blank"
              />
            </div>
            <button
              type="button"
              onClick={() => resourceInputRef.current?.click()}
              disabled={uploadingResource}
              className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 disabled:from-steel-700 disabled:to-steel-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-accent-500/25 disabled:shadow-none"
            >
              <Upload
                className={`h-5 w-5 mr-2 ${uploadingResource ? "animate-pulse" : ""}`}
              />
              {uploadingResource ? "Uploading..." : "Upload File"}
            </button>
            <input
              ref={resourceInputRef}
              type="file"
              onChange={handleResourceUpload}
              className="hidden"
            />
          </div>
          <p className="text-steel-500 text-xs mt-3">
            Up to {MAX_UPLOAD_MB} MB per file
          </p>
        </div>

        {/* Resources List */}
        <div className="bg-steel-900 border border-steel-700 rounded-xl overflow-hidden">
          {resources.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-steel-600 mx-auto mb-4" />
              <p className="text-steel-400">No documents yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-steel-700 bg-steel-800/50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                    Title
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                    Size
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-steel-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {resources.map((resource, index) => (
                  <motion.tr
                    key={resource.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-steel-800 hover:bg-steel-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-steel-500 flex-shrink-0" />
                        <p className="text-steel-100 font-medium">
                          {resource.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-steel-400 text-sm uppercase">
                      {resource.file_type?.split("/").pop() || "-"}
                    </td>
                    <td className="px-6 py-4 text-steel-400 text-sm">
                      {formatFileSize(resource.file_size)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={resource.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-steel-400 hover:text-accent-400 hover:bg-steel-800 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteResource(resource.id)}
                          disabled={deletingResourceId === resource.id}
                          className="p-2 text-steel-400 hover:text-red-400 hover:bg-steel-800 rounded transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
