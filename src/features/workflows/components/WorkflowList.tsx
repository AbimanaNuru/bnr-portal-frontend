"use client";

import { useModalStore } from "@/src/core/store/useModalStore";
import { WorkflowForm } from "@/src/features/workflows/components/WorkflowForm";
import {
  EntityCardGrid,
  EntityCardItem,
} from "@/src/shared/components/EntityCardGrid/EntityCardGrid";
import { GitBranch, HelpCircle, Layers, ShieldCheck } from "lucide-react";
import React from "react";
import { useWorkflows } from "../hooks/useWorkflows";

export const WorkflowList: React.FC = () => {
  const { data: workflows, isLoading } = useWorkflows();
  const { openModal } = useModalStore();

  const items: EntityCardItem[] =
    workflows?.map((workflow) => ({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      count: workflow.levels?.length || 0,
      countLabel: "Levels",
      icon: GitBranch,
      secondaryIcon: workflow.is_active ? ShieldCheck : HelpCircle,
    })) ?? [];

  const handleCardClick = (item: EntityCardItem) => {
    const workflow = workflows?.find((w) => w.id === item.id);
    if (!workflow) return;
    openModal(
      <WorkflowForm workflow={workflow} />,
      `Edit Workflow: ${workflow.name}`,
      "lg"
    );
  };

  const handleAddClick = () => {
    openModal(<WorkflowForm />, "Create New Workflow", "md");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            Approval Workflows
          </h2>
          <p className="text-sm text-text-secondary">
            Define multi-level approval processes for different application types.
          </p>
        </div>
      </div>
      <EntityCardGrid
        items={items}
        isLoading={isLoading}
        onCardClick={handleCardClick}
        addCard={{
          label: "Create Workflow",
          subLabel: "Define new approval path",
          icon: GitBranch,
          onClick: handleAddClick,
        }}
      />
    </div>
  );
};
