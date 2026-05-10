"use client";

import { Button } from "@/src/design-system/components/button/Button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import React from "react";

interface PaginationProps {
  page_size: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  page_size,
  onPageChange,
}) => {
  // Safe bounds handling
  const maxPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), maxPages);

  const startItem = Math.min((safeCurrentPage - 1) * page_size + 1, totalCount);
  const endItem = Math.min(safeCurrentPage * page_size, totalCount);

  const hasData = totalCount > 0;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-bg-card border-t border-border rounded-b-2xl w-full gap-4">
      {/* ── Summary Text ── */}
      <div className="text-sm text-text-secondary">
        Showing{" "}
        <span className="font-medium text-text-primary">
          {hasData ? startItem : 0}
        </span>{" "}
        to{" "}
        <span className="font-medium text-text-primary">
          {hasData ? endItem : 0}
        </span>{" "}
        of{" "}
        <span className="font-medium text-text-primary">
          {totalCount}
        </span>{" "}
        entries
      </div>

      {/* ── First / Prev / Page Info / Next / Last Controls ── */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={!hasData || safeCurrentPage === 1}
          title="Go to first page"
          className="rounded-lg h-9 w-9 text-text-secondary hover:text-text-primary"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={!hasData || safeCurrentPage === 1}
          title="Go to previous page"
          className="rounded-lg h-9 w-9 text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center justify-center min-w-[5rem] px-2 h-9 text-sm font-medium text-text-secondary">
          {hasData ? safeCurrentPage : 0} / {maxPages}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={!hasData || safeCurrentPage >= maxPages}
          title="Go to next page"
          className="rounded-lg h-9 w-9 text-text-secondary hover:text-text-primary"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(maxPages)}
          disabled={!hasData || safeCurrentPage >= maxPages}
          title="Go to last page"
          className="rounded-lg h-9 w-9 text-text-secondary hover:text-text-primary"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
