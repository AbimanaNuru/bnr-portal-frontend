import { client } from "@/src/core/api/client";
import {
  WorkflowDefinition,
  WorkflowCreate,
  WorkflowUpdate,
  WorkflowLevel,
  WorkflowLevelCreate,
  WorkflowLevelUpdate,
} from "../types/workflow.types";

export const getWorkflows = async (): Promise<WorkflowDefinition[]> => {
  const response = await client.get("/workflows/");
  return response.data;
};

export const createWorkflow = async (data: WorkflowCreate): Promise<string> => {
  const response = await client.post("/workflows/", data);
  return response.data;
};

export const getWorkflow = async (workflowId: string): Promise<WorkflowDefinition> => {
  const response = await client.get(`/workflows/${workflowId}`);
  return response.data;
};

export const updateWorkflow = async (
  workflowId: string,
  data: WorkflowUpdate
): Promise<string> => {
  const response = await client.put(`/workflows/${workflowId}`, data);
  return response.data;
};

export const deleteWorkflow = async (workflowId: string): Promise<void> => {
  await client.delete(`/workflows/${workflowId}`);
};

export const addLevelToWorkflow = async (
  workflowId: string,
  data: WorkflowLevelCreate
): Promise<string> => {
  const response = await client.post(`/workflows/${workflowId}/levels`, data);
  return response.data;
};

export const getWorkflowLevels = async (
  workflowId: string
): Promise<WorkflowLevel[]> => {
  const response = await client.get(`/workflows/${workflowId}/levels`);
  return response.data;
};

export const updateWorkflowLevel = async (
  levelId: string,
  data: WorkflowLevelUpdate
): Promise<string> => {
  const response = await client.put(`/workflows/levels/${levelId}`, data);
  return response.data;
};

export const removeWorkflowLevel = async (levelId: string): Promise<void> => {
  await client.delete(`/workflows/levels/${levelId}`);
};

export const assignRoleToLevel = async (
  levelId: string,
  roleId: string
): Promise<string> => {
  const response = await client.post(`/workflows/levels/${levelId}/roles`, {
    role_id: roleId,
  });
  return response.data;
};

export const removeRoleFromLevel = async (
  levelId: string,
  roleId: string
): Promise<WorkflowLevel> => {
  const response = await client.delete(
    `/workflows/levels/${levelId}/roles/${roleId}`
  );
  return response.data;
};
