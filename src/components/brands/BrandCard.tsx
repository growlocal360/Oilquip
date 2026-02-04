import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";
import type { Brand } from "@/lib/types";

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link href={`/brands/${brand.slug}`} className="group block">
      <div className="h-full bg-steel-900/50 border border-steel-700 hover:border-accent-500/50 rounded-xl overflow-hidden transition-all duration-300">
        {/* Logo area */}
        <div className="relative h-40 bg-white flex items-center justify-center p-6">
          {brand.logo_url ? (
            <Image
              src={brand.logo_url}
              alt={brand.name}
              fill
              className="object-contain p-6"
            />
          ) : (
            <Building2 className="h-16 w-16 text-steel-300" />
          )}
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-bold text-steel-100 group-hover:text-accent-400 transition-colors">
            {brand.name}
          </h3>
          {brand.description && (
            <p className="text-steel-400 text-sm mt-2 line-clamp-2">
              {brand.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
