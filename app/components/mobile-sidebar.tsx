import { useState } from "react";
import { Link } from "react-router";
import { NavItems } from "./nav-items";
import { Sheet, SheetContent } from "./ui/sheet";

export function MobileSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mobile-sidebar wrapper">
      <header>
        <Link to="/">
          <img
            src="/assets/icons/logo.svg"
            alt="logo"
            className="size-[30px]"
          />
          <h1>Tourvisto</h1>
        </Link>

        <button className="cursor-pointer" onClick={() => setSidebarOpen(true)}>
          <img src="/assets/icons/menu.svg" alt="menu" className="size-7" />
        </button>
      </header>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[270px]">
          <NavItems onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
