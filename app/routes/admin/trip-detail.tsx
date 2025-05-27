import { data } from "react-router";
import { Header } from "~/components/header";
import { InfoPill } from "~/components/info-pill";
import { TripCard } from "~/components/trip-card";
import { Badge } from "~/components/ui/badge";
import { getAllTrips, getTripById } from "~/lib/trips";
import { cn, getFirstWord, parseTripData } from "~/lib/utils";
import type { Route } from "./+types/trip-detail";

export async function loader({ params, context }: Route.LoaderArgs) {
  const { tripId } = params;

  if (!tripId) {
    throw new Error("Trip ID is required");
  }

  const [trip, trips] = await Promise.all([
    getTripById(context, tripId),
    getAllTrips(context, 4, 0),
  ]);

  if (!trip) {
    throw new Error(`Trip with ID ${tripId} not found`);
  }

  return data({
    trip,
    allTrips: trips.allTrips,
    total: trips.total,
  });
}

export default function TripDetail({ loaderData }: Route.ComponentProps) {
  const tripDetails = parseTripData(loaderData?.trip?.tripDetails);

  const pillItems = [
    { text: tripDetails?.travelStyle, bg: "bg-pink-50 text-pink-500" },
    { text: tripDetails?.groupType, bg: "bg-primary-50 text-primary-500 " },
    { text: tripDetails?.budget, bg: "bg-success-50 text-success-500" },
    { text: tripDetails?.interests, bg: "bg-navy-50 text-navy-500" },
  ];

  const visitTimeAndWeatherInfo = [
    { title: "Best Time to Visit:", items: tripDetails?.bestTimeToVisit },
    { title: "Weather:", items: tripDetails?.weatherInfo },
  ];

  return (
    <main className="travel-detail wrapper">
      <Header
        title="Trip Details"
        description="View and edit AI generated travel plans"
      />

      <section className="container wrapper-md">
        <header>
          <h1 className="p-40-semibold text-dark-100">{tripDetails?.name}</h1>
          <div className="flex items-center gap-5">
            <InfoPill
              text={`${tripDetails?.duration} day play`}
              image="/assets/icons/calendar.svg"
            />

            <InfoPill
              text={`${tripDetails?.itinerary
                ?.slice(0, 2)
                .map((item) => item.location)
                .join(", ")}`}
              image="/assets/icons/location-mark.svg"
            />
          </div>
        </header>

        <section className="gallery">
          {loaderData?.trip?.imageUrls?.split(",").map((imageUrl, i) => (
            <img
              src={imageUrl}
              key={imageUrl}
              className={cn(
                "w-full rounded-xl object-cover",
                i === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]"
              )}
              alt="Trip Image"
            />
          ))}
        </section>

        <section className="flex gap-3 md:gap-5 items-center flex-wrap">
          {pillItems.map((pill, i) => (
            <Badge
              key={i}
              className={cn("text-base font-medium px-4", pill.bg)}
            >
              {getFirstWord(pill.text)}
            </Badge>
          ))}
          <ul className="flex gap-1 items-center">
            {Array(5)
              .fill("null")
              .map((_, index) => (
                <li key={index}>
                  <img
                    src="/assets/icons/star.svg"
                    alt="star"
                    className="size-[18px]"
                  />
                </li>
              ))}

            <li className="ml-1">
              <Badge className="bg-yellow-50 text-yellow-700">4.9/5</Badge>
            </li>
          </ul>
        </section>

        <section className="title">
          <article>
            <h3>
              {tripDetails?.duration}-Day {tripDetails?.country}{" "}
              {tripDetails?.travelStyle} Trip
            </h3>
            <p>
              {tripDetails?.budget}, {tripDetails?.groupType} and{" "}
              {tripDetails?.interests}
            </p>
          </article>

          <h2>{tripDetails?.estimatedPrice}</h2>
        </section>

        <p className="text-sm md:text-lg font-normal text-dark-400">
          {tripDetails?.description}
        </p>

        <ul className="itinerary">
          {tripDetails?.itinerary?.map((dayPlan: DayPlan, index: number) => (
            <li key={index}>
              <h3>
                Day {dayPlan.day}: {dayPlan.location}
              </h3>

              <ul>
                {dayPlan.activities.map((activity, index: number) => (
                  <li key={index}>
                    <span className="flex-shring-0 p-18-semibold">
                      {activity.time}
                    </span>
                    <p className="flex-grow">{activity.description}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {visitTimeAndWeatherInfo.map((section) => (
          <section key={section.title} className="visit">
            <div>
              <h3>{section.title}</h3>

              <ul>
                {section.items?.map((item) => (
                  <li key={item}>
                    <p className="flex-grow">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>

        <div className="trip-grid">
          {loaderData.allTrips.map((trip) => (
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
    </main>
  );
}
