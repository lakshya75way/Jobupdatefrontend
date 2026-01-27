import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000"),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default("1d"),
  MAIL_HOST: z.string().min(1),
  MAIL_PORT: z.string().transform((v) => parseInt(v, 10)),
  MAIL_USER: z.string().email(),
  MAIL_PASSWORD: z.string().min(1),
  VAPID_PUBLIC_KEY: z.string().min(1),
  VAPID_PRIVATE_KEY: z.string().min(1),
});

console.log(" Loading environment variables...");
console.log("PORT in process.env:", process.env.PORT);

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables:", _env.error.format());
  process.exit(1);
}

console.log("Env variables validated. PORT:", _env.data.PORT);
export const env = _env.data;
