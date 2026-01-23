import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`
            w-full px-4 py-2
            bg-white/5 border border-white/10
            rounded-xl
            text-white placeholder-gray-400
            transition-all duration-200
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                : ""
            }
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
