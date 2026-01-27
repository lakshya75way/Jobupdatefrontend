import { Router } from "express";
import {
  createJob,
  getAllJobs,
  getJobStatus,
  adminGetAllJobs,
} from "./job.controller";
import { protect, authorize } from "../../middlewares/auth.middlewares";

const router = Router();

router.use(protect);

router.post("/submit", createJob);

router.get("/all", getAllJobs);

router.get("/admin/all", authorize(["admin"]), adminGetAllJobs);

router.get("/:id", getJobStatus);

export default router;
