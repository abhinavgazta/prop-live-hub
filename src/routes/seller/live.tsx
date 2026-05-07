import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/seller/live")({
  beforeLoad: () => {
    throw redirect({ to: "/seller/host" });
  },
});
