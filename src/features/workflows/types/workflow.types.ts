export interface WorkflowLevel {
  id: string;
  workflow_id: string;
  name: string;
  level_number: number;
  required_approvals: number;
  roles: any[];
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  levels: WorkflowLevel[];
}

export interface WorkflowCreate {
  name: string;
  description: string;
  is_active: boolean;
  levels: any[];
}

export interface WorkflowUpdate {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface WorkflowLevelCreate {
  level_number: number;
  name: string;
  required_approvals: number;
  role_ids: string[];
}

export interface WorkflowLevelUpdate {
  level_number?: number;
  name?: string;
  required_approvals?: number;
  role_ids?: string[];
}
