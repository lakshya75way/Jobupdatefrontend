import React from "react";
import AsyncSelect from "react-select/async";
import { getMyFilesApi, openFile } from "../../services/upload.service";
import { UserFile } from "../../types/upload";
import { message } from "antd";
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
  
  let timeoutId: ReturnType<typeof setTimeout>;

  const loadOptions = (
    inputValue: string,
    callback: (options: FileOption[]) => void,
  ) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
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
  };

  const handleChange = (option: FileOption | null) => {
    if (option) {
      
      if (onSelect) {
        onSelect(option.file);
      }

      
      if (autoOpenFile) {
        openFile(option.value).catch(() => {
          message.error("Failed to open file");
        });
      }
    }
  };

  const handleInputChange = (value: string) => {
    if (onInputChange) {
      onInputChange(value);
    }
    return value;
  };

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
          DropdownIndicator: () => (
            <div style={{ padding: "0 8px", color: "#94a3b8" }}>
              <FileOutlined />
            </div>
          ),
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

export default FileSearchPicker;
