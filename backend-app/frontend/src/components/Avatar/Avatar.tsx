import { Avatar as AntAvatar, AvatarProps } from "antd";
import React from "react";
const Avatar: React.FC<AvatarProps> & { Group: typeof AntAvatar.Group } = (
  props,
) => {
  return (
    <AntAvatar
      {...props}
      style={{
        border: "2px solid white",
        boxShadow: "var(--shadow-sm)",
        ...props.style,
      }}
    />
  );
};
Avatar.Group = AntAvatar.Group;
export default Avatar;
