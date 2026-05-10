import InputTextField from "@/src/design-system/components/input/InputTextField";
import React from "react";

interface AmountFilterProps {
  minAmount?: number;
  maxAmount?: number;
  minLabel: string;
  maxLabel: string;
  onChange: (key: "min_amount" | "max_amount", value: number) => void;
}

const AmountFilter: React.FC<AmountFilterProps> = ({
  minAmount,
  maxAmount,
  minLabel,
  maxLabel,
  onChange,
}) => {
  return (
    <div className="contents">
      <div className="flex flex-col gap-1.5">
        <InputTextField
          label={minLabel}
          placeholder={minLabel}
          value={minAmount?.toString() || ""}
          onChange={(e) => onChange("min_amount", Number(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <InputTextField
          label={maxLabel}
          placeholder={maxLabel}
          value={maxAmount?.toString() || ""}
          onChange={(e) => onChange("max_amount", Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default AmountFilter;