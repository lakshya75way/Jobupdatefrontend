import React, { memo } from "react";
import { Modal, Typography } from "antd";
import { Job } from "../../types/job";

const { Title, Text } = Typography;

interface JobLogsModalProps {
  job: Job | null;
  onClose: () => void;
}

export const JobLogsModal: React.FC<JobLogsModalProps> = memo(
  ({ job, onClose }) => {
    return (
      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            Job Logs: {job?.id}
          </Title>
        }
        open={!!job}
        onCancel={onClose}
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
          {job && (
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
                      job.status === "completed"
                        ? "#4ade80"
                        : job.status === "failed"
                          ? "#ef4444"
                          : "#fbbf24",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {job.status}
                </span>
              </div>
              <div>
                <div style={{ marginBottom: 4 }}>
                  <Text style={{ color: "#888" }}>
                    [{new Date(job.createdAt).toLocaleTimeString()}]
                  </Text>{" "}
                  Job initialized.
                </div>
                {job.status !== "pending" && (
                  <div style={{ marginBottom: 4 }}>
                    <Text style={{ color: "#888" }}>
                      [
                      {new Date(
                        new Date(job.createdAt).getTime() + 500,
                      ).toLocaleTimeString()}
                      ]
                    </Text>{" "}
                    Processor started.
                  </div>
                )}
                {job.status === "completed" && (
                  <>
                    <div style={{ marginBottom: 4 }}>
                      <Text style={{ color: "#888" }}>
                        [
                        {new Date(
                          job.completedAt || new Date(),
                        ).toLocaleTimeString()}
                        ]
                      </Text>{" "}
                      Task executed successfully.
                    </div>
                    <div style={{ color: "#4ade80", marginTop: 8 }}>
                      Result: {job.result}
                    </div>
                  </>
                )}
                {job.status === "failed" && (
                  <>
                    <div style={{ marginBottom: 4 }}>
                      <Text style={{ color: "#888" }}>
                        [
                        {new Date(
                          job.completedAt || new Date(),
                        ).toLocaleTimeString()}
                        ]
                      </Text>{" "}
                      Task encountered an error.
                    </div>
                    <div style={{ color: "#ef4444", marginTop: 8 }}>
                      Error: {job.error}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>
    );
  },
);

export default JobLogsModal;
