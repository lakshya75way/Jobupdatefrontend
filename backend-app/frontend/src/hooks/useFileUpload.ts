import axios from "axios";
import { useAppDispatch } from "../store";
import {
  addUpload,
  updateProgress,
  updateStatus,
} from "../store/slices/uploadSlice";
import { uploadFileApi } from "../services/upload.service";
import { v4 as uuidv4 } from "uuid";
import { notificationService } from "../services/notification.service";
import { useNavigate } from "react-router-dom";

export const useFileUpload = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // Request notification permission on first action
    notificationService.requestPermission();

    const uploadPromises = fileArray.map(async (file) => {
      const id = uuidv4();
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
        const response = await uploadFileApi(file, (progress) => {
          dispatch(updateProgress({ id, progress }));
        });

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
        let errorMessage = "Upload failed";
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

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
      }
    });

    return Promise.all(uploadPromises);
  };

  return { uploadFiles };
};
