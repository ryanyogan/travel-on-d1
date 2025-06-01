import { LucidePlus } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export function Header({
  title,
  description,
  ctaText,
  ctaUrl,
}: {
  title: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
}) {
  const location = useLocation();

  return (
    <header className="header">
      <article>
        <h1
          className={cn(
            "text-dark-100",
            location.pathname === "/"
              ? "text-2xl md:text-4xl font-bold"
              : "text-xl md:text-2xl font-semibold"
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "text-slate-700 font-normal",
            location.pathname === "/"
              ? "text-base md:text-lg"
              : "text-sm md:text-lg"
          )}
        >
          {description}
        </p>
      </article>
      {ctaText && ctaUrl && (
        <Link to={ctaUrl}>
          <Button
            type="button"
            className="h-12 w-full cursor-pointer bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LucidePlus className="size-5" />
            <span className="text-white tracking-wider mr-2">{ctaText}</span>
          </Button>
        </Link>
      )}
    </header>
  );
}
