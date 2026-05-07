import { createFileRoute } from "@tanstack/react-router";
import { DemandMyEventsContent } from "@/components/dashboard/DemandMyEventsContent";

export const Route = createFileRoute("/demand/my-events")({
  component: () => <DemandMyEventsContent />,
  head: () => ({
    meta: [{ title: "My Registered Events — PropLive" }],
  }),
});
