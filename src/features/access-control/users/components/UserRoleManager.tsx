"use client";

import React from "react";
import { useUser, useUserRoles } from "../hooks/useUsers";
import { Shield, Info, Loader2 } from "lucide-react";

import { AccessControlFooter } from "../../shared/components/AccessControlFooter";

interface UserRoleManagerProps {
  userId: string;
}

export const UserRoleManager: React.FC<UserRoleManagerProps> = ({ userId }) => {
  const { data: user, isLoading: userLoading } = useUser(userId);
  const { data: userRoles, isLoading: userRolesLoading } = useUserRoles(userId);

  const isLoading = userLoading || userRolesLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-text-secondary animate-pulse">Loading access configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* User Header in Modal */}
      <div className="flex items-center gap-4 p-5 bg-primary/5 rounded-2xl border border-primary/10">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 font-bold text-xl">
          {user?.fullname?.[0]}
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary tracking-tight">{user?.fullname}</h3>
          <p className="text-sm text-text-secondary">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Current Access Roles
        </h3>

        {userRoles && userRoles.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {userRoles.map((role) => (
              <div
                key={role.id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-primary/20 bg-bg-card shadow-sm group hover:border-primary/40 transition-all"
              >
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-text-primary">
                    {role.name}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-bg-hover/30 rounded-3xl border border-dashed border-border">
            <Info className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-20" />
            <p className="text-sm text-text-muted font-medium">This user has no roles assigned.</p>
            <p className="text-xs text-text-muted/60 mt-1">Contact an administrator to request access.</p>
          </div>
        )}
      </div>

      <AccessControlFooter 
        title="Security Information"
        description="User roles are managed globally. If you need to change access levels, please submit a request through the IT service desk."
      />
    </div>
  );
};

