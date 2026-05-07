import { createFileRoute } from "@tanstack/react-router";
import { ReputationContent } from "@/components/dashboard/ReputationContent";

export const Route = createFileRoute("/seller/reputation")({
  component: () => <ReputationContent />,
  head: () => ({
    meta: [{ title: "Reputation — PropLive" }],
  }),
});
