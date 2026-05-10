import { useQuery } from "@tanstack/react-query";
import { permissionApi } from "../api/permission.api";

export const usePermissionCategories = () => {
  return useQuery({
    queryKey: ["permission-categories"],
    queryFn: () => permissionApi.listPermissionCategories(),
  });
};
