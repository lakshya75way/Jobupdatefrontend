import { useMemo } from "react";
import { Space, Typography, Tag, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  FileOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { UserFile } from "../../types/upload";

const { Text } = Typography;

interface UseFileTableColumnsProps {
  onOpen: (file: UserFile) => void;
  onDownload: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export const useFileTableColumns = ({
  onOpen,
  onDownload,
  onDelete,
}: UseFileTableColumnsProps): ColumnsType<UserFile> => {
  return useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "originalName",
        key: "name",
        render: (text: string, record: UserFile) => (
          <Space onClick={() => onOpen(record)} style={{ cursor: "pointer" }}>
            <FileOutlined style={{ color: "#3b82f6" }} />
            <Text
              strong
              style={{
                maxWidth: 300,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {text}
            </Text>
          </Space>
        ),
      },
      {
        title: "Type",
        dataIndex: "mimeType",
        key: "type",
        render: (text: string) => <Tag color="blue">{text}</Tag>,
        responsive: ["md"],
      },
      {
        title: "Size",
        dataIndex: "size",
        key: "size",
        render: (size: number) => {
          const kilobytes = size / 1024;
          const megabytes = kilobytes / 1024;
          return megabytes > 1
            ? `${megabytes.toFixed(2)} MB`
            : `${kilobytes.toFixed(2)} KB`;
        },
        responsive: ["sm"],
      },
      {
        title: "Uploaded At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date: string) => new Date(date).toLocaleString(),
        responsive: ["lg"],
      },
      {
        title: "Actions",
        key: "actions",
        fixed: "right",
        width: 150,
        render: (_: unknown, record: UserFile) => (
          <Space size="small">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onOpen(record)}
              title="Open"
            />
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => onDownload(record._id, record.originalName)}
              title="Download"
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record._id)}
              title="Delete"
            />
          </Space>
        ),
      },
    ],
    [onOpen, onDownload, onDelete],
  );
};
