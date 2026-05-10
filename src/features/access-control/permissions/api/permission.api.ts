import { client } from "@/src/core/api/client";
import { Permission, PermissionCategory } from "../../types/access-control.types";

export const permissionApi = {
  listPermissionCategories: async () => {
    const response = await client.get<PermissionCategory[]>("/users/permission-categories");
    return response.data;
  },
};
