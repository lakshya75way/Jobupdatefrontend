import type { InputHTMLAttributes } from "react";
import { Label } from "../atoms/Label";
import { Input } from "../atoms/Input";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const FormField = ({
  label,
  error,
  required,
  className = "",
  id,
  ...props
}: FormFieldProps) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`mb-4 ${className}`}>
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <Input id={inputId} error={error} required={required} {...props} />
    </div>
  );
};
