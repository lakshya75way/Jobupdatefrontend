import { Router } from "express";
import { protect } from "../../middlewares/auth.middlewares";
import {
  signup,
  login,
  verify,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
  updatePushSubscription,
  deletePushSubscription,
  scheduleTestNotification,
} from "./auth.controller";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/verify/:token", verify);

router.post("/change-password", protect, changePassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/refresh-token", refreshToken);

router.post("/logout", protect, logout);

router.post("/push-subscription", protect, updatePushSubscription);

router.delete("/push-subscription", protect, deletePushSubscription);

router.post("/schedule-test-notification", protect, scheduleTestNotification);

export default router;
