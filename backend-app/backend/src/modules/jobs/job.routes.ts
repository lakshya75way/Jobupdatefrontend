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

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management endpoints
 */

/**
 * @swagger
 * /jobs/submit:
 *   post:
 *     summary: Submit a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - data
 *             properties:
 *               type:
 *                 type: string
 *               priority:
 *                 type: number
 *               data:
 *                 type: object
 *     responses:
 *       202:
 *         description: Job submitted
 */
router.post("/submit", createJob);

/**
 * @swagger
 * /jobs/all:
 *   get:
 *     summary: Get all user jobs
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get("/all", getAllJobs);

/**
 * @swagger
 * /jobs/admin/all:
 *   get:
 *     summary: Get all jobs (Admin only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all jobs
 */
router.get("/admin/all", authorize(["admin"]), adminGetAllJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get job details
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details
 */
router.get("/:id", getJobStatus);

export default router;
