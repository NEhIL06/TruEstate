import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("4000"),
  DATABASE_URL: z.url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = {
  PORT: parseInt(parsed.data.PORT, 10),
  DATABASE_URL: parsed.data.DATABASE_URL,
};
