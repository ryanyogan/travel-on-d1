import { Suspense, useState } from "react";
import { Await, Link, useSearchParams } from "react-router";
import { FeaturedDestination } from "~/components/featured-destination";
import { Header } from "~/components/header";
import { Spinner } from "~/components/spinner";
import { TripCard } from "~/components/trip-card";
import { Button } from "~/components/ui/button";
import { getAllTrips } from "~/lib/trips";
import type { Route } from "./+types/travel-page";

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const limit = 20;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const offset = (page - 1) * limit;

  const user = await context.auth.api.getSession(request);

  const allTripsPromise = getAllTrips(context, limit, offset);

  return {
    trips: allTripsPromise,
    user,
  };
};

export default function TravelPage({ loaderData }: Route.ComponentProps) {
  const { trips, user } = loaderData;

  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") || "1");

  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.location.search = `?page=${page}`;
  };

  return (
    <main className="flex flex-col">
      <section className="travel-hero">
        <div>
          <section className="wrapper">
            <article>
              <h1 className="p-72-bold text-dark-100">
                Plan Your Trip with Ease
              </h1>

              <p className="text-dark-100">
                Customize your travel itinerary in minutes—pick your
                destination, set your preferences, and explore with confidence.
              </p>
            </article>

            <Link to="#trips">
              <Button
                type="button"
                className="button-class h-11 w-full md:w-[240px] cursor-pointer hover:-translate-x-1 hover:-translate-y-1"
              >
                <span className="p-16-semibold text-white">Get Started</span>
              </Button>
            </Link>
          </section>
        </div>
      </section>

      <section className="pt-20 wrapper flex flex-col gap-10 h-full">
        <Header
          title="Featured Travel Destinations"
          description="Check out some of the best places you visit around the world"
        />
        <div className="featured">
          <article>
            <FeaturedDestination
              bgImage="bg-card-1"
              containerClass="h-1/3 lg:h-1/2"
              bigCard
              title="Barcelona Tour"
              rating={4.2}
              activityCount={196}
            />

            <div className="travel-featured">
              <FeaturedDestination
                bgImage="bg-card-2"
                bigCard
                title="London"
                rating={4.5}
                activityCount={512}
              />
              <FeaturedDestination
                bgImage="bg-card-3"
                bigCard
                title="Australia Tour"
                rating={3.5}
                activityCount={250}
              />
            </div>
          </article>

          <div className="flex flex-col gap-[30px]">
            <FeaturedDestination
              containerClass="w-full h-[240px]"
              bgImage="bg-card-4"
              title="Spain Tour"
              rating={3.8}
              activityCount={150}
            />
            <FeaturedDestination
              containerClass="w-full h-[240px]"
              bgImage="bg-card-5"
              title="Japan"
              rating={5}
              activityCount={150}
            />
            <FeaturedDestination
              containerClass="w-full h-[240px]"
              bgImage="bg-card-6"
              title="Italy Tour"
              rating={4.2}
              activityCount={500}
            />
          </div>
        </div>
      </section>

      <section id="trips" className="py-20 wrapper flex flex-col gap-10">
        <Header
          title="Handpicked Trips"
          description="Browse well-planned trips designes for your travel style"
        />

        <Suspense fallback={<Spinner />}>
          <Await resolve={trips}>
            {({ allTrips }) => (
              <div className="trip-grid w-full">
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
            )}
          </Await>
        </Suspense>

        {/* <PagerComponent
          totalRecordsCount={loaderData.total}
          pageSize={8}
          currentPage={currentPage}
          click={(args) => handlePageChange(args.currentPage)}
          cssClass="!mb-4"
        /> */}
      </section>

      <footer className="h-28 bg-white">
        <div className="wrapper footer-container">
          <Link to="/">
            <img
              src="/assets/icons/logo.svg"
              alt="logo"
              className="size-[30px]"
            />
            <h1>Tourvisto</h1>
          </Link>

          <div>
            {["Terms & Conditions", "Privacy Policy"].map((item) => (
              <Link to="/" key={item}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
