import { redirect } from "react-router";
import { Header } from "~/components/header";
import { StatsCard } from "~/components/stats-card";
import { TripCard } from "~/components/trip-card";
import { getUsersAndTripsStats } from "~/lib/dashboard";
import { getAllTrips } from "~/lib/trips";
import { parseTripData } from "~/lib/utils";
import type { Route } from "./+types/dashboard";

export async function loader({ context, request }: Route.LoaderArgs) {
  const [user, dashboardStats, trips] = await Promise.all([
    context.auth.api.getSession(request),
    getUsersAndTripsStats(context),
    getAllTrips(context, 4, 0),
  ]);

  if (!user?.user) {
    throw redirect("/sign-in");
  }

  return {
    user: user.user,
    dashboardStats,
    allTrips: trips.allTrips.map((trip) => ({
      ...trip,
      ...parseTripData(trip.tripDetails),
      imageUrls: trip.imageUrls.split(",") ?? [],
    })),
  };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const dashboardStats = loaderData.dashboardStats;
  const allTrips = loaderData.allTrips as Trip[] | [];

  return (
    <main className="dashboard wrapper overflow-y-scroll">
      <Header
        title={`Welcome ${loaderData.user?.name ?? "Guest"} 👋`}
        description="Track your travel plans, manage bookings, and explore new destinations with ease."
      />

      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle="Total Users"
            total={dashboardStats.totalUsers}
            currentMonthCount={dashboardStats.usersJoined.currentMonth}
            lastMonthCount={dashboardStats.usersJoined.lastMonth}
          />

          <StatsCard
            headerTitle="Total Trips"
            total={dashboardStats.totalTrips}
            currentMonthCount={dashboardStats.tripsCreated.currentMonth}
            lastMonthCount={dashboardStats.tripsCreated.lastMonth}
          />

          <StatsCard
            headerTitle="Active Users Today"
            total={dashboardStats.userRole.total}
            currentMonthCount={dashboardStats.userRole.currentMonth}
            lastMonthCount={dashboardStats.userRole.lastMonth}
          />
        </div>
      </section>

      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
        <div className="trip-grid">
          {allTrips.slice(0, 4).map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id}
              name={trip.name}
              imageUrl={trip.imageUrls[0]}
              location={trip.itinerary?.[0]?.location ?? ""}
              tags={[trip.interests, trip.travelStyle]}
              price={trip.estimatedPrice}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
