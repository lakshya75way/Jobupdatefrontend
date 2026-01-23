import React, { useState } from "react";
import {
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Form,
  TableProps,
  Divider,
  Switch,
  Modal,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useJobs } from "../hooks/useJobs";
import { Job, CreateJobDto, JobStatus } from "../types/job";
import { Button, Input, Card, Select, Table, Badge } from "../components";
import { useAuth } from "../hooks/useAuth";
import styles from "./jobs.module.css";
const { Title, Text } = Typography;
const JobsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm<CreateJobDto>();
  const { user } = useAuth();
  const [isAdminView, setIsAdminView] = useState(user?.role === "admin");
  const { jobs, loading, addJob, fetchJobs } = useJobs(isAdminView);
  const [, modalContextHolder] = Modal.useModal();
  const columns: TableProps<Job>["columns"] = [
    {
      title: "Task ID",
      dataIndex: "id",
      key: "id",
      width: 140,
      fixed: "left",
      render: (text: string) => (
        <Text copyable code style={{ color: "#6366f1", fontWeight: 600 }}>
          {text.substring(0, 8)}...
        </Text>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 180,
      render: (text: string) => (
        <Space>
          {text === "Fast Task" ? (
            <ThunderboltOutlined style={{ color: "#f59e0b" }} />
          ) : (
            <ClockCircleOutlined style={{ color: "#64748b" }} />
          )}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 180,
      render: (status: Job["status"], record: Job) => {
        const isRetrying =
          (record.retries || 0) > 0 &&
          status !== "completed" &&
          status !== "failed";
        type BadgeStatus =
          | "success"
          | "processing"
          | "default"
          | "error"
          | "warning";
        const config: Record<JobStatus, { color: BadgeStatus; text: string }> =
          {
            pending: { color: "default", text: "Pending" },
            processing: { color: "processing", text: "Processing" },
            completed: {
              color: "success",
              text: "Completed",
            },
            failed: { color: "error", text: "Failed" },
          };
        const { color, text } = config[status];
        return (
          <Space direction="vertical" size={0}>
            <Badge status={color} text={isRetrying ? "Retrying..." : text} />
            {isRetrying && (
              <Text type="warning" style={{ fontSize: 11, marginLeft: 16 }}>
                Attempt {record.retries}/{record.maxRetries}
              </Text>
            )}
          </Space>
        );
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      render: (priority: number) => {
        let color = "default";
        let label = "Standard";
        if (priority >= 10) {
          color = "error";
          label = "Critical";
        } else if (priority >= 5) {
          color = "warning";
          label = "Elevated";
        }
        return (
          <Tag
            color={color}
            style={{
              borderRadius: 6,
              fontWeight: 700,
              minWidth: 80,
              textAlign: "center",
            }}
          >
            {label}
          </Tag>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => (
        <Text type="secondary">{new Date(date).toLocaleTimeString()}</Text>
      ),
      responsive: ["lg"],
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_: unknown, record: Job) => (
        <Button size="small" onClick={() => setSelectedJob(record)}>
          View Logs
        </Button>
      ),
    },
  ];
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const handleAddJob = async (values: CreateJobDto) => {
    const success = await addJob(values);
    if (success) {
      setIsModalOpen(false);
      form.resetFields();
    }
  };
  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      {modalContextHolder}
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
            {user?.role === "admin" && (
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
                    onChange={(checked: boolean) => {
                      setIsAdminView(checked);
                      fetchJobs(checked);
                    }}
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                  />
                </Space>
              </Col>
            )}
            <Col xs={24} sm={user?.role === "admin" ? 9 : 24}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => setIsModalOpen(true)}
                className={styles.addBtn}
                style={{ width: "100%", height: 46 }}
              >
                Submit New Task
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
          <Col xs={24} sm={16} flex="auto">
            <Input
              prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
              placeholder="Filter by Job ID or Type..."
              size="large"
              className={styles.searchBar}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Select defaultValue="all" size="large" style={{ width: "100%" }}>
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="processing">Processing</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="failed">Failed</Select.Option>
            </Select>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={Array.isArray(jobs) ? jobs : []}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            Dispatch Background Task
          </Title>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={500}
      >
        <Divider style={{ marginTop: 12 }} />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddJob}
          size="large"
          initialValues={{
            type: "Fast Task",
            priority: 0,
            metadataType: "standard",
            data: { info: "Standard Task" },
          }}
        >
          <Form.Item
            name="type"
            label={<Text strong>Task Specification</Text>}
            rules={[{ required: true }]}
          >
            <Select placeholder="Select task type">
              <Select.Option value="Fast Task">Fast Task (2s)</Select.Option>
              <Select.Option value="Heavy Processing">
                Heavy Processing (5s)
              </Select.Option>
              <Select.Option value="Data Sync">Data Sync</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="priority"
            label={<Text strong>Execution Priority</Text>}
          >
            <Select placeholder="Choose priority">
              <Select.Option value={0}>Standard (Low)</Select.Option>
              <Select.Option value={5}>Elevated (Medium)</Select.Option>
              <Select.Option value={10}>Critical (High)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="metadataType"
            label={<Text strong>Simulation Mode</Text>}
            initialValue="standard"
          >
            <Select
              onChange={(value) => {
                if (value === "standard") {
                  form.setFieldsValue({ data: { info: "Standard Task" } });
                } else if (value === "fail_once") {
                  form.setFieldsValue({
                    data: {
                      failOnce: true,
                      failCount: 1,
                      info: "Simulated Failure (1x)",
                    },
                  });
                } else if (value === "fail_permanent") {
                  form.setFieldsValue({
                    data: {
                      shouldFail: true,
                      permanent: true,
                      info: "Permanent Failure",
                    },
                  });
                }
              }}
            >
              <Select.Option value="standard">Standard Execution</Select.Option>
              <Select.Option value="fail_once">
                Simulate Failure (Retry Success)
              </Select.Option>
              <Select.Option value="fail_permanent">
                Simulate Permanent Failure
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="data" hidden>
            <Input />
          </Form.Item>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<PlayCircleOutlined />}
              style={{ fontWeight: 600 }}
            >
              Launch Task
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            Job Logs: {selectedJob?.id}
          </Title>
        }
        open={!!selectedJob}
        onCancel={() => setSelectedJob(null)}
        footer={null}
        width={600}
      >
        <div
          style={{
            background: "#1e1e1e",
            padding: 16,
            borderRadius: 8,
            color: "#fff",
            fontFamily: "monospace",
            minHeight: 300,
          }}
        >
          {selectedJob && (
            <>
              <div
                style={{
                  marginBottom: 12,
                  borderBottom: "1px solid #333",
                  paddingBottom: 8,
                }}
              >
                <Text style={{ color: "#aaa" }}>Status: </Text>
                <span
                  style={{
                    color:
                      selectedJob.status === "completed"
                        ? "#4ade80"
                        : selectedJob.status === "failed"
                          ? "#ef4444"
                          : "#fbbf24",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {selectedJob.status}
                </span>
              </div>
              <div>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: "#888" }}>
                    [{new Date(selectedJob.createdAt).toLocaleTimeString()}]
                  </Text>{" "}
                  Job initialized.
                </div>
                {selectedJob.status !== "pending" && (
                  <div style={{ marginBottom: 4 }}>
                    <Text style={{ color: "#888" }}>
                      [
                      {new Date(
                        new Date(selectedJob.createdAt).getTime() + 500,
                      ).toLocaleTimeString()}
                      ]
                    </Text>{" "}
                    Processor started.
                  </div>
                )}
                {selectedJob.status === "completed" && (
                  <>
                    <div style={{ marginBottom: 4 }}>
                      <Text style={{ color: "#888" }}>
                        [
                        {new Date(
                          selectedJob.completedAt || new Date(),
                        ).toLocaleTimeString()}
                        ]
                      </Text>{" "}
                      Task executed successfully.
                    </div>
                    <div style={{ color: "#4ade80", marginTop: 8 }}>
                      ✓ Result: {selectedJob.result}
                    </div>
                  </>
                )}
                {selectedJob.status === "failed" && (
                  <>
                    <div style={{ marginBottom: 4 }}>
                      <Text style={{ color: "#888" }}>
                        [
                        {new Date(
                          selectedJob.completedAt || new Date(),
                        ).toLocaleTimeString()}
                        ]
                      </Text>{" "}
                      Task encountered an error.
                    </div>
                    <div style={{ color: "#ef4444", marginTop: 8 }}>
                      ✗ Error: {selectedJob.error}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
export default JobsPage;
