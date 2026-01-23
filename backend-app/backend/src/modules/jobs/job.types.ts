export type JobStatus = "pending" | "processing" | "completed" | "failed";
export interface JobMetadata {
  [key: string]: string | number | boolean | null | undefined;
}
export interface Job {
  id: string;
  userId: string; // Added to track ownership
  type: string;
  status: JobStatus;
  data: JobMetadata;
  result?: string;
  error?: string;
  retries: number;
  maxRetries: number;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}
export interface CreateJobDto {
  type: string;
  data: JobMetadata;
  priority?: number;
}
