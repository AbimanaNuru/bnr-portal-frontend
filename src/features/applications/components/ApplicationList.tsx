"use client";

import React, { useMemo, useState } from "react";
import {
  useApplications,
  ApplicationStatus,
  Application,
} from "@/src/features/applications";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import Table from "@/src/design-system/components/TableComponent/Table";
import SearchBar from "@/src/design-system/components/TableComponent/SearchBar";
import Pagination from "@/src/design-system/components/TableComponent/TablePagination";
import StatusBadge from "@/src/design-system/components/badge/StatusBadge";
import { Button } from "@/src/design-system/components/button";
import { PermissionGuard } from "@/src/features/access-control/components/PermissionGuard";
import { PERMISSIONS } from "@/src/features/access-control/permissions";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Plus, Send, Search } from "lucide-react";
import { useModalStore } from "@/src/core/store/useModalStore";
import { WorkflowTransitionControl } from "./WorkflowTransitionControl";
import { LoadingState } from "@/src/shared/components/feedback/LoadingState";
import { ErrorState } from "@/src/shared/components/feedback/ErrorState";
import { EmptyState } from "@/src/shared/components/feedback/EmptyState";

const statusConfig = {
  DRAFT: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-400" },
  SUBMITTED: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  UNDER_REVIEW: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  INFORMATION_REQUESTED: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  REVIEWED: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
  APPROVED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  REJECTED: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
};

interface ApplicationListProps {
  fetchOwnOnly?: boolean;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({ fetchOwnOnly = false }) => {
  const router = useRouter();
  const { openModal, closeModal } = useModalStore();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, refetch } = useApplications({
    page,
    page_size: pageSize,
    search: searchTerm,
    status,
  }, fetchOwnOnly);

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => (
          <div className="font-medium text-text-primary">{row.original.title}</div>
        ),
      },
      {
        header: "Institution",
        accessorKey: "institution_name",
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-medium text-text-primary">{row.original.institution_name}</div>
            <div className="text-xs text-text-secondary">
              {row.original.institution_type.replace(/_/g, " ")}
            </div>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} config={statusConfig} />
        ),
      },
      {
        header: "Created",
        accessorKey: "created_at",
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary">
            {format(new Date(row.original.created_at), "MMM dd, yyyy")}
          </span>
        ),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            {(row.original.status === ApplicationStatus.DRAFT || row.original.status === ApplicationStatus.INFORMATION_REQUESTED) && (
              <PermissionGuard permissions={[PERMISSIONS.APPLICATION_CREATE, PERMISSIONS.APPLICATIONS_TRANSITION]}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(
                      <div className="p-4 bg-bg-card rounded-xl max-w-lg mx-auto">
                        <WorkflowTransitionControl application={row.original} onSuccess={closeModal} />
                      </div>,
                      "Application Workflow",
                      "md"
                    );
                  }}
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {row.original.status === ApplicationStatus.DRAFT ? "Submit" : "Resubmit"}
                </Button>
              </PermissionGuard>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/applications/${row.original.id}`);
              }}
            >
              <Eye className="w-4 h-4 mr-1.5" />
              View
            </Button>
          </div>
        ),
      },
    ],
    [router, openModal, closeModal]
  );

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Applications</h2>
        <PermissionGuard permission={PERMISSIONS.APPLICATION_CREATE}>
          <Button onClick={() => router.push("/dashboard/applications/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </PermissionGuard>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="w-full md:w-80">
          <SearchBar
            searchTerm={search}
            onSearch={(val) => {
              setSearch(val);
              setSearchTerm(val);
              setPage(1);
            }}
            onClear={() => {
              setSearch("");
              setSearchTerm("");
              setPage(1);
            }}
            placeholder="Search applications..."
          />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-bg-card rounded-2xl border border-border">
          <LoadingState message="Loading applications…" />
        </div>
      ) : isError ? (
        <div className="bg-bg-card rounded-2xl border border-border">
          <ErrorState 
            message="Failed to load applications. Please check your connection." 
            onRetry={() => refetch()} 
          />
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <>
          <Table table={table} onRowClick={(row) => router.push(`/dashboard/applications/${row.original.id}`)} />
          <Pagination
            currentPage={page}
            totalPages={data.total_pages}
            totalCount={data.total_count}
            page_size={pageSize}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="bg-bg-card rounded-2xl border border-border">
          <EmptyState 
            title={searchTerm ? "No applications match your search" : "No applications found"}
            message={searchTerm 
              ? `We couldn't find any applications matching "${searchTerm}". Try a different term.`
              : fetchOwnOnly 
                ? "You haven't created any applications yet."
                : "There are no applications in the system yet."
            }
            icon={searchTerm ? <Search className="w-8 h-8 text-text-muted" /> : undefined}
            actionLabel={!searchTerm && (fetchOwnOnly || !fetchOwnOnly) ? "New Application" : undefined}
            onAction={!searchTerm ? () => router.push("/dashboard/applications/new") : undefined}
          />
        </div>
      )}
    </div>
  );
};
