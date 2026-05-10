"use client";

import React from "react";
import { AuditLogList } from "@/src/features/audit-logs";

export default function AuditLogsPage() {
  return (
    <div className="container mx-auto py-8">
      <AuditLogList />
    </div>
  );
}
