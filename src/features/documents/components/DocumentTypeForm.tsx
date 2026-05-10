"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentTypeSchema, DocumentTypeSchema } from "../validation/document-type.schema";
import { useCreateDocumentType, useUpdateDocumentType } from "../hooks/useDocuments";
import { Button } from "@/src/design-system/components/button/Button";
import InputTextField from "@/src/design-system/components/input/InputTextField";
import { useModalStore } from "@/src/core/store/useModalStore";
import { toast } from "sonner";
import { FileText, AlertCircle } from "lucide-react";

interface DocumentTypeFormProps {
  documentType?: any;
}

export const DocumentTypeForm: React.FC<DocumentTypeFormProps> = ({ documentType }) => {
  const isEditing = !!documentType;
  const { closeModal } = useModalStore();
  const createDocType = useCreateDocumentType();
  const updateDocType = useUpdateDocumentType();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentTypeSchema>({
    resolver: zodResolver(documentTypeSchema),
    defaultValues: {
      name: documentType?.name || "",
      description: documentType?.description || "",
      is_required: documentType?.is_required ?? false,
      is_active: documentType?.is_active ?? true,
    },
  });

  const onSubmit = async (data: DocumentTypeSchema) => {
    try {
      if (isEditing) {
        await updateDocType.mutateAsync({
          typeId: documentType.id,
          data,
        });
        toast.success("Document type updated successfully");
      } else {
        await createDocType.mutateAsync(data);
        toast.success("Document type created successfully");
      }
      closeModal();
    } catch (error) {
      toast.error("Failed to save document type");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div className="space-y-4">
        <InputTextField
          label="Document Type Name"
          placeholder="e.g., Business License, Tax Clearance"
          register={register}
          name="name"
          error={errors.name?.message}
          icon={<FileText />}
          required
        />

        <div className="space-y-1">
          <label className="block text-[13px] font-bold pl-1 text-text-secondary">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Describe what this document type is used for..."
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

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 p-3 bg-bg-app rounded-xl border border-border">
            <input
              type="checkbox"
              id="is_required"
              {...register("is_required")}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="is_required" className="text-sm font-semibold text-text-primary cursor-pointer flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-warning" />
              Required for Submission
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-bg-app rounded-xl border border-border">
          <input
            type="checkbox"
            id="is_active"
            {...register("is_active")}
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
          />
          <label htmlFor="is_active" className="text-sm font-semibold text-text-primary cursor-pointer">
            Active and Available
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" type="button" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          isLoading={createDocType.isPending || updateDocType.isPending}
        >
          {isEditing ? "Save Changes" : "Create Document Type"}
        </Button>
      </div>
    </form>
  );
};
