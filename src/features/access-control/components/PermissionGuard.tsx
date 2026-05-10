import React, { ReactNode } from "react";
import { usePermissions } from "../hooks/use-permissions";
import { Permission } from "../permissions";

interface PermissionGuardProps {
  /**
   * Single permission required to show children.
   */
  permission?: string | Permission;
  
  /**
   * List of permissions required.
   */
  permissions?: (string | Permission)[];
  
  /**
   * If true, the user must have ALL permissions in the `permissions` array.
   * If false (default), the user must have ANY of the permissions.
   */
  requireAll?: boolean;
  
  /**
   * Component to show if the user does NOT have the required permissions.
   */
  fallback?: ReactNode;
  
  /**
   * The content to show if permissions match.
   */
  children: ReactNode;
}

/**
 * A wrapper component that conditionally renders its children based on user permissions.
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = usePermissions();

  // If we're still loading profile data, don't show anything (or show fallback if preferred)
  // Usually it's better to wait for the profile to avoid UI flickering
  if (isLoading) return null;

  let isAllowed = false;

  if (permission) {
    isAllowed = hasPermission(permission);
  } else if (permissions) {
    isAllowed = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
  } else {
    // If no permission is specified, allow by default (or you might want to change this)
    isAllowed = true;
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
