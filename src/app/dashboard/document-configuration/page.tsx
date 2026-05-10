"use client";

import React from "react";
import Breadcrumb from "@/src/design-system/components/breadcrumb/Breadcrumb";
import { DocumentTypeList } from "@/src/features/documents";

export default function DocumentConfigurationPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-4">
        <Breadcrumb
          items={[{ label: "Document Configuration" }]}
          description="Manage system-wide configuration, including document requirements and templates."
        />
      </div>

      <div className="space-y-6">
        <div className="bg-bg-card border border-border rounded-2xl shadow-sm overflow-hidden p-6 min-h-[600px]">
          <DocumentTypeList />
        </div>
      </div>
    </div>
  );
}
