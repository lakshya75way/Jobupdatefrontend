import type { ReactNode } from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
}

export const Label = ({
  children,
  required,
  className = "",
  ...props
}: LabelProps) => {
  return (
    <label
      className={`block text-sm font-medium text-gray-300 mb-2 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};
