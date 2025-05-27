import type { AppLoadContext } from "react-router";

interface Document {
  [key: string]: any;
}

type FilterByDate = (
  items: Document[],
  key: string,
  start: string,
  end?: string
) => number;

export async function getUsersAndTripsStats(
  context: AppLoadContext
): Promise<DashboardStats> {
  const d = new Date();
  const startCurrent = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
  const startPrev = new Date(
    d.getFullYear(),
    d.getMonth() - 1,
    1
  ).toISOString();
  const endPrev = new Date(d.getFullYear(), d.getMonth(), 0).toISOString();

  const [users, trips] = await Promise.all([
    context.db.query.user.findMany({}),
    context.db.query.trip.findMany({}),
  ]);

  const filterByDate: FilterByDate = (items, key, start, end) =>
    items.filter((item) => item[key] >= start && (!end || item[key] <= end))
      .length;

  const filterUsersByRole = (role: string) => {
    return users.filter((user: Document) => user.status === role);
  };

  return {
    totalUsers: users.length,
    usersJoined: {
      currentMonth: filterByDate(users, "joinedAt", startCurrent, undefined),
      lastMonth: filterByDate(users, "joinedAt", startPrev, endPrev),
    },
    totalTrips: trips.length,
    tripsCreated: {
      currentMonth: filterByDate(trips, "createdAt", startCurrent, undefined),
      lastMonth: filterByDate(trips, "createdAt", startPrev, endPrev),
    },
    userRole: {
      total: filterUsersByRole("user").length,
      currentMonth: filterByDate(
        filterUsersByRole("user"),
        "joinedAt",
        startCurrent
      ),
      lastMonth: filterByDate(
        filterUsersByRole("user"),
        "joinedAt",
        startPrev,
        endPrev
      ),
    },
  };
}
