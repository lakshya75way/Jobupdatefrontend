import { Card as AntCard, CardProps } from "antd";
import React from "react";
const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return (
    <AntCard
      variant="borderless"
      {...props}
      style={{
        boxShadow: "var(--shadow-premium)",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface)",
        ...props.style,
      }}
      styles={{
        header: {
          borderBottom: "1px solid var(--surface-border)",
          padding: "16px 24px",
          ...(typeof props.styles === "object" ? props.styles.header : {}),
        },
        body: {
          padding: "24px",
          ...(typeof props.styles === "object" ? props.styles.body : {}),
        },
        ...(typeof props.styles === "object" ? props.styles : {}),
      }}
    >
      {children}
    </AntCard>
  );
};
export default Card;
