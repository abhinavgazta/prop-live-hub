import { createFileRoute } from "@tanstack/react-router";
import { MyEventsContent } from "@/components/dashboard/MyEventsContent";

export const Route = createFileRoute("/seller/my-events")({
  component: () => <MyEventsContent />,
  head: () => ({
    meta: [{ title: "My Events — PropLive" }],
  }),
});
