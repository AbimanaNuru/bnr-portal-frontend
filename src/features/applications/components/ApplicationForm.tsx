"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applicationSchema,
  ApplicationFormValues,
} from "../validation/application.schema";
import { InstitutionType } from "../types/application.types";
import { Button, InputTextField } from "@/src/design-system";
import DropdownField from "@/src/shared/components/ComboBox/ComboBox";
import { Loader2 } from "lucide-react";

interface ApplicationFormProps {
  initialData?: Partial<ApplicationFormValues>;
  onSubmit: (data: ApplicationFormValues) => void;
  isLoading?: boolean;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      institution_type: InstitutionType.COMMERCIAL_BANK,
      declaration_accepted: false,
      ...initialData,
    },
  });

  const institutionTypes = Object.values(InstitutionType).map((type) => ({
    label: type.replace(/_/g, " "),
    value: type,
  }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-bg-card p-6 rounded-2xl border border-border shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Basic Information ── */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-text-primary border-b border-border pb-2">
            Basic Information
          </h3>
          <InputTextField
            label="Application Title"
            register={register}
            name="title"
            placeholder="e.g., New Commercial Bank License"
            error={errors.title?.message}
            required
          />
          <div>
            <label className="block text-[13px] font-bold pl-1 text-text-secondary mb-1">
              Description <span className="text-text-error ml-0.5">*</span>
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className={`w-full rounded-xl border text-[14px] font-semibold p-3 bg-bg-card text-text-primary placeholder:text-text-muted transition-all duration-200 outline-none ${
                errors.description
                  ? "border-text-error focus:ring-1 focus:ring-text-error"
                  : "border-border focus:ring-1 focus:ring-text-success"
              }`}
              placeholder="Describe the purpose of this application"
            />
            {errors.description && (
              <p className="text-text-error mt-1 pl-3 text-[11px] font-bold">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* ── Institution Details ── */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-text-primary border-b border-border pb-2">
            Institution Details
          </h3>
          <InputTextField
            label="Institution Name"
            register={register}
            name="institution_name"
            placeholder="Full legal name"
            error={errors.institution_name?.message}
            required
          />
          <DropdownField
            label="Institution Type"
            name="institution_type"
            register={register}
            options={institutionTypes}
            value={watch("institution_type") ?? ""}
            onChange={(e) =>
              setValue("institution_type", e.target.value as InstitutionType)
            }
            placeholder="Select type"
            error={errors.institution_type?.message}
            required
          />
          <InputTextField
            label="Registration Number"
            register={register}
            name="registration_number"
            placeholder="Company registration number"
            error={errors.registration_number?.message}
            required
          />
        </div>

        {/* ── Contact Person ── */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-text-primary border-b border-border pb-2">
            Contact Person
          </h3>
          <InputTextField
            label="Full Name"
            register={register}
            name="contact_full_name"
            placeholder="John Doe"
            error={errors.contact_full_name?.message}
            required
          />
          <InputTextField
            label="Title / Position"
            register={register}
            name="contact_title"
            placeholder="Managing Director"
            error={errors.contact_title?.message}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputTextField
              label="Email"
              register={register}
              name="contact_email"
              type="email"
              placeholder="john@example.com"
              error={errors.contact_email?.message}
              required
            />
            <InputTextField
              label="Phone"
              register={register}
              name="contact_phone"
              placeholder="+250…"
              error={errors.contact_phone?.message}
              required
            />
          </div>
        </div>

        {/* ── Operational Details ── */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-text-primary border-b border-border pb-2">
            Operational Details
          </h3>
          <InputTextField
            label="Proposed Capital (RWF)"
            register={register}
            name="proposed_capital"
            placeholder="e.g., 5,000,000,000"
            error={errors.proposed_capital?.message}
            required
          />
          <InputTextField
            label="Primary Products / Services"
            register={register}
            name="primary_products"
            placeholder="List main financial products"
            error={errors.primary_products?.message}
            required
          />
          <InputTextField
            label="Target Districts"
            register={register}
            name="target_districts"
            placeholder="e.g., Nyarugenge, Gasabo"
            error={errors.target_districts?.message}
            required
          />
        </div>
      </div>

      {/* ── Declaration ── */}
      <div className="space-y-3 bg-bg-app p-4 rounded-xl border border-border">
        <h3 className="text-base font-bold text-text-primary">Declaration</h3>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            {...register("declaration_accepted")}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <p className="text-sm text-text-secondary leading-relaxed">
            I hereby declare that the information provided in this application is true and
            complete to the best of my knowledge. I understand that any false statements may
            lead to the rejection of this application or revocation of any granted license.
          </p>
        </div>
        {errors.declaration_accepted && (
          <p className="text-text-error text-[11px] font-bold pl-1">
            {errors.declaration_accepted.message}
          </p>
        )}
      </div>

      {/* ── Additional Notes ── */}
      <div>
        <label className="block text-[13px] font-bold pl-1 text-text-secondary mb-1">
          Additional Notes
        </label>
        <textarea
          {...register("additional_notes")}
          rows={3}
          className="w-full rounded-xl border border-border text-[14px] font-semibold p-3 bg-bg-card text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-text-success transition-all duration-200"
          placeholder="Any other relevant information…"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[180px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing…
            </>
          ) : (
            "Save Application"
          )}
        </Button>
      </div>
    </form>
  );
};
