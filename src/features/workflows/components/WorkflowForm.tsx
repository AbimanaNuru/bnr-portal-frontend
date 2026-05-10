"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workflowSchema, WorkflowSchema } from "../validation/workflow.schema";
import { useCreateWorkflow, useUpdateWorkflow } from "../hooks/useWorkflows";
import { Button } from "@/src/design-system/components/button/Button";
import InputTextField from "@/src/design-system/components/input/InputTextField";
import { useModalStore } from "@/src/core/store/useModalStore";
import { WorkflowDefinition } from "../types/workflow.types";
import { toast } from "sonner";
import { WorkflowLevelList } from "@/src/features/workflows/components/WorkflowLevelList";

interface WorkflowFormProps {
  workflow?: WorkflowDefinition;
}

export const WorkflowForm: React.FC<WorkflowFormProps> = ({ workflow }) => {
  const isEditing = !!workflow;
  const { closeModal } = useModalStore();
  const createWorkflow = useCreateWorkflow();
  const updateWorkflow = useUpdateWorkflow();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkflowSchema>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: workflow?.name || "",
      description: workflow?.description || "",
      is_active: workflow?.is_active ?? true,
    },
  });

  const onSubmit = async (data: WorkflowSchema) => {
    try {
      if (isEditing) {
        await updateWorkflow.mutateAsync({
          workflowId: workflow.id,
          data,
        });
        toast.success("Workflow updated successfully");
      } else {
        await createWorkflow.mutateAsync({
          ...data,
          levels: [], // Initial levels are empty for new workflows
        });
        toast.success("Workflow created successfully");
      }
      closeModal();
    } catch (error) {
      toast.error(isEditing ? "Failed to update workflow" : "Failed to create workflow");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div className="space-y-4">
        <InputTextField
          label="Workflow Name"
          placeholder="e.g., Standard License Approval"
          register={register}
          name="name"
          error={errors.name?.message}
          required
        />

        <div className="space-y-1">
          <label className="block text-[13px] font-bold pl-1 text-text-secondary">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Describe the purpose of this workflow..."
            className={`
              w-full py-3 px-3.5 rounded-xl border text-[14px] font-semibold
              bg-bg-card text-text-primary placeholder:text-text-muted
              transition-all duration-200 min-h-[100px]
              ${errors.description ? "border-text-error focus:ring-text-error" : "border-border focus:ring-text-success"}
              focus:outline-none focus:ring-1
            `}
          />
          {errors.description && (
            <p className="text-text-error mt-1 pl-3 text-[11px] font-bold">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 p-4 bg-bg-app rounded-xl border border-border">
          <input
            type="checkbox"
            id="is_active"
            {...register("is_active")}
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
          />
          <label htmlFor="is_active" className="text-sm font-semibold text-text-primary cursor-pointer">
            Mark as Active
          </label>
        </div>
      </div>

      {isEditing && (
        <div className="pt-6 border-t border-border">
          <WorkflowLevelList workflowId={workflow.id} />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" type="button" onClick={closeModal}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          isLoading={createWorkflow.isPending || updateWorkflow.isPending}
        >
          {isEditing ? "Save Changes" : "Create Workflow"}
        </Button>
      </div>
    </form>
  );
};
