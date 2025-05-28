import { eq } from "drizzle-orm";
import { data, Outlet, redirect } from "react-router";
import { MobileSidebar } from "~/components/mobile-sidebar";
import { NavItems } from "~/components/nav-items";
import * as schema from "~/database/schema";
import type { Route } from "./+types/layout";

export async function loader({ context, request }: Route.LoaderArgs) {
  try {
    const user = await context.auth.api.getSession(request);
    if (!user?.user.id) {
      throw redirect("/sign-in");
    }

    const userQuery = await context.db.query.user.findFirst({
      where: eq(schema.user.id, user.user.id),
    });

    // if (userQuery?.status === "USER") {
    //   return redirect("/");
    // }

    return data({ user: userQuery });
  } catch (error) {
    console.error("Error loading client session:", error);
  }
}

export default function AdminLayout() {
  return (
    <div className="admin-layout font-inter">
      <MobileSidebar />

      <aside className="w-full max-w-[270px] hidden lg:block">
        <NavItems />
      </aside>

      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
}
