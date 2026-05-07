import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  Building2,
  TrendingUp,
  Eye,
  ChevronRight,
  Users,
  PlayCircle,
  Flame,
  Box,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MasterclassPlugin } from "@/components/layout/MasterclassPlugin";
import {
  mockLiveSessions,
  mockLocalities,
  mockReplaySessions,
  type LiveSession,
  type LocalityInsight,
  type ReplaySession,
} from "@/lib/mockMapData";

const DiscoveryMap = lazy(() =>
  typeof window !== "undefined"
    ? import("@/components/map/DiscoveryMap").then((m) => ({ default: m.DiscoveryMap }))
    : Promise.resolve({ default: () => <div className="h-full w-full bg-[#f6f8fb]" /> }),
);

const Locality3DView = lazy(() =>
  typeof window !== "undefined"
    ? import("@/components/map/Locality3DView").then((m) => ({ default: m.Locality3DView }))
    : Promise.resolve({ default: () => null }),
);

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/demand" });
  },
  component: Index,
  head: () => ({
    meta: [
      { title: "PropLive — Live, hyper-local real estate events in Gurgaon" },
      {
        name: "description",
        content:
          "Discover live property walkthroughs, masterclasses and verified resident insights on an interactive Gurgaon map.",
      },
    ],
  }),
});

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

function Index() {
  const [active, setActive] = useState("Live Now");
  const [selectedLocality, setSelectedLocality] = useState<LocalityInsight | null>(null);
  const [selectedLive, setSelectedLive] = useState<LiveSession | null>(null);
  const [selectedReplay, setSelectedReplay] = useState<ReplaySession | null>(null);
  const [view3D, setView3D] = useState<LocalityInsight | null>(null);

  const liveSessions = mockLiveSessions.filter((s) => s.type === "live");
  const totalLiveViewers = liveSessions.reduce((sum, s) => sum + s.viewers, 0);
  const totalJoiners = liveSessions.reduce((sum, s) => sum + s.joiners, 0);

  const headerLocality = useMemo(() => selectedLocality ?? mockLocalities[0], [selectedLocality]);

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-live pulse-live" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {liveSessions.length} events live · {totalJoiners.toLocaleString()} joined today
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
          <StatPill label="Live Now" value={String(liveSessions.length)} tone="live" />
          <StatPill label="Watching" value={totalLiveViewers.toLocaleString()} />
          <StatPill label="Replays" value={String(mockReplaySessions.length)} tone="gold" />
        </div>
      </div>

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

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="relative h-[620px] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <Suspense
            fallback={
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                Loading map…
              </div>
            }
          >
            <DiscoveryMap
              liveSessions={mockLiveSessions}
              replays={mockReplaySessions}
              localities={mockLocalities}
              onSelectLive={setSelectedLive}
              onSelectReplay={setSelectedReplay}
              onSelectLocality={setSelectedLocality}
              onOpen3D={setView3D}
            />
          </Suspense>
        </div>

        <aside className="flex flex-col gap-3">
          {selectedLocality && (
            <LocalityCard
              locality={selectedLocality}
              onOpen3D={() => setView3D(selectedLocality)}
              onClose={() => setSelectedLocality(null)}
            />
          )}

          {!selectedLocality && (
            <LocalityHighlight
              locality={headerLocality}
              onOpen3D={() => setView3D(headerLocality)}
              onPick={() => setSelectedLocality(headerLocality)}
            />
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Live Right Now
            </h2>
            <Link to="/demand/live" className="text-xs font-semibold text-primary hover:underline">
              View all →
            </Link>
          </div>

          {liveSessions.map((s) => (
            <LiveSessionCard key={s.id} session={s} onClick={() => setSelectedLive(s)} />
          ))}

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-[#a855f7]" />
              <h3 className="text-sm font-bold">Past Replays</h3>
              <span className="ml-auto text-[10px] font-semibold text-muted-foreground">
                {mockReplaySessions.length} sessions
              </span>
            </div>
            <div className="space-y-3">
              {mockReplaySessions.map((r) => (
                <ReplayRow key={r.id} replay={r} onClick={() => setSelectedReplay(r)} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal" />
              <h3 className="text-sm font-bold">Upcoming Masterclasses</h3>
            </div>
            <div className="space-y-3">
              {mockLiveSessions
                .filter((s) => s.type === "upcoming")
                .map((s) => (
                  <div key={s.id} className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal/10 text-teal">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{s.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.locality} · {s.joiners.toLocaleString()} registered
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]">
                      Remind
                    </Button>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/30 p-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
              <TrendingUp className="h-3.5 w-3.5" /> Hot Sector
            </div>
            <div className="text-xl font-bold">
              {[...mockLocalities].sort((a, b) => b.hotness - a.hotness)[0]?.name}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              +{[...mockLocalities].sort((a, b) => b.hotness - a.hotness)[0]?.yoyAppreciation}% YoY
              · hottest engagement today
            </div>
            <Button size="sm" variant="secondary" className="mt-3 h-8 w-full text-xs font-semibold">
              Join the conversation
            </Button>
          </div>
        </aside>
      </div>

      {/* Live session details overlay */}
      {selectedLive && (
        <SessionPopover session={selectedLive} onClose={() => setSelectedLive(null)} />
      )}
      {selectedReplay && (
        <ReplayPopover replay={selectedReplay} onClose={() => setSelectedReplay(null)} />
      )}

      {view3D && (
        <Suspense fallback={null}>
          <Locality3DView locality={view3D} onClose={() => setView3D(null)} />
        </Suspense>
      )}

      <MasterclassPlugin />
    </div>
  );
}

function LocalityCard({
  locality,
  onOpen3D,
  onClose,
}: {
  locality: LocalityInsight;
  onOpen3D: () => void;
  onClose: () => void;
}) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-4 shadow-[var(--shadow-elegant)]">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Locality insight
          </div>
          <div className="text-lg font-bold leading-tight">{locality.name}</div>
        </div>
        <button
          onClick={onClose}
          className="grid h-7 w-7 place-items-center rounded-full border border-border bg-card hover:bg-secondary"
          aria-label="Close locality details"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <Metric label="Live" value={String(locality.liveSessions)} accent="live" />
        <Metric label="Replays" value={String(locality.replayCount)} />
        <Metric label="Avg price" value={`₹${locality.avgPriceCr} Cr`} />
        <Metric label="Per sqft" value={`₹${locality.pricePerSqftK}k`} />
        <Metric label="YoY" value={`+${locality.yoyAppreciation}%`} accent="gold" />
        <Metric label="Hotness" value={`${locality.hotness}/100`} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 font-semibold">
          <Eye className="h-3 w-3" /> {locality.totalViewersLast7d.toLocaleString()} viewers / 7d
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 font-semibold">
          <Users className="h-3 w-3" /> {locality.legendBrokers} legend brokers
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 font-semibold">
          <Building2 className="h-3 w-3" /> {locality.inventoryUnits} units
        </span>
      </div>

      <Button
        size="sm"
        className="mt-3 h-8 w-full gap-1.5 text-xs font-semibold"
        onClick={onOpen3D}
      >
        <Box className="h-3.5 w-3.5" />
        Visualize in 3D
      </Button>
    </div>
  );
}

function LocalityHighlight({
  locality,
  onOpen3D,
  onPick,
}: {
  locality: LocalityInsight;
  onOpen3D: () => void;
  onPick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <Flame className="h-4 w-4 text-[var(--live)]" />
        <h3 className="text-sm font-bold">Featured locality</h3>
        <span className="ml-auto text-[10px] font-semibold text-muted-foreground">
          Tap a boundary on the map
        </span>
      </div>
      <div className="text-lg font-bold leading-tight">{locality.name}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">
        ₹{locality.avgPriceCr} Cr avg · {locality.liveSessions} live · {locality.replayCount}{" "}
        replays
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" className="h-8 text-[11px]" onClick={onPick}>
          See details
        </Button>
        <Button size="sm" className="h-8 gap-1.5 text-[11px]" onClick={onOpen3D}>
          <Box className="h-3.5 w-3.5" /> 3D view
        </Button>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "live" | "gold";
}) {
  const tone =
    accent === "live"
      ? "bg-[var(--live)]/10 text-[var(--live)]"
      : accent === "gold"
        ? "bg-[var(--gold)]/15 text-[var(--gold-foreground)]"
        : "bg-secondary text-foreground";
  return (
    <div className={`rounded-lg px-2 py-1.5 ${tone}`}>
      <div className="text-[9px] font-semibold uppercase tracking-wider opacity-70">{label}</div>
      <div className="text-sm font-bold leading-tight">{value}</div>
    </div>
  );
}

function LiveSessionCard({ session, onClick }: { session: LiveSession; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-border bg-card p-3 text-left transition hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
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
            {session.viewers.toLocaleString()}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{session.title}</div>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">
            {session.locality} · {session.developer}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Badge variant="secondary" className="gap-1 px-1.5 py-0 text-[9px]">
              <Users className="h-2.5 w-2.5" />
              {session.joiners.toLocaleString()} joined
            </Badge>
            <span className="text-[9px] font-semibold text-[var(--live)]">
              +{session.joiningPerMinute}/min
            </span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </button>
  );
}

function ReplayRow({ replay, onClick }: { replay: ReplaySession; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-start gap-3 text-left">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#a855f7]/10 text-[#a855f7]">
        <PlayCircle className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{replay.title}</div>
        <div className="text-[11px] text-muted-foreground">
          {replay.locality} · {replay.durationMin}m
        </div>
        <div className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
          {replay.replayViews.toLocaleString()} replays · {replay.engagement}% engagement
        </div>
      </div>
      <ChevronRight className="mt-1 h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function SessionPopover({ session, onClose }: { session: LiveSession; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[1500] grid place-items-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-[min(440px,100%)] rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-elegant)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <Badge className="gap-1 bg-live px-1.5 py-0 text-[9px]">
              <span className="h-1 w-1 rounded-full bg-white" /> LIVE
            </Badge>
            <div className="mt-2 text-lg font-bold leading-tight">{session.title}</div>
            <div className="text-[11px] text-muted-foreground">
              {session.developer} · {session.locality}
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full border border-border bg-card hover:bg-secondary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
          <Metric label="Watching" value={session.viewers.toLocaleString()} accent="live" />
          <Metric label="Joined" value={session.joiners.toLocaleString()} />
          <Metric label="+/min" value={`+${session.joiningPerMinute}`} accent="gold" />
        </div>
        <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recently joined
          </div>
          <div className="mt-2 flex -space-x-1.5">
            {session.recentJoiners?.map((j) => (
              <div
                key={j.id}
                title={`${j.name} · ${j.tier}`}
                className={`grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold text-white ring-2 ring-card ${
                  j.tier === "legend"
                    ? "bg-[var(--gold)]"
                    : j.tier === "gold"
                      ? "bg-[var(--gold)]/80"
                      : j.tier === "silver"
                        ? "bg-[var(--silver)] text-foreground"
                        : "bg-primary"
                }`}
              >
                {j.initial}
              </div>
            ))}
            <div className="ml-2 self-center text-[11px] font-semibold text-muted-foreground">
              +{Math.max(0, session.joiners - (session.recentJoiners?.length ?? 0))} more
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button asChild size="sm" className="h-9 flex-1 text-xs font-semibold">
            <Link to="/demand/live">Join live</Link>
          </Button>
          <Button size="sm" variant="outline" className="h-9 flex-1 text-xs">
            Notify on highlights
          </Button>
        </div>
      </div>
    </div>
  );
}

function ReplayPopover({ replay, onClose }: { replay: ReplaySession; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[1500] grid place-items-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-[min(440px,100%)] rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-elegant)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <Badge className="gap-1 bg-[#a855f7] px-1.5 py-0 text-[9px] text-white">
              <PlayCircle className="h-2.5 w-2.5" /> REPLAY
            </Badge>
            <div className="mt-2 text-lg font-bold leading-tight">{replay.title}</div>
            <div className="text-[11px] text-muted-foreground">
              {replay.developer} · {replay.locality}
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full border border-border bg-card hover:bg-secondary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
          <Metric label="Replays" value={replay.replayViews.toLocaleString()} />
          <Metric label="Live viewers" value={replay.liveViewers.toLocaleString()} accent="live" />
          <Metric label="Engagement" value={`${replay.engagement}%`} accent="gold" />
        </div>
        <div className="mt-3 text-[11px] text-muted-foreground">
          Aired{" "}
          {new Date(replay.airedAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}{" "}
          · {replay.durationMin}m · {replay.highlightCount} highlights
        </div>
        <div className="mt-3 flex gap-2">
          <Button asChild size="sm" className="h-9 flex-1 text-xs font-semibold">
            <Link to="/demand/replay">Watch replay</Link>
          </Button>
          <Button size="sm" variant="outline" className="h-9 flex-1 text-xs">
            Share clip
          </Button>
        </div>
      </div>
    </div>
  );
}
