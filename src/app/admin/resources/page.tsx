"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Resource } from "@/lib/types";

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchResources = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("resources")
      .select("*, category:resource_categories(*)")
      .order("created_at", { ascending: false });

    setResources(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    setDeleteId(id);
    const response = await fetch(`/api/resources/${id}`, { method: "DELETE" });

    if (response.ok) {
      setResources(resources.filter((r) => r.id !== id));
    }
    setDeleteId(null);
  };

  const togglePublish = async (resource: Resource) => {
    const response = await fetch(`/api/resources/${resource.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !resource.published }),
    });

    if (response.ok) {
      fetchResources();
    }
  };

  const getFileIcon = (fileType: string | null) => {
    if (fileType?.startsWith("image")) return ImageIcon;
    return FileText;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-steel-100">Resources</h1>
          <p className="text-steel-400 mt-1">
            Manage downloadable files and documents
          </p>
        </div>
        <Link
          href="/admin/resources/new"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
        >
          <Plus className="h-5 w-5 mr-2" />
          Upload Resource
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-steel-500" />
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-steel-900 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
        />
      </div>

      {/* Resources List */}
      <div className="bg-steel-900 border border-steel-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-steel-400">Loading...</div>
        ) : filteredResources.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-steel-400 mb-4">No resources found</p>
            <Link
              href="/admin/resources/new"
              className="text-accent-400 hover:text-accent-300"
            >
              Upload your first resource
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-steel-700 bg-steel-800/50">
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Resource
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Size
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Downloads
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
              {filteredResources.map((resource, index) => {
                const FileIcon = getFileIcon(resource.file_type);
                return (
                  <motion.tr
                    key={resource.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-steel-800 hover:bg-steel-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-accent-500/10 rounded-lg">
                          <FileIcon className="h-5 w-5 text-accent-500" />
                        </div>
                        <div>
                          <p className="text-steel-100 font-medium">
                            {resource.title}
                          </p>
                          {resource.description && (
                            <p className="text-steel-500 text-sm truncate max-w-xs">
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-steel-400 text-sm">
                      {resource.category?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-steel-400 text-sm">
                      {formatFileSize(resource.file_size)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-steel-400 text-sm">
                        <Download className="h-4 w-4" />
                        <span>{resource.download_count}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(resource)}
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                          resource.published
                            ? "bg-green-500/10 text-green-400"
                            : "bg-steel-700 text-steel-400"
                        }`}
                      >
                        {resource.published ? (
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
                        <a
                          href={resource.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-steel-400 hover:text-accent-400 hover:bg-steel-800 rounded transition-colors"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(resource.id)}
                          disabled={deleteId === resource.id}
                          className="p-2 text-steel-400 hover:text-red-400 hover:bg-steel-800 rounded transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
