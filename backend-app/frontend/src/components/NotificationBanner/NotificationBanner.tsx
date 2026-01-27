import React, { useState } from "react";
import { Alert, Button, Space } from "antd";
import { BellOutlined, CloseOutlined } from "@ant-design/icons";
import { notificationService } from "../../services/notificationService";
import { useNotificationPermission } from "../../hooks/useNotificationPermission";

const NotificationBanner: React.FC = () => {
  const shouldShow = useNotificationPermission();
  const [dismissed, setDismissed] = useState(false);

  const handleEnable = async () => {
    const perm = await notificationService.requestPermission();
    if (perm !== "default") {
      setDismissed(true);
    }
  };

  if (!shouldShow || dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2000,
        width: "90%",
        maxWidth: "500px",
        animation: "bannerSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <Alert
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="pulse-icon">
              <BellOutlined style={{ fontSize: "20px", color: "white" }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#1e293b" }}>
                Step Processed Notifications
              </div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                Enable OS alerts to get notified even in the background.
              </div>
            </div>
          </div>
        }
        type="info"
        action={
          <Space>
            <Button
              size="middle"
              type="primary"
              onClick={handleEnable}
              style={{
                borderRadius: "8px",
                background: "#6366f1",
                border: "none",
                fontWeight: 600,
              }}
            >
              Enable Now
            </Button>
            <Button
              size="small"
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setDismissed(true)}
            />
          </Space>
        }
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "20px",
          padding: "16px 20px",
          boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)",
        }}
      />

      <style>
        {`
          @keyframes bannerSlideIn {
            from { opacity: 0; transform: translate(-50%, -30px) scale(0.95); }
            to { opacity: 1; transform: translate(-50%, 0) scale(1); }
          }
          
          .pulse-icon {
            background: #6366f1;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: iconPulse 2s infinite;
          }
          
          @keyframes iconPulse {
            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
            100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
          }
        `}
      </style>
    </div>
  );
};

export default NotificationBanner;
