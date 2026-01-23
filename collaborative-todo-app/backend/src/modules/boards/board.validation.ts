import { z } from "zod";

export const createBoardSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Board name is required").max(100),
  }),
});

export const inviteUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    role: z.enum(["viewer", "editor", "admin"]),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const boardIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const removeCollaboratorSchema = z.object({
  params: z.object({
    id: z.string(),
    userId: z.string(),
  }),
});

export const updateCollaboratorRoleSchema = z.object({
  body: z.object({
    role: z.enum(["viewer", "editor", "admin"]),
  }),
  params: z.object({
    id: z.string(),
    userId: z.string(),
  }),
});
