import { QueryFilter } from "mongoose";
import File, { IFile } from "./upload.model";
import { AppError } from "../../middlewares/error.middleware";
import fs from "fs";
import path from "path";

export const uploadFileService = async (
  userId: string,
  fileData: {
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    path: string;
  },
): Promise<IFile> => {
  return await File.create({
    filename: fileData.filename,
    originalName: fileData.originalname,
    mimeType: fileData.mimetype,
    size: fileData.size,
    userId,
    path: fileData.path,
  });
};

export const getUserFilesService = async (
  userId: string,
  search?: string,
): Promise<IFile[]> => {
  const query: QueryFilter<IFile> = { userId };
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.originalName = { $regex: escapedSearch, $options: "i" };
  }
  const files = await File.find(query).sort({ createdAt: -1 });

  const validFiles: IFile[] = [];
  for (const file of files) {
    const filePath = path.resolve(file.path);
    if (fs.existsSync(filePath)) {
      validFiles.push(file);
    } else {
      await File.deleteOne({ _id: file._id });
    }
  }

  return validFiles;
};

export const getFileByIdService = async (
  fileId: string,
  userId: string,
): Promise<IFile> => {
  const file = await File.findOne({ _id: fileId, userId });
  if (!file) {
    throw new AppError("File not found", 404);
  }

  const filePath = path.resolve(file.path);
  if (!fs.existsSync(filePath)) {
    await File.deleteOne({ _id: fileId });
    throw new AppError(
      "Physical file is missing from server. Database record cleaned up.",
      404,
    );
  }

  return file;
};

export const deleteFileService = async (
  fileId: string,
  userId: string,
): Promise<void> => {
  const file = await File.findOne({ _id: fileId, userId });
  if (!file) {
    throw new AppError("File not found", 404);
  }

  const filePath = path.resolve(file.path);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await File.deleteOne({ _id: fileId });
};
