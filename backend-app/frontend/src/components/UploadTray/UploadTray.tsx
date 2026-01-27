import React, { useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../store/appStore";
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
import { Progress, Button, Tooltip } from "antd";
import { openFile } from "../../services/fileUploadService";
import { notificationService } from "../../services/notificationService";
import useFileUpload from "../../hooks/useFileUpload";
import styles from "./UploadTray.module.css";

const UploadTray: React.FC = () => {
  const { items, isExpanded } = useAppSelector(
    (state) => state.upload || { items: [], isExpanded: false },
  );
  const dispatch = useAppDispatch();
  const { cancelUpload } = useFileUpload();

  const counts = useMemo(
    () => ({
      uploading: items.filter((item) => item.status === "uploading").length,
      completed: items.filter((item) => item.status === "completed").length,
      failed: items.filter((item) => item.status === "failed").length,
    }),
    [items],
  );

  const handleRemove = (item: UploadItem) => {
    if (item.status === "uploading") {
      cancelUpload(item.id);
    }
    dispatch(removeUpload(item.id));
  };

  const handleItemClick = async (item: UploadItem) => {
    if (item.status === "completed" && item.backendId) {
      try {
        await openFile(item.backendId);
      } catch (error: unknown) {
        notificationService.message.error("Failed to open file");
      }
    }
  };

  if (items.length === 0) return null;

  return (
    <div
      className={`${styles.trayContainer} ${isExpanded ? styles.expanded : styles.collapsed}`}
    >
      <div className={styles.header} onClick={() => dispatch(toggleTray())}>
        <div className={styles.headerTitle}>
          <CloudUploadOutlined className={styles.uploadIcon} />
          <span>
            {counts.uploading > 0
              ? `Uploading ${counts.uploading} items...`
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
            {counts.completed > 0 && (
              <span className={styles.successText}>
                {counts.completed} successful
              </span>
            )}
            {counts.failed > 0 && (
              <span className={styles.errorText}>{counts.failed} failed</span>
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
                        handleRemove(item);
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
