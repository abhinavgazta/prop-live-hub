import { createFileRoute } from "@tanstack/react-router";
import { HostContent } from "@/components/dashboard/HostContent";

export const Route = createFileRoute("/seller/host")({
  component: () => <HostContent />,
  head: () => ({
    meta: [{ title: "Host War Room — PropLive" }],
  }),
});
