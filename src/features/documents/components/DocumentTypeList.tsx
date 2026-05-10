"use client";

import React from "react";
import { FileText, Settings, ShieldCheck, HelpCircle } from "lucide-react";
import {
  EntityCardGrid,
  EntityCardItem,
} from "@/src/shared/components/EntityCardGrid/EntityCardGrid";
import { useModalStore } from "@/src/core/store/useModalStore";
import { useDocumentTypes } from "../hooks/useDocuments";
import { DocumentTypeForm } from "./DocumentTypeForm";

export const DocumentTypeList: React.FC = () => {
  const { data: documentTypes, isLoading } = useDocumentTypes();
  const { openModal } = useModalStore();

  const items: EntityCardItem[] =
    documentTypes?.map((docType) => ({
      id: docType.id.toString(),
      name: docType.name,
      description: docType.description,
      count: docType.is_required ? 1 : 0,
      countLabel: docType.is_required ? "Required" : "Optional",
      icon: FileText,
      secondaryIcon: docType.is_active ? ShieldCheck : HelpCircle,
    })) ?? [];

  const handleCardClick = (item: EntityCardItem) => {
    const docType = documentTypes?.find((d) => d.id.toString() === item.id);
    if (!docType) return;
    openModal(
      <DocumentTypeForm documentType={docType} />,
      `Edit Document Type: ${docType.name}`,
      "md"
    );
  };

  const handleCreateNew = () => {
    openModal(
      <DocumentTypeForm />,
      "Create New Document Type",
      "md"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            Document Types
          </h2>
          <p className="text-sm text-text-secondary">
            Manage required and optional document types across applications.
          </p>
        </div>
      </div>
      <EntityCardGrid
        items={items}
        isLoading={isLoading}
        onCardClick={handleCardClick}
        addCard={{
          label: "Create Document Type",
          subLabel: "Define new requirements",
          icon: FileText,
          onClick: handleCreateNew,
        }}
      />
    </div>
  );
};
