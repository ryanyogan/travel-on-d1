import { Header } from "~/components/header";

export default function Trips() {
  return (
    <main className="all-users wrapper">
      <Header
        title="Trips"
        description="View and edit Ai-Generated travel plans"
        ctaText="Create a trip"
        ctaUrl="/trips/create"
      />
    </main>
  );
}
