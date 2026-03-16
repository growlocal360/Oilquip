export interface PortalCustomer {
  id: string;
  name: string;
  slug: string;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  logo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  users?: PortalUser[];
  projects?: PortalProject[];
}

export interface PortalCustomerInsert {
  name: string;
  slug: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  logo_url?: string | null;
  notes?: string | null;
}

export interface PortalCustomerUpdate extends Partial<PortalCustomerInsert> {
  id: string;
}

export interface PortalUser {
  id: string;
  customer_id: string;
  email: string;
  name: string;
  active: boolean;
  created_at: string;
  // Joined data
  customer?: PortalCustomer;
}

export interface PortalUserInsert {
  customer_id: string;
  email: string;
  name: string;
  active?: boolean;
}

export interface PortalUserUpdate extends Partial<PortalUserInsert> {
  id: string;
}

export interface PortalProject {
  id: string;
  customer_id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  // Joined data
  customer?: PortalCustomer;
  documents?: PortalDocument[];
}

export interface PortalProjectInsert {
  customer_id: string;
  name: string;
  description?: string | null;
  status?: string;
}

export interface PortalProjectUpdate extends Partial<PortalProjectInsert> {
  id: string;
}

export interface PortalDocument {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
  // Joined data
  project?: PortalProject;
}

export interface PortalDocumentInsert {
  project_id: string;
  name: string;
  description?: string | null;
  file_url: string;
  file_type?: string | null;
  file_size?: number | null;
}

export interface PortalDocumentUpdate extends Partial<PortalDocumentInsert> {
  id: string;
}

export interface PortalAccessRequest {
  id: string;
  email: string;
  name: string;
  company_name: string;
  message: string | null;
  status: string;
  reviewed_at: string | null;
  created_at: string;
}

export interface PortalAccessRequestInsert {
  email: string;
  name: string;
  company_name: string;
  message?: string | null;
}

export interface PortalAccessRequestUpdate {
  id: string;
  status?: string;
  reviewed_at?: string | null;
}
