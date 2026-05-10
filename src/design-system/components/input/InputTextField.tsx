import React from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type InputFieldProps<T extends FieldValues> = {
  label?: string;
  type?: string;
  register?: UseFormRegister<T>;
  name?: Path<T>;
  defaultValue?: string;
  placeholder: string;
  error?: string | undefined;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  validationRules?: Record<string, any>;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  labelClassName?: string;
};

const InputTextField = <T extends FieldValues>({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  placeholder,
  validationRules,
  required = false,
  disabled = false,
  icon,
  value,
  onChange,
  labelClassName,
}: InputFieldProps<T>) => {
  // Spread react-hook-form registration only when both register and name are provided
  const registered = register && name ? register(name, validationRules) : {};

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={name as string}
          className={`block text-[13px] font-bold pl-1 ${labelClassName || (disabled
            ? "text-text-muted"
            : "text-text-secondary"
          )}`}
        >
          {label}
          {required && <span className="text-text-error ml-1">*</span>}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? "text-text-error" : "text-text-primary/50 group-focus-within:text-primary"} transition-all duration-200 [&>svg]:size-[18px]`}>
            {icon}
          </span>
        )}

        <input
          id={name as string}
          type={type}
          {...registered}
          placeholder={placeholder}
          defaultValue={value !== undefined ? undefined : defaultValue}
          value={value}
          {...(onChange ? { onChange } : {})}
          disabled={disabled}
          {...inputProps}
          className={`
            w-full py-3 rounded-xl border text-[14px] font-semibold
            ${icon ? "pl-12 " : "pl-3.5"} pr-4
            bg-bg-card
            text-text-primary
            placeholder:text-text-muted
            transition-all duration-200
            ${error
              ? "border-text-error focus:outline-none focus:ring-1 focus:ring-text-error"
              : "border-border focus:outline-none focus:ring-1 focus:ring-text-success"
            }
            ${disabled ? "bg-bg-hover cursor-not-allowed opacity-60" : ""}
          `}
        />
      </div>

      {error && (
        <p className="text-text-error mt-2 pl-3 text-[11px] font-bold flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputTextField;
