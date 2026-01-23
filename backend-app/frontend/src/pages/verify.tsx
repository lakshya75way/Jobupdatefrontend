import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spin, Result, Typography } from "antd";
import api from "../services/api";
import { Button } from "../components";
const { Title } = Typography;
const VerifyPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  useEffect(() => {
    const startVerification = async () => {
      try {
        await api.post(`/auth/verify/${token}`);
        setStatus("success");
      } catch (err: unknown) {
        setStatus("error");
      }
    };
    if (token) startVerification();
  }, [token]);
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--glass)",
        backdropFilter: "blur(20px)",
      }}
    >
      {status === "loading" && (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
          <Title level={4} style={{ marginTop: 24 }}>
            Verifying your account...
          </Title>
        </div>
      )}
      {status === "success" && (
        <Result
          status="success"
          title={<Title level={2}>Email Verified Successfully!</Title>}
          subTitle="Your account has been confirmed. You can now access all features."
          extra={[
            <Link to="/login" key="login">
              <Button
                type="primary"
                size="large"
                style={{ padding: "0 40px", height: 48, borderRadius: 12 }}
              >
                Sign In to Your Account
              </Button>
            </Link>,
          ]}
        />
      )}
      {status === "error" && (
        <Result
          status="error"
          title={<Title level={2}>Verification Failed</Title>}
          subTitle="The link may be expired or invalid. Please try signing up again."
          extra={[
            <Link to="/signup" key="signup">
              <Button
                type="primary"
                size="large"
                danger
                style={{ padding: "0 40px", height: 48, borderRadius: 12 }}
              >
                Back to Sign Up
              </Button>
            </Link>,
          ]}
        />
      )}
    </div>
  );
};
export default VerifyPage;
