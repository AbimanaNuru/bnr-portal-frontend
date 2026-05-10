"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workflowLevelSchema, WorkflowLevelSchema } from "../validation/workflow.schema";
import { useAddLevelToWorkflow, useUpdateWorkflowLevel } from "../hooks/useWorkflows";
import { useRoles } from "@/src/features/access-control/roles/hooks/useRoles";
import { Button } from "@/src/design-system/components/button/Button";
import InputTextField from "@/src/design-system/components/input/InputTextField";
import { useModalStore } from "@/src/core/store/useModalStore";
import { toast } from "sonner";
import { Shield } from "lucide-react";

interface WorkflowLevelFormProps {
  workflowId: string;
  level?: any;
}

export const WorkflowLevelForm: React.FC<WorkflowLevelFormProps> = ({ workflowId, level }) => {
  const isEditing = !!level;
  const { closeModal } = useModalStore();
  const addLevel = useAddLevelToWorkflow();
  const updateLevel = useUpdateWorkflowLevel();
  const { data: roles, isLoading: isLoadingRoles } = useRoles();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<WorkflowLevelSchema>({
    resolver: zodResolver(workflowLevelSchema),
    defaultValues: {
      name: level?.name || "",
      level_number: level?.level_number || 1,
      required_approvals: level?.required_approvals || 1,
      role_ids: level?.roles?.map((r: any) => r.id) || [],
    },
  });

  const onSubmit = async (data: WorkflowLevelSchema) => {
    try {
      if (isEditing) {
        await updateLevel.mutateAsync({
          levelId: level.id,
          data,
        });
        toast.success("Approval level updated successfully");
      } else {
        await addLevel.mutateAsync({
          workflowId,
          data,
        });
        toast.success("Approval level added successfully");
      }
      closeModal();
    } catch (error) {
      toast.error("Failed to save approval level");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <InputTextField
            label="Level Name"
            placeholder="e.g., Department Head Approval"
            register={register}
            name="name"
            error={errors.name?.message}
            required
          />
        </div>

        <InputTextField
          label="Level Number"
          type="number"
          placeholder="1"
          register={register}
          name="level_number"
          inputProps={{ min: 1 }}
          error={errors.level_number?.message}
          required
        />

        <InputTextField
          label="Required Approvals"
          type="number"
          placeholder="1"
          register={register}
          name="required_approvals"
          inputProps={{ min: 1 }}
          error={errors.required_approvals?.message}
          required
        />
      </div>

      <div className="space-y-3">
        <label className="block text-[13px] font-bold pl-1 text-text-secondary">
          Assigned Roles
          <span className="text-text-error ml-1">*</span>
        </label>
        
        <div className="max-h-[200px] overflow-y-auto p-4 bg-bg-app rounded-xl border border-border space-y-2">
          {isLoadingRoles ? (
            <div className="text-center py-4 text-sm text-text-secondary">Loading roles...</div>
          ) : (
            roles?.map((role: any) => (
              <label 
                key={role.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-bg-card hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-text-primary">{role.name}</span>
                    <p className="text-[10px] text-text-secondary line-clamp-1">{role.description}</p>
                  </div>
                </div>
                <Controller
                  name="role_ids"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                      checked={field.value.includes(role.id)}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...field.value, role.id]
                          : field.value.filter((id: string) => id !== role.id);
                        field.onChange(newValue);
                      }}
                    />
                  )}
                />
              </label>
            ))
          )}
        </div>
        {errors.role_ids && (
          <p className="text-text-error mt-1 pl-3 text-[11px] font-bold">
            {errors.role_ids.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" type="button" onClick={closeModal}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          isLoading={addLevel.isPending}
        >
          {isEditing ? "Save Level" : "Add Level"}
        </Button>
      </div>
    </form>
  );
};
