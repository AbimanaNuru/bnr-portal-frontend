export interface Permission {
  id: string;
  name: string;
  description: string;
  category_id: string;
  category?: PermissionCategory;
}

export interface PermissionCategory {
  id: string;
  name: string;
  description: string;
  permissions?: Permission[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions?: Permission[];
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  phone_number: string;
  avatar_url: string | null;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  roles?: Role[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AssignPermissionRequest {
  permission_id: string;
}

export type RemovePermissionRequest = AssignPermissionRequest;

export interface AssignRoleRequest {
  role_id: string;
}

export interface UserStatusUpdateRequest {
  is_active: boolean;
}

export interface UserQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  user_role?: string;
  user_status?: boolean;
}

export interface UserInviteRequest {
  email: string;
  fullname: string;
  role_id: string;
}
