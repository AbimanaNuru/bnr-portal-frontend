import React from "react";

export interface EntriesDisplayProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

const EntriesDisplay: React.FC<EntriesDisplayProps> = ({
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-secondary">Show Entries</label>
      <div className="flex items-center gap-3">
        <div className="relative w-full">
          <select
            value={pageSize.toString()}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="w-full py-3 pl-4 pr-10 rounded-xl border text-sm appearance-none
                bg-bg-app
                text-text-primary
                border-border
                focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                transition-all duration-200 cursor-pointer
            "
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} Items per page
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntriesDisplay;