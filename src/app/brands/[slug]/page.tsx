"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, ExternalLink, Package, FileText, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/brands/ProductCard";
import type { Brand, BrandProduct, BrandResource } from "@/lib/types";

export default function BrandDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<BrandProduct[]>([]);
  const [resources, setResources] = useState<BrandResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch brand by slug
      const { data: brandData, error } = await supabase
        .from("brands")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error || !brandData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setBrand(brandData);

      // Fetch products for this brand
      const { data: productsData } = await supabase
        .from("brand_products")
        .select("*")
        .eq("brand_id", brandData.id)
        .eq("published", true)
        .order("display_order", { ascending: true });

      setProducts(productsData || []);

      // Fetch resources
      const { data: resourcesData } = await supabase
        .from("brand_resources")
        .select("*")
        .eq("brand_id", brandData.id)
        .order("display_order", { ascending: true });

      setResources(resourcesData || []);
      setLoading(false);
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-steel-950 min-h-screen flex items-center justify-center">
        <p className="text-steel-400">Loading...</p>
      </div>
    );
  }

  if (notFound || !brand) {
    return (
      <div className="bg-steel-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-steel-100 mb-4">
            Brand Not Found
          </h1>
          <p className="text-steel-400 mb-8">
            The brand you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/brands"
            className="inline-flex items-center text-accent-400 hover:text-accent-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brands
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-steel-950 min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Link */}
            <Link
              href="/brands"
              className="inline-flex items-center text-steel-400 hover:text-accent-400 mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Brands
            </Link>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Main column */}
              <div
                className={
                  resources.length > 0
                    ? "lg:col-span-2 flex flex-col md:flex-row items-start md:items-center gap-8"
                    : "lg:col-span-3 flex flex-col md:flex-row items-start md:items-center gap-8"
                }
              >
                {/* Logo */}
                <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {brand.logo_url ? (
                    <Image
                      src={brand.logo_url}
                      alt={brand.name}
                      width={128}
                      height={128}
                      className="object-contain p-4"
                    />
                  ) : (
                    <Building2 className="h-16 w-16 text-steel-300" />
                  )}
                </div>

                {/* Info */}
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-steel-100 mb-4">
                    {brand.name}
                  </h1>
                  {brand.description && (
                    <p className="text-lg text-steel-400 max-w-2xl mb-4">
                      {brand.description}
                    </p>
                  )}
                  {brand.website_url && (
                    <a
                      href={brand.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-accent-400 hover:text-accent-300 font-medium transition-colors"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  )}
                </div>
              </div>

              {/* Catalogs & Brochures sidebar */}
              {resources.length > 0 && (
                <aside className="lg:col-span-1">
                  <h3 className="text-xl font-bold text-steel-100 mb-4">
                    Catalogs &amp; Brochures:
                  </h3>
                  <ul className="space-y-2">
                    {resources.map((resource) => (
                      <li key={resource.id}>
                        <a
                          href={resource.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 py-2 text-steel-300 hover:text-accent-400 transition-colors"
                        >
                          <FileText className="h-4 w-4 text-steel-500 group-hover:text-accent-400 transition-colors flex-shrink-0" />
                          <span className="flex-1 underline-offset-4 group-hover:underline">
                            {resource.title}
                          </span>
                          <Download className="h-4 w-4 text-steel-600 group-hover:text-accent-400 transition-colors flex-shrink-0" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-steel-100 mb-8">
              Products
            </h2>

            {products.length === 0 ? (
              <div className="text-center py-12 bg-steel-900/50 border border-steel-700 rounded-xl">
                <Package className="h-12 w-12 text-steel-600 mx-auto mb-4" />
                <p className="text-steel-400">
                  No products available for this brand yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                  >
                    <ProductCard product={product} brandSlug={brand.slug} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
