import React from "react";
import { Result, Typography } from "antd";
import { Link } from "react-router-dom";
import { Button } from "../components";
const { Title, Text } = Typography;
const ErrorPage: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at center, #ffffff 0%, #fef2f2 100%)",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <Title
          style={{
            fontSize: 120,
            margin: 0,
            fontWeight: 900,
            color: "var(--danger)",
            opacity: 0.1,
          }}
        >
          500
        </Title>
        <Result
          status="500"
          title={
            <Title level={2} style={{ fontWeight: 800 }}>
              Systems Offline
            </Title>
          }
          subTitle={
            <Text type="secondary" style={{ fontSize: 16 }}>
              Something went wrong on our end. Our engineers are already looking
              into it.
            </Text>
          }
          extra={
            <Link to="/">
              <Button
                type="primary"
                size="large"
                style={{ height: 48, padding: "0 32px", borderRadius: 12 }}
              >
                Back to Dashboard
              </Button>
            </Link>
          }
          style={{ marginTop: -80 }}
        />
      </div>
    </div>
  );
};
export default ErrorPage;
