import { z } from "zod";
export const emailSchema = z.string().email("Invalid email");
const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
export const signupSchema = z.object({
    email: emailSchema,
    password: passwordSchema
});
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required")
});
export const changePassSchema = z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: passwordSchema
});
export const resetPassSchema = z.object({
    password: passwordSchema
});
export const forgotPasswordSchema = z.object({
    email: emailSchema
}); 
