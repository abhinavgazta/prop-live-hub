import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  DiscoverHeader,
  DiscoverFilters,
  DiscoverMapSection,
  DiscoverSidebar,
  PINS,
} from "@/components/dashboard/DiscoverContent";

export const Route = createFileRoute("/demand/")({
  component: DemandDiscover,
  head: () => ({
    meta: [{ title: "Demand Dashboard · Discover — PropLive" }],
  }),
});

function DemandDiscover() {
  const [active, setActive] = useState("Live Now");
  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <DiscoverHeader />
      <DiscoverFilters active={active} setActive={setActive} />
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <DiscoverMapSection pins={PINS} />
        <DiscoverSidebar pins={PINS} dashboard="demand" />
      </div>
    </div>
  );
}
