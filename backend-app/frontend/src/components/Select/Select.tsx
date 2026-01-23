import { Select as AntSelect, SelectProps } from "antd";
import React from "react";
interface SelectComponent extends React.FC<SelectProps> {
  Option: typeof AntSelect.Option;
  OptGroup: typeof AntSelect.OptGroup;
}
const Select: SelectComponent = (props) => {
  return <AntSelect {...props} style={{ width: "100%", ...props.style }} />;
};
Select.Option = AntSelect.Option;
Select.OptGroup = AntSelect.OptGroup;
export default Select;
