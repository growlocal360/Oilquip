"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload, X, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import slugify from "slugify";

export default function NewBrandPage() {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

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

    const response = await fetch("/api/brands", {
      method: "POST",
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
      alert(error.error || "Failed to create brand");
    }

    setSaving(false);
  };

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
            <h1 className="text-3xl font-bold text-steel-100">Add Brand</h1>
            <p className="text-steel-400 mt-1">
              Add a new product brand or manufacturer
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
                  <button
                    type="button"
                    onClick={clearLogo}
                    className="p-2 text-steel-400 hover:text-red-400 rounded transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="border-2 border-dashed border-steel-700 hover:border-accent-500/50 rounded-lg p-8 text-center cursor-pointer transition-colors"
                >
                  <Upload className="h-10 w-10 text-steel-500 mx-auto mb-4" />
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
                <span className="text-steel-300">Publish immediately</span>
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
              <span>{saving ? "Saving..." : "Save Brand"}</span>
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}
