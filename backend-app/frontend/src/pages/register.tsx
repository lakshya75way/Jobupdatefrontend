import React, { useState } from "react";
import { Form, Typography, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./login.module.css"; // Reusing premium styles
import { RegisterResponse } from "../types/auth";
import { AxiosError } from "axios";
import { Button, Input } from "../components";
const { Title, Text } = Typography;
interface SignupFormValues {
  email: string;
  password: string;
  confirm: string;
}
const SignupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const onFinish = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      await api.post<RegisterResponse>("/auth/signup", {
        email: values.email,
        password: values.password,
      });
      message.success("Account created! Please verify your email.");
      navigate("/login");
    } catch (err: unknown) {
      const error = err as AxiosError<{
        message?: string;
        errors?: { message: string }[];
      }>;
      if (error.response?.data?.errors?.length) {
        error.response.data.errors.forEach((e) => {
          message.error(e.message);
        });
      } else {
        message.error(
          error.response?.data?.message || "Failed to create account.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          Create Account
        </Title>
        <Text className={styles.subtitle}>Create your account today</Text>
      </div>
      <Form
        name="signup"
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
          label={<Text className={styles.label}>Password</Text>}
          rules={[
            { required: true, message: "Password is required" },
            { min: 8, message: "Must be at least 8 characters" },
            {
              pattern: /[A-Z]/,
              message: "Must contain at least one uppercase letter",
            },
            {
              pattern: /[a-z]/,
              message: "Must contain at least one lowercase letter",
            },
            { pattern: /[0-9]/, message: "Must contain at least one number" },
            {
              pattern: /[^A-Za-z0-9]/,
              message: "Must contain at least one special character",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className={styles.inputIcon} />}
            placeholder="••••••••"
            className={styles.input}
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          label={<Text className={styles.label}>Confirm Password</Text>}
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className={styles.inputIcon} />}
            placeholder="••••••••"
            className={styles.input}
          />
        </Form.Item>
        <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
            className={styles.submitBtn}
          >
            Get Started <ArrowRightOutlined />
          </Button>
        </Form.Item>
        <div className={styles.footer}>
          <Text className={styles.footerText}>
            Already have an account?{" "}
            <Link to="/login" className={styles.signupLink}>
              Sign In
            </Link>
          </Text>
        </div>
      </Form>
    </div>
  );
};
export default SignupPage;
