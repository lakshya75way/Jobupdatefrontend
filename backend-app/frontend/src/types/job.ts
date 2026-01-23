export type JobStatus = "pending" | "processing" | "completed" | "failed";
export interface JobMetadata {
  [key: string]: string | number | boolean | null | undefined;
}
export interface Job {
  id: string;
  userId: string;
  type: string;
  status: JobStatus;
  data: JobMetadata;
  result?: string;
  error?: string;
  retries: number;
  maxRetries: number;
  priority: number;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}
export interface CreateJobDto {
  type: string;
  data: JobMetadata;
  priority?: number;
}
