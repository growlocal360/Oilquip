export interface ResourceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  thumbnail_url: string | null;
  published: boolean;
  display_order: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  category?: ResourceCategory;
}

export interface ResourceInsert {
  title: string;
  description?: string | null;
  category_id?: string | null;
  file_url: string;
  file_type?: string | null;
  file_size?: number | null;
  thumbnail_url?: string | null;
  published?: boolean;
  display_order?: number;
}

export interface ResourceUpdate extends Partial<ResourceInsert> {
  id: string;
}
