import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDocumentTypes,
  createDocumentType,
  updateDocumentType,
  getApplicationRequirements,
  uploadApplicationDocument,
  downloadDocument,
  getApplicationDocuments,
} from "../api/document.api";
import { DocumentTypeDefinitionUpdate } from "../types/document.types";

export const useDocumentTypes = () => {
  return useQuery({
    queryKey: ["documentTypes"],
    queryFn: getDocumentTypes,
  });
};

export const useCreateDocumentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDocumentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentTypes"] });
    },
  });
};

export const useUpdateDocumentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      typeId,
      data,
    }: {
      typeId: number;
      data: DocumentTypeDefinitionUpdate;
    }) => updateDocumentType(typeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentTypes"] });
    },
  });
};

export const useApplicationRequirements = (applicationId: string) => {
  return useQuery({
    queryKey: ["applicationRequirements", applicationId],
    queryFn: () => getApplicationRequirements(applicationId),
    enabled: !!applicationId,
  });
};

export const useUploadApplicationDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      file,
      documentTypeId,
    }: {
      applicationId: string;
      file: File;
      documentTypeId?: number;
    }) => uploadApplicationDocument(applicationId, file, documentTypeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["applicationRequirements", variables.applicationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["applicationDocuments", variables.applicationId],
      });
    },
  });
};

export const useDownloadDocument = () => {
  return useMutation({
    mutationFn: ({
      documentId,
      applicationId,
    }: {
      documentId: number;
      applicationId: string;
    }) => downloadDocument(documentId, applicationId),
  });
};
export const useApplicationDocuments = (applicationId: string) => {
  return useQuery({
    queryKey: ["applicationDocuments", applicationId],
    queryFn: () => getApplicationDocuments(applicationId),
    enabled: !!applicationId,
  });
};
