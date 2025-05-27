import { Suspense } from "react";
import { Await } from "react-router";
import { Header } from "~/components/header";
import { Spinner } from "~/components/spinner";
import { TripCard } from "~/components/trip-card";
import { getAllTrips } from "~/lib/trips";
import type { Route } from "./+types/trips";

export async function loader({ context, request }: Route.LoaderArgs) {
  const limit = 30;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const offset = (page - 1) * limit;

  const tripsPromise = getAllTrips(context, limit, offset);

  if (!tripsPromise) {
    throw new Error(`Trips not found`);
  }

  return {
    allTrips: tripsPromise,
  };
}

export default function Trips({ loaderData }: Route.ComponentProps) {
  const { allTrips } = loaderData;

  return (
    <main className="all-users wrapper">
      <Header
        title="Trips"
        description="View and edit Ai-Generated travel plans"
        ctaText="Create a trip"
        ctaUrl="/trips/create"
      />

      <section>
        <h1 className="p-24-semibold text-dark-100 mb-4">
          Manage Created Trips
        </h1>

        <Suspense fallback={<Spinner />}>
          <Await resolve={allTrips}>
            {({ allTrips }) => {
              return (
                <div className="trip-grid mb-4">
                  {allTrips.map((trip) => (
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
              );
            }}
          </Await>
        </Suspense>
      </section>
    </main>
  );
}
