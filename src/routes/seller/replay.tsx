import { createFileRoute } from "@tanstack/react-router";
import { ReplayContent } from "@/components/dashboard/ReplayContent";

export const Route = createFileRoute("/seller/replay")({
  component: () => <ReplayContent />,
  head: () => ({
    meta: [{ title: "Replay — PropLive" }],
  }),
});
