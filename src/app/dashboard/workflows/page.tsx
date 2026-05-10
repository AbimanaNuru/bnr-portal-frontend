"use client";

import React from "react";
import { WorkflowList } from "@/src/features/workflows";

export default function WorkflowsPage() {
  return (
    <div className="container mx-auto py-8">
      <WorkflowList />
    </div>
  );
}
