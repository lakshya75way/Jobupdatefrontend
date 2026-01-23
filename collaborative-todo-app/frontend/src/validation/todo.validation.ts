import { z } from "zod";

export const createTodoSchema = z.object({
  text: z
    .string()
    .min(1, "Task text is required")
    .max(500, "Task text must be less than 500 characters"),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
});

export const updateTodoSchema = z.object({
  text: z
    .string()
    .min(1, "Task text is required")
    .max(500, "Task text must be less than 500 characters")
    .optional(),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  completed: z.boolean().optional(),
});
