import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  route("sign-in", "routes/root/sign-in.tsx"),
  route("api/create-trip", "routes/api/create-trip.ts"),
  layout("routes/admin/layout.tsx", [
    route("dashboard", "routes/admin/dashboard.tsx"),
    route("all-users", "routes/admin/all-users.tsx"),
    ...prefix("trips", [
      index("routes/admin/trips.tsx"),
      route("create", "routes/admin/create-trip.tsx"),
      route(":tripId", "routes/admin/trip-detail.tsx"),
    ]),
  ]),
  ...prefix("api/auth/:provider", [route("index", "routes/api/auth/index.ts")]),
] satisfies RouteConfig;
