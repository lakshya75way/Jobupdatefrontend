import React, { useState } from "react";
import { Form, Typography, message, Result } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import api from "../services/api";
import styles from "./login.module.css";
import { Button, Input } from "../components";
import { AxiosError } from "axios";
const { Title, Text } = Typography;
interface ForgotPasswordValues {
  email: string;
}
const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const onFinish = async (values: ForgotPasswordValues) => {
    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: values.email });
      setIsSent(true);
      message.success("Reset link sent to your email!");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      message.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };
  if (isSent) {
    return (
      <Result
        status="success"
        title="Email Sent!"
        subTitle="We have sent a password reset link to your email address. Please check your inbox."
        extra={[
          <Button
            type="primary"
            key="login"
            size="large"
            className={styles.submitBtn}
          >
            <Link to="/login">Back to Login</Link>
          </Button>,
        ]}
        className={styles.result}
      />
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={4} style={{ color: "white", marginBottom: 8 }}>
          Forgot Password
        </Title>
        <Text style={{ color: "rgba(255,255,255,0.45)" }}>
          Enter your email to receive reset instructions
        </Text>
      </div>
      <Form
        name="forgot-password"
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className={styles.form}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
            placeholder="Email Address"
            size="large"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
            className={styles.submitBtn}
          >
            Send Reset Link
          </Button>
        </Form.Item>
        <div className={styles.footer}>
          <Link
            to="/login"
            className={styles.signupLink}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <ArrowLeftOutlined /> Back to Login
          </Link>
        </div>
      </Form>
    </div>
  );
};
export default ForgotPasswordPage;
