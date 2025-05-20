import { data, Outlet, redirect } from "react-router";
import { MobileSidebar } from "~/components/mobile-sidebar";
import { NavItems } from "~/components/nav-items";
import { authClient } from "~/lib/auth-client";
import type { Route } from "./+types/layout";

export async function clientLoader({}: Route.LoaderArgs) {
  try {
    const user = await authClient.getSession();
    if (!user.data?.user.id) {
      throw redirect("/sign-in");
    }

    // if (user.data.user.status === "user") {
    //   return redirect("/");
    // }

    return data({ user: user.data.user });
  } catch (error) {
    console.error("Error loading client session:", error);
  }
}

export default function AdminLayout() {
  return (
    <div className="admin-layout">
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
