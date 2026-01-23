import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Card,
  message,
  Upload,
  Empty,
  Input,
  Modal,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  InboxOutlined,
  CloudUploadOutlined,
  FileOutlined,
  DownloadOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useFileUpload } from "../../hooks/useFileUpload";
import {
  getMyFilesApi,
  deleteFileApi,
  downloadFile,
  openFile,
} from "../../services/upload.service";
import { UserFile } from "../../types/upload";
import styles from "./UploadsPage.module.css";

import FileSearchPicker from "../../components/FileSearchPicker/FileSearchPicker";

const { Title, Text } = Typography;
const { Dragger } = Upload;

const SUPPORTED_PREVIEW_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg+xml",
  "image/webp",
  "text/plain",
  "text/html",
  "text/css",
  "application/json",
  "text/javascript",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "video/mp4",
  "video/webm",
  "video/ogg",
];

const UploadsPage: React.FC = () => {
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const { uploadFiles } = useFileUpload();

  const fetchFiles = async (search?: string, silent: boolean = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await getMyFilesApi(search);
      setFiles(response.data.data);
    } catch (error) {
      if (!silent) {
        messageApi.error("Failed to fetch files");
      }
      console.error("Background sync failed:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Filter files based on search query
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) {
      return files;
    }
    const query = searchQuery.toLowerCase();
    return files.filter((file) =>
      file.originalName.toLowerCase().includes(query),
    );
  }, [files, searchQuery]);

  useEffect(() => {
    fetchFiles(searchQuery, false); // Initial load with loader
    const interval = setInterval(() => fetchFiles(searchQuery, true), 15000); // Silent background sync
    return () => clearInterval(interval);
  }, [searchQuery]);

  const handleDelete = async (id: string) => {
    modalApi.confirm({
      title: "Delete File",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this file? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteFileApi(id);
          messageApi.success("File deleted successfully");
          fetchFiles(searchQuery, true);
        } catch (error) {
          messageApi.error("Failed to delete file");
        }
      },
    });
  };

  const handleDownload = async (id: string, name: string) => {
    try {
      await downloadFile(id, name);
    } catch (error) {
      messageApi.error("Failed to download file");
    }
  };

  const handleOpen = async (record: UserFile) => {
    const isSupported = SUPPORTED_PREVIEW_TYPES.some(
      (type) => record.mimeType.startsWith(type) || record.mimeType === type,
    );

    if (!isSupported) {
      modalApi.confirm({
        title: "Preview Not Supported",
        icon: <FileOutlined />,
        content: `The file format (${record.mimeType}) cannot be previewed directly in the browser. Would you like to download it instead?`,
        okText: "Download Now",
        cancelText: "Cancel",
        onOk: () => handleDownload(record._id, record.originalName),
      });
      return;
    }

    try {
      await openFile(record._id);
    } catch (error: unknown) {
      messageApi.error("Failed to open file");
    }
  };

  const columns: ColumnsType<UserFile> = [
    {
      title: "Name",
      dataIndex: "originalName",
      key: "name",
      render: (text: string, record: UserFile) => (
        <Space onClick={() => handleOpen(record)} style={{ cursor: "pointer" }}>
          <FileOutlined style={{ color: "#3b82f6" }} />
          <Text strong className={styles.itemNameTable}>
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
        const kb = size / 1024;
        const mb = kb / 1024;
        return mb > 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
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
            onClick={() => handleOpen(record)}
            title="Open"
          />
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record._id, record.originalName)}
            title="Download"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {messageContextHolder}
      {modalContextHolder}
      <div className={styles.header}>
        <div>
          <Title level={2}>My Uploads</Title>
          <Text type="secondary">Manage your background file uploads</Text>
        </div>
      </div>

      <div className={styles.content}>
        <div style={{ marginBottom: "20px" }}>
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            Quick Search:
          </Text>
          <FileSearchPicker
            onSelect={(file) => {
              setSearchQuery(file.originalName);
              handleOpen(file);
            }}
            onInputChange={(value) => {
              setSearchQuery(value);
            }}
            autoOpenFile={false} // We handle opening ourselves for preview logic
          />
        </div>

        <Card
          className={styles.uploadCard}
          styles={{ body: { padding: "40px 24px" } }}
        >
          <Dragger
            multiple
            showUploadList={false}
            customRequest={async ({ file, onSuccess, onError }) => {
              try {
                await uploadFiles([file as File]);
                if (onSuccess) onSuccess("ok");
                fetchFiles(searchQuery, true); // Silent refresh after upload
              } catch (err: unknown) {
                if (onError) onError(err as Error);
              }
            }}
            className={styles.dragger}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Files will upload in the
              background.
            </p>
          </Dragger>
        </Card>

        <Card className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <Title level={4}>Recent Files</Title>
            <Space className={styles.headerActions}>
              <Input
                placeholder="Filter files..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />
              <Button
                icon={<CloudUploadOutlined />}
                onClick={() => fetchFiles()}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </div>
          <Table
            dataSource={filteredFiles}
            columns={columns}
            rowKey="_id"
            loading={loading}
            scroll={{ x: 700 }}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No files uploaded yet"
                />
              ),
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default UploadsPage;
