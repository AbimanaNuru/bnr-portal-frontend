"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, User, Shield, Loader2, Send } from "lucide-react";

import { Button } from "@/src/design-system";
import InputTextField from "@/src/design-system/components/input/InputTextField";
import DropdownField from "@/src/shared/components/ComboBox/ComboBox";
import { useInviteUser } from "../hooks/useUsers";
import { useRoles } from "../../roles/hooks/useRoles";
import { useModalStore } from "@/src/core/store/useModalStore";

const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  role_id: z.string().uuid("Please select a valid role"),
});

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

export const InviteUserModal: React.FC = () => {
  const { closeModal } = useModalStore();
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { mutate: inviteUser, isPending: isInviting } = useInviteUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      fullname: "",
      role_id: "",
    },
  });

  const selectedRoleId = watch("role_id");

  const onSubmit = (data: InviteUserFormValues) => {
    inviteUser(data, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const roleOptions = React.useMemo(() => {
    return roles?.map((role) => ({
      label: role.name,
      value: role.id,
    })) || [];
  }, [roles]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <InputTextField
          label="Full Name"
          name="fullname"
          placeholder="Enter user's full name"
          register={register}
          error={errors.fullname?.message}
          icon={<User />}
          required
        />

        <InputTextField
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter user's email"
          register={register}
          error={errors.email?.message}
          icon={<Mail />}
          required
        />

        <DropdownField
          label="System Role"
          name="role_id"
          options={roleOptions}
          register={register}
          error={errors.role_id?.message}
          value={selectedRoleId}
          onChange={(e) => setValue("role_id", e.target.value, { shouldValidate: true })}
          required
          placeholder="Select an access role"
        />
      </div>

      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
        <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary leading-relaxed">
          <p className="font-bold text-text-primary mb-1">Onboarding Information</p>
          The invited user will receive an email with their temporary credentials and a link to set up their account.
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          onClick={closeModal}
          disabled={isInviting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="gap-2"
          disabled={isInviting || rolesLoading}
        >
          {isInviting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Send Invitation
        </Button>
      </div>
    </form>
  );
};
