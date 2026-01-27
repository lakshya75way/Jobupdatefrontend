import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Typography, App } from "antd";
import { LockOutlined } from "@ant-design/icons";
import api from "../services/apiClient";
import styles from "./LoginPage.module.css";
import { Button, Input } from "../components";

const { Title, Text } = Typography;

const ResetPasswordPage: React.FC = () => {
  const { message } = App.useApp();
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFinish = async (values: { password: string }) => {
    if (!token) {
      message.error("Invalid or expired token.");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: values.password,
      });
      message.success("Password reset successful! Please log in.");
      navigate("/login");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          Reset Password
        </Title>
        <Text className={styles.subtitle}>Enter your new password below</Text>
      </div>
      <Form
        name="reset-password"
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className={styles.form}
        size="large"
      >
        <Form.Item
          name="password"
          label={<Text className={styles.label}>New Password</Text>}
          rules={[
            { required: true, message: "Please input your new password!" },
            { required: true, message: "Please input your new password!" },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
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
          label={<Text className={styles.label}>Confirm New Password</Text>}
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your new password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
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
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default ResetPasswordPage;
