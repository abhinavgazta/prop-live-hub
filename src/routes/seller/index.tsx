import { createFileRoute } from "@tanstack/react-router";
import DiscoverContent from "@/components/dashboard/DiscoverContent";

export const Route = createFileRoute("/seller/")({
  component: SellerDiscover,
  head: () => ({
    meta: [{ title: "Seller Dashboard · Discover — PropLive" }],
  }),
});

function SellerDiscover() {
  return <DiscoverContent dashboard="seller" />;
}
