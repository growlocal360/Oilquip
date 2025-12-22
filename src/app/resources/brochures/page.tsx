"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import ResourceCard from "@/components/resources/ResourceCard";
import { createClient } from "@/lib/supabase/client";
import type { Resource } from "@/lib/types";

export default function BrochuresPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      const response = await fetch("/api/resources?category=brochures&published=true");
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
      setLoading(false);
    };

    fetchResources();
  }, []);

  const handleDownload = async (resourceId: string) => {
    const supabase = createClient();
    await supabase.rpc("increment_download_count", { resource_id: resourceId });
  };

  return (
    <div className="bg-steel-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/resources"
              className="inline-flex items-center text-steel-400 hover:text-accent-400 mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Resources
            </Link>

            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl">
                <FileText className="h-10 w-10 text-accent-500" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-steel-100 mb-6">
              Oilquip <span className="text-gradient">Brochures</span>
            </h1>
            <p className="text-xl text-steel-400 leading-relaxed max-w-2xl">
              Download our product and service brochures for detailed
              information about our capabilities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 bg-steel-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-steel-800/50 border border-steel-700 rounded-xl h-72 animate-pulse"
                />
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-steel-600 mx-auto mb-4" />
              <p className="text-steel-400 text-lg">
                No brochures available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ResourceCard
                    resource={resource}
                    onDownload={() => handleDownload(resource.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
