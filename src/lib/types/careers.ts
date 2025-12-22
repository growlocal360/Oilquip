import type { JSONContent } from "@tiptap/react";

export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship";

export interface JobPosting {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string;
  employment_type: EmploymentType;
  description: JSONContent;
  requirements: JSONContent | null;
  salary_range: string | null;
  published: boolean;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobPostingInsert {
  title: string;
  slug: string;
  department?: string | null;
  location?: string;
  employment_type?: EmploymentType;
  description: JSONContent;
  requirements?: JSONContent | null;
  salary_range?: string | null;
  published?: boolean;
  published_at?: string | null;
  expires_at?: string | null;
}

export interface JobPostingUpdate extends Partial<JobPostingInsert> {
  id: string;
}
