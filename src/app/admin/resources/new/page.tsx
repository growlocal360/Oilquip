"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload, FileText, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ResourceCategory } from "@/lib/types";

export default function NewResourcePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileName, setFileName] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("resource_categories")
        .select("*")
        .order("display_order");

      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

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
      const { data: { publicUrl } } = supabase.storage
        .from("resources")
        .getPublicUrl(uniqueName);

      setFileUrl(publicUrl);
      setFileType(file.type);
      setFileSize(file.size);

      // Auto-fill title from filename if empty
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setTitle(nameWithoutExt.replace(/[-_]/g, " "));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Please try again.");
      setFileName("");
    }

    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileUrl) return;

    setSaving(true);

    const response = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || null,
        category_id: categoryId || null,
        file_url: fileUrl,
        file_type: fileType || null,
        file_size: fileSize || null,
        published,
      }),
    });

    if (response.ok) {
      router.push("/admin/resources");
    } else {
      const error = await response.json();
      alert(error.error || "Failed to create resource");
    }

    setSaving(false);
  };

  const clearFile = () => {
    setFileUrl("");
    setFileName("");
    setFileType("");
    setFileSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
            <h1 className="text-3xl font-bold text-steel-100">Upload Resource</h1>
            <p className="text-steel-400 mt-1">
              Add a new downloadable file or document
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                File *
              </label>
              {fileUrl ? (
                <div className="flex items-center justify-between p-4 bg-steel-800 border border-steel-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent-500/10 rounded-lg">
                      <FileText className="h-5 w-5 text-accent-500" />
                    </div>
                    <div>
                      <p className="text-steel-100 font-medium">{fileName}</p>
                      <p className="text-steel-500 text-sm">
                        {(fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="p-2 text-steel-400 hover:text-red-400 rounded transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-steel-700 hover:border-accent-500/50 rounded-lg p-8 text-center cursor-pointer transition-colors"
                >
                  <Upload className="h-10 w-10 text-steel-500 mx-auto mb-4" />
                  <p className="text-steel-300 mb-1">
                    {uploading ? "Uploading..." : "Click to upload a file"}
                  </p>
                  <p className="text-steel-500 text-sm">
                    PDF, PNG, JPG, SVG, ZIP up to 10MB
                  </p>
                </div>
              )}
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
              transition={{ delay: 0.05 }}
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
              transition={{ delay: 0.1 }}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
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
                <span className="text-steel-300">Publish immediately</span>
              </label>
            </motion.div>

            {/* Save Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              type="submit"
              disabled={saving || !title || !fileUrl}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 disabled:from-steel-700 disabled:to-steel-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25 disabled:shadow-none"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? "Saving..." : "Save Resource"}</span>
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}
