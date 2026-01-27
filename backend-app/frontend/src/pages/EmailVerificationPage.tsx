import React from "react";
import { useParams, Link } from "react-router-dom";
import { Spin, Typography, Result, App } from "antd";
import api from "../services/apiClient";
import styles from "./LoginPage.module.css";
import { Button } from "../components";

const { Title, Text } = Typography;

const EmailVerificationPage: React.FC = () => {
  const { message } = App.useApp();
  const { token } = useParams();
  const [status, setStatus] = React.useState<"loading" | "success" | "error">(
    "loading",
  );

  React.useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        return;
      }
      try {
        await api.get(`/auth/verify/${token}`);
        setStatus("success");
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        message.error(err.response?.data?.message || "Verification failed");
        setStatus("error");
      }
    };
    verifyEmail();
  }, [token, message]);

  return (
    <div className={styles.container}>
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "24px",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        {status === "loading" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
            <Title level={4} style={{ marginTop: 24 }}>
              Verifying your account...
            </Title>
            <Text type="secondary">
              Just a moment while we confirm your email.
            </Text>
          </div>
        )}
        {status === "success" && (
          <Result
            status="success"
            title={<Title level={3}>Verification Complete!</Title>}
            subTitle="Your email has been successfully verified. You're all set to go."
            extra={[
              <Button
                type="primary"
                key="login"
                size="large"
                block
                style={{ height: 48, borderRadius: 12 }}
              >
                <Link to="/login">Proceed to Login</Link>
              </Button>,
            ]}
          />
        )}
        {status === "error" && (
          <Result
            status="error"
            title={<Title level={3}>Verification Failed</Title>}
            subTitle="This link might be invalid or already used. Please request a new verification link."
            extra={[
              <Button
                type="primary"
                key="signup"
                size="large"
                block
                style={{ height: 48, borderRadius: 12 }}
              >
                <Link to="/signup">Back to Sign Up</Link>
              </Button>,
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
