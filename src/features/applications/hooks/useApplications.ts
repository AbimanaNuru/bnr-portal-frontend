import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  transitionApplication,
  checkApplicationSubmission,
  submitApplication,
} from "../api/application.api";
import { ApplicationUpdate, ApplicationTransition } from "../types/application.types";
import { usePermissions } from "@/src/features/access-control/hooks/use-permissions";
import { PERMISSIONS } from "@/src/features/access-control/permissions";

export const useApplications = (params?: {
  page?: number;
  page_size?: number;
  status?: string;
  search?: string;
}, fetchOwnOnly: boolean = false) => {
  const { hasPermission, isLoading } = usePermissions();
  // If explicitly requested to fetch own only, or if user doesn't have READ_ALL, treat as not staff
  const isStaff = !fetchOwnOnly && hasPermission(PERMISSIONS.APPLICATIONS_READ_ALL);

  return useQuery({
    queryKey: ["applications", params, isStaff],
    queryFn: () => getApplications(params, isStaff),
    enabled: !isLoading,
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplication(id),
    enabled: !!id,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApplicationUpdate }) =>
      updateApplication(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application", variables.id] });
    },
  });
};

export const useTransitionApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApplicationTransition }) =>
      transitionApplication(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application", variables.id] });
    },
  });
};

export const useSubmissionCheck = (id: string) => {
  return useQuery({
    queryKey: ["application", id, "submission-check"],
    queryFn: () => checkApplicationSubmission(id),
    enabled: !!id,
  });
};

export const useSubmitApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      submitApplication(id, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application", variables.id] });
    },
  });
};
