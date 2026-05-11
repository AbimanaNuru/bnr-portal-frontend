export interface DocumentTypeDefinition {
  id: number;
  name: string;
  description: string;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentTypeDefinitionCreate {
  name: string;
  description: string;
  is_required?: boolean;
  is_active?: boolean;
}

export interface DocumentTypeDefinitionUpdate {
  name?: string;
  description?: string;
  is_required?: boolean;
  is_active?: boolean;
}

export interface ApplicationDocumentRequirement {
  id: number;
  application_id: string;
  document_type_id: number;
  name_snapshot: string;
  is_required_snapshot: boolean;
  is_satisfied: boolean;
  satisfied_at?: string;
  latest_document_id?: number;
  document_type?: DocumentTypeDefinition;
}

export interface Document {
  id: number;
  application_id: string;
  document_type_id?: number;
  uploaded_by: string;
  original_filename: string;
  stored_filename: string;
  file_size_bytes: number;
  mime_type: string;
  version_number: number;
  is_latest: boolean;
  upload_round: string;
  uploaded_at: string;
}

export interface DocumentUploadResponse {
  detail: string;
  id: string;
}
