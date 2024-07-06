import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { config } from "dotenv";
import * as schema from "./schema";

config();

export const db = drizzle(sql, { schema });
