import { useCallback, useEffect, useRef } from "react";
import api from "../services/apiClient";
import { notificationService } from "../services/notificationService";
import { Job, CreateJobDto } from "../types/job";
import { socket } from "../services/socketClient";
import { useAuth } from "./useAuth";
import { useAppDispatch, useAppSelector } from "../store/appStore";
import { setJobs, updateJob, setLoading } from "../store/slices/jobSlice";

export const useJobs = (isAdminView: boolean = false) => {
  const dispatch = useAppDispatch();
  const { jobs, loading } = useAppSelector((state) => state.jobs);
  const isAdminViewRef = useRef(isAdminView);

  useEffect(() => {
    isAdminViewRef.current = isAdminView;
  }, [isAdminView]);

  const fetchJobs = useCallback(
    async (adminMode: boolean = false) => {
      dispatch(setLoading(true));
      try {
        const endpoint = adminMode ? "/jobs/admin/all" : "/jobs/all";
        const response = await api.get<{ data: Job[] }>(endpoint);
        dispatch(setJobs(response.data.data));
      } catch (error: unknown) {
        console.error("Fetch jobs failed:", error);
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const addJob = useCallback(
    async (jobData: CreateJobDto) => {
      dispatch(setLoading(true));
      try {
        await api.post<{ data: Job }>("/jobs/submit", jobData);
        notificationService.message.success(
          "Task submitted to background queue",
        );
        return true;
      } catch (error: unknown) {
        notificationService.message.error("Failed to submit task");
        dispatch(setLoading(false));
        return false;
      }
    },
    [dispatch],
  );

  const { user } = useAuth();

  useEffect(() => {
    fetchJobs(isAdminView);

    if (!socket.connected) {
      socket.connect();
    }

    const handleJobUpdate = (updatedJob: Job) => {
      dispatch(updateJob(updatedJob));
    };

    socket.on("jobUpdated", handleJobUpdate);

    return () => {
      socket.off("jobUpdated", handleJobUpdate);
    };
  }, [fetchJobs, user?.role, isAdminView, dispatch]);

  return {
    jobs,
    loading,
    fetchJobs,
    addJob,
  };
};
