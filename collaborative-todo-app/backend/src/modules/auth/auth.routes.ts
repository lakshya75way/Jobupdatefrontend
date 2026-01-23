import { Router } from "express";
import {
  signup,
  login,
  verifyEmail,
  changePassword,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
} from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify/:token", verifyEmail);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.use(protect);
router.post("/change-password", changePassword);
router.post("/logout", logout);
router.get("/me", getMe);

export default router;
