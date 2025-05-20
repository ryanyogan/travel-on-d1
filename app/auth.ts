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
  providers: [
    {
      id: "google",
      type: "oauth",
      // placeholder values – CLI doesn’t execute, so env vars aren’t needed here
      clientId: "GOOGLE_CLIENT_ID",
      clientSecret: "GOOGLE_CLIENT_SECRET",
      authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
      scope: "openid email profile",
    },
  ],
});
