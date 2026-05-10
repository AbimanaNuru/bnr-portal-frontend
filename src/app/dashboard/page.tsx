"use client";

import { useProfileStore } from "@/src/features/profile/store/profile.store";
import { usePermissions } from "@/src/features/access-control";
import { PERMISSIONS } from "@/src/features/access-control/permissions";
import { Button } from "@/src/design-system/components/button";
import { FileText, ClipboardList, ShieldCheck, Users, Activity, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function DashboardPage() {
  const { profile } = useProfileStore();
  const { hasPermission } = usePermissions();
  const router = useRouter();

  const user = profile?.user;
  const isStaff = hasPermission(PERMISSIONS.APPLICATIONS_READ_ALL);
  const isApplicant = hasPermission(PERMISSIONS.APPLICATIONS_READ_OWN);

  return (
    <div className="w-full h-full p-2 space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 to-primary p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Activity className="w-48 h-48" strokeWidth={1} />
        </div>
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.fullname || "User"}!
          </h1>
          <p className="text-white/80 max-w-lg">
            {isStaff 
              ? "Access the BNR Licensing & Compliance portal tools below to manage and review applications."
              : "Manage your licensing applications securely with the National Bank of Rwanda."}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm font-medium text-white/90 bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-md">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Status: Active
            </span>
            <div className="w-px h-4 bg-white/20" />
            <span>Last login: {user?.last_login_at ? format(new Date(user.last_login_at), "MMM d, yyyy h:mm a") : "Today"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Applicant Specific Experience */}
        {isApplicant && !isStaff && (
          <>
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-primary/20 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-text-primary mb-1">New Application</h3>
                <p className="text-sm text-text-secondary line-clamp-2">Start a new licensing application with the National Bank of Rwanda.</p>
              </div>
              <Button onClick={() => router.push("/dashboard/applications/new")} className="mt-auto bg-primary hover:bg-primary/90 text-white">
                Start Now
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-primary/20 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-text-primary mb-1">My Applications</h3>
                <p className="text-sm text-text-secondary line-clamp-2">Track the progress of your submitted licensing applications.</p>
              </div>
              <Button variant="outline" onClick={() => router.push("/dashboard/my-applications")} className="mt-auto border-primary/20 text-primary hover:bg-primary/5">
                View My Applications
              </Button>
            </div>
          </>
        )}

        {/* Staff Specific Experience */}
        {isStaff && (
          <>
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-primary/20 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-text-primary mb-1">All Applications</h3>
                <p className="text-sm text-text-secondary line-clamp-2">View and manage all licensing applications across the portal.</p>
              </div>
              <Button onClick={() => router.push("/dashboard/applications")} className="mt-auto bg-primary hover:bg-primary/90">
                View Directory
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-primary/20 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-text-primary mb-1">Review Queue</h3>
                <p className="text-sm text-text-secondary line-clamp-2">Process applications pending your specific review or approval.</p>
              </div>
              <Button variant="outline" onClick={() => router.push("/dashboard/review-queue")} className="mt-auto border-primary/20 text-primary hover:bg-primary/5">
                Open Queue
              </Button>
            </div>
            
            {hasPermission(PERMISSIONS.ROLES_MANAGE) && (
              <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-primary/20 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-text-primary mb-1">Access Control</h3>
                  <p className="text-sm text-text-secondary line-clamp-2">Manage internal users, roles, and granular system permissions.</p>
                </div>
                <Button variant="outline" onClick={() => router.push("/dashboard/access-control")} className="mt-auto border-primary/20 text-primary hover:bg-primary/5">
                  Manage Access
                </Button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
