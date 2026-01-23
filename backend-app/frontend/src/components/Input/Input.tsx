import { Input as AntInput, InputProps as AntInputProps } from "antd";
import React from "react";
export interface InputProps extends AntInputProps {}
interface InputComponent extends React.FC<InputProps> {
  Password: typeof AntInput.Password;
  TextArea: typeof AntInput.TextArea;
  Search: typeof AntInput.Search;
  Group: typeof AntInput.Group;
}
const Input: InputComponent = (props) => {
  return <AntInput {...props} />;
};
Input.Password = AntInput.Password;
Input.TextArea = AntInput.TextArea;
Input.Search = AntInput.Search;
Input.Group = AntInput.Group;
export default Input;
