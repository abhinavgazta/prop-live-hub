import { createFileRoute } from "@tanstack/react-router";
import { LiveTourTemplate } from "@/components/dashboard/templates/LiveTourTemplate";

export const Route = createFileRoute("/demand/event-detail")({
  component: () => <LiveTourTemplate dashboard="demand" />,
  head: () => ({
    meta: [{ title: "Event Detail — PropLive" }],
  }),
});
