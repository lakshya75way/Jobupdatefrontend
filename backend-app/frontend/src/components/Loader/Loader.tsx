import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React from "react";
interface LoaderProps {
  size?: "small" | "default" | "large";
  tip?: string;
  fullscreen?: boolean;
}
const Loader: React.FC<LoaderProps> = ({
  size = "large",
  tip,
  fullscreen = false,
}) => {
  const antIcon = (
    <LoadingOutlined style={{ fontSize: size === "large" ? 40 : 24 }} spin />
  );
  if (fullscreen) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(4px)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
        }}
      >
        <Spin indicator={antIcon} tip={tip} size={size}>
          <div />
        </Spin>
      </div>
    );
  }
  return (
    <Spin indicator={antIcon} tip={tip} size={size}>
      <div />
    </Spin>
  );
};
export default Loader;
