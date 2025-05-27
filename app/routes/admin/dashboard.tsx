import { Suspense } from "react";
import { Await, redirect } from "react-router";
import { Header } from "~/components/header";
import { Spinner } from "~/components/spinner";
import { StatsCard } from "~/components/stats-card";
import { TripCard } from "~/components/trip-card";
import { getUsersAndTripsStats } from "~/lib/dashboard";
import { getAllTrips } from "~/lib/trips";
import type { Route } from "./+types/dashboard";

export async function loader({ context, request }: Route.LoaderArgs) {
  const [user, dashboardStats] = await Promise.all([
    context.auth.api.getSession(request),
    getUsersAndTripsStats(context),
  ]);

  const tripsPromise = getAllTrips(context, 4, 0);

  if (!user?.user) {
    throw redirect("/sign-in");
  }

  return {
    user: user.user,
    dashboardStats,
    tripsPromise,
  };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const dashboardStats = loaderData.dashboardStats;
  const { tripsPromise } = loaderData;

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
        <h1 className="text-xl font-semibold text-dark-100">
          Recently Created Trips
        </h1>
        <Suspense fallback={<Spinner />}>
          <Await resolve={tripsPromise}>
            {({ allTrips }) => (
              <div className="trip-grid">
                {allTrips.slice(0, 4).map((trip) => (
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
            )}
          </Await>
        </Suspense>
      </section>
    </main>
  );
}
