import { z } from "zod";

export const workflowSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  is_active: z.boolean(),
});

export type WorkflowSchema = z.infer<typeof workflowSchema>;

export const workflowLevelSchema = z.object({
  name: z.string().min(3, "Level name must be at least 3 characters"),
  level_number: z.number().min(1, "Level number must be at least 1"),
  required_approvals: z.number().min(1, "At least 1 approval is required"),
  role_ids: z.array(z.string()).min(1, "Select at least one role"),
});

export type WorkflowLevelSchema = z.infer<typeof workflowLevelSchema>;
