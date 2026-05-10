"use client";

import React from "react";
import { Plus, Trash2, Edit2, Shield } from "lucide-react";
import { 
  useWorkflowLevels, 
  useAddLevelToWorkflow,
  useRemoveWorkflowLevel 
} from "../hooks/useWorkflows";
import { Button } from "@/src/design-system/components/button/Button";
import { StatusBadge } from "@/src/design-system/components/badge";
import { useModalStore } from "@/src/core/store/useModalStore";
import { WorkflowLevelForm } from "@/src/features/workflows/components/WorkflowLevelForm";
import { toast } from "sonner";

interface WorkflowLevelListProps {
  workflowId: string;
}

export const WorkflowLevelList: React.FC<WorkflowLevelListProps> = ({ workflowId }) => {
  const { data: levels, isLoading } = useWorkflowLevels(workflowId);
  const { openModal } = useModalStore();
  const removeLevel = useRemoveWorkflowLevel();

  const handleAddLevel = () => {
    openModal(
      <WorkflowLevelForm workflowId={workflowId} />,
      "Add Approval Level",
      "md"
    );
  };

  const handleEditLevel = (level: any) => {
    openModal(
      <WorkflowLevelForm workflowId={workflowId} level={level} />,
      `Edit Level: ${level.name}`,
      "md"
    );
  };

  const handleDeleteLevel = async (levelId: string) => {
    if (window.confirm("Are you sure you want to remove this approval level?")) {
      try {
        await removeLevel.mutateAsync(levelId);
        toast.success("Level removed successfully");
      } catch (error) {
        toast.error("Failed to remove level");
      }
    }
  };

  if (isLoading) return <div className="p-4 text-center">Loading levels...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Approval Levels
        </h3>
        <Button size="sm" variant="outline" className="gap-2" onClick={handleAddLevel}>
          <Plus className="w-4 h-4" />
          Add Level
        </Button>
      </div>

      <div className="space-y-2">
        {levels?.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-border rounded-xl">
            <p className="text-sm text-text-secondary">No approval levels defined yet.</p>
          </div>
        ) : (
          levels?.sort((a, b) => a.level_number - b.level_number).map((level) => (
            <div 
              key={level.id}
              className="flex items-center justify-between p-4 bg-bg-card border border-border rounded-xl hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {level.level_number}
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">{level.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-3 h-3 text-text-secondary" />
                    <span className="text-xs text-text-secondary">
                      {level.required_approvals} Required Approvals
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={() => handleEditLevel(level)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-error"
                  onClick={() => handleDeleteLevel(level.id)}
                  isLoading={removeLevel.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
