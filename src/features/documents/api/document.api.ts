import { client } from "@/src/core/api/client";
import {
  ApplicationDocumentRequirement,
  DocumentTypeDefinition,
  DocumentTypeDefinitionCreate,
  DocumentTypeDefinitionUpdate,
  DocumentUploadResponse,
} from "../types/document.types";

export const getDocumentTypes = async (): Promise<DocumentTypeDefinition[]> => {
  const response = await client.get("/documents/types");
  return response.data;
};

export const createDocumentType = async (
  data: DocumentTypeDefinitionCreate
): Promise<{ detail: string; id: string }> => {
  const response = await client.post("/documents/types", data);
  return response.data;
};

export const updateDocumentType = async (
  typeId: number,
  data: DocumentTypeDefinitionUpdate
): Promise<{ detail: string }> => {
  const response = await client.put(`/documents/types/${typeId}`, data);
  return response.data;
};

export const getApplicationRequirements = async (
  applicationId: string
): Promise<ApplicationDocumentRequirement[]> => {
  const response = await client.get(
    `/documents/applications/${applicationId}/requirements`
  );
  return response.data;
};

export const uploadApplicationDocument = async (
  applicationId: string,
  file: File,
  documentTypeId?: number
): Promise<DocumentUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  if (documentTypeId !== undefined) {
    formData.append("document_type_id", documentTypeId.toString());
  }

  const response = await client.post(
    `/documents/applications/${applicationId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const downloadDocument = async (
  documentId: number,
  applicationId: string
): Promise<Blob> => {
  const response = await client.get(
    `/documents/${documentId}/download`,
    {
      params: { application_id: applicationId },
      responseType: "blob",
    }
  );
  return response.data;
};
