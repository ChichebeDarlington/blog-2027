import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z
    .string()
    .min(12, "JWT_SECRET must contain at least 32 characters"),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
  COOKIE_NAME: z.string().default("chichebe_admin_token"),
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  COOKIE_SECURE: z.enum(["true", "false"]).default("false"),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error(
    "Invalid environment configuration:",
    parsedEnv.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = {
  ...parsedEnv.data,
  COOKIE_SECURE: parsedEnv.data.COOKIE_SECURE === "true",
};
