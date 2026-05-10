import InputTextField from "@/src/design-system/components/input/InputTextField";
import { Button } from "@/src/design-system/components/button/Button";
import { X } from "lucide-react";
import React from "react";

interface DateFilterProps {
  startDate?: string;
  endDate?: string;
  onChange: (key: "start_date" | "end_date", value: string) => void;
  onReset?: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onChange,
  onReset,
}) => {
  return (
    <div className="contents">
      <div className="flex flex-col gap-1.5">
        <InputTextField
          label="Start date"
          type="date"
          value={startDate ? startDate.split("T")[0] : ""}
          onChange={(e) => onChange("start_date", e.target.value)}
          placeholder="Start date"
        />
      </div>
      <div className="flex flex-col gap-1.5 relative">
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <InputTextField
              label="End date"
              type="date"
              value={endDate ? endDate.split("T")[0] : ""}
              onChange={(e) => onChange("end_date", e.target.value)}
              placeholder="End date"
            />
          </div>
          {onReset && (
            <Button
              variant="destructive"
              onClick={onReset}
              disabled={!startDate && !endDate}
              className="mb-[2px] h-[48px] w-[48px] rounded-xl flex items-center justify-center shrink-0"
              title="Reset dates"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateFilter;