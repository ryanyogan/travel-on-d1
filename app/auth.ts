import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import Database from "better-sqlite3";
import * as schema from "../database/schema";

const db = new Database("better-auth.db");
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    schema,
    provider: "sqlite",
  }),
});
