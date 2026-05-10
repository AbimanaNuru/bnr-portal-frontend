"use client";

import { useRouter } from "next/navigation";
import { ApplicationForm } from "@/src/features/applications/components/ApplicationForm";
import { useCreateApplication } from "@/src/features/applications/hooks/useApplications";
import { PermissionGuard } from "@/src/features/access-control/components/PermissionGuard";
import { PERMISSIONS } from "@/src/features/access-control/permissions";
import { toast } from "sonner";

export default function NewApplicationPage() {
  const router = useRouter();
  const { mutateAsync: createApplication, isPending } = useCreateApplication();

  const handleSubmit = async (data: any) => {
    try {
      const id = await createApplication(data);
      toast.success("Application created successfully");
      router.push(`/dashboard/applications/${id}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail || "Failed to create application"
      );
    }
  };

  return (
    <PermissionGuard
      permission={PERMISSIONS.APPLICATION_CREATE}
      fallback={
        <div className="flex items-center justify-center h-64 text-text-secondary">
          You do not have permission to create applications.
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Create New Application
          </h1>
          <p className="text-text-secondary mt-1">
            Fill in the details below to start your licence application process.
          </p>
        </div>
        <ApplicationForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </PermissionGuard>
  );
}
