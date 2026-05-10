import { Control, Controller, FieldValues, Path } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type PhoneInputFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  required?: boolean;
};

const PhoneInputField = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  required = false,
}: PhoneInputFieldProps<T>) => {
  return (
    <div className="space-y-1">
      <label className="block font-medium text-text-secondary">
        {label}:
        {required && <span className="text-error p-1">*</span>}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <PhoneInput
            {...field}
            country={"rw"} // Default country
            value={field.value}
            onChange={(phone) => field.onChange(phone)}
            inputClass="!w-full !h-12 !text-base !pl-12 !rounded-lg !border-border !bg-bg-card !text-text-primary focus:!border-primary focus:!ring-1 focus:!ring-primary"
            buttonClass="!border-border !bg-bg-card hover:!bg-bg-hover !h-12 !rounded-l-lg"
            containerClass="!w-full"
            dropdownClass="!bg-bg-card !text-text-primary"
            searchClass="!p-2 !border !border-border !rounded !mb-2"
            enableSearch={true}
            searchPlaceholder="Search countries..."
            countryCodeEditable={false}
          />
        )}
      />

      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
};

export default PhoneInputField;
