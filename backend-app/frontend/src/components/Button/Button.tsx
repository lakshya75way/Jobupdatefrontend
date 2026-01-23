import React from "react";
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";
export interface ButtonProps extends AntButtonProps {}
const Button: React.FC<ButtonProps> & {
  Group: typeof AntButton.Group;
} = ({ children, ...props }) => {
  return <AntButton {...props}>{children}</AntButton>;
};
Button.Group = AntButton.Group;
export default Button;
