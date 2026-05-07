import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Radio,
  Calendar,
  Star,
  Building2,
  TrendingUp,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { DiscoveryMap, Pin } from "@/components/map/DiscoveryMap";
import { Suspense, lazy } from "react";

const Map = DiscoveryMap;

export const PINS: Pin[] = [
  {
    id: "1",
    lat: 28.4646,
    lng: 77.0266,
    type: "live",
    title: "M3M Golf Estate · Live Tour",
    meta: "1,284 watching · Sector 65",
    viewers: 1284,
  },
  {
    id: "2",
    lat: 28.4321,
    lng: 77.0667,
    type: "live",
    title: "DLF Privana South",
    meta: "812 watching · Sector 76",
    viewers: 812,
  },
  {
    id: "3",
    lat: 28.4089,
    lng: 77.051,
    type: "upcoming",
    title: "Sector 84 Masterclass",
    meta: "Sat 7 PM · 2.4k registered",
  },
  {
    id: "4",
    lat: 28.49,
    lng: 77.085,
    type: "upcoming",
    title: "Smart Buyer Workshop",
    meta: "Sun 6 PM · Locality Legends",
  },
  {
    id: "5",
    lat: 28.45,
    lng: 77.09,
    type: "property",
    title: "Emaar Digi Homes",
    meta: "3BHK · ₹2.4 Cr onwards",
  },
  {
    id: "6",
    lat: 28.475,
    lng: 77.04,
    type: "property",
    title: "Sobha City",
    meta: "4BHK · ₹3.1 Cr onwards",
  },
  {
    id: "7",
    lat: 28.42,
    lng: 77.03,
    type: "property",
    title: "Adani Samsara",
    meta: "Villa · ₹5.8 Cr onwards",
  },
  {
    id: "8",
    lat: 28.44,
    lng: 77.075,
    type: "live",
    title: "Tata Primanti — Open House",
    meta: "521 watching · Sector 72",
  },
];

const FILTERS = [
  "Live Now",
  "Upcoming",
  "Replays",
  "3 BHK",
  "4 BHK",
  "Villa",
  "Plot",
  "Under ₹2 Cr",
  "Verified Moderator",
];

function StatPill({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "live" | "gold";
}) {
  const cls =
    tone === "live"
      ? "bg-[var(--live)]/10 text-[var(--live)]"
      : tone === "gold"
        ? "bg-[var(--gold)]/15 text-[var(--gold-foreground)]"
        : "bg-secondary text-foreground";
  return (
    <div className={`rounded-xl ${cls} px-3 py-2`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{label}</div>
      <div className="text-base font-bold leading-tight">{value}</div>
    </div>
  );
}

export function DiscoverHeader() {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-live pulse-live" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            14 events live in Gurgaon
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Discover what's happening on every street.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Live tours, masterclasses and verified resident insights — pinned to the map, ranked by
          community trust.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <StatPill label="Live Now" value="14" tone="live" />
        <StatPill label="This Week" value="38" />
        <StatPill label="Legends" value="126" tone="gold" />
      </div>
    </div>
  );
}

export function DiscoverFilters({
  active,
  setActive,
}: {
  active: string;
  setActive: (f: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 shadow-[var(--shadow-soft)]">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Search Sector 84, Golf Course Road, M3M Golf Estate…"
        />
        <Button size="sm" variant="ghost" className="h-7 gap-1.5 px-2 text-xs">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </Button>
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${active === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LiveCard({ pin, dashboard }: { pin: Pin; dashboard: "demand" | "seller" }) {
  const to = `/${dashboard}/live`;
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border bg-card p-3 transition hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
    >
      <div className="flex items-center gap-3">
        <div
          className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.25),transparent_60%)]" />
          <Badge className="absolute left-1.5 top-1.5 gap-1 bg-live px-1.5 py-0 text-[9px]">
            <span className="h-1 w-1 rounded-full bg-white" />
            LIVE
          </Badge>
          <div className="absolute bottom-1 right-1.5 inline-flex items-center gap-0.5 text-[9px] font-bold text-white">
            <Eye className="h-2.5 w-2.5" />
            {pin.viewers?.toLocaleString()}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{pin.title}</div>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">{pin.meta}</div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Badge variant="secondary" className="gap-1 px-1.5 py-0 text-[9px]">
              <Star className="h-2.5 w-2.5 fill-[var(--gold)] text-[var(--gold)]" />
              Legend host
            </Badge>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  );
}

export function DiscoverMapSection({ pins }: { pins: Pin[] }) {
  return (
    <div className="relative h-[560px] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <Suspense
        fallback={
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            Loading map…
          </div>
        }
      >
        <Map pins={pins} />
      </Suspense>

      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
        <div className="glass pointer-events-auto rounded-xl px-3 py-2 shadow-[var(--shadow-soft)]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Engagement Heat
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-2 w-8 rounded-full bg-gradient-to-r from-teal/40 to-live/80" />
            <span className="text-[10px] text-muted-foreground">Low → High</span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
        <div className="glass pointer-events-auto flex items-center gap-3 rounded-xl px-3 py-2">
          <span className="inline-flex items-center gap-1.5 text-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-live pulse-live" />
            Live
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-teal" />
            Upcoming
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            Property
          </span>
        </div>
        <div className="glass pointer-events-auto rounded-xl px-3 py-2 text-xs text-muted-foreground">
          Gurgaon · 28.46°N 77.03°E
        </div>
      </div>
    </div>
  );
}

export function DiscoverSidebar({
  pins,
  dashboard,
}: {
  pins: Pin[];
  dashboard: "demand" | "seller";
}) {
  const liveCards = pins.filter((p) => p.type === "live");
  const upcoming = pins.filter((p) => p.type === "upcoming");

  return (
    <aside className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Live Right Now
        </h2>
        <Link
          to={`/${dashboard}/live`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          View all →
        </Link>
      </div>
      {liveCards.map((c) => (
        <LiveCard key={c.id} pin={c} dashboard={dashboard} />
      ))}

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-teal" />
          <h3 className="text-sm font-bold">Upcoming Masterclasses</h3>
        </div>
        <div className="space-y-3">
          {upcoming.map((p) => (
            <div key={p.id} className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal/10 text-teal">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.meta}</div>
              </div>
              <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]">
                Remind
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl border border-border p-4 text-primary-foreground"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80">
          <TrendingUp className="h-3.5 w-3.5" />
          Hot sector this week
        </div>
        <div className="mt-2 text-2xl font-bold">Sector 84</div>
        <div className="text-xs opacity-80">+38% engagement · 6 live tours · 2 masterclasses</div>
        <Button size="sm" variant="secondary" className="mt-3 h-8 w-full text-xs">
          Join the conversation
        </Button>
      </div>
    </aside>
  );
}
