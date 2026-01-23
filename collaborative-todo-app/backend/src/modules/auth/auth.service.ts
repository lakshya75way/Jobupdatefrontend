import User, { IUser } from "../../models/user.model.js";
import { AppError } from "../../middlewares/error.middleware.js";
import {
  generateToken,
  generateRefreshToken,
  verifyToken,
  type IJwtPayload,
} from "../../utils/jwt.util.js";
import { generateRandomToken, hashToken } from "../../utils/crypto.util.js";
import * as emailService from "../../utils/email.util.js";

export interface ISignupData {
  email: string;
  password: string;
  name: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export const signup = async (
  data: ISignupData
): Promise<{ user: Partial<IUser> }> => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  const verificationToken = generateRandomToken();
  const hashedToken = hashToken(verificationToken);

  const user = await User.create({
    email: data.email,
    password: data.password,
    name: data.name,
    verificationToken: hashedToken,
  });

  console.log(`\n🔗 EMAIL VERIFICATION TOKEN for ${user.email}:`);
  console.log(
    `   http://localhost:5173/verify-email?token=${verificationToken}`
  );
  console.log(`   Token: ${verificationToken}\n`);

  await emailService.sendVerificationEmail(
    user.email,
    user.name,
    verificationToken
  );

  return {
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
    },
  };
};

export const login = async (
  data: ILoginData
): Promise<{ user: Partial<IUser>; token: string; refreshToken: string }> => {
  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user || !(await user.comparePassword(data.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isVerified) {
    throw new AppError(
      "Please verify your email address before logging in.",
      401
    );
  }

  const payload: IJwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
  };

  const token = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
    },
    token,
    refreshToken,
  };
};

export const verifyEmail = async (token: string): Promise<void> => {
  const hashedToken = hashToken(token);
  const user = await User.findOne({ verificationToken: hashedToken });

  if (!user) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
};

export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!(await user.comparePassword(oldPassword))) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword;
  user.tokenVersion += 1;
  await user.save();
};

export const logout = async (userId: string): Promise<void> => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = undefined;
    user.tokenVersion += 1;
    await user.save();
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("There is no user with that email address.", 404);
  }

  const resetToken = generateRandomToken();
  user.resetToken = hashToken(resetToken);
  user.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save({ validateBeforeSave: false });
  await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError("Token is invalid or has expired", 400);
  }

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  user.tokenVersion += 1;

  await user.save();
};

export const refreshToken = async (
  oldRefreshToken: string
): Promise<{ user: Partial<IUser>; token: string; refreshToken: string }> => {
  const decoded = verifyToken(oldRefreshToken);
  const user = await User.findById(decoded.userId).select("+refreshToken");

  if (!user || user.refreshToken !== oldRefreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (user.tokenVersion !== decoded.tokenVersion) {
    throw new AppError("Session expired", 401);
  }

  const payload: IJwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
  };

  const token = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
    },
    token,
    refreshToken,
  };
};
