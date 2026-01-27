import React from "react";
import { Result, Typography } from "antd";
import { Link } from "react-router-dom";
import { Button } from "../components";
const { Title, Text } = Typography;
const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%)",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <Title
          style={{
            fontSize: 120,
            margin: 0,
            fontWeight: 900,
            color: "var(--primary)",
            opacity: 0.1,
          }}
        >
          404
        </Title>
        <Result
          status="404"
          title={
            <Title level={2} style={{ fontWeight: 800 }}>
              Lost in Space?
            </Title>
          }
          subTitle={
            <Text type="secondary" style={{ fontSize: 16 }}>
              The page you're looking for has drifted away. Let's get you back
              to safety.
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
export default NotFoundPage;
