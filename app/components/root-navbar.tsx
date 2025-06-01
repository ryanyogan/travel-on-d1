import { LucideLogOut } from "lucide-react";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function RootNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user } = useLoaderData();

  const handleLogout = async () => {
    // await logoutUser();
    navigate("/sign-in");
  };

  return (
    <nav
      className={cn(
        location.pathname === `/travel/${params.tripId}`
          ? "bg-white"
          : "glassmorphism",
        "w-full fixed z-50"
      )}
    >
      <header className="root-nav wrapper">
        <Link prefetch="intent" to="/" className="link-logo">
          <img
            src="/assets/icons/logo.svg"
            alt="logo"
            className="size-[30px]"
          />
          <h1>Tourvisto</h1>
        </Link>

        <aside>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer outline-none">
                <img
                  src={user.image || "/assets/images/david.wepb"}
                  alt="user"
                  referrerPolicy="no-referrer"
                  className="rounded-full aspect-square"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem>
                <Link prefetch="intent" to={`/profile/${user.id}`}>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link prefetch="intent" to="/dashboard">
                  Admin Panel
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer flex flex-row gap-x-2 items-center"
                >
                  <LucideLogOut className="size-4" />
                  <span>Sign Out</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </aside>
      </header>
    </nav>
  );
}
