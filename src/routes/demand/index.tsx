import { createFileRoute } from "@tanstack/react-router";
import DiscoverContent from "@/components/dashboard/DiscoverContent";

export const Route = createFileRoute("/demand/")({
  component: DemandDiscover,
  head: () => ({
    meta: [{ title: "Demand Dashboard · Discover — PropLive" }],
  }),
});

function DemandDiscover() {
  return <DiscoverContent dashboard="demand" />;
}
