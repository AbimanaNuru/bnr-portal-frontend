"use client";

import { Sidebar } from "@/src/shared/components/layout/Sidebar";
import { Topbar } from "@/src/shared/components/layout/Topbar";
import React from "react";
import { useLayoutStore } from "@/src/core/store/useLayoutStore";
import { useProfile } from "@/src/features/profile/hooks/use-profile.hooks";
import { LoadingState } from "@/src/shared/components/feedback/LoadingState";
import { ErrorState } from "@/src/shared/components/feedback/ErrorState";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isSidebarOpen, closeSidebar } = useLayoutStore();
  
  // Ensure profile is loaded early for permissions
  const { isLoading, isError, refetch } = useProfile();

  if (isLoading) {
    return <LoadingState fullPage message="Authenticating and loading profile…" />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center p-6">
        <ErrorState 
          title="Session Initialization Failed"
          message="We couldn't load your profile. This might be due to an expired session or network issues."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-app overflow-hidden p-0 sm:p-2 gap-0 sm:gap-2 shadow-lg shadow-border/40">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Hidden on mobile by default, uses absolute positioning when open */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:flex
      `}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 gap-0 sm:gap-2 overflow-hidden">
        <Topbar />
        <main className="flex-1 bg-bg-card rounded-none sm:rounded-lg overflow-y-auto p-0 sm:p-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <div className="w-full min-h-full bg-bg-card px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
