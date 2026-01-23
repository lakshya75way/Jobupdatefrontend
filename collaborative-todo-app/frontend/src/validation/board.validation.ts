import { z } from "zod";

export const createBoardSchema = z.object({
  name: z
    .string()
    .min(1, "Board name is required")
    .max(100, "Board name is too long"),
});

export const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["viewer", "editor", "admin"], {
    message: "Role must be viewer, editor, or admin",
  }),
});
