"use client";

import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === "AUTHENTICATED") {
      redirect("/dashboard");
    } else {
      redirect("/auth/login");
    }
  }, [status]);

  return null;
}
