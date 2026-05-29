"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Building2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Package,
  FileText,
  Download,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import slugify from "slugify";
import type { Brand, BrandProduct, BrandResource } from "@/lib/types";

const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;
const MAX_UPLOAD_MB = MAX_UPLOAD_BYTES / 1024 / 1024;

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function EditBrandPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  // Products
  const [products, setProducts] = useState<BrandProduct[]>([]);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Resources
  const resourceInputRef = useRef<HTMLInputElement>(null);
  const [resources, setResources] = useState<BrandResource[]>([]);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [uploadingResource, setUploadingResource] = useState(false);
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data: brand, error } = await supabase
        .from("brands")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !brand) {
        alert("Brand not found");
        router.push("/admin/brands");
        return;
      }

      setName(brand.name);
      setSlug(brand.slug);
      setDescription(brand.description || "");
      setWebsiteUrl(brand.website_url || "");
      setLogoUrl(brand.logo_url || "");
      setPublished(brand.published);
      setDisplayOrder(brand.display_order);

      // Fetch products
      const { data: productsData } = await supabase
        .from("brand_products")
        .select("*")
        .eq("brand_id", id)
        .order("display_order", { ascending: true });

      setProducts(productsData || []);

      // Fetch resources
      const { data: resourcesData } = await supabase
        .from("brand_resources")
        .select("*")
        .eq("brand_id", id)
        .order("display_order", { ascending: true });

      setResources(resourcesData || []);
      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === slugify(name, { lower: true, strict: true })) {
      setSlug(slugify(value, { lower: true, strict: true }));
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const uniqueName = `logos/${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("brands")
        .upload(uniqueName, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("brands").getPublicUrl(uniqueName);

      setLogoUrl(publicUrl);
    } catch (error) {
      console.error("Logo upload error:", error);
      alert("Failed to upload logo. Please try again.");
    }

    setUploading(false);
  };

  const clearLogo = () => {
    setLogoUrl("");
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    setSaving(true);

    const response = await fetch(`/api/brands/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        description: description || null,
        website_url: websiteUrl || null,
        logo_url: logoUrl || null,
        published,
        display_order: displayOrder,
      }),
    });

    if (response.ok) {
      router.push("/admin/brands");
    } else {
      const error = await response.json();
      alert(error.error || "Failed to update brand");
    }

    setSaving(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeletingProductId(productId);
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setProducts(products.filter((p) => p.id !== productId));
    }
    setDeletingProductId(null);
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
      const uniqueName = `resources/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 11)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("brands")
        .upload(uniqueName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("brands").getPublicUrl(uniqueName);

      const response = await fetch(`/api/brands/${id}/resources`, {
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

      const created: BrandResource = await response.json();
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
    const response = await fetch(`/api/brand-resources/${resourceId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setResources(resources.filter((r) => r.id !== resourceId));
    }
    setDeletingResourceId(null);
  };

  const toggleProductPublish = async (product: BrandProduct) => {
    const response = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !product.published }),
    });

    if (response.ok) {
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, published: !p.published } : p
        )
      );
    }
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
            href="/admin/brands"
            className="p-2 text-steel-400 hover:text-steel-200 hover:bg-steel-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-steel-100">Edit Brand</h1>
            <p className="text-steel-400 mt-1">
              Update brand details and manage products
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Brand Logo
              </label>
              {logoUrl ? (
                <div className="flex items-center justify-between p-4 bg-steel-800 border border-steel-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                      <Image
                        src={logoUrl}
                        alt="Brand logo"
                        width={64}
                        height={64}
                        className="object-contain p-2"
                      />
                    </div>
                    <p className="text-steel-100 font-medium">Logo uploaded</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3 py-1.5 text-sm text-accent-400 hover:text-accent-300 border border-accent-500/30 hover:border-accent-500/50 rounded-lg transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={clearLogo}
                      className="p-2 text-steel-400 hover:text-red-400 rounded transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="border-2 border-dashed border-steel-700 hover:border-accent-500/50 rounded-lg p-8 text-center cursor-pointer transition-colors"
                >
                  <Upload className={`h-10 w-10 text-steel-500 mx-auto mb-4 ${uploading ? "animate-pulse" : ""}`} />
                  <p className="text-steel-300 mb-1">
                    {uploading ? "Uploading..." : "Click to upload brand logo"}
                  </p>
                  <p className="text-steel-500 text-sm">
                    PNG, JPG, SVG recommended
                  </p>
                </div>
              )}
              <input
                ref={logoInputRef}
                type="file"
                onChange={handleLogoChange}
                className="hidden"
                accept=".png,.jpg,.jpeg,.svg,.webp"
              />
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Brand Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                placeholder="e.g. Stucchi"
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
                  /brands/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-r-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                  placeholder="brand-slug"
                  required
                />
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors resize-none"
                placeholder="Brief description of this brand..."
              />
            </motion.div>

            {/* Website URL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                placeholder="https://www.example.com"
              />
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
              <p className="text-steel-500 text-sm mt-2">
                Lower numbers appear first in the carousel and grid
              </p>
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

      {/* Products Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-steel-100">Products</h2>
            <p className="text-steel-400 mt-1">
              Manage products for this brand
            </p>
          </div>
          <Link
            href={`/admin/brands/${id}/products/new`}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-accent-500/25"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Link>
        </div>

        <div className="bg-steel-900 border border-steel-700 rounded-xl overflow-hidden">
          {products.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 text-steel-600 mx-auto mb-4" />
              <p className="text-steel-400 mb-4">No products yet</p>
              <Link
                href={`/admin/brands/${id}/products/new`}
                className="text-accent-400 hover:text-accent-300"
              >
                Add the first product
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-steel-700 bg-steel-800/50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                    Product
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                    Model #
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-steel-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-steel-800 hover:bg-steel-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-steel-800 flex items-center justify-center flex-shrink-0">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-contain p-1"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-steel-500" />
                          )}
                        </div>
                        <p className="text-steel-100 font-medium">
                          {product.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-steel-400 text-sm">
                      {product.model_number || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleProductPublish(product)}
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                          product.published
                            ? "bg-green-500/10 text-green-400"
                            : "bg-steel-700 text-steel-400"
                        }`}
                      >
                        {product.published ? (
                          <>
                            <Eye className="h-3 w-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/brands/${id}/products/${product.id}/edit`}
                          className="p-2 text-steel-400 hover:text-accent-400 hover:bg-steel-800 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deletingProductId === product.id}
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

      {/* Resources Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-12"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-steel-100">
            Catalogs &amp; Brochures
          </h2>
          <p className="text-steel-400 mt-1">
            Brand-level files (catalogs, brochures, brand guides) shown on the
            public brand page
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
              <Upload className={`h-5 w-5 mr-2 ${uploadingResource ? "animate-pulse" : ""}`} />
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
              <p className="text-steel-400">No catalogs or brochures yet</p>
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
