"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  FileText,
  File,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { PortalDocument } from "@/lib/types";

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function EditProjectPage() {
  const params = useParams();
  const customerId = params.id as string;
  const projectId = params.projectId as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [documents, setDocuments] = useState<PortalDocument[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data: project } = await supabase
        .from("portal_projects")
        .select("*, portal_documents(*)")
        .eq("id", projectId)
        .single();

      if (project) {
        setName(project.name);
        setDescription(project.description || "");
        setStatus(project.status);
        setDocuments(project.portal_documents || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setSaving(true);

    const response = await fetch(`/api/portal/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: description || null,
        status,
      }),
    });

    if (response.ok) {
      alert("Project updated successfully");
    } else {
      const error = await response.json();
      alert(error.error || "Failed to update project");
    }

    setSaving(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const uniqueName = `documents/${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("portal")
        .upload(uniqueName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("portal").getPublicUrl(uniqueName);

      // Create document record
      const response = await fetch(
        `/api/portal/projects/${projectId}/documents`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            file_url: publicUrl,
            file_type: file.type,
            file_size: file.size,
          }),
        }
      );

      if (response.ok) {
        const newDoc = await response.json();
        setDocuments([newDoc, ...documents]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload document. Please try again.");
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const deleteDocument = async (docId: string) => {
    if (!confirm("Delete this document?")) return;

    const response = await fetch(`/api/portal/documents/${docId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setDocuments(documents.filter((d) => d.id !== docId));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-steel-800 rounded" />
        <div className="h-64 bg-steel-900 rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <Link
          href={`/admin/portal/customers/${customerId}/edit`}
          className="p-2 text-steel-400 hover:text-steel-200 hover:bg-steel-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-steel-100">Edit Project</h1>
          <p className="text-steel-400 mt-1">{name}</p>
        </div>
      </div>

      {/* Project Details Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors resize-none"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 outline-none transition-colors"
              >
                <option value="active">Active</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              type="submit"
              disabled={saving || !name}
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
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-accent-400" />
            <h2 className="text-xl font-semibold text-steel-100">Documents</h2>
            <span className="text-steel-500 text-sm">
              ({documents.length})
            </span>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center px-3 py-1.5 text-sm text-accent-400 hover:text-accent-300 border border-accent-500/30 hover:border-accent-500/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Upload className="h-4 w-4 mr-1" />
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.dwg,.dxf,.png,.jpg,.jpeg"
          />
        </div>

        <div className="bg-steel-900 border border-steel-700 rounded-xl overflow-hidden">
          {documents.length === 0 ? (
            <div className="p-8 text-center">
              <File className="h-10 w-10 text-steel-600 mx-auto mb-3" />
              <p className="text-steel-500 text-sm mb-3">
                No documents uploaded yet
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-accent-400 hover:text-accent-300 text-sm"
              >
                Upload the first document
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-steel-700 bg-steel-800/50">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-steel-300">
                    Document
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-steel-300">
                    Type
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-steel-300">
                    Size
                  </th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-steel-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-steel-800 hover:bg-steel-800/30 transition-colors"
                  >
                    <td className="px-6 py-3">
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-steel-100 hover:text-accent-400 text-sm font-medium transition-colors"
                      >
                        {doc.name}
                      </a>
                    </td>
                    <td className="px-6 py-3 text-steel-400 text-sm">
                      {doc.file_type
                        ? doc.file_type.split("/").pop()?.toUpperCase()
                        : "—"}
                    </td>
                    <td className="px-6 py-3 text-steel-400 text-sm">
                      {formatFileSize(doc.file_size)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1 text-steel-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
