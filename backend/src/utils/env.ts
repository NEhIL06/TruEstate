import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("4000"),
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_KEY: z.string().min(10)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = {
  PORT: parseInt(parsed.data.PORT, 10),
  SUPABASE_URL: parsed.data.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: parsed.data.SUPABASE_SERVICE_KEY
};
