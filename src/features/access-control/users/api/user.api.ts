import { client } from "@/src/core/api/client";
import {
  AssignRoleRequest,
  PaginatedResponse,
  Role,
  User,
  UserQueryParams,
  UserStatusUpdateRequest
} from "../../types/access-control.types";

export const userApi = {
  listUsers: async (params?: UserQueryParams) => {
    const response = await client.get<PaginatedResponse<User>>("users/", { params });
    return response.data;
  },

  getUser: async (userId: string) => {
    const response = await client.get<User>(`/users/${userId}`);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    await client.delete(`/api/v1/users/${userId}`);
  },

  setUserStatus: async (userId: string, data: UserStatusUpdateRequest) => {
    const response = await client.patch<string>(`/users/${userId}/status`, data);
    return response.data;
  },

  getUserRoles: async (userId: string) => {
    const response = await client.get<Role[]>(`/users/${userId}/roles`);
    return response.data;
  },

  assignRoleToUser: async (userId: string, data: AssignRoleRequest) => {
    const response = await client.post<string>(`/users/${userId}/roles`, data);
    return response.data;
  },

  removeRoleFromUser: async (userId: string, roleId: string) => {
    const response = await client.delete<string>(`/users/${userId}/roles/${roleId}`);
    return response.data;
  },
};
