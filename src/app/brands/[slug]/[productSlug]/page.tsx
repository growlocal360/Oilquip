"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Download, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ArticleContent from "@/components/editor/ArticleContent";
import type { Brand, BrandProduct, ProductResource } from "@/lib/types";

export default function ProductDetailPage() {
  const params = useParams();
  const brandSlug = params.slug as string;
  const productSlug = params.productSlug as string;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [product, setProduct] = useState<BrandProduct | null>(null);
  const [resources, setResources] = useState<ProductResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch brand by slug
      const { data: brandData } = await supabase
        .from("brands")
        .select("*")
        .eq("slug", brandSlug)
        .eq("published", true)
        .single();

      if (!brandData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setBrand(brandData);

      // Fetch product by brand_id and slug
      const { data: productData } = await supabase
        .from("brand_products")
        .select("*")
        .eq("brand_id", brandData.id)
        .eq("slug", productSlug)
        .eq("published", true)
        .single();

      if (!productData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProduct(productData);

      // Fetch product resources
      const { data: resourcesData } = await supabase
        .from("product_resources")
        .select("*")
        .eq("product_id", productData.id)
        .order("display_order", { ascending: true });

      setResources(resourcesData || []);
      setLoading(false);
    };

    fetchData();
  }, [brandSlug, productSlug]);

  if (loading) {
    return (
      <div className="bg-steel-950 min-h-screen flex items-center justify-center">
        <p className="text-steel-400">Loading...</p>
      </div>
    );
  }

  if (notFound || !brand || !product) {
    return (
      <div className="bg-steel-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-steel-100 mb-4">
            Product Not Found
          </h1>
          <p className="text-steel-400 mb-8">
            The product you&apos;re looking for doesn&apos;t exist.
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

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-steel-400 mb-8">
              <Link href="/brands" className="hover:text-accent-400 transition-colors">
                Brands
              </Link>
              <span>/</span>
              <Link href={`/brands/${brand.slug}`} className="hover:text-accent-400 transition-colors">
                {brand.name}
              </Link>
              <span>/</span>
              <span className="text-steel-300">{product.name}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Product Image */}
              <div className="bg-steel-900/50 border border-steel-700 rounded-2xl overflow-hidden">
                <div className="relative aspect-square flex items-center justify-center p-8">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain p-8"
                    />
                  ) : (
                    <Package className="h-24 w-24 text-steel-600" />
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-4">
                  {product.name}
                </h1>

                {product.model_number && (
                  <p className="text-accent-400 font-medium mb-4">
                    Model: {product.model_number}
                  </p>
                )}

                <div className="flex items-center space-x-2 mb-6">
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="inline-flex items-center space-x-2 px-3 py-1.5 bg-steel-800 border border-steel-700 rounded-lg text-steel-300 hover:text-accent-400 hover:border-accent-500/30 transition-colors text-sm"
                  >
                    {brand.logo_url && (
                      <Image
                        src={brand.logo_url}
                        alt={brand.name}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    )}
                    <span>{brand.name}</span>
                  </Link>
                </div>

                {resources.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-steel-300 uppercase tracking-wide mb-3">
                      Documents
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
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      {product.description && (
        <section className="pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-steel-900/50 border border-steel-700 rounded-2xl p-8 lg:p-12"
            >
              <h2 className="text-2xl font-bold text-steel-100 mb-6">
                Description
              </h2>
              <ArticleContent content={product.description} />
            </motion.div>
          </div>
        </section>
      )}

      {/* Specifications */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <section className="pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-steel-900/50 border border-steel-700 rounded-2xl overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-steel-100 p-8 pb-0">
                Specifications
              </h2>
              <div className="divide-y divide-steel-800 mt-6">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between px-8 py-4 hover:bg-steel-800/30 transition-colors"
                  >
                    <span className="text-steel-400 font-medium">{key}</span>
                    <span className="text-steel-100">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Back CTA */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href={`/brands/${brand.slug}`}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            More {brand.name} Products
          </Link>
        </div>
      </section>
    </div>
  );
}
