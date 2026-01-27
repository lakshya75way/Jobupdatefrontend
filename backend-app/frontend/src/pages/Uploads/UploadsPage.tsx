import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  Typography,
  Card,
  message,
  Upload,
  Empty,
  Input,
  Modal,
} from "antd";
import {
  InboxOutlined,
  CloudUploadOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useFileUpload } from "../../hooks/useFileUpload";
import {
  getMyFilesApi,
  deleteFileApi,
  downloadFile,
  openFile,
} from "../../services/fileUploadService";
import { UserFile } from "../../types/upload";
import { useFileTableColumns } from "./useFileTableColumns";
import { SUPPORTED_PREVIEW_TYPES, BACKGROUND_SYNC_INTERVAL } from "./constants";
import FileSearchPicker from "../../components/FileSearchPicker/FileSearchPicker";
import styles from "./UploadsPage.module.css";

const { Title, Text } = Typography;
const { Dragger } = Upload;

const UploadsPage: React.FC = () => {
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const { uploadFiles } = useFileUpload();

  const fetchFiles = useCallback(
    async (search?: string, silent: boolean = false) => {
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
    },
    [messageApi],
  );

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
    fetchFiles(searchQuery, false);
    const syncInterval = setInterval(
      () => fetchFiles(searchQuery, true),
      BACKGROUND_SYNC_INTERVAL,
    );
    return () => clearInterval(syncInterval);
  }, [searchQuery, fetchFiles]);

  const handleDelete = useCallback(
    async (id: string) => {
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
    },
    [modalApi, messageApi, searchQuery, fetchFiles],
  );

  const handleDownload = useCallback(
    async (id: string, name: string) => {
      try {
        await downloadFile(id, name);
      } catch (error) {
        messageApi.error("Failed to download file");
      }
    },
    [messageApi],
  );

  const handleOpen = useCallback(
    async (record: UserFile) => {
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
    },
    [modalApi, handleDownload, messageApi],
  );

  const columns = useFileTableColumns({
    onOpen: handleOpen,
    onDownload: handleDownload,
    onDelete: handleDelete,
  });

  return (
    <div className={`${styles.container} page-transition`}>
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
            autoOpenFile={false}
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
                fetchFiles(searchQuery, true);
              } catch (error: unknown) {
                if (onError) onError(error as Error);
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
            <div className={styles.tableHeaderActions}>
              <Input
                placeholder="Filter files..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                style={{ width: 250 }}
                allowClear
              />
              <button
                onClick={() => fetchFiles()}
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 15px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "6px",
                  background: "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                <CloudUploadOutlined />
                Refresh
              </button>
            </div>
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
