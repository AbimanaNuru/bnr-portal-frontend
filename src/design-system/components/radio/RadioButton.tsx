"use client";

import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface RadioButtonGroupProps<T extends FieldValues> {
  label: string;
  options: Option[];
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  required?: boolean;
}

const RadioButtonGroup = <T extends FieldValues>({
  label,
  options,
  name,
  register,
  error,
  required = false,
}: RadioButtonGroupProps<T>) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>

      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-3 text-sm cursor-pointer group"
          >
            <input
              type="radio"
              value={option.value}
              {...register(name, { required })}
              className={`
                h-5 w-5 flex-shrink-0 cursor-pointer
                border border-border
                rounded-full
                bg-bg-card
                accent-primary
              `}
            />
            <span className="text-text-secondary group-hover:text-primary transition-colors">
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {error && <p className="text-error text-xs mt-1.5">{error}</p>}
    </div>
  );
};

export default RadioButtonGroup;