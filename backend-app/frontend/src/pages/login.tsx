import React, { useState } from "react";
import { Form, Typography, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import styles from "./login.module.css";
import { LoginResponse } from "../types/auth";
import { AxiosError } from "axios";
import { Button, Input } from "../components";
const { Title, Text } = Typography;
interface LoginFormValues {
  email: string;
  password: string;
}
const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login, setAuthLoading, setAuthError } = useAuth();
  const navigate = useNavigate();
  const onFinish = async (values: LoginFormValues) => {
    setIsLoading(true);
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email: values.email,
        password: values.password,
      });
      login(
        response.data.user,
        response.data.token,
        response.data.refreshToken,
      );
      message.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string; status?: string }>;
      let errorMsg = "Invalid email or password.";
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMsg = "Incorrect email or password. Please try again.";
      } else if (!error.response) {
        errorMsg = "Cannot connect to server. Please check your connection.";
      }
      setAuthError(errorMsg);
      message.error(errorMsg, 5);
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          Sign In
        </Title>
        <Text className={styles.subtitle}>
          Enter your details to access your account
        </Text>
      </div>
      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className={styles.form}
        size="large"
      >
        <Form.Item
          name="email"
          label={<Text className={styles.label}>Email Address</Text>}
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input
            prefix={<MailOutlined className={styles.inputIcon} />}
            placeholder="name@company.com"
            className={styles.input}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={
            <div className={styles.labelWrapper}>
              <Text className={styles.label}>Password</Text>
              <Link to="/forgot-password" className={styles.forgotPassword}>
                Forgot?
              </Link>
            </div>
          }
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password
            prefix={<LockOutlined className={styles.inputIcon} />}
            placeholder="••••••••"
            className={styles.input}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
            className={styles.submitBtn}
          >
            Sign In <ArrowRightOutlined />
          </Button>
        </Form.Item>
        <div className={styles.footer}>
          <Text className={styles.footerText}>
            Don't have an account?{" "}
            <Link to="/register" className={styles.signupLink}>
              Create one now
            </Link>
          </Text>
        </div>
      </Form>
    </div>
  );
};
export default LoginPage;
