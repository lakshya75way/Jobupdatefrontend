import { useState, useCallback, useEffect, useRef } from "react";
import api from "../services/api";
import { message } from "antd";
import { Job, CreateJobDto } from "../types/job";
import { socket } from "../services/socket";
import { useAuth } from "./useAuth";
export const useJobs = (isAdminView: boolean = false) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const isAdminViewRef = useRef(isAdminView);
  useEffect(() => {
    isAdminViewRef.current = isAdminView;
  }, [isAdminView]);
  const fetchJobs = useCallback(async (adminMode: boolean = false) => {
    setLoading(true);
    try {
      const endpoint = adminMode ? "/jobs/admin/all" : "/jobs/all";
      const response = await api.get<{ data: Job[] }>(endpoint);
      setJobs(response.data.data);
    } catch (err: unknown) {
      console.error("Fetch jobs failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  const addJob = useCallback(async (jobData: CreateJobDto) => {
    setLoading(true);
    try {
      await api.post<{ data: Job }>("/jobs/submit", jobData);
      message.success("Task submitted to background queue");
      return true;
    } catch (err: unknown) {
      message.error("Failed to submit task");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  const { user } = useAuth();
  useEffect(() => {
    fetchJobs(isAdminView);
    console.log("Setting up socket connection...");
    if (socket.connected) {
      socket.disconnect();
    }
    socket.connect();
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
    const handleJobUpdate = (updatedJob: Job) => {
      setJobs((prev) => {
        if (!Array.isArray(prev)) return [updatedJob];
        const index = prev.findIndex((j) => j.id === updatedJob.id);
        if (index !== -1) {
          const newJobs = [...prev];
          newJobs[index] = updatedJob;
          return newJobs;
        }
        if (isAdminViewRef.current) {
          return [updatedJob, ...prev];
        }
        return prev;
      });
    };
    socket.on("jobUpdated", handleJobUpdate);
    return () => {
      socket.off("jobUpdated", handleJobUpdate);
    };
  }, [fetchJobs, user?.role, isAdminView]);
  return {
    jobs,
    loading,
    fetchJobs,
    addJob,
  };
};
