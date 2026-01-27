import api from "./apiClient";
import { AxiosProgressEvent } from "axios";
import { env } from "../config/env.config";

export const uploadFileApi = (
  file: File,
  onProgress: (progress: number) => void,
  signal?: AbortSignal,
) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/uploads/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      const progress = progressEvent.total
        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
        : 0;
      onProgress(progress);
    },
  });
};

export const getMyFilesApi = (search?: string) => {
  return api.get("/uploads/my-files", {
    params: { search },
  });
};

export const deleteFileApi = (id: string) => {
  return api.delete(`/uploads/${id}`);
};

export const downloadFileUrl = (id: string) => {
  return `${env.VITE_API_URL}/uploads/download/${id}`;
};

export const downloadFile = async (id: string, name: string) => {
  const response = await api.get(`/uploads/download/${id}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const openFile = async (id: string) => {
  const response = await api.get(`/uploads/view/${id}`, {
    responseType: "blob",
  });

  const contentType =
    response.headers["content-type"] || "application/octet-stream";
  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: contentType }),
  );
  window.location.href = url;
};
