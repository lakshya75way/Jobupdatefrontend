import { Badge as AntBadge, BadgeProps } from "antd";
import React from "react";
const Badge: React.FC<BadgeProps> = (props) => {
  return <AntBadge {...props} />;
};
export default Badge;
