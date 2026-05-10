import { useProfileStore } from "@/src/features/profile/store/profile.store";
import { useCallback } from "react";
import { Permission } from "../permissions";

/**
 * Hook to check if the current user has specific permissions.
 */
export function usePermissions() {
  const { profile } = useProfileStore();
  
  // Extract permissions from the profile response
  const userPermissions = profile?.user?.permissions || [];

  /**
   * Checks if the user has a specific permission.
   */
  const hasPermission = useCallback(
    (permission: string | Permission) => {
      return userPermissions.includes(permission as string);
    },
    [userPermissions]
  );

  /**
   * Checks if the user has any of the provided permissions.
   */
  const hasAnyPermission = useCallback(
    (permissions: (string | Permission)[]) => {
      return permissions.some((p) => userPermissions.includes(p as string));
    },
    [userPermissions]
  );

  /**
   * Checks if the user has all of the provided permissions.
   */
  const hasAllPermissions = useCallback(
    (permissions: (string | Permission)[]) => {
      return permissions.every((p) => userPermissions.includes(p as string));
    },
    [userPermissions]
  );

  return {
    permissions: userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading: !profile, // If profile is null, we might still be loading it
  };
}
