import { z } from "zod";

export const createTodoSchema = z.object({
  body: z.object({
    text: z
      .string()
      .min(1, "Todo text is required")
      .max(500, "Todo text must be less than 500 characters"),
    clientId: z.string().min(1, "Client ID is required"),
  }),
});

export const updateTodoSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(500).optional(),
    completed: z.boolean().optional(),
    version: z.number().int().min(0),
    lastModified: z.number().int().positive(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const getTodoSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const deleteTodoSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const addCollaboratorSchema = z.object({
  body: z.object({
    email: z.string().email(),
    role: z.enum(["viewer", "editor", "admin"]),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const moveTodoSchema = z.object({
  body: z.object({
    newOrder: z.number(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
