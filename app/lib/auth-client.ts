import { createAuthClient } from "better-auth/react";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : "https://funroad.ryanyogan.workers.dev";

export const authClient = createAuthClient({
  baseURL,
});
