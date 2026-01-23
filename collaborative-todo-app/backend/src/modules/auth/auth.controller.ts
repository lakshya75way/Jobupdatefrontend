import type { Request, Response } from "express";
import * as authService from "./auth.service.js";
import { catchAsync } from "../../middlewares/error.middleware.js";
import {
  signupSchema,
  loginSchema,
  verifyEmailSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation.js";

export const signup = catchAsync(async (req: Request, res: Response) => {
  await signupSchema.parseAsync({ body: req.body });
  console.log(`[Auth] 📝 Signup attempt: ${req.body.email}`);
  const { user } = await authService.signup(req.body);
  console.log(`[Auth] ✅ User created: ${user.email}`);

  res.status(201).json({
    status: "success",
    message:
      "User created successfully. Please check your email to verify your account.",
    data: { user },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  await loginSchema.parseAsync({ body: req.body });
  console.log(`[Auth] 🔐 Login attempt: ${req.body.email}`);
  const { user, token, refreshToken } = await authService.login(req.body);
  console.log(`[Auth] ✅ Login successful: ${user.email}`);

  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: { user, token, refreshToken },
  });
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  await verifyEmailSchema.parseAsync({ params: req.params });
  console.log(`[Auth] 📧 Email verification attempt with token`);
  await authService.verifyEmail(req.params.token);
  console.log(`[Auth] ✅ Email verified successfully`);

  res.status(200).json({
    status: "success",
    message: "Email verified successfully. You can now log in.",
  });
});

export const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    await changePasswordSchema.parseAsync({ body: req.body });
    await authService.changePassword(
      req.user!.userId,
      req.body.oldPassword,
      req.body.newPassword
    );

    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  }
);

export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.user!.userId);

  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    data: { user: req.user },
  });
});

export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    await forgotPasswordSchema.parseAsync({ body: req.body });
    await authService.forgotPassword(req.body.email);

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to your email!",
    });
  }
);

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await resetPasswordSchema.parseAsync({ body: req.body, params: req.params });
  await authService.resetPassword(req.params.token, req.body.password);

  res.status(200).json({
    status: "success",
    message:
      "Password reset successful. You can now log in with your new password.",
  });
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken: oldRefreshToken } = req.body;

  const {
    user,
    token,
    refreshToken: newRefreshToken,
  } = await authService.refreshToken(oldRefreshToken);

  res.status(200).json({
    status: "success",
    data: { user, token, refreshToken: newRefreshToken },
  });
});
