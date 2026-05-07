import { createFileRoute } from "@tanstack/react-router";
import { PrelaunchTemplate } from "@/components/dashboard/templates/PrelaunchTemplate";

export const Route = createFileRoute("/demand/prelaunch")({
  component: () => <PrelaunchTemplate dashboard="demand" />,
  head: () => ({
    meta: [{ title: "Pre-Launch Event — PropLive" }],
  }),
});
