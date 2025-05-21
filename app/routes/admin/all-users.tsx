import { Header } from "~/components/header";

import { data } from "react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/all-users";

export async function loader({ context, params }: Route.LoaderArgs) {
  try {
    const users = await context.db.query.user.findMany({
      limit: 5,
      offset: 0,
    });

    if (users.length === 0) {
      return data({
        users: [],
        total: 0,
      });
    }

    return data({ users, total: users.length });
  } catch (error) {
    console.error("Error fetching users:", error);
    return data({
      users: [],
      total: 0,
    });
  }
}

export default function AllUsers({ loaderData }: Route.ComponentProps) {
  return (
    <main className="all-users wrapper">
      <Header title="All Users" description="Check out our current users" />
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date Joined</TableHead>
            <TableHead>Trips Created</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loaderData.users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-1.5">
                <img
                  src={user.image ?? "/images/user.png"}
                  alt="user"
                  className="rounded-full size-8 aspect-square"
                />
                <span>{user.name}</span>
              </TableCell>
              <TableCell className="text-left truncate">{user.email}</TableCell>
              <TableCell className="text-left truncate">
                {user.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </TableCell>
              <TableCell className="text-left truncate">10</TableCell>
              <TableCell className="text-left truncate">
                <article
                  className={cn(
                    "status-column",
                    user.status === "user" ? "bg-success-50" : "bg-light-300"
                  )}
                >
                  <div
                    className={cn(
                      "size-1.5 rounded-full",
                      user.status === "user" ? "bg-success-500" : "bg-gray-500"
                    )}
                  />
                  <h3
                    className={cn(
                      "font-inter text-xs font-medium",
                      user.status === "user"
                        ? "text-success-700"
                        : "text-gray-500"
                    )}
                  >
                    {user.status}
                  </h3>
                </article>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </main>
  );
}
