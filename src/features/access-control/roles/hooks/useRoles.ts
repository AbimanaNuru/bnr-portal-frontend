import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleApi } from "../api/role.api";
import { AssignPermissionRequest, RemovePermissionRequest } from "../../types/access-control.types";
import { toast } from "sonner";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => roleApi.listRoles(),
  });
};

export const useAssignPermissionToRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: AssignPermissionRequest }) => 
      roleApi.assignPermissionToRole(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Permission assigned successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Failed to assign permission";
      toast.error(message);
    },
  });
};

export const useRemovePermissionFromRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: RemovePermissionRequest }) => 
      roleApi.removePermissionFromRole(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Permission removed successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Failed to remove permission";
      toast.error(message);
    },
  });
};
