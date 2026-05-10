"use client";

import React, { useMemo, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { User } from "../../types/access-control.types";
import { useUsers, useSetUserStatus } from "../hooks/useUsers";
import { UserRoleManager } from "@/src/features/access-control/users/components/UserRoleManager";
import Table from "@/src/design-system/components/TableComponent/Table";
import TablePagination from "@/src/design-system/components/TableComponent/TablePagination";
import SearchBar from "@/src/design-system/components/TableComponent/SearchBar";
import TableStatus from "@/src/design-system/components/TableComponent/TableStatus";
import EntriesDisplay from "@/src/design-system/components/TableComponent/EntriesDisplay";
import { Button } from "@/src/design-system";
import { Shield, UserMinus, UserCheck, MoreVertical, Loader2 } from "lucide-react";
import { useModalStore } from "@/src/core/store/useModalStore";
import { motion } from "framer-motion";

export const UserTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("All");

  const { data, isLoading } = useUsers({
    page,
    page_size: pageSize,
    search,
    user_status: status === "All" ? undefined : status === "Active",
  });

  const { mutate: setStatusMutate, isPending: isSettingStatus, variables: statusVariables } = useSetUserStatus();
  const { openModal } = useModalStore();

  const handleToggleStatus = (user: User) => {
    setStatusMutate({ userId: user.id, data: { is_active: !user.is_active } });
  };

  const handleManageRoles = (user: User) => {
    openModal(<UserRoleManager userId={user.id} />, `Manage Roles: ${user.fullname}`, "md");
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "fullname",
        header: "User",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-bold text-text-primary">{info.getValue() as string}</span>
            <span className="text-xs text-text-secondary">{info.row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "roles",
        header: "Roles",
        cell: (info) => {
          const roles = info.getValue() as any[];
          return (
            <div className="flex flex-wrap gap-1">
              {roles?.length > 0 ? (
                roles.map((role) => (
                  <span key={role.id} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                    {role.name}
                  </span>
                ))
              ) : (
                <span className="text-text-muted text-[10px]">No Roles</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "is_active",
        header: "Status",
        cell: (info) => {
          const isActive = info.getValue() as boolean;
          return (
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              isActive ? "bg-text-success/10 text-text-success" : "bg-text-error/10 text-text-error"
            }`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        accessorKey: "last_login_at",
        header: "Last Login",
        cell: (info) => {
          const date = info.getValue() as string;
          return (
            <span className="text-xs text-text-secondary">
              {date ? new Date(date).toLocaleDateString() : "Never"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const isActive = row.original.is_active;
          const isPending = isSettingStatus && statusVariables?.userId === row.original.id;

          return (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 gap-1.5" 
                onClick={() => handleManageRoles(row.original)}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="text-[11px]">Roles</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className={`h-9 w-9 p-0 rounded-xl transition-all duration-500 relative overflow-hidden group border-border/60 ${
                  isActive 
                    ? "hover:bg-error/5 hover:border-error/30 text-error" 
                    : "hover:bg-success/5 hover:border-success/30 text-success"
                }`}
                onClick={() => handleToggleStatus(row.original)}
                disabled={isPending}
                title={isActive ? "Deactivate User" : "Activate User"}
              >
                <motion.div
                  initial={false}
                  animate={{ 
                    scale: isPending ? 0.8 : 1, 
                  }}
                  className="relative z-10 flex items-center justify-center"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isActive ? (
                    <UserMinus className="w-4.5 h-4.5" />
                  ) : (
                    <UserCheck className="w-4.5 h-4.5" />
                  )}
                </motion.div>
                
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  isActive ? "bg-error/5" : "bg-success/5"
                }`} />
                
                <motion.div
                  className={`absolute inset-0 ${isActive ? "bg-error" : "bg-success"} opacity-0`}
                  whileTap={{ opacity: 0.1, scale: 1.5 }}
                />
              </Button>
            </div>
          );
        },
      },
    ],
    [isSettingStatus, statusVariables]
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:w-[350px]">
            <SearchBar
              searchTerm={search}
              onSearch={setSearch}
              onClear={() => setSearch("")}
              placeholder="Search users..."
            />
          </div>
          <div className="shrink-0">
             <EntriesDisplay
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
              />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/50 pt-6">
          <div className="w-full max-w-xl">
            <TableStatus
              selectedStatus={status}
              onStatusChange={setStatus}
              statusOptions={[
                { label: "All Users", value: "All" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-bg-card/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <Table table={table} />
      </div>

      <div className="flex items-center justify-end border-t border-border/50 pt-6">
        <TablePagination
          totalCount={data?.total || 0}
          currentPage={page}
          page_size={pageSize}
          totalPages={data?.total_pages || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
