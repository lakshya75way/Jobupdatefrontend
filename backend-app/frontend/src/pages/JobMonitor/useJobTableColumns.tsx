import { useMemo } from "react";
import { TableProps, Space, Typography, Tag, Flex } from "antd";
import { ThunderboltOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Job, JobStatus } from "../../types/job";
import { Badge, Button } from "../../components";

const { Text } = Typography;

interface UseJobTableColumnsProps {
  onViewLogs: (job: Job) => void;
}

export const useJobTableColumns = ({
  onViewLogs,
}: UseJobTableColumnsProps): TableProps<Job>["columns"] => {
  return useMemo(
    () => [
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
          const config: Record<
            JobStatus,
            { color: BadgeStatus; text: string }
          > = {
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
            <Flex vertical gap={0}>
              <Badge status={color} text={isRetrying ? "Retrying..." : text} />
              {isRetrying && (
                <Text type="warning" style={{ fontSize: 11, marginLeft: 16 }}>
                  Attempt {record.retries}/{record.maxRetries}
                </Text>
              )}
            </Flex>
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
          <Button size="small" onClick={() => onViewLogs(record)}>
            View Logs
          </Button>
        ),
      },
    ],
    [onViewLogs],
  );
};
