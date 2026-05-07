import { createFileRoute } from "@tanstack/react-router";
import { PrelaunchTemplate } from "@/components/dashboard/templates/PrelaunchTemplate";

export const Route = createFileRoute("/seller/prelaunch")({
  component: () => <PrelaunchTemplate dashboard="seller" />,
  head: () => ({
    meta: [{ title: "Pre-Launch Event — PropLive" }],
  }),
});
