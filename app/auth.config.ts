import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "../database/schema";

export function createAuth(
  db: DrizzleD1Database<typeof schema>,
  env: Env // ← Worker env binding
) {
  return betterAuth({
    // your Drizzle adapter, pointed at the live D1 binding
    database: drizzleAdapter(db, { schema, provider: "sqlite" }),
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID!, // ← from wrangler secret
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
        redirectURI: env.BETTER_AUTH_BASE_URL + "api/auth/callback/google",
      },
    },

    // session & cookie security
    secret: env.BETTER_AUTH_SECRET!, // generate one, `wrangler secret put`
    baseUrl: env.BETTER_AUTH_BASE_URL!, // e.g. https://auth.myapp.com
  });
}
