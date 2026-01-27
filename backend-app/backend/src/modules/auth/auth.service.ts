import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { AppError } from "../../middlewares/error.middleware";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { User } from "../../models/user.model";
import { sendMail } from "../../utils/mailer";
import { JwtPayload } from "../../utils/jwt.types";
import { PushSubscriptionData } from "../../types/push.types";
export const signupService = async (email: string, password: string) => {
  const exists = await User.findOne({ email });
  if (exists) throw new AppError("user already exists", 400);
  const token = crypto.randomBytes(32).toString("hex");
  await User.create({
    email,
    password,
    verificationToken: token,
  });
  const url = `http://localhost:5173/verify/${token}`;
  await sendMail(
    email,
    "Verify Your Account",
    `Please verify your account by clicking this link: ${url}`,
    `<p>Please verify your account by clicking the link below:</p><a href="${url}">Verify Account</a>`,
  );
};
export const verifyService = async (token: string) => {
  const user = await User.findOne({ verificationToken: token });
  if (!user) throw new AppError("invalid token", 400);
  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
};
export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Incorrect username or password", 401);
  if (!user.isVerified) throw new AppError("Please verify your email", 401);
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError("wrong email or password", 401);
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
  };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  user.refreshToken = refreshToken;
  await user.save();
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};
export const refreshTokenService = async (refreshToken: string) => {
  const user = await User.findOne({ refreshToken });
  if (!user) throw new AppError("Invalid refresh token", 401);
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
  };
  return signAccessToken(payload);
};
export const logoutService = async (refreshToken: string) => {
  const user = await User.findOne({ refreshToken });
  if (!user) throw new AppError("Invalid refresh token", 401);
  user.tokenVersion += 1;
  user.refreshToken = undefined;
  await user.save();
};
export const changePass = async (
  userId: string,
  oldPass: string,
  newPass: string,
) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new AppError("user not found", 404);
  const match = await bcrypt.compare(oldPass, user.password);
  if (!match) throw new AppError("invalid password", 400);
  user.password = newPass;
  user.tokenVersion += 1;
  user.refreshToken = undefined;
  await user.save();
};
export const forgotPass = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("no user found please signup", 404);
  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  await user.save();
  const url = `http://localhost:5173/reset/${token}`;
  await sendMail(
    email,
    "Reset Password",
    `Reset your password using this link: ${url}`,
    `<p>You requested a password reset. Please click the link below to set a new password:</p><a href="${url}">Reset Password</a>`,
  );
};
export const resetPass = async (token: string, newpass: string) => {
  const user = await User.findOne({ resetToken: token });
  if (!user) throw new AppError("invalid token", 400);
  user.password = newpass;
  user.resetToken = undefined;
  user.tokenVersion += 1;
  user.refreshToken = undefined;
  await user.save();
};
export const updatePushSub = async (
  userId: string,
  subscription: PushSubscriptionData,
  userAgent?: string,
): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) return;

  const existingIndex = user.pushSubscriptions?.findIndex(
    (sub) => sub.endpoint === subscription.endpoint,
  );

  if (existingIndex !== undefined && existingIndex >= 0) {
    await User.findByIdAndUpdate(userId, {
      $set: {
        [`pushSubscriptions.${existingIndex}.lastUsedAt`]: new Date(),
        [`pushSubscriptions.${existingIndex}.isActive`]: true,
        [`pushSubscriptions.${existingIndex}.keys`]: subscription.keys,
      },
    });
  } else {
    await User.findByIdAndUpdate(userId, {
      $push: {
        pushSubscriptions: {
          ...subscription,
          userAgent,
          createdAt: new Date(),
          lastUsedAt: new Date(),
          isActive: true,
        },
      },
    });
  }
};

export const deletePushSub = async (
  userId: string,
  endpoint: string,
): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    $pull: { pushSubscriptions: { endpoint } },
  });
};
