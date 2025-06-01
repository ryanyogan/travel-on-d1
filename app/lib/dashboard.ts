import type { AppLoadContext } from "react-router";
import type { SelectUser } from "~/database/schema";
import { parseTripData } from "./utils";

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

  const filterByDate: FilterByDate = (items, key, start, end) => {
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : undefined;
    return items.filter(
      (item) => item[key] >= startTime && (!endTime || item[key] <= endTime)
    ).length;
  };

  const filterUsersByRole = (role: string) => {
    return users.filter((user: Document) => user.status === role);
  };

  return {
    totalUsers: users.length,
    usersJoined: {
      currentMonth: filterByDate(users, "createdAt", startCurrent, undefined),
      lastMonth: filterByDate(users, "createdAt", startPrev, endPrev),
    },
    totalTrips: trips.length,
    tripsCreated: {
      currentMonth: filterByDate(trips, "createdAt", startCurrent, undefined),
      lastMonth: filterByDate(trips, "createdAt", startPrev, endPrev),
    },
    userRole: {
      total: users.length,
      currentMonth: filterByDate(users, "createdAt", startCurrent),
      lastMonth: filterByDate(users, "createdAt", startPrev, endPrev),
    },
  };
}

export async function getUserGrowthPerDay(context: AppLoadContext) {
  const users = await context.db.query.user.findMany({});

  const userGrowth = users.reduce(
    (acc: { [key: string]: number }, user: SelectUser) => {
      const date = new Date(user.createdAt);
      const day = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {}
  );

  return Object.entries(userGrowth).map(([day, count]) => ({
    count: Number(count),
    day,
  }));
}

export async function getTripsCreatedPerDay(context: AppLoadContext) {
  const trips = await context.db.query.trip.findMany({});

  const tripGrowth = trips.reduce(
    (acc: { [key: string]: number }, trip: Document) => {
      const date = new Date(trip.createdAt);
      const day = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {}
  );

  return Object.entries(tripGrowth).map(([day, count]) => ({
    count: Number(count),
    day,
  }));
}

export async function getTripsByTravelStyle(context: AppLoadContext) {
  const trips = await context.db.query.trip.findMany({});

  const travelStyleCounts = trips.reduce(
    (acc: { [key: string]: number }, trip: Document) => {
      const tripDetail = parseTripData(trip.tripDetails);

      if (tripDetail && tripDetail.travelStyle) {
        const style = tripDetail.travelStyle;
        acc[style] = (acc[style] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  return Object.entries(travelStyleCounts).map(([style, count]) => ({
    count: Number(count),
    style,
  }));
}
