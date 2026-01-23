import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  uploadFile,
  getUserFiles,
  downloadFile,
  deleteFile,
  viewFile,
} from "./upload.controller";
import { protect } from "../../middlewares/auth.middlewares";

const router = Router();

const UPLOAD_DIR = "uploads/";
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}


const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage });

router.use(protect);


router.post("/upload", upload.single("file"), uploadFile);


router.get("/my-files", getUserFiles);


router.get("/download/:id", downloadFile);


router.get("/view/:id", viewFile);


router.delete("/:id", deleteFile);

export default router;
