import React from "react";
import {
  Typography,
  Descriptions,
  Row,
  Col,
  Tag,
  Form,
  Input,
  Switch,
  Space,
} from "antd";
import {
  LockOutlined,
  CloudSyncOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { Card, Button } from "../components";
import api from "../services/api";
import { notificationService } from "../services/notification.service";

const { Title, Text } = Typography;

interface ChangePasswordValues {
  oldPassword: string;
  newPassword: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [pushEnabled, setPushEnabled] = React.useState(false);
  const [pushLoading, setPushLoading] = React.useState(true);

  React.useEffect(() => {
    const checkPushStatus = async () => {
      const status = await notificationService.getPushStatus();
      setPushEnabled(status);
      setPushLoading(false);
    };
    checkPushStatus();
  }, []);

  const handlePushToggle = async (checked: boolean) => {
    setPushLoading(true);
    if (checked) {
      const success = await notificationService.subscribeToPush();
      if (success) {
        setPushEnabled(true);
        notificationService.message.success(
          "Background notifications enabled!",
        );
      } else {
        notificationService.message.error(
          "Failed to enable background notifications.",
        );
      }
    } else {
      const success = await notificationService.unsubscribeFromPush();
      if (success) {
        setPushEnabled(false);
        notificationService.message.info("Background notifications disabled.");
      }
    }
    setPushLoading(false);
  };

  const onChangePassword = async (values: ChangePasswordValues) => {
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
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      <Row gutter={[24, 24]}>
        {/* Profile Card */}
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

        {/* Security Card */}
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
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: "Required" },
                  { min: 8, message: "Min 8 chars" },
                ]}
              >
                <Input.Password />
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

        {/* System & Push Card */}
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
                    onClick={async () => {
                      const perm =
                        await notificationService.requestPermission();
                      if (perm === "granted") {
                        notificationService.message.success(
                          "Browser permission granted!",
                        );
                      }
                    }}
                    disabled={
                      notificationService.getPermissionStatus() === "granted"
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
                      Test Bell 🔔
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
                      loading={pushLoading}
                      checked={pushEnabled}
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
                  {pushEnabled && (
                    <Button
                      type="primary"
                      ghost
                      size="small"
                      style={{ marginTop: 16, borderRadius: 8 }}
                      onClick={async () => {
                        try {
                          const res = await api.post(
                            "/auth/schedule-test-notification",
                          );
                          notificationService.message.success(res.data.message);
                        } catch (err) {
                          notificationService.message.error(
                            "Failed to schedule test.",
                          );
                        }
                      }}
                    >
                      Delayed Test (10s) 🕒
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

export default ProfilePage;
