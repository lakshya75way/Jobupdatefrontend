import React from "react";
interface LogoProps {
  className?: string;
  size?: number;
}
const Logo: React.FC<LogoProps> = ({ className, size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ color: "var(--primary)" }}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
};
export default Logo;
