import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  icon,
  fullWidth,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";

  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 focus:ring-indigo-500 border border-transparent",
    secondary:
      "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500 border border-gray-600",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 focus:ring-red-500 border border-transparent",
    ghost: "bg-transparent hover:bg-white/10 text-gray-300 hover:text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const loadingClass = isLoading ? "opacity-75 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${loadingClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
