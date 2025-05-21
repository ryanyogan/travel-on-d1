import * as Sentry from "@sentry/react-router";

Sentry.init({
  dsn: "https://933610b9e27193ba5e13ec20db873565@o4505899124719616.ingest.us.sentry.io/4507920401956864",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
