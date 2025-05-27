import { LucideLoaderCircle } from "lucide-react";

export function Spinner() {
  return (
    <div
      className="h-[200px] w-full flex flex-col items-center justify-center self-center"
      role="status"
    >
      <LucideLoaderCircle className="size-16 animate-spin" />
    </div>
  );
}
