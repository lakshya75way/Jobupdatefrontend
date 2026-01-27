import React, { memo } from "react";
import { Row, Col, Typography, Space, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "../../components";
import styles from "./JobMonitorPage.module.css";

const { Title, Text } = Typography;

interface JobMonitorHeaderProps {
  userRole?: string;
  isAdminView: boolean;
  onAdminViewChange: (checked: boolean) => void;
  onCreateJob: () => void;
}

export const JobMonitorHeader: React.FC<JobMonitorHeaderProps> = memo(
  ({ userRole, isAdminView, onAdminViewChange, onCreateJob }) => {
    return (
      <Row
        gutter={[16, 16]}
        justify="space-between"
        align="middle"
        style={{ marginBottom: 32 }}
      >
        <Col xs={24} lg={12}>
          <Title
            level={2}
            style={{ margin: 0, fontWeight: 800, letterSpacing: "-1px" }}
          >
            Task Monitor
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Real-time background job processing queue.
          </Text>
        </Col>
        <Col xs={24} lg={12}>
          <Row gutter={[12, 12]} justify="end">
            {userRole === "admin" && (
              <Col xs={24} sm={11}>
                <Space
                  style={{
                    background: "#fff",
                    padding: "6px 16px",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text strong>Admin View</Text>
                  <Switch
                    checked={isAdminView}
                    onChange={onAdminViewChange}
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                  />
                </Space>
              </Col>
            )}
            <Col xs={24} sm={userRole === "admin" ? 9 : 24}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={onCreateJob}
                className={styles.addBtn}
                style={{ width: "100%", height: 46 }}
              >
                Submit New Task
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  },
);

export default JobMonitorHeader;
