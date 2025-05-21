import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { sidebarItems } from "~/constants";
import { authClient } from "~/lib/auth-client";
import { cn } from "~/lib/utils";
import type { loader } from "~/routes/admin/layout";

export function NavItems({ onClose }: { onClose?: () => void }) {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/sign-in");
  };

  return (
    <section className="nav-items">
      <Link to="/" className="link-logo">
        <img src="/assets/icons/logo.svg" alt="Logo" className="size-[30px]" />
        <h1>Tourvisto</h1>
      </Link>

      <div className="container">
        <nav>
          {sidebarItems.map((item) => (
            <NavLink to={item.href} key={item.id} onClick={() => onClose?.()}>
              {({ isActive }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={`group-hover:brightness-0 size-0 group-hover:invert ${
                      isActive ? "brightness-0 invert" : "text-dark-200"
                    }`}
                  />
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <footer className="nav-footer">
          <img
            src={data?.user?.image ?? "/assets/icons/dummy.svg"}
            alt={data?.user?.name}
            referrerPolicy="no-referrer"
          />
          <article>
            <h2>{data?.user?.name}</h2>
            <p>{data?.user?.email}</p>
          </article>

          <button onClick={handleLogout} className="cursor-pointer">
            <img
              src="/assets/icons/logout.svg"
              alt="logout"
              className="size-6"
            />
          </button>
        </footer>
      </div>
    </section>
  );
}
