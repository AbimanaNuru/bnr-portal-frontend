"use client";
import { flexRender, Table as ReactTable, Row } from "@tanstack/react-table";
import React from "react";

interface TableProps {
  table: ReactTable<any>;
  onRowClick?: (row: Row<any>) => void;
}

const Table: React.FC<TableProps> = ({ table, onRowClick }) => {
  return (
    <div className="w-full">
      {/* ─── Desktop Table ─────────────────────────────────────────────────── */}
      <div className="hidden md:block w-full overflow-hidden rounded-2xl border border-border bg-bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-bg-app border-b border-border text-sm font-semibold text-text-secondary uppercase tracking-wider"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 whitespace-normal break-words min-w-[100px] max-w-[120px]"
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    group transition-colors duration-200 
                    hover:bg-bg-hover 
                    ${onRowClick ? "cursor-pointer" : ""}
                  `}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <td
                      key={cell.id}
                      className={`
                        px-6 py-4 text-sm text-text-secondary whitespace-nowrap
                        ${index === 0
                          ? "font-medium text-text-primary" // First column slightly bolder
                          : ""
                        }
                      `}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className="px-6 py-12 text-center text-sm text-text-secondary"
                  >
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Mobile Card View ──────────────────────────────────────────────── */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            onClick={() => onRowClick?.(row)}
            className={`
              bg-bg-card rounded-2xl border border-border 
              shadow-sm p-5 transition-shadow duration-200
              ${onRowClick
                ? "cursor-pointer active:scale-[0.98] hover:shadow-md"
                : ""
              }
            `}
          >
            <div className="space-y-3">
              {row
                .getVisibleCells()
                .map((cell) => (
                  <div
                    key={cell.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1 sm:mb-0">
                      {flexRender(
                        cell.column.columnDef.header,
                        cell.getContext() as any
                      )}
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
        {table.getRowModel().rows.length === 0 && (
          <div className="bg-bg-card rounded-2xl border border-border shadow-sm p-8 text-center text-sm text-text-secondary">
            No data available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;