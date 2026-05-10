import { Button } from "@/src/design-system/components/button/Button";
import React from "react";

interface StatusFilterProps {
  statusOptions: { label: string; value: string }[];
  selectedStatus?: string;
  onStatusChange: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  statusOptions,
  selectedStatus,
  onStatusChange,
}) => {

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide no-scrollbar flex-nowrap scroll-smooth px-1">
        {statusOptions.map(({ label, value }) => (
          <Button
            key={value}
            size="sm"
            variant={selectedStatus === value ? "default" : "outline"}
            onClick={() => onStatusChange(value)}
            className={`whitespace-nowrap transition-all duration-300 ${selectedStatus === value
              ? "shadow-md scale-[1.02]"
              : "hover:bg-bg-hover"
              }`}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;
