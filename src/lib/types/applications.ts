import type { JobPosting } from "./careers";

export type ApplicationType = "resume" | "full";

export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "interviewing"
  | "offer"
  | "hired"
  | "rejected";

export interface EducationEntry {
  school: string;
  location?: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  gpa?: string;
}

export interface EmploymentEntry {
  company: string;
  title: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
  responsibilities?: string;
  reason_for_leaving?: string;
  supervisor_name?: string;
  supervisor_contact?: string;
  may_we_contact?: boolean;
}

export interface ReferenceEntry {
  name: string;
  relationship?: string;
  company?: string;
  phone?: string;
  email?: string;
}

export interface MilitaryService {
  served?: boolean;
  branch?: string;
  rank?: string;
  start_date?: string;
  end_date?: string;
  discharge_type?: string;
}

export interface EEOResponse {
  race?: string;
  gender?: string;
  veteran_status?: string;
  disability?: string;
}

export interface JobApplication {
  id: string;
  job_id: string | null;
  application_type: ApplicationType;
  status: ApplicationStatus;

  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;

  position_desired: string | null;
  employment_type: string | null;
  availability_date: string | null;
  compensation_expectation: string | null;

  authorized_to_work: boolean | null;
  needs_sponsorship: boolean | null;

  resume_url: string | null;
  resume_filename: string | null;
  resume_size: number | null;
  notes: string | null;

  education: EducationEntry[] | null;
  employment_history: EmploymentEntry[] | null;
  professional_references: ReferenceEntry[] | null;
  military: MilitaryService | null;

  eeo: EEOResponse | null;

  reference_verification_ack: boolean;
  background_check_consent: boolean;

  created_at: string;
  updated_at: string;

  // Joined
  job?: JobPosting | null;
}

export interface JobApplicationInsert {
  job_id?: string | null;
  application_type: ApplicationType;

  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;

  position_desired?: string | null;
  employment_type?: string | null;
  availability_date?: string | null;
  compensation_expectation?: string | null;

  authorized_to_work?: boolean | null;
  needs_sponsorship?: boolean | null;

  resume_url?: string | null;
  resume_filename?: string | null;
  resume_size?: number | null;
  notes?: string | null;

  education?: EducationEntry[] | null;
  employment_history?: EmploymentEntry[] | null;
  professional_references?: ReferenceEntry[] | null;
  military?: MilitaryService | null;

  eeo?: EEOResponse | null;

  reference_verification_ack: boolean;
  background_check_consent: boolean;
}

export interface JobApplicationUpdate {
  id: string;
  status?: ApplicationStatus;
}
