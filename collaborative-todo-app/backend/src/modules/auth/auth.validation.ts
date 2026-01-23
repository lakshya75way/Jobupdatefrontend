import { z } from "zod";

export const emailSchema = z.string().email("Invalid email");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export const signupSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
    name: z.string().min(2, "Name must be at least 2 characters long"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: passwordSchema,
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: passwordSchema,
  }),
  params: z.object({
    token: z.string(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

export const verifyEmailSchema = z.object({
  params: z.object({
    token: z.string(),
  }),
});
