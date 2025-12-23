"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload, FileText, X, RefreshCw, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Resource, ResourceCategory } from "@/lib/types";

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileName, setFileName] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [originalFileName, setOriginalFileName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from("resource_categories")
        .select("*")
        .order("display_order");

      setCategories(categoriesData || []);

      // Fetch resource
      const { data: resource, error } = await supabase
        .from("resources")
        .select("*, category:resource_categories(*)")
        .eq("id", id)
        .single();

      if (error || !resource) {
        alert("Resource not found");
        router.push("/admin/resources");
        return;
      }

      setTitle(resource.title);
      setDescription(resource.description || "");
      setCategoryId(resource.category_id || "");
      setFileUrl(resource.file_url);
      setFileType(resource.file_type || "");
      setFileSize(resource.file_size || 0);
      setThumbnailUrl(resource.thumbnail_url || "");
      setPublished(resource.published);

      // Extract filename from URL
      const urlParts = resource.file_url.split("/");
      const storedFileName = urlParts[urlParts.length - 1];
      setFileName(storedFileName);
      setOriginalFileName(storedFileName);

      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const supabase = createClient();

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${fileExt}`;

      // Upload directly to Supabase storage
      const { data, error } = await supabase.storage
        .from("resources")
        .upload(uniqueName, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("resources").getPublicUrl(uniqueName);

      setFileUrl(publicUrl);
      setFileType(file.type);
      setFileSize(file.size);
      setFileName(file.name);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Please try again.");
    }

    setUploading(false);
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);

    try {
      const supabase = createClient();

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const uniqueName = `thumbnails/${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${fileExt}`;

      // Upload directly to Supabase storage
      const { data, error } = await supabase.storage
        .from("resources")
        .upload(uniqueName, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("resources").getPublicUrl(uniqueName);

      setThumbnailUrl(publicUrl);
    } catch (error) {
      console.error("Thumbnail upload error:", error);
      alert("Failed to upload thumbnail. Please try again.");
    }

    setUploadingThumbnail(false);
  };

  const clearThumbnail = () => {
    setThumbnailUrl("");
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileUrl) return;

    setSaving(true);

    const response = await fetch(`/api/resources/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || null,
        category_id: categoryId || null,
        file_url: fileUrl,
        file_type: fileType || null,
        file_size: fileSize || null,
        thumbnail_url: thumbnailUrl || null,
        published,
      }),
    });

    if (response.ok) {
      router.push("/admin/resources");
    } else {
      const error = await response.json();
      alert(error.error || "Failed to update resource");
    }

    setSaving(false);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
            href="/admin/resources"
            className="p-2 text-steel-400 hover:text-steel-200 hover:bg-steel-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-steel-100">Edit Resource</h1>
            <p className="text-steel-400 mt-1">
              Update resource details or replace the file
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current File */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Current File
              </label>
              <div className="flex items-center justify-between p-4 bg-steel-800 border border-steel-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent-500/10 rounded-lg">
                    <FileText className="h-5 w-5 text-accent-500" />
                  </div>
                  <div>
                    <p className="text-steel-100 font-medium">{fileName}</p>
                    <p className="text-steel-500 text-sm">
                      {formatFileSize(fileSize)}
                    </p>
                  </div>
                </div>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm text-accent-400 hover:text-accent-300 border border-accent-500/30 hover:border-accent-500/50 rounded-lg transition-colors"
                >
                  Preview
                </a>
              </div>
            </motion.div>

            {/* Replace File */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Replace File (optional)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-steel-700 hover:border-accent-500/50 rounded-lg p-6 text-center cursor-pointer transition-colors"
              >
                <RefreshCw
                  className={`h-8 w-8 text-steel-500 mx-auto mb-3 ${uploading ? "animate-spin" : ""}`}
                />
                <p className="text-steel-300 mb-1">
                  {uploading ? "Uploading..." : "Click to upload a new file"}
                </p>
                <p className="text-steel-500 text-sm">
                  PDF, PNG, JPG, SVG, ZIP up to 10MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.svg,.zip"
              />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                placeholder="Resource title"
                required
              />
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
                rows={3}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors resize-none"
                placeholder="Brief description of this resource..."
              />
            </motion.div>

            {/* Thumbnail Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Preview Image (optional)
              </label>
              <p className="text-steel-500 text-sm mb-3">
                Add a preview image for PDFs and other non-image files
              </p>
              {thumbnailUrl ? (
                <div className="flex items-center justify-between p-4 bg-steel-800 border border-steel-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-steel-700">
                      <img
                        src={thumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-steel-100 font-medium">Thumbnail uploaded</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearThumbnail}
                    className="p-2 text-steel-400 hover:text-red-400 rounded transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="border-2 border-dashed border-steel-700 hover:border-accent-500/50 rounded-lg p-6 text-center cursor-pointer transition-colors"
                >
                  <ImageIcon className={`h-8 w-8 text-steel-500 mx-auto mb-3 ${uploadingThumbnail ? "animate-pulse" : ""}`} />
                  <p className="text-steel-300 mb-1">
                    {uploadingThumbnail ? "Uploading..." : "Click to upload preview image"}
                  </p>
                  <p className="text-steel-500 text-sm">PNG, JPG up to 2MB</p>
                </div>
              )}
              <input
                ref={thumbnailInputRef}
                type="file"
                onChange={handleThumbnailChange}
                className="hidden"
                accept=".png,.jpg,.jpeg"
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-steel-900 border border-steel-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-steel-100 mb-4">
                Category
              </h3>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 outline-none transition-colors"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Visibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
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
              transition={{ delay: 0.3 }}
              type="submit"
              disabled={saving || !title || !fileUrl}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 disabled:from-steel-700 disabled:to-steel-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25 disabled:shadow-none"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}
