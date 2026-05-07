import { LiveTourTemplate } from "@/components/dashboard/templates/LiveTourTemplate";

export function EventDetailContent({ dashboard }: { dashboard: "demand" | "seller" }) {
  return <LiveTourTemplate dashboard={dashboard} />;
}
