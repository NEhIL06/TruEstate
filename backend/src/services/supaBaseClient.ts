import postgres from "postgres";
import { env } from "../utils/env";

export const sql = postgres(env.DATABASE_URL, {
  ssl: "require",   
  max: 10,          
  idle_timeout: 20, 
});