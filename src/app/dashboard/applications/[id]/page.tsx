"use client";

import { useParams } from "next/navigation";
import { ApplicationDetails } from "@/src/features/applications/components/ApplicationDetails";
import { PermissionGuard } from "@/src/features/access-control/components/PermissionGuard";
import { PERMISSIONS } from "@/src/features/access-control/permissions";

export default function ApplicationDetailPage() {
  const { id } = useParams();

  return (
    <PermissionGuard
      permissions={[
        PERMISSIONS.APPLICATIONS_READ_OWN,
        PERMISSIONS.APPLICATIONS_READ_ALL,
      ]}
      fallback={
        <div className="flex items-center justify-center h-64 text-text-secondary">
          You do not have permission to view this application.
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <ApplicationDetails id={id as string} />
      </div>
    </PermissionGuard>
  );
}
