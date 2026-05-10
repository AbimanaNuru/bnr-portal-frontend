"use client";

import { ApplicationList } from "@/src/features/applications/components/ApplicationList";
import { PermissionGuard } from "@/src/features/access-control/components/PermissionGuard";
import { PERMISSIONS } from "@/src/features/access-control/permissions";

export default function ApplicationsPage() {
  return (
    <PermissionGuard
      permissions={[PERMISSIONS.APPLICATIONS_READ_ALL]}
      fallback={
        <div className="flex items-center justify-center h-64 text-text-secondary">
          You do not have permission to view applications.
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <ApplicationList />
      </div>
    </PermissionGuard>
  );
}
