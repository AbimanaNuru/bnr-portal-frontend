export enum InstitutionType {
  COMMERCIAL_BANK = "COMMERCIAL_BANK",
  MICROFINANCE = "MICROFINANCE",
  FOREX_BUREAU = "FOREX_BUREAU",
  PAYMENT_PROVIDER = "PAYMENT_PROVIDER",
}

export enum ApplicationStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  INFORMATION_REQUESTED = "INFORMATION_REQUESTED",
  REVIEWED = "REVIEWED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Application {
  id: string;
  title: string;
  description: string;
  institution_name: string;
  institution_type: InstitutionType;
  registration_number: string;
  contact_full_name: string;
  contact_title: string;
  contact_email: string;
  contact_phone: string;
  proposed_capital: string;
  primary_products: string;
  target_districts: string;
  declaration_accepted: boolean;
  additional_notes?: string;
  extra_metadata?: Record<string, any>;
  applicant_id: string;
  current_level: number;
  status: ApplicationStatus;
  version: number;
  reviewed_by?: string;
  approved_by?: string;
  reviewer_notes?: string;
  declaration_accepted_at?: string;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
  applicant?: {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  approvals?: ApplicationApproval[];
  available_actions?: string[];
}

export interface ApplicationApproval {
  id: string;
  level_id: string;
  approved_by: {
    id: string;
    fullname: string | null;
    email: string;
  };
  approved_at: string;
  notes?: string;
  is_approved: boolean;
}

export interface ApplicationCreate {
  title: string;
  description: string;
  institution_name: string;
  institution_type: InstitutionType;
  registration_number: string;
  contact_full_name: string;
  contact_title: string;
  contact_email: string;
  contact_phone: string;
  proposed_capital: string;
  primary_products: string;
  target_districts: string;
  declaration_accepted: boolean;
  additional_notes?: string;
  extra_metadata?: Record<string, any>;
}

export interface ApplicationUpdate {
  title?: string;
  description?: string;
  institution_name?: string;
  institution_type?: InstitutionType;
  registration_number?: string;
  contact_full_name?: string;
  contact_title?: string;
  contact_email?: string;
  contact_phone?: string;
  proposed_capital?: string;
  primary_products?: string;
  target_districts?: string;
  declaration_accepted?: boolean;
  additional_notes?: string;
  extra_metadata?: Record<string, any>;
  version: number;
}

export interface ApplicationTransition {
  action: string;
  notes?: string;
  version: number;
}

export interface ApplicationListResponse {
  items: Application[];
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  message: string;
}

export interface SubmissionCheckResponse {
  application_id: string;
  ready_to_submit: boolean;
  checks: {
    is_draft: boolean;
    declaration_accepted: boolean;
    all_required_documents_uploaded: boolean;
  };
  documents: {
    name: string;
    required: boolean;
    satisfied: boolean;
  }[];
  missing_required_documents: string[];
}
