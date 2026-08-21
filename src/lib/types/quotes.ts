export interface Quote {
  id: string;
  quote_text: string;
  author: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuoteInsert {
  quote_text: string;
  author?: string | null;
  published?: boolean;
}

export interface QuoteUpdate extends Partial<QuoteInsert> {
  id: string;
}
