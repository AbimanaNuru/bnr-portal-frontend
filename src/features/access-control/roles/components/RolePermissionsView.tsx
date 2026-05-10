"use client";

import { ArrowRight, CheckCircle2, Info, Key, Loader2, Plus, Shield, Trash2 } from "lucide-react";
import React from "react";
import { usePermissionCategories } from "../../permissions/hooks/usePermissions";
import { Permission, Role } from "../../types/access-control.types";
import { useAssignPermissionToRole, useRemovePermissionFromRole, useRoles } from "../hooks/useRoles";

import { AccessControlFooter } from "../../shared/components/AccessControlFooter";

interface RolePermissionsViewProps {
  role: Role;
}

export const RolePermissionsView: React.FC<RolePermissionsViewProps> = ({ role: initialRole }) => {
  const { data: roles } = useRoles();
  const { data: categories, isLoading: isLoadingCategories } = usePermissionCategories();
  const assignMutation = useAssignPermissionToRole();
  const removeMutation = useRemovePermissionFromRole();

  // Ensure we use the latest role data from the cache
  const role = roles?.find((r) => r.id === initialRole.id) || initialRole;

  const assignedPermissionIds = new Set(role.permissions?.map((p) => p.id) || []);

  const handleAssign = (permissionId: string) => {
    assignMutation.mutate({
      roleId: role.id,
      data: { permission_id: permissionId },
    });
  };

  const handleRemove = (permissionId: string) => {
    removeMutation.mutate({
      roleId: role.id,
      data: { permission_id: permissionId },
    });
  };

  // Group assigned permissions for visualization
  const groupedAssigned: Record<string, Permission[]> = role.permissions?.reduce((acc, permission) => {
    const categoryName = permission.category?.name || "Other";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>) || {};

  if (isLoadingCategories) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-text-secondary animate-pulse">Loading permissions configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Role Header Info */}
      <div className="flex items-center gap-4 p-5 bg-primary/5 rounded-2xl border border-primary/10">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-text-primary">{role.name}</h3>
          <p className="text-sm text-text-secondary">{role.description || "No description provided."}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Available Permissions */}
        <div className="space-y-6 ">
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Available Permissions
          </h4>

          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {categories?.map((category) => {
              const availableInCat = category.permissions?.filter((p) => !assignedPermissionIds.has(p.id)) || [];
              if (availableInCat.length === 0) return null;

              return (
                <div key={category.id} className="space-y-3">
                  <p className="text-[11px] font-black text-text-primary uppercase tracking-wider bg-bg-hover/50 px-3 py-1.5 rounded-lg border border-border/50 inline-block">
                    {category.name}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {availableInCat.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between gap-3 p-3 bg-bg-card border border-border rounded-xl group hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Key className="w-4 h-4 text-primary" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                              {permission.name}
                            </p>
                            <p className="text-[11px] text-text-secondary leading-tight line-clamp-1">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssign(permission.id)}
                          disabled={assignMutation.isPending}
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-110 disabled:opacity-50 disabled:scale-100"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assigned Permissions */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-text-success" />
            Assigned to Role
          </h4>

          {Object.keys(groupedAssigned).length > 0 ? (
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(groupedAssigned).map(([categoryName, permissions]) => (
                <div key={categoryName} className="space-y-3">
                  <p className="text-[11px] font-black text-text-success uppercase tracking-wider bg-text-success/5 px-3 py-1.5 rounded-lg border border-text-success/10 inline-block">
                    {categoryName}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between gap-3 p-3 bg-bg-card border border-text-success/20 rounded-xl group hover:border-text-error/30 transition-all"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-text-success/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-text-success" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-text-primary">
                              {permission.name}
                            </p>
                            <p className="text-[11px] text-text-secondary leading-tight line-clamp-1">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(permission.id)}
                          disabled={removeMutation.isPending}
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-text-error/10 text-text-error hover:bg-text-error hover:text-white transition-all transform hover:scale-110 disabled:opacity-50 disabled:scale-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-bg-hover/30 rounded-3xl border border-dashed border-border">
              <Info className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-20" />
              <p className="text-sm text-text-muted font-medium">No permissions assigned to this role yet.</p>
              <p className="text-xs text-text-muted/60 mt-1">Use the arrows on the left to add permissions.</p>
            </div>
          )}
        </div>
      </div>

      <AccessControlFooter 
        title="Management Console"
        description="Changes to role permissions are applied immediately to all users currently assigned this role."
      />
    </div>
  );
};
