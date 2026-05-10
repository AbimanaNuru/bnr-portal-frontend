"use client";

import {
  EntityCardGrid,
  EntityCardItem,
} from "@/src/shared/components/EntityCardGrid/EntityCardGrid";
import { useModalStore } from "@/src/core/store/useModalStore";
import { Lock, Shield } from "lucide-react";
import React from "react";
import { useRoles } from "../hooks/useRoles";
import { RolePermissionsView } from "./RolePermissionsView";

export const RoleList: React.FC = () => {
  const { data: roles, isLoading } = useRoles();
  const { openModal } = useModalStore();

  const items: EntityCardItem[] =
    roles?.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      count: role.permissions?.length ?? 0,
      countLabel: "Permissions",
      icon: Shield,
      secondaryIcon: Lock,
    })) ?? [];

  const handleCardClick = (item: EntityCardItem) => {
    const role = roles?.find((r) => r.id === item.id);
    if (!role) return;
    openModal(<RolePermissionsView role={role} />, `Role: ${role.name}`, "xl");
  };

  return (
    <EntityCardGrid
      items={items}
      isLoading={isLoading}
      onCardClick={handleCardClick}
      addCard={{
        label: "Create New Role",
        subLabel: "Define custom access levels",
        icon: Shield,
      }}
    />
  );
};
