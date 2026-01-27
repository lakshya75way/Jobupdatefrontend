import { Request, Response } from "express";
import { AppError, catchAsync } from "../../middlewares/error.middleware";
import {
  signupService,
  verifyService,
  loginService,
  changePass,
  forgotPass,
  resetPass,
  refreshTokenService,
  logoutService,
  updatePushSub,
  deletePushSub,
} from "./auth.service";
import { sendPushNotification } from "../../utils/push.util";
import {
  signupSchema,
  loginSchema,
  changePassSchema,
  resetPassSchema,
  forgotPasswordSchema,
} from "./auth.validation";
export const signup = catchAsync(async (req: Request, res: Response) => {
  const data = signupSchema.parse(req.body);
  await signupService(data.email, data.password);
  res.json({ message: "signup success. Check email for verification link" });
});
export const verify = catchAsync(async (req: Request, res: Response) => {
  await verifyService(req.params.token);
  res.json({ message: "email verified" });
});
export const login = catchAsync(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const result = await loginService(data.email, data.password);
  res.json({
    user: result.user,
    token: result.accessToken,
    refreshToken: result.refreshToken,
  });
});
export const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const data = changePassSchema.parse(req.body);
    const userId = req.user!.userId;
    await changePass(userId, data.oldPassword, data.newPassword);
    res.json({ message: "password changed" });
  },
);
export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const data = forgotPasswordSchema.parse(req.body);
    await forgotPass(data.email);
    res.json({ message: "reset email sent!!" });
  },
);
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const data = resetPassSchema.parse(req.body);
  await resetPass(data.token, data.newPassword);
  res.json({ message: "pass reset done" });
});
export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  const newAccessToken = await refreshTokenService(refreshToken);
  res.json({ accessToken: newAccessToken });
});
export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new AppError("refresh token is required", 400);
  }
  await logoutService(refreshToken);
  res.json({ message: "logout success" });
});

export const updatePushSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const userAgent = req.headers["user-agent"];
    await updatePushSub(userId, req.body, userAgent);
    res.json({ message: "push subscription updated" });
  },
);

export const deletePushSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    await deletePushSub(userId, req.body.endpoint);
    res.json({ message: "push subscription deleted" });
  },
);

export const scheduleTestNotification = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const delay = 10000;
    res.json({
      message: `Test notification scheduled in ${delay / 1000}s. You can close the tab now!`,
    });
    setTimeout(async () => {
      try {
        await sendPushNotification(userId, {
          title: "Background Test Successful!",
          body: "This notification was sent 10 seconds after you requested it, even if the tab was closed.",
          url: "/dashboard/profile",
          tag: "background-test",
        });
      } catch (err) {}
    }, delay);
  },
);
