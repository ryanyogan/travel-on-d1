import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import {
  sentryReactRouter,
  type SentryReactRouterBuildOptions,
} from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "ryan-yogan-81ab02b9",
  project: "calee",
  authToken:
    "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",
};

export default defineConfig((config) => ({
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
    }),
    tailwindcss(),
    reactRouter(),
    sentryReactRouter(sentryConfig, config),
    tsconfigPaths(),
  ],
}));
