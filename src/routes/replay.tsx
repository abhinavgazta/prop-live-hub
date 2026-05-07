import { createFileRoute } from "@tanstack/react-router";
import {
  Play,
  Volume2,
  Maximize2,
  ShieldCheck,
  Trophy,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/replay")({
  component: Replay,
  head: () => ({
    meta: [
      { title: "Replay · M3M Golf Estate — PropLive" },
      {
        name: "description",
        content:
          "Smart-scrub replay with timestamped resident insights, hidden charges, noise analysis and more.",
      },
    ],
  }),
});

const MARKERS = [
  { t: "01:24", pct: 5, label: "Drone — Tower B exterior", tone: "primary" },
  { t: "04:12", pct: 14, label: "Noise Level Analysis", tone: "live" },
  { t: "08:30", pct: 30, label: "3BHK Walkthrough", tone: "primary" },
  { t: "12:45", pct: 45, label: "Hidden Maintenance Charges", tone: "live" },
  { t: "18:02", pct: 64, label: "Clubhouse Tour", tone: "teal" },
  { t: "22:30", pct: 80, label: "Resident Q&A", tone: "gold" },
] as const;

const INSIGHTS = [
  {
    t: "04:12",
    title: "Noise Level Analysis",
    author: "Anika Sharma",
    tier: "Legend",
    body: "Measured 38 dB in master bedroom at 11 PM — quietest tower I've tested in Sector 65.",
    up: 184,
  },
  {
    t: "12:45",
    title: "Hidden Maintenance Charges",
    author: "Vivek Rao",
    tier: "Gold",
    body: "Sinking fund of ₹2.40/sq.ft is on top of the quoted ₹4.50. Confirmed with society treasurer.",
    up: 156,
  },
  {
    t: "18:02",
    title: "Clubhouse — actual access hours",
    author: "Priya Mehta",
    tier: "Silver",
    body: "Pool closes 9 PM despite brochure claim of 24/7 — gym is the only true round-the-clock facility.",
    up: 112,
  },
  {
    t: "22:30",
    title: "Power backup honest review",
    author: "Rohan K.",
    tier: "Resident",
    body: "DG covers full apartment load including ACs. Switchover under 8 seconds in 3 outages this year.",
    up: 87,
  },
];

const tone: Record<string, string> = {
  primary: "bg-primary",
  live: "bg-[var(--live)]",
  teal: "bg-teal",
  gold: "bg-[var(--gold)]",
};

function Replay() {
  return (
    <div className="grid gap-4 px-4 py-6 md:px-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-4">
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Replay · 28:40
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            M3M Golf Estate — Resident-led Open House
          </h1>
          <div className="mt-1 text-sm text-muted-foreground">
            Originally aired Tue · 4,218 watched live · 12,840 replays
          </div>
        </div>

        <div
          className="relative aspect-video overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-elegant)]"
          style={{
            background: "linear-gradient(135deg, oklch(0.22 0.05 250), oklch(0.38 0.13 245))",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_60%)]" />
          <button className="absolute inset-0 m-auto grid h-16 w-16 place-items-center rounded-full bg-white/95 text-primary shadow-2xl">
            <Play className="h-7 w-7 fill-primary" />
          </button>
          <div className="absolute right-4 top-4 flex gap-1.5">
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-black/40 text-white backdrop-blur">
              <Volume2 className="h-4 w-4" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-black/40 text-white backdrop-blur">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Smart Scrub */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Smart Scrub Timeline
            </div>
            <div className="text-xs text-muted-foreground">04:12 / 28:40</div>
          </div>
          <div className="relative h-2 rounded-full bg-secondary">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              style={{ width: "14%" }}
            />
            {MARKERS.map((m) => (
              <div
                key={m.t}
                className="absolute -top-1 -translate-x-1/2 group"
                style={{ left: `${m.pct}%` }}
              >
                <div className={`h-4 w-4 rounded-full ring-2 ring-background ${tone[m.tone]}`} />
                <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background group-hover:block">
                  {m.t} · {m.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {MARKERS.map((m) => (
              <button
                key={m.t}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] hover:border-primary/50"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${tone[m.tone]}`} />
                <span className="font-mono font-semibold">{m.t}</span>
                <span className="text-muted-foreground">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[var(--gold)]" />
            <h2 className="text-sm font-bold">Leaderboard of Insights</h2>
            <span className="text-[11px] text-muted-foreground">— this project</span>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {[
              { rank: 1, name: "Anika Sharma", tier: "Legend", insights: 9, karma: 1284 },
              { rank: 2, name: "Vivek Rao", tier: "Gold", insights: 6, karma: 812 },
              { rank: 3, name: "Priya Mehta", tier: "Silver", insights: 4, karma: 540 },
            ].map((u) => (
              <div
                key={u.rank}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
              >
                <div
                  className={`grid h-9 w-9 place-items-center rounded-full text-sm font-black ${u.rank === 1 ? "bg-[var(--gold)] text-[var(--gold-foreground)]" : u.rank === 2 ? "bg-[var(--silver)]/60" : "bg-secondary"}`}
                >
                  #{u.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{u.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {u.tier} · {u.insights} insights · {u.karma} karma
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight Rail */}
      <aside className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold">Insight Rail</h2>
          <Badge variant="secondary" className="gap-1">
            <ShieldCheck className="h-3 w-3 text-primary" />
            Verified
          </Badge>
        </div>
        <div className="space-y-3">
          {INSIGHTS.map((i) => (
            <button
              key={i.t}
              className="group block w-full rounded-xl border border-border bg-background p-3 text-left transition hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-md bg-primary px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary-foreground">
                  {i.t}
                </span>
                <span className="text-sm font-semibold">{i.title}</span>
              </div>
              <div className="mb-2 text-xs leading-relaxed text-muted-foreground">{i.body}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="font-semibold">{i.author}</span>
                  <Badge
                    className={`px-1.5 py-0 text-[9px] ${i.tier === "Legend" ? "bg-[var(--gold)] text-[var(--gold-foreground)]" : i.tier === "Gold" ? "bg-[var(--gold)]/30 text-[var(--gold-foreground)]" : "bg-secondary"}`}
                  >
                    {i.tier}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-0.5">
                    <ThumbsUp className="h-3 w-3" />
                    {i.up}
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    <MessageSquare className="h-3 w-3" />
                    24
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <Button variant="outline" className="mt-3 w-full">
          Show 14 more insights
        </Button>
      </aside>
    </div>
  );
}
