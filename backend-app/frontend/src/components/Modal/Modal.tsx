import { Modal as AntModal, ModalProps } from "antd";
import React from "react";
const Modal: React.FC<ModalProps> = ({ children, ...props }) => {
  return (
    <AntModal
      centered
      {...props}
      styles={{
        mask: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0, 0, 0, 0.45)",
        },
        ...props.styles,
      }}
    >
      {children}
    </AntModal>
  );
};
export default Modal;
