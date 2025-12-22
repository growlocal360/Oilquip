"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderOpen, Image, BookOpen, FileText, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ResourceCategory } from "@/lib/types";

const iconMap: Record<string, typeof Image> = {
  Image: Image,
  BookOpen: BookOpen,
  FileText: FileText,
};

export default function ResourcesPage() {
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("resource_categories")
        .select("*")
        .order("display_order");

      setCategories(data || []);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-steel-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl mb-6">
              <FolderOpen className="h-10 w-10 text-accent-500" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-steel-100 mb-6">
              Library & <span className="text-gradient">Resources</span>
            </h1>
            <p className="text-xl text-steel-400 leading-relaxed">
              Download logos, brochures, and brand materials. Everything you
              need in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-steel-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-steel-800/50 border border-steel-700 rounded-xl h-64 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {categories.map((category, index) => {
                const Icon = iconMap[category.icon || "FileText"] || FileText;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/resources/${category.slug}`}
                      className="group block"
                    >
                      <div className="h-full bg-steel-800/50 border border-steel-700 hover:border-accent-500/50 rounded-xl p-8 text-center transition-all duration-300">
                        <div className="inline-flex items-center justify-center p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl mb-6 group-hover:bg-accent-500/20 transition-colors">
                          <Icon className="h-10 w-10 text-accent-500" />
                        </div>

                        <h2 className="text-2xl font-bold text-steel-100 mb-3 group-hover:text-accent-400 transition-colors">
                          {category.name}
                        </h2>

                        {category.description && (
                          <p className="text-steel-400 mb-6">
                            {category.description}
                          </p>
                        )}

                        <div className="inline-flex items-center text-accent-400 font-semibold group-hover:text-accent-300 transition-colors">
                          View {category.name}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-steel-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-steel-100 mb-6">
              Need Something Specific?
            </h2>
            <p className="text-steel-400 text-lg mb-8">
              Can&apos;t find what you&apos;re looking for? Contact us and
              we&apos;ll help you get the resources you need.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
