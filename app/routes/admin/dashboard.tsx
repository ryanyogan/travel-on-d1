import { redirect } from "react-router";
import { Header } from "~/components/header";
import { StatsAreaCard } from "~/components/stats-area-card";
import { StatsTripsByStyle } from "~/components/stats-trips-by-style";
import { TripCard } from "~/components/trip-card";
import {
  getTripsByTravelStyle,
  getTripsCreatedPerDay,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "~/lib/dashboard";
import { getAllTrips } from "~/lib/trips";
import type { Route } from "./+types/dashboard";

export async function loader({ context, request }: Route.LoaderArgs) {
  const [
    user,
    dashboardStats,
    userGrowth,
    tripGrowth,
    tripsByTravelStyle,
    trips,
  ] = await Promise.all([
    context.auth.api.getSession(request),
    getUsersAndTripsStats(context),
    getUserGrowthPerDay(context),
    getTripsCreatedPerDay(context),
    getTripsByTravelStyle(context),
    getAllTrips(context, 4, 0),
  ]);

  if (!user?.user) {
    throw redirect("/sign-in");
  }

  return {
    user: user.user,
    dashboardStats,
    trips,
    tripsByTravelStyle,
  };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const dashboardStats = loaderData.dashboardStats;
  const { trips, tripsByTravelStyle } = loaderData;

  return (
    <main className="dashboard wrapper overflow-y-scroll">
      <Header
        title={`Welcome ${loaderData.user?.name ?? "Guest"} 👋`}
        description="Track your travel plans, manage bookings, and explore new destinations with ease."
      />

      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsAreaCard
            title="Total Users"
            description="Track user growth over time"
            total={dashboardStats.totalUsers}
            currentMonthCount={dashboardStats.usersJoined.currentMonth}
            lastMonthCount={dashboardStats.usersJoined.lastMonth}
          />

          <StatsAreaCard
            title="Total Trips"
            description="Monitor trip creation trends"
            total={dashboardStats.totalTrips}
            currentMonthCount={dashboardStats.tripsCreated.currentMonth}
            lastMonthCount={dashboardStats.tripsCreated.lastMonth}
          />

          <StatsAreaCard
            title="Active Users Today"
            description="See how many users are active today"
            total={dashboardStats.userRole.total}
            currentMonthCount={dashboardStats.userRole.currentMonth}
            lastMonthCount={dashboardStats.userRole.lastMonth}
          />
        </div>
      </section>

      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">
          Recently Created Trips
        </h1>
        <div className="trip-grid">
          {trips.allTrips.slice(0, 4).map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id}
              name={trip.name!}
              imageUrl={trip.imageUrls[0]}
              location={trip.itinerary?.[0]?.location ?? ""}
              tags={[trip.interests!, trip.travelStyle!]}
              price={trip.estimatedPrice!}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <StatsTripsByStyle data={tripsByTravelStyle} />
      </section>
    </main>
  );
}
