import { Outlet } from "react-router";
import { MobileSidebar } from "~/components/mobile-sidebar";
import { NavItems } from "~/components/nav-items";

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
