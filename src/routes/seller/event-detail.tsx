import { createFileRoute } from "@tanstack/react-router";
import { LiveTourTemplate } from "@/components/dashboard/templates/LiveTourTemplate";

export const Route = createFileRoute("/seller/event-detail")({
  component: () => <LiveTourTemplate dashboard="seller" />,
  head: () => ({
    meta: [{ title: "Event Detail — PropLive" }],
  }),
});
