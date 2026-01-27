import React, { memo, useCallback, useRef } from "react";
import AsyncSelect from "react-select/async";
import { getMyFilesApi, openFile } from "../../services/fileUploadService";
import { UserFile } from "../../types/upload";
import { notificationService } from "../../services/notificationService";
import { FileOutlined } from "@ant-design/icons";

interface FileOption {
  value: string;
  label: string;
  file: UserFile;
}

interface FileSearchPickerProps {
  onSelect?: (file: UserFile) => void;
  onInputChange?: (value: string) => void;
  autoOpenFile?: boolean;
}

const FileSearchPicker: React.FC<FileSearchPickerProps> = ({
  onSelect,
  onInputChange,
  autoOpenFile = true,
}) => {
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadOptions = useCallback(
    (inputValue: string, callback: (options: FileOption[]) => void) => {
      if (timeoutId.current) clearTimeout(timeoutId.current);

      timeoutId.current = setTimeout(async () => {
        try {
          const response = await getMyFilesApi(inputValue);
          const files: UserFile[] = response.data.data;

          const options = files.map((file) => ({
            value: file._id,
            label: file.originalName,
            file: file,
          }));

          callback(options);
        } catch (error: unknown) {
          console.error("Error fetching files:", error);
          callback([]);
        }
      }, 500);
    },
    [],
  );

  const handleChange = useCallback(
    (option: FileOption | null) => {
      if (option) {
        if (onSelect) {
          onSelect(option.file);
        }

        if (autoOpenFile) {
          openFile(option.value).catch(() => {
            notificationService.message.error("Failed to open file");
          });
        }
      }
    },
    [onSelect, autoOpenFile],
  );

  const handleInputChange = useCallback(
    (value: string) => {
      if (onInputChange) {
        onInputChange(value);
      }
      return value;
    },
    [onInputChange],
  );

  const DropdownIndicator = useCallback(
    () => (
      <div style={{ padding: "0 8px", color: "#94a3b8" }}>
        <FileOutlined />
      </div>
    ),
    [],
  );

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "10px 0" }}>
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        onInputChange={handleInputChange}
        placeholder="Search for a file..."
        isClearable
        components={{
          DropdownIndicator,
        }}
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "8px",
            borderColor: "#e2e8f0",
            boxShadow: "none",
            backgroundColor: "white",
            "&:hover": {
              borderColor: "#3b82f6",
            },
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#eff6ff" : "transparent",
            color: state.isFocused ? "#1e40af" : "#334155",
            cursor: "pointer",
            padding: "10px 15px",
            fontSize: "14px",
          }),
          menu: (base) => ({
            ...base,
            borderRadius: "8px",
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            zIndex: 9999,
          }),
          placeholder: (base) => ({
            ...base,
            color: "#94a3b8",
          }),
        }}
      />
    </div>
  );
};

export default memo(FileSearchPicker);
