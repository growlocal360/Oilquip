"use client";

import Image from "next/image";
import { Download, FileText, Image as ImageIcon } from "lucide-react";
import type { Resource } from "@/lib/types";

interface ResourceCardProps {
  resource: Resource;
  onDownload?: () => void;
}

export default function ResourceCard({ resource, onDownload }: ResourceCardProps) {
  const getFileIcon = () => {
    if (resource.file_type?.startsWith("image")) return ImageIcon;
    return FileText;
  };

  const FileIcon = getFileIcon();

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = () => {
    onDownload?.();
    window.open(resource.file_url, "_blank");
  };

  return (
    <div className="bg-steel-900/50 border border-steel-700 hover:border-accent-500/50 rounded-xl overflow-hidden transition-all duration-300">
      {/* Thumbnail or Icon */}
      <div className="relative h-40 bg-steel-800 flex items-center justify-center">
        {resource.thumbnail_url || resource.file_type?.startsWith("image") ? (
          <Image
            src={resource.thumbnail_url || resource.file_url}
            alt={resource.title}
            fill
            className="object-contain p-4"
          />
        ) : (
          <FileIcon className="h-16 w-16 text-steel-600" />
        )}
      </div>

      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-steel-100 mb-1 line-clamp-1">
          {resource.title}
        </h3>

        {/* Description */}
        {resource.description && (
          <p className="text-steel-400 text-sm mb-3 line-clamp-2">
            {resource.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-steel-500 text-xs mb-4">
          <span>{resource.file_type?.split("/")[1]?.toUpperCase() || "FILE"}</span>
          <span>{formatFileSize(resource.file_size)}</span>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-accent-500/10 hover:bg-accent-500/20 border border-accent-500/30 text-accent-400 rounded-lg font-medium transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}
