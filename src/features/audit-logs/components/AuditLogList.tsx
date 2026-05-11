"use client";

import { useModalStore } from "@/src/core/store/useModalStore";
import SearchBar from "@/src/design-system/components/TableComponent/SearchBar";
import Table from "@/src/design-system/components/TableComponent/Table";
import TablePagination from "@/src/design-system/components/TableComponent/TablePagination";
import { StatusBadge } from "@/src/design-system/components/badge";
import { EmptyState } from "@/src/shared/components/feedback/EmptyState";
import { ErrorState } from "@/src/shared/components/feedback/ErrorState";
import { LoadingState } from "@/src/shared/components/feedback/LoadingState";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  Activity,
  Calendar,
  ClipboardList,
  Eye,
  Shield,
  User
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useAuditLogs } from "../hooks/useAuditLogs";
import { AuditLog } from "../types/audit-log.types";

const columnHelper = createColumnHelper<AuditLog>();

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date(dateString));
};

import { useAuditLog } from "../hooks/useAuditLogs";

const AuditLogDetailView = ({ logId }: { logId: string }) => {
  const { data: log, isLoading } = useAuditLog(logId);

  if (isLoading) return <div className="p-12 text-center">Loading log details...</div>;
  if (!log) return <div className="p-12 text-center text-text-error">Log not found.</div>;

  return (
    <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">User Details</label>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-text-primary">{log.user_full_name}</p>
                <p className="text-xs text-text-secondary">{log.user_email} • {log.user_role}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Action & Resource</label>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={log.status} />
              <p className="text-sm font-semibold text-text-primary capitalize">
                {log.action.replace(/_/g, " ")} on {log.resource}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Timestamp</label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-text-secondary" />
              <p className="text-sm font-semibold text-text-primary">
                {formatDate(log.created_at)}
              </p>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Resource ID</label>
            <p className="text-sm font-mono text-text-secondary mt-1">{log.resource_id}</p>
          </div>
        </div>
      </div>

      {/* Technical Context */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Technical Context
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-bg-app rounded-2xl border border-border">
          <div>
            <p className="text-[10px] font-bold text-text-secondary uppercase">IP Address</p>
            <p className="text-sm font-semibold text-text-primary">{log.ip_address}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-secondary uppercase">Browser</p>
            <p className="text-sm font-semibold text-text-primary">{log.browser} {log.browser_version}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-secondary uppercase">Operating System</p>
            <p className="text-sm font-semibold text-text-primary">{log.os} {log.os_version}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-secondary uppercase">Device</p>
            <p className="text-sm font-semibold text-text-primary capitalize">{log.device}</p>
          </div>
        </div>
      </div>

      {/* Data Changes */}
      {(log.old_data || log.new_data) && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Data Changes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-text-secondary uppercase pl-1">Before</p>
              <pre className="p-4 bg-bg-app rounded-xl border border-border text-[12px] font-mono overflow-x-auto text-text-secondary">
                {JSON.stringify(log.old_data, null, 2) || "None"}
              </pre>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-text-secondary uppercase pl-1">After</p>
              <pre className="p-4 bg-bg-app rounded-xl border border-border text-[12px] font-mono overflow-x-auto text-text-primary">
                {JSON.stringify(log.new_data, null, 2) || "None"}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Extra Metadata */}
      {log.extra && Object.keys(log.extra).length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-text-secondary uppercase pl-1">Additional Metadata</p>
          <pre className="p-4 bg-bg-app rounded-xl border border-border text-[12px] font-mono overflow-x-auto text-text-secondary">
            {JSON.stringify(log.extra, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export const AuditLogList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { openModal } = useModalStore();

  const { data, isLoading, isError, refetch } = useAuditLogs({
    page,
    search,
    page_size: 10,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("created_at", {
        header: "Timestamp",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-text-secondary" />
            <span>{formatDate(info.getValue())}</span>
          </div>
        ),
      }),
      columnHelper.accessor("user_full_name", {
        header: "User",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-text-primary">{info.getValue()}</span>
            <span className="text-xs text-text-secondary">{info.row.original.user_email}</span>
          </div>
        ),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <StatusBadge status={info.getValue().replace(/_/g, " ")} />
        ),
      }),
      columnHelper.accessor("resource", {
        header: "Resource",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-text-secondary" />
            <span className="capitalize">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue().toLowerCase();
          return (
            <StatusBadge status={status} />
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal(
                <AuditLogDetailView logId={info.row.original.id} />,
                "Audit Log Detail",
                "lg"
              );
            }}
            className="p-2 hover:bg-bg-hover rounded-lg transition-colors text-primary"
          >
            <Eye className="w-4 h-4" />
          </button>
        ),
      }),
    ],
    [openModal]
  );

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: data?.total_pages ?? -1,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Audit Logs</h2>
            <p className="text-sm text-text-secondary">
              Track all system activities and user actions for security and compliance.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="mb-6">
          <SearchBar
            searchTerm={search}
            onSearch={setSearch}
            onClear={() => setSearch("")}
            placeholder="Search by email, action, or resource..."
          />
        </div>

        {isLoading ? (
          <LoadingState message="Loading audit trail…" />
        ) : isError ? (
          <ErrorState
            message="Failed to load audit logs. Please check your connection."
            onRetry={() => refetch()}
          />
        ) : data?.items && data.items.length > 0 ? (
          <>
            <Table
              table={table}
              onRowClick={(row) => {
                openModal(
                  <AuditLogDetailView logId={row.original.id} />,
                  "Audit Log Detail",
                  "lg"
                );
              }}
            />
            <div className="mt-6">
              <TablePagination
                currentPage={page}
                totalPages={data?.total_pages ?? 1}
                onPageChange={setPage}
                page_size={10}
                totalCount={data?.total_count ?? 0}
              />
            </div>
          </>
        ) : (
          <EmptyState
            title={search ? "No logs match your search" : "No logs found"}
            message={search
              ? `We couldn't find any audit logs matching "${search}".`
              : "The system audit trail is currently empty."
            }
            icon={<ClipboardList className="w-8 h-8 text-text-muted" />}
          />
        )}
      </div>
    </div>
  );
};
