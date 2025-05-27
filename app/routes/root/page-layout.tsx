import { eq } from "drizzle-orm";
import { Outlet, redirect } from "react-router";
import { RootNavbar } from "~/components/root-navbar";
import * as schema from "~/database/schema";
import type { Route } from "./+types/page-layout";

export async function loader({ context, request }: Route.LoaderArgs) {
  try {
    const user = await context.auth.api.getSession(request);
    if (!user?.user) {
      throw redirect("/sign-in");
    }

    const userQuery = await context.db.query.user.findFirst({
      where: eq(schema.user.id, user.user.id),
    });

    return { user: userQuery };
  } catch (error) {
    console.error("Error in loader:", error);
    return redirect("/sign-in");
  }
}

export default function PageLayout() {
  return (
    <div className="bg-light-200">
      <RootNavbar />
      <Outlet />
    </div>
  );
}
