import type { AppLoadContext } from "react-router";
import { parseTripData } from "./utils";

export async function getAllTrips(
  ctx: AppLoadContext,
  limit: number,
  offset: number
) {
  const trips = await ctx.db.query.trip.findMany({
    orderBy: (trips, { desc }) => [desc(trips.createdAt)],
    limit,
    offset,
  });

  if (trips.length === 0) {
    console.error("No trips found");
    return { allTrips: [], total: 0 };
  }

  return {
    allTrips: trips.map((trip) => ({
      ...trip,
      ...parseTripData(trip.tripDetails),
      imageUrls: trip.imageUrls.split(",") ?? [],
    })),
    total: trips.length,
  };
}

export async function getTripById(ctx: AppLoadContext, id: string) {
  const trip = await ctx.db.query.trip.findFirst({
    where: (trips, { eq }) => eq(trips.id, id),
  });

  if (!trip) {
    console.error(`Trip with id ${id} not found`);
    return null;
  }

  return trip;
}
