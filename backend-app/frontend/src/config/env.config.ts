import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_SOCKET_URL: z.string().url(),
  VITE_VAPID_PUBLIC_KEY: z.string().min(1),
});

const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
  console.error("Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
