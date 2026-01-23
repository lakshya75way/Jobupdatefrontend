import { Job, JobStatus, JobMetadata } from "./job.types";
import crypto from "crypto";
import { io } from "../../socket";
class JobManager {
  private static instance: JobManager;
  private jobs: Map<string, Job> = new Map();
  private isWorkerRunning: boolean = false;
  private constructor() {
    console.log("[JobManager] In-memory queue initialized.");
  }
  public static getInstance(): JobManager {
    if (!JobManager.instance) {
      JobManager.instance = new JobManager();
    }
    return JobManager.instance;
  }
  public createJob(
    userId: string,
    type: string,
    data: JobMetadata,
    priority: number = 0,
  ): Job {
    const id = crypto.randomBytes(8).toString("hex");
    const job: Job = {
      id,
      userId,
      type,
      status: "pending",
      data,
      priority,
      retries: 0,
      maxRetries: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.jobs.set(id, job);
    this.runWorker();
    return job;
  }
  public getJob(id: string): Job | undefined {
    return this.jobs.get(id);
  }
  public getAllJobs(): Job[] {
    return Array.from(this.jobs.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }
  public getJobsByUser(userId: string): Job[] {
    return this.getAllJobs().filter((job) => job.userId === userId);
  }
  private async runWorker() {
    if (this.isWorkerRunning) return;
    this.isWorkerRunning = true;
    console.log("[JobWorker] Worker loop started...");
    while (true) {
      const pendingJobs = this.getAllJobs()
        .filter((j) => j.status === "pending")
        .sort((a, b) => {
          if (b.priority !== a.priority) return b.priority - a.priority;
          return a.createdAt.getTime() - b.createdAt.getTime();
        });
      const nextJob = pendingJobs[0];
      if (!nextJob) {
        console.log("[JobWorker] No more pending jobs. Worker going to sleep.");
        break;
      }
      await this.executeJob(nextJob);
    }
    this.isWorkerRunning = false;
  }
  private async executeJob(job: Job) {
    this.updateJobStatus(job.id, "processing");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const activeJob = this.jobs.get(job.id);
    if (!activeJob) return;
    activeJob.startedAt = new Date();
    try {
      console.log(
        `[JobWorker] Working on job: ${activeJob.id} [${activeJob.type}]`,
      );
      const result = await this.performTask(activeJob);
      this.updateJobStatus(activeJob.id, "completed", {
        result: result || `Successfully processed ${activeJob.type}`,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown processing error";
      console.error(`[JobWorker] Job ${activeJob.id} failed: ${errorMessage}`);
      if (activeJob.retries < activeJob.maxRetries) {
        const nextRetry = activeJob.retries + 1;
        console.log(
          `[JobWorker] Job ${activeJob.id} will retry (Attempt ${nextRetry})...`,
        );
        this.updateJobStatus(activeJob.id, "pending", {
          retries: nextRetry,
          error: `Retry ${nextRetry}: ${errorMessage}`,
        });
        this.runWorker();
      } else {
        this.updateJobStatus(activeJob.id, "failed", { error: errorMessage });
      }
    }
  }
  private updateJobStatus(
    id: string,
    status: JobStatus,
    extra: Partial<Job> = {},
  ) {
    const job = this.jobs.get(id);
    if (job) {
      const updatedJob = {
        ...job,
        ...extra,
        status,
        updatedAt: new Date(),
        completedAt:
          status === "completed" || status === "failed"
            ? new Date()
            : job.completedAt,
      };
      this.jobs.set(id, updatedJob);
      if (io) {
        io.emit("jobUpdated", updatedJob);
      }
    }
  }
  private async performTask(job: Job): Promise<string> {
    return new Promise((resolve, reject) => {
      const delay = job.type === "Fast Task" ? 2000 : 5000;
      setTimeout(() => {
        if (job.data.shouldFail === true) {
          return reject(new Error("Simulated permanent failure"));
        }
        if (job.data.failOnce === true && job.retries === 0) {
          return reject(new Error("Simulated temporary failure (will retry)"));
        }
        if (Math.random() < 0.05) {
          return reject(new Error("Random system fluctuation error"));
        }
        resolve(
          `Completed ${job.type} with parameters: ${JSON.stringify(job.data)}`,
        );
      }, delay);
    });
  }
}
export const jobManager = JobManager.getInstance();
