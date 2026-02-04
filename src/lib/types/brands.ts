import type { JSONContent } from "@tiptap/react";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  // Joined data
  products?: BrandProduct[];
}

export interface BrandInsert {
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  website_url?: string | null;
  published?: boolean;
  display_order?: number;
}

export interface BrandUpdate extends Partial<BrandInsert> {
  id: string;
}

export interface BrandProduct {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  model_number: string | null;
  description: JSONContent | null;
  image_url: string | null;
  datasheet_url: string | null;
  specs: Record<string, string> | null;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  // Joined data
  brand?: Brand;
}

export interface BrandProductInsert {
  brand_id: string;
  name: string;
  slug: string;
  model_number?: string | null;
  description?: JSONContent | null;
  image_url?: string | null;
  datasheet_url?: string | null;
  specs?: Record<string, string> | null;
  published?: boolean;
  display_order?: number;
}

export interface BrandProductUpdate extends Partial<BrandProductInsert> {
  id: string;
}
