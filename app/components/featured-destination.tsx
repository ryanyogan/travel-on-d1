import { cn } from "~/lib/utils";

export function FeaturedDestination({
  containerClass = "",
  bigCard = false,
  rating,
  title,
  activityCount,
  bgImage,
}: DestinationProps) {
  return (
    <section
      className={cn(
        "rounded-[14px] overflow-hidden bg-cover bg-center size-full min-w-[280px]",
        containerClass,
        bgImage
      )}
    >
      <div className="bg-linear200 h-full">
        <article className="featured-card">
          <div
            className={cn(
              "bg-white rounded-20 font-bold text-dark-100 w-fit py-px px-3 text-sm"
            )}
          >
            {rating}
          </div>

          <article className="flex flex-col gap-3.5">
            <h2
              className={cn("text-lg font-semibold text-white", {
                "p-30-bold": bigCard,
              })}
            >
              {title}
            </h2>

            <figure className="flex gap-2 items-center">
              <img
                height={50}
                width={50}
                src="https://ik.imagekit.io/hfft2vlbg/fun-road/images/david.webp?tr=w-50,h-50"
                alt="user"
                className={cn("size-4 rounded-full aspect-square", {
                  "size-11": bigCard,
                })}
              />
              <p
                className={cn("text-xs font-normal text-white", {
                  "text-lg": bigCard,
                })}
              >
                {activityCount} activities
              </p>
            </figure>
          </article>
        </article>
      </div>
    </section>
  );
}
