import { useCallback } from "react";
import { useAppDispatch } from "../store/appStore";
import {
  addUpload,
  updateProgress,
  updateStatus,
} from "../store/slices/uploadSlice";
import { uploadFileApi } from "../services/fileUploadService";
import { v4 as uuidv4 } from "uuid";
import { notificationService } from "../services/notificationService";
import { useNavigate } from "react-router-dom";
import { uploadManager } from "../services/upload.manager";
import { handleApiError } from "../utils/errors";

export const useFileUpload = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      notificationService.requestPermission();

      const uploadPromises = fileArray.map(async (file) => {
        const id = uuidv4();
        const signal = uploadManager.createController(id);

        dispatch(
          addUpload({
            id,
            name: file.name,
            progress: 0,
            status: "uploading",
            backendId: "",
          }),
        );

        try {
          const response = await uploadFileApi(
            file,
            (progress) => {
              dispatch(updateProgress({ id, progress }));
            },
            signal,
          );

          dispatch(
            updateStatus({
              id,
              status: "completed",
              backendId: response.data.data._id,
            }),
          );

          notificationService.success(
            "Upload Complete",
            `${file.name} has been processed successfully.`,
            () => navigate(`/dashboard/uploads`),
            file.name,
          );
        } catch (error: unknown) {
          if (error instanceof DOMException && error.name === "AbortError") {
            console.log(`Upload ${id} cancelled`);
            return;
          }

          const errorMessage = handleApiError(
            error,
            `Could not upload ${file.name}`,
          );

          dispatch(
            updateStatus({
              id,
              status: "failed",
              error: errorMessage,
            }),
          );

          notificationService.error(
            "Upload Failed",
            `Could not upload ${file.name}: ${errorMessage}`,
            undefined,
            file.name,
          );
        } finally {
          uploadManager.removeController(id);
        }
      });

      return Promise.all(uploadPromises);
    },
    [dispatch, navigate],
  );

  const cancelUpload = useCallback(
    (id: string) => {
      uploadManager.cancelUpload(id);
      dispatch(
        updateStatus({ id, status: "failed", error: "Cancelled by user" }),
      );
    },
    [dispatch],
  );

  return { uploadFiles, cancelUpload };
};
export default useFileUpload;
