"use client";

import AuthLayout from "@/src/app/auth/layout";
import LoginPage from "@/src/app/auth/login/page";
import { useAuthStore } from "@/src/features/auth/store/auth.store";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfile } from "@/src/features/profile/hooks/use-profile.hooks";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const router = useRouter();
  const pathname = usePathname();

  const { profile, isLoading: isProfileLoading } = useProfile(status === "AUTHENTICATED");

  useEffect(() => {
    if (status === "AUTHENTICATED" && (pathname === "/" || pathname.startsWith("/auth"))) {
      router.push("/dashboard");
    }
  }, [status, pathname, router]);

  if (status === "LOADING" || (status === "AUTHENTICATED" && isProfileLoading && !profile)) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center space-y-6 bg-app-bg">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          <div className="absolute h-8 w-8 animate-pulse rounded-full bg-primary/20" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            {status === "LOADING" ? "Securing your session" : "Loading your profile"}
          </h2>
          <p className="text-foreground">Please wait a moment...</p>
        </div>
        {status === "LOADING" && (
          <button
            onClick={() => useAuthStore.getState().setStatus("UNAUTHENTICATED")}
            className="text-sm text-error hover:text-error/80 transition-colors underline"
          >
            Take me back
          </button>
        )}
      </div>
    );
  }

  if (status === "UNAUTHENTICATED" || status === "OTP_REQUIRED") {
    const isPublicRoute =
      pathname === "/auth/login" ||
      pathname === "/auth/register" ||
      pathname === "/auth/verify-otp" ||
      pathname === "/auth/forgot-password" ||
      pathname === "/auth/reset-password" ||
      pathname === "/reset-password";

    if (isPublicRoute) return <>{children}</>;

    return <AuthLayout><LoginPage /></AuthLayout>;
  }

  if (status === "AUTHENTICATED" && (pathname === "/" || pathname.startsWith("/auth"))) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center space-y-6 bg-app-bg">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        <p className="text-text-secondary animate-pulse">Redirecting to dashboard...</p>
      </div>
    );
  }

  return <>{children}</>;
}
