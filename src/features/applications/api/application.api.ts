import { client } from "@/src/core/api/client";
import {
  Application,
  ApplicationCreate,
  ApplicationUpdate,
  ApplicationTransition,
  ApplicationListResponse,
  SubmissionCheckResponse,
} from "../types/application.types";

export const getApplications = async (
  params?: {
    page?: number;
    page_size?: number;
    status?: string;
    search?: string;
  },
  isStaff: boolean = false
): Promise<ApplicationListResponse> => {
  const endpoint = isStaff ? "/applications" : "/applications/my";
  const response = await client.get(endpoint, { params });
  return response.data;
};

export const getApplication = async (id: string): Promise<Application> => {
  const response = await client.get(`/applications/${id}`);
  return response.data;
};

export const createApplication = async (data: ApplicationCreate): Promise<string> => {
  const response = await client.post("/applications/", data);
  return response.data.id as string;
};

export const updateApplication = async (
  id: string,
  data: ApplicationUpdate
): Promise<string> => {
  const response = await client.put(`/applications/${id}`, data);
  return response.data;
};

export const transitionApplication = async (
  id: string,
  data: ApplicationTransition
): Promise<string> => {
  const response = await client.post(`/applications/${id}/transition`, data);
  return response.data;
};

export const checkApplicationSubmission = async (id: string): Promise<SubmissionCheckResponse> => {
  const response = await client.get(`/applications/${id}/submission-check`);
  return response.data;
};

export const submitApplication = async (id: string, notes?: string): Promise<{ detail: string; application_id: string }> => {
  const response = await client.post(`/applications/${id}/submit`, null, { params: { notes } });
  return response.data;
};

