import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { PushSubscriptionData } from "../types/push.types";

export interface IUser extends Document {
  email: string;
  password: string;
  isVerified: boolean;
  role: "user" | "admin";
  verificationToken?: string;
  resetToken?: string;
  refreshToken?: string;
  tokenVersion: number;
  pushSubscriptions?: PushSubscriptionData[];
}
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verificationToken: String,
    resetToken: String,
    refreshToken: String,
    tokenVersion: {
      type: Number,
      default: 0,
    },
    pushSubscriptions: {
      type: [
        {
          endpoint: { type: String, required: true },
          expirationTime: { type: Number, default: null },
          keys: {
            p256dh: { type: String, required: true },
            auth: { type: String, required: true },
          },
          userAgent: String,
          createdAt: { type: Date, default: Date.now },
          lastUsedAt: Date,
          isActive: { type: Boolean, default: true },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
userSchema.pre<IUser>("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
export const User = mongoose.model<IUser>("User", userSchema);
