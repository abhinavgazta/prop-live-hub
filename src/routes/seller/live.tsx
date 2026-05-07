import { createFileRoute } from "@tanstack/react-router";
import { LiveRoomContent } from "@/components/dashboard/LiveRoomContent";

export const Route = createFileRoute("/seller/live")({
  component: () => <LiveRoomContent />,
  head: () => ({
    meta: [{ title: "Live Room — PropLive" }],
  }),
});
