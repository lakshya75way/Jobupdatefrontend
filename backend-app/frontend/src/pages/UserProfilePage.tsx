import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Descriptions,
  Row,
  Col,
  Tag,
  Form,
  Input as AntdInput,
  Switch,
  Space,
} from "antd";
import {
  LockOutlined,
  CloudSyncOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { Button, Card } from "../components";
import api from "../services/apiClient";
import { notificationService } from "../services/notificationService";

const { Title, Text } = Typography;

interface ChangePasswordValues {
  oldPassword: string;
  newPassword: string;
}

interface PushState {
  enabled: boolean;
  loading: boolean;
}

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [pushState, setPushState] = useState<PushState>({
    enabled: false,
    loading: true,
  });

  useEffect(() => {
    const checkPushStatus = async () => {
      const status = await notificationService.getPushStatus();
      setPushState({ enabled: status, loading: false });
    };
    checkPushStatus();
  }, []);

  const handlePushToggle = useCallback(async (checked: boolean) => {
    setPushState((prev) => ({ ...prev, loading: true }));
    if (checked) {
      const success = await notificationService.subscribeToPush();
      if (success) {
        setPushState({ enabled: true, loading: false });
        notificationService.message.success(
          "Background notifications enabled!",
        );
      } else {
        notificationService.message.error(
          "Failed to enable background notifications.",
        );
        setPushState((prev) => ({ ...prev, loading: false }));
      }
    } else {
      const success = await notificationService.unsubscribeFromPush();
      if (success) {
        setPushState({ enabled: false, loading: false });
        notificationService.message.info("Background notifications disabled.");
      } else {
        setPushState((prev) => ({ ...prev, loading: false }));
      }
    }
  }, []);

  const onChangePassword = useCallback(
    async (values: ChangePasswordValues) => {
      setLoading(true);
      try {
        await api.post("/auth/change-password", values);
        notificationService.message.success("Password changed successfully");
        form.resetFields();
      } catch (err: unknown) {
        const errorMsg =
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message || "Failed to change password";
        notificationService.message.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [form],
  );

  const handleBrowserPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      notificationService.message.error(
        "Notifications are not supported in this browser",
      );
      return;
    }

    setPermissionLoading(true);
    try {
      const perm = await notificationService.requestPermission();
      if (perm === "granted") {
        notificationService.message.success("Browser permission granted!");
      } else if (perm === "denied") {
        notificationService.message.error(
          "Notifications blocked. To enable: Click the lock icon in your address bar → Site settings → Notifications → Allow",
          8,
        );
      } else {
        notificationService.message.warning("Permission request was dismissed");
      }
    } catch (error) {
      console.error("Permission request error:", error);
      notificationService.message.error(
        "Failed to request permission. Please try again.",
      );
    } finally {
      setPermissionLoading(false);
    }
  }, []);

  const handleScheduleTest = useCallback(async () => {
    try {
      const res = await api.post("/auth/schedule-test-notification");
      notificationService.message.success(res.data.message);
    } catch (error: unknown) {
      notificationService.message.error("Failed to schedule test.");
    }
  }, []);

  return (
    <div className="page-transition">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <BellOutlined />
                <Title level={4} style={{ margin: 0 }}>
                  My Profile
                </Title>
              </Space>
            }
          >
            <Descriptions column={1} size="middle">
              <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color="blue">{user?.role || "User"}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <LockOutlined />
                <Title level={4} style={{ margin: 0 }}>
                  Security
                </Title>
              </Space>
            }
          >
            <Title level={5}>Change Password</Title>
            <Form form={form} layout="vertical" onFinish={onChangePassword}>
              <Form.Item
                name="oldPassword"
                label="Current Password"
                rules={[{ required: true, message: "Required" }]}
              >
                <AntdInput.Password />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: "Required" },
                  { min: 8, message: "Min 8 chars" },
                ]}
              >
                <AntdInput.Password />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<LockOutlined />}
                >
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24}>
          <Card
            title={
              <Space>
                <CloudSyncOutlined />
                <Title level={4} style={{ margin: 0 }}>
                  Notification Settings
                </Title>
              </Space>
            }
          >
            <Row gutter={[32, 32]}>
              <Col xs={24} md={12}>
                <Title level={5}>Hybrid Alerts (Active Tab)</Title>
                <Text
                  type="secondary"
                  style={{ display: "block", marginBottom: 16 }}
                >
                  Get instant in-app and browser popups while using the
                  application.
                </Text>
                <Space wrap>
                  <Button
                    type="default"
                    onClick={handleBrowserPermission}
                    loading={permissionLoading}
                    disabled={
                      notificationService.getPermissionStatus() === "granted" ||
                      permissionLoading
                    }
                  >
                    {notificationService.getPermissionStatus() === "granted"
                      ? "Browser Alerts Enabled"
                      : "Request Browser Permission"}
                  </Button>
                  {notificationService.getPermissionStatus() === "granted" && (
                    <Button
                      type="link"
                      onClick={() => notificationService.testNotification()}
                    >
                      Test Bell
                    </Button>
                  )}
                </Space>
              </Col>

              <Col xs={24} md={12}>
                <div
                  style={{
                    background: "rgba(99, 102, 241, 0.05)",
                    padding: "20px",
                    borderRadius: "16px",
                    border: "1px dashed rgba(99, 102, 241, 0.2)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <Title level={5} style={{ marginTop: 0 }}>
                        Persistent Push (Closed Tab)
                      </Title>
                      <Text
                        type="secondary"
                        style={{ display: "block", maxWidth: "300px" }}
                      >
                        Stay updated even when your browser is closed. Uses
                        OS-level Service Workers.
                      </Text>
                    </div>
                    <Switch
                      loading={pushState.loading}
                      checked={pushState.enabled}
                      onChange={handlePushToggle}
                      disabled={
                        notificationService.getPermissionStatus() !== "granted"
                      }
                    />
                  </div>
                  {notificationService.getPermissionStatus() !== "granted" && (
                    <Text
                      type="danger"
                      style={{
                        fontSize: "12px",
                        marginTop: "8px",
                        display: "block",
                      }}
                    >
                      * Please grant browser permission first.
                    </Text>
                  )}
                  {pushState.enabled && (
                    <Button
                      type="primary"
                      ghost
                      size="small"
                      style={{ marginTop: 16, borderRadius: 8 }}
                      onClick={handleScheduleTest}
                    >
                      Delayed Test (10s)
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfilePage;
