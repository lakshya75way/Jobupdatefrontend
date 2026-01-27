import React, { memo } from "react";
import { Modal, Form, Divider, Typography } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { CreateJobDto } from "../../types/job";
import { Button, Select, Input } from "../../components";

const { Title, Text } = Typography;

interface CreateJobModalProps {
  isOpen: boolean;
  loading: boolean;
  form: ReturnType<typeof Form.useForm<CreateJobDto>>[0];
  onClose: () => void;
  onSubmit: (values: CreateJobDto) => Promise<void>;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = memo(
  ({ isOpen, loading, form, onClose, onSubmit }) => {
    return (
      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            Dispatch Background Task
          </Title>
        }
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={500}
      >
        <Divider style={{ marginTop: 12 }} />
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
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
            <Button onClick={onClose}>Cancel</Button>
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
    );
  },
);

export default CreateJobModal;
