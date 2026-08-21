"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Brand } from "@/lib/types";

export default function BrandsCarousel() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await fetch("/api/brands?published=true");
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    };
    fetchBrands();
  }, []);

  if (brands.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-accent-500 font-semibold uppercase tracking-wider text-sm mb-4">
            Our Partners
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-steel-900 mb-4">
            Brands We Represent
          </h2>
          <p className="text-steel-500 max-w-2xl mx-auto">
            We partner with industry-leading manufacturers to deliver the best
            fluid power solutions.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex-[0_0_50%] sm:flex-[0_0_33.33%] md:flex-[0_0_25%] lg:flex-[0_0_16.66%] min-w-0 px-3"
                >
                  <Link href={`/products/${brand.slug}`}>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 h-28 flex items-center justify-center hover:border-accent-400 hover:shadow-md transition-all">
                      {brand.logo_url ? (
                        <Image
                          src={brand.logo_url}
                          alt={brand.name}
                          width={160}
                          height={80}
                          className="object-contain max-h-16"
                        />
                      ) : (
                        <span className="text-steel-500 font-medium text-sm">
                          {brand.name}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-steel-500 hover:text-accent-500 hover:border-accent-400 transition-colors hidden md:flex"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-steel-500 hover:text-accent-500 hover:border-accent-400 transition-colors hidden md:flex"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Dots */}
        {scrollSnaps.length > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === selectedIndex
                    ? "bg-accent-500"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center text-accent-500 hover:text-accent-600 font-semibold transition-colors"
          >
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
