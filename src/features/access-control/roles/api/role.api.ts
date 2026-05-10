import { client } from "@/src/core/api/client";
import { AssignPermissionRequest, RemovePermissionRequest, Role, UserStatusUpdateRequest } from "../../types/access-control.types";

export const roleApi = {
  listRoles: async () => {
    const response = await client.get<Role[]>("/users/roles");
    return response.data;
  },

  assignPermissionToRole: async (roleId: string, data: AssignPermissionRequest) => {
    const response = await client.post<string>(`/users/roles/${roleId}/permissions`, data);
    return response.data;
  },

  removePermissionFromRole: async (roleId: string, data: RemovePermissionRequest) => {
    const response = await client.delete<string>(`/users/roles/${roleId}/permissions`, { data });
    return response.data;
  },

  userChangeStatus: async (userId: string, data: UserStatusUpdateRequest) => {
    const response = await client.patch<string>(`/users/${userId}/status`, data);
    return response.data;
  },
};
