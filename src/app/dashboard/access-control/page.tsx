"use client";

import React, { useState } from "react";
import Breadcrumb from "@/src/design-system/components/breadcrumb/Breadcrumb";
import { HorizontalTabs, TabItem } from "@/src/design-system/components/tabs/HorizontalTabs";
import { UserTable } from "@/src/features/access-control/users/components/UserTable";
import { RoleList } from "@/src/features/access-control/roles/components/RoleList";
import { PermissionList } from "@/src/features/access-control/permissions/components/PermissionList";
import { Users, Shield, Key } from "lucide-react";

const ACCESS_CONTROL_TABS: TabItem[] = [
  { id: "users", label: "Users", icon: <Users /> },
  { id: "roles", label: "Roles", icon: <Shield /> },
  { id: "permissions", label: "Permissions", icon: <Key /> },
];

export default function AccessControlPage() {
  const [activeTab, setActiveTab] = useState("users");

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserTable />;
      case "roles":
        return <RoleList />;
      case "permissions":
        return <PermissionList />;
      default:
        return <UserTable />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-4">
        <Breadcrumb
          items={[{ label: "Access Control" }]}
          description="Manage system users, roles, and granular permissions to control data access across the platform."
        />
      </div>

      <div className="space-y-6">
        {/* Tab Selection */}
        <div className="flex justify-start">
          <HorizontalTabs
            tabs={ACCESS_CONTROL_TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        <div className="bg-bg-card border border-border rounded-2xl shadow-sm overflow-hidden p-6 min-h-[600px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
