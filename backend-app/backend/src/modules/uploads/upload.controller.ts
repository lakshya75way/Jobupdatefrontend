import { Request, Response } from "express";
import { catchAsync, AppError } from "../../middlewares/error.middleware";
import * as uploadService from "./upload.service";
import path from "path";
import fs from "fs";

import { sendPushNotification } from "../../utils/push.util";

export const uploadFile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  if (!req.file) {
    // Attempt to notify of failure even if no file was provided in the request
    await sendPushNotification(userId, {
      title: "Upload Failed",
      body: "No file was received by the server.",
      tag: "upload-error",
    });
    throw new AppError("No file uploaded", 400);
  }

  const { filename, originalname, mimetype, size, path: filePath } = req.file;

  try {
    const newFile = await uploadService.uploadFileService(userId, {
      filename,
      originalname,
      mimetype,
      size,
      path: filePath,
    });

    // Background push notification
    await sendPushNotification(userId, {
      title: "File Processed ✅",
      body: `${originalname} is now available in your drive.`,
      url: "/dashboard/uploads",
      tag: "upload-success",
    });

    res.status(201).json({
      status: "success",
      data: newFile,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    await sendPushNotification(userId, {
      title: "Upload Failed ❌",
      body: `Error processing ${originalname}: ${errorMessage}`,
      tag: "upload-error",
    });
    throw err;
  }
});

export const getUserFiles = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const search = req.query.search as string;
  const files = await uploadService.getUserFilesService(userId, search);

  res.status(200).json({
    status: "success",
    results: files.length,
    data: files,
  });
});

export const downloadFile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const file = await uploadService.getFileByIdService(req.params.id, userId);

  const filePath = path.resolve(file.path);
  if (!fs.existsSync(filePath)) {
    throw new AppError("Physical file not found", 404);
  }

  res.download(filePath, file.originalName);
});

export const deleteFile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await uploadService.deleteFileService(req.params.id, userId);

  res.status(200).json({
    status: "success",
    message: "File deleted successfully",
  });
});

export const viewFile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const file = await uploadService.getFileByIdService(req.params.id, userId);

  const filePath = path.resolve(file.path);
  if (!fs.existsSync(filePath)) {
    throw new AppError("Physical file not found", 404);
  }

  res.setHeader("Content-Type", file.mimeType);
  res.setHeader("Content-Disposition", "inline");
  res.sendFile(filePath);
});
