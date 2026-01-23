import React from "react";
import { useAppSelector, useAppDispatch } from "../../store";
import {
  toggleTray,
  clearCompleted,
  removeUpload,
  UploadItem,
} from "../../store/slices/uploadSlice";
import {
  CloseOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  LoadingOutlined,
  UpOutlined,
  DownOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { Progress, Button, Tooltip, message } from "antd";
import { openFile } from "../../services/upload.service";
import styles from "./UploadTray.module.css";

const UploadTray: React.FC = () => {
  const { items, isExpanded } = useAppSelector(
    (state) => state.upload || { items: [], isExpanded: false },
  );
  const dispatch = useAppDispatch();

  if (items.length === 0) return null;

  const uploadingCount = items.filter((i) => i.status === "uploading").length;
  const completedCount = items.filter((i) => i.status === "completed").length;
  const failedCount = items.filter((i) => i.status === "failed").length;

  const handleItemClick = async (item: UploadItem) => {
    if (item.status === "completed" && item.backendId) {
      try {
        await openFile(item.backendId);
      } catch (error: unknown) {
        message.error("Failed to open file");
      }
    }
  };

  return (
    <div
      className={`${styles.trayContainer} ${isExpanded ? styles.expanded : styles.collapsed}`}
    >
      <div className={styles.header} onClick={() => dispatch(toggleTray())}>
        <div className={styles.headerTitle}>
          <CloudUploadOutlined className={styles.uploadIcon} />
          <span>
            {uploadingCount > 0
              ? `Uploading ${uploadingCount} items...`
              : "Uploads complete"}
          </span>
        </div>
        <div className={styles.headerActions}>
          <Button
            type="text"
            size="small"
            icon={isExpanded ? <DownOutlined /> : <UpOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleTray());
            }}
          />
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(clearCompleted());
            }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className={styles.body}>
          <div className={styles.summary}>
            {completedCount > 0 && (
              <span className={styles.successText}>
                {completedCount} successful
              </span>
            )}
            {failedCount > 0 && (
              <span className={styles.errorText}>{failedCount} failed</span>
            )}
          </div>
          <div className={styles.itemList}>
            {items.map((item) => (
              <div
                key={item.id}
                className={`${styles.item} ${item.status === "completed" ? styles.clickable : ""}`}
                onClick={() => handleItemClick(item)}
              >
                <div className={styles.itemInfo}>
                  <div
                    className={`${styles.itemName} ${item.status === "completed" ? styles.itemNameCompleted : ""}`}
                    title={item.name}
                  >
                    {item.name}
                  </div>
                  <div className={styles.itemStatus}>
                    {item.status === "uploading" && (
                      <LoadingOutlined className={styles.spinning} />
                    )}
                    {item.status === "completed" && (
                      <CheckCircleFilled className={styles.successIcon} />
                    )}
                    {item.status === "failed" && (
                      <Tooltip title={item.error}>
                        <CloseCircleFilled className={styles.errorIcon} />
                      </Tooltip>
                    )}
                    <Button
                      type="text"
                      size="small"
                      icon={<CloseOutlined style={{ fontSize: 10 }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeUpload(item.id));
                      }}
                      className={styles.removeBtn}
                    />
                  </div>
                </div>
                <Progress
                  percent={item.progress}
                  size="small"
                  status={
                    item.status === "failed"
                      ? "exception"
                      : item.status === "completed"
                        ? "success"
                        : "active"
                  }
                  showInfo={false}
                  className={styles.progress}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadTray;
