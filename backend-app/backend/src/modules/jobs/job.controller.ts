import { Request, Response } from "express";
import { catchAsync, AppError } from "../../middlewares/error.middleware";
import { jobManager } from "./job.manager";
export const createJob = catchAsync(async (req: Request, res: Response) => {
  const { type, data, priority } = req.body;
  if (!type) throw new AppError("Job type is required", 400);
  const userId = req.user!.userId;
  const job = jobManager.createJob(userId, type, data || {}, priority || 0);
  res.status(202).json({
    status: "success",
    message: "Job submitted successfully",
    data: job,
  });
});
export const getJobStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const job = jobManager.getJob(id);
  if (!job || (job.userId !== user.userId && user.role !== "admin")) {
    throw new AppError("Job not found", 404);
  }
  res.json({
    status: "success",
    data: job,
  });
});
export const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const jobs = jobManager.getJobsByUser(userId);
  res.json({
    status: "success",
    results: jobs.length,
    data: jobs,
  });
});
export const adminGetAllJobs = catchAsync(
  async (_req: Request, res: Response) => {
    const jobs = jobManager.getAllJobs();
    res.json({
      status: "success",
      results: jobs.length,
      data: jobs,
    });
  }
);
