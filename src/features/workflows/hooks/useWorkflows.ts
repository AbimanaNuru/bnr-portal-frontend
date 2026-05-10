import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  addLevelToWorkflow,
  getWorkflowLevels,
  updateWorkflowLevel,
  removeWorkflowLevel,
} from "../api/workflow.api";
import {
  WorkflowCreate,
  WorkflowUpdate,
  WorkflowLevelCreate,
  WorkflowLevelUpdate,
} from "../types/workflow.types";

export const useWorkflows = () => {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: getWorkflows,
  });
};

export const useWorkflow = (workflowId: string) => {
  return useQuery({
    queryKey: ["workflows", workflowId],
    queryFn: () => getWorkflow(workflowId),
    enabled: !!workflowId,
  });
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkflowCreate) => createWorkflow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
};

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workflowId,
      data,
    }: {
      workflowId: string;
      data: WorkflowUpdate;
    }) => updateWorkflow(workflowId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({
        queryKey: ["workflows", variables.workflowId],
      });
    },
  });
};

export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
};

export const useWorkflowLevels = (workflowId: string) => {
  return useQuery({
    queryKey: ["workflowLevels", workflowId],
    queryFn: () => getWorkflowLevels(workflowId),
    enabled: !!workflowId,
  });
};

export const useAddLevelToWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workflowId,
      data,
    }: {
      workflowId: string;
      data: WorkflowLevelCreate;
    }) => addLevelToWorkflow(workflowId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workflowLevels", variables.workflowId],
      });
      queryClient.invalidateQueries({
        queryKey: ["workflows", variables.workflowId],
      });
    },
  });
};

export const useUpdateWorkflowLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      levelId,
      data,
    }: {
      levelId: string;
      data: WorkflowLevelUpdate;
    }) => updateWorkflowLevel(levelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflowLevels"] });
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
};

export const useRemoveWorkflowLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (levelId: string) => removeWorkflowLevel(levelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflowLevels"] });
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
};
