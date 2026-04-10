import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import type { BrandProduct } from "@/lib/types";

interface ProductCardProps {
  product: BrandProduct;
  brandSlug: string;
}

export default function ProductCard({ product, brandSlug }: ProductCardProps) {
  return (
    <Link href={`/products/${brandSlug}/${product.slug}`} className="group block">
      <div className="h-full bg-steel-900/50 border border-steel-700 hover:border-accent-500/50 rounded-xl overflow-hidden transition-all duration-300">
        <div className="relative h-48 bg-steel-800 flex items-center justify-center">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-4"
            />
          ) : (
            <Package className="h-16 w-16 text-steel-600" />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-steel-100 group-hover:text-accent-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.model_number && (
            <p className="text-accent-400 text-sm mt-1">
              {product.model_number}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
