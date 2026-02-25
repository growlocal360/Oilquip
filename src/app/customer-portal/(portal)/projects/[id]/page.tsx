"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Download,
  File,
  FileImage,
  FileSpreadsheet,
} from "lucide-react";
import type { PortalProject, PortalDocument } from "@/lib/types";

interface ProjectWithDocs extends Omit<PortalProject, "customer"> {
  portal_documents: PortalDocument[];
  customer: { id: string; name: string };
}

function getFileIcon(fileType: string | null) {
  if (!fileType) return File;
  if (fileType.includes("pdf")) return FileText;
  if (fileType.includes("image")) return FileImage;
  if (fileType.includes("sheet") || fileType.includes("excel"))
    return FileSpreadsheet;
  return File;
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PortalProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<ProjectWithDocs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch(`/api/portal/projects/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
      setLoading(false);
    };
    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-steel-800 rounded animate-pulse" />
        <div className="h-10 w-72 bg-steel-800 rounded animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-steel-900 border border-steel-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-steel-300">
          Project not found
        </h2>
        <Link
          href="/customer-portal/dashboard"
          className="text-accent-400 hover:text-accent-300 mt-4 inline-block"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          href="/customer-portal/dashboard"
          className="inline-flex items-center text-steel-400 hover:text-accent-400 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to projects
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-steel-100">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-steel-400 mt-2">{project.description}</p>
            )}
          </div>
          <span
            className={`text-xs font-medium px-3 py-1.5 rounded-full ${
              project.status === "active"
                ? "bg-green-500/10 text-green-400"
                : project.status === "completed"
                  ? "bg-steel-700 text-steel-400"
                  : "bg-yellow-500/10 text-yellow-400"
            }`}
          >
            {project.status}
          </span>
        </div>
      </motion.div>

      {/* Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-steel-100 mb-4">
          Documents
        </h2>

        {(!project.portal_documents ||
          project.portal_documents.length === 0) ? (
          <div className="text-center py-12 bg-steel-900 border border-steel-700 rounded-xl">
            <FileText className="h-12 w-12 text-steel-600 mx-auto mb-3" />
            <p className="text-steel-400">
              No documents have been uploaded for this project yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {project.portal_documents.map((doc, index) => {
              const IconComponent = getFileIcon(doc.file_type);
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center justify-between bg-steel-900 border border-steel-700 rounded-xl p-4 hover:border-steel-600 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-steel-800 rounded-lg">
                      <IconComponent className="h-5 w-5 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="text-steel-100 font-medium">
                        {doc.name}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-steel-500">
                        {doc.file_type && (
                          <span>
                            {doc.file_type.split("/").pop()?.toUpperCase()}
                          </span>
                        )}
                        {doc.file_size && (
                          <span>{formatFileSize(doc.file_size)}</span>
                        )}
                        {doc.description && <span>{doc.description}</span>}
                      </div>
                    </div>
                  </div>

                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-sm font-medium">Download</span>
                  </a>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
