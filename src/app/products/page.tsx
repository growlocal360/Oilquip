"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import BrandCard from "@/components/brands/BrandCard";
import type { Brand } from "@/lib/types";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await fetch("/api/brands?published=true");
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
      setLoading(false);
    };

    fetchBrands();
  }, []);

  return (
    <div className="bg-steel-950 min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/10 rounded-2xl mb-6">
              <Building2 className="h-8 w-8 text-accent-500" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-steel-100 mb-6">
              Our <span className="text-gradient">Products</span>
            </h1>
            <p className="text-xl text-steel-400 max-w-2xl mx-auto">
              We partner with industry-leading manufacturers to deliver the best
              fluid power solutions for your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-steel-400">Loading brands...</p>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-steel-600 mx-auto mb-4" />
              <p className="text-steel-400">No brands available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <BrandCard brand={brand} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
