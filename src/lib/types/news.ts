import type { JSONContent } from "@tiptap/react";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: JSONContent;
  featured_image: string | null;
  published: boolean;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsArticleInsert {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: JSONContent;
  featured_image?: string | null;
  published?: boolean;
  published_at?: string | null;
}

export interface NewsArticleUpdate extends Partial<NewsArticleInsert> {
  id: string;
}
