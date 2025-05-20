import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { createRequestHandler } from "react-router";
import { createAuth } from "~/auth.config";
import * as schema from "../database/schema";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    db: DrizzleD1Database<typeof schema>;
    auth: ReturnType<typeof createAuth>;
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const db = drizzle(env.DB, { schema });
    const auth = createAuth(db, env);

    if (url.pathname.startsWith("/api/auth")) {
      return auth.handler(request);
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
      db,
      auth,
    });
  },
} satisfies ExportedHandler<Env>;
