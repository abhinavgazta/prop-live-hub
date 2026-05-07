import { createFileRoute } from "@tanstack/react-router";
import { CreateEventContent } from "@/components/dashboard/CreateEventContent";

export const Route = createFileRoute("/seller/create-event")({
  component: () => <CreateEventContent />,
  head: () => ({
    meta: [{ title: "Create Event — PropLive" }],
  }),
});
