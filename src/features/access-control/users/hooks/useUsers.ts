import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user.api";
import { UserQueryParams, UserStatusUpdateRequest, AssignRoleRequest } from "../../types/access-control.types";
import { toast } from "sonner";

export const useUsers = (params?: UserQueryParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.listUsers(params),
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => userApi.getUser(userId),
    enabled: !!userId,
  });
};

export const useUserRoles = (userId: string) => {
  return useQuery({
    queryKey: ["user-roles", userId],
    queryFn: () => userApi.getUserRoles(userId),
    enabled: !!userId,
  });
};

export const useSetUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UserStatusUpdateRequest }) => 
      userApi.setUserStatus(userId, data),
    onSuccess: (_, { userId, data }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      toast.success(`User ${data.is_active ? "activated" : "deactivated"} successfully`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Failed to update user status";
      toast.error(message);
    }
  });
};

export const useAssignRoleToUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: AssignRoleRequest }) => 
      userApi.assignRoleToUser(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user-roles", userId] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};

export const useRemoveRoleFromUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) => 
      userApi.removeRoleFromUser(userId, roleId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user-roles", userId] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};
