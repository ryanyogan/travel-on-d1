import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { Badge } from "./ui/badge";

export function TripCard({
  id,
  name,
  imageUrl,
  location = "Unknown Location",
  tags = [],
  price,
}: {
  id: string;
  name: string;
  imageUrl: string;
  location?: string;
  tags: string[];
  price: string;
}) {
  const path = useLocation();

  return (
    <Link
      to={
        path.pathname === "/" || path.pathname.startsWith("/travel")
          ? `/travel/${id}`
          : `/trips/${id}`
      }
      className="trip-card"
    >
      <img src={imageUrl} alt={name} />
      <article>
        <h2>{name}</h2>
        <figure>
          <img
            src="/assets/icons/location-mark.svg"
            alt="Location"
            className="size-4"
          />
          <figcaption>{location}</figcaption>
        </figure>
      </article>

      <div className="mt-5 pl-[18px] pr-3.5 pb-5">
        {tags.map((tag, index) => (
          <Badge
            key={tag + index}
            className={cn(
              "mr-2 bg-success-50 text-success-700",
              index === 1 && "bg-pink-50 text-pink-500"
            )}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <article className="tripCard-pill">{price}</article>
    </Link>
  );
}
