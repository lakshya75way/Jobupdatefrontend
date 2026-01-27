import React, { useMemo, useCallback } from "react";
import { Row, Col, Statistic, Typography, Upload } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { useJobs } from "../../hooks/useJobs";
import { useAuth } from "../../hooks/useAuth";
import { useFileUpload } from "../../hooks/useFileUpload";
import { Card, Button } from "../../components";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notificationService";

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface UploadRequestProps {
  file: File | Blob | string;
  onSuccess?: (body: unknown, xhr?: XMLHttpRequest) => void;
  onError?: (error: Error) => void;
}

const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { jobs, loading } = useJobs(user?.role === "admin");
  const { uploadFiles } = useFileUpload();

  const stats = useMemo(() => {
    if (!Array.isArray(jobs)) {
      return { total: 0, completed: 0, processing: 0, failed: 0, pending: 0 };
    }
    const total = jobs.length;
    const completed = jobs.filter((job) => job.status === "completed").length;
    const processing = jobs.filter((job) => job.status === "processing").length;
    const failed = jobs.filter((job) => job.status === "failed").length;
    const pending = jobs.filter((job) => job.status === "pending").length;
    return { total, completed, processing, failed, pending };
  }, [jobs]);

  const handleQuickUpload = useCallback(
    async ({ file, onSuccess, onError }: UploadRequestProps) => {
      try {
        await uploadFiles([file as File]);
        if (onSuccess) onSuccess("ok");
        notificationService.message.success(
          `${(file as File).name} upload started`,
        );
      } catch (error: unknown) {
        if (onError) onError(error as Error);
        notificationService.message.error(
          `${(file as File).name} upload failed`,
        );
      }
    },
    [uploadFiles],
  );

  if (loading && jobs.length === 0) return null;

  return (
    <div className="page-transition">
      <div
        style={{
          marginBottom: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <Title
            level={2}
            style={{ margin: 0, fontWeight: 800, letterSpacing: "-1px" }}
          >
            System Overview
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Real-time summary of background job processing.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<CloudUploadOutlined />}
          onClick={() => navigate("/dashboard/uploads")}
        >
          Manage All Files
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderLeft: "4px solid #6366f1" }}>
            <Statistic
              title={
                <Text strong style={{ color: "#64748b" }}>
                  Total Tasks
                </Text>
              }
              value={stats.total}
              styles={{ content: { fontWeight: 800, color: "#1e293b" } }}
              prefix={<ClockCircleOutlined style={{ color: "#6366f1" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderLeft: "4px solid #10b981" }}>
            <Statistic
              title={
                <Text strong style={{ color: "#64748b" }}>
                  Completed
                </Text>
              }
              value={stats.completed}
              styles={{ content: { fontWeight: 800, color: "#1e293b" } }}
              prefix={<CheckCircleOutlined style={{ color: "#10b981" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderLeft: "4px solid #3b82f6" }}>
            <Statistic
              title={
                <Text strong style={{ color: "#64748b" }}>
                  Processing
                </Text>
              }
              value={stats.processing}
              styles={{ content: { fontWeight: 800, color: "#1e293b" } }}
              prefix={<SyncOutlined spin style={{ color: "#3b82f6" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderLeft: "4px solid #f43f5e" }}>
            <Statistic
              title={
                <Text strong style={{ color: "#64748b" }}>
                  Failed
                </Text>
              }
              value={stats.failed}
              styles={{ content: { fontWeight: 800, color: "#1e293b" } }}
              prefix={<CloseCircleOutlined style={{ color: "#f43f5e" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                Quick Upload
              </Title>
            }
          >
            <Dragger
              multiple
              showUploadList={false}
              customRequest={handleQuickUpload}
              style={{ background: "#f8fafc", border: "2px dashed #e2e8f0" }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#6366f1" }} />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Files will be processed in the background. Tracks progress in
                the tray.
              </p>
            </Dragger>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                Pending Queue
              </Title>
            }
          >
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Title
                level={1}
                style={{ margin: 0, color: "#6366f1", opacity: 0.2 }}
              >
                {stats.pending}
              </Title>
              <Text type="secondary">Tasks waiting in queue</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default DashboardOverviewPage;
