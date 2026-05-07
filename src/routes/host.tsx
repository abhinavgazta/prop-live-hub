import { createFileRoute } from "@tanstack/react-router";
import {
  Eye,
  MousePointerClick,
  Flame,
  Pin,
  MicOff,
  Mic2,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/host")({
  component: Host,
  head: () => ({
    meta: [
      { title: "Host War Room — PropLive" },
      {
        name: "description",
        content:
          "Real-time analytics, attendee tagging and moderation tools for live property events.",
      },
    ],
  }),
});

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${100 - (v / max) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-16 w-full">
      <defs>
        <linearGradient id={`g-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,100 ${points} 100,100`} fill={`url(#g-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

const ATTENDEES = [
  { n: "Vivek Rao", t: "Hot", watch: "26m", q: 4, tone: "live" },
  { n: "Priya Mehta", t: "Hot", watch: "24m", q: 3, tone: "live" },
  { n: "Rohan K.", t: "Warm", watch: "18m", q: 1, tone: "gold" },
  { n: "Neha B.", t: "Warm", watch: "15m", q: 2, tone: "gold" },
  { n: "Arjun S.", t: "Cold", watch: "4m", q: 0, tone: "muted" },
  { n: "Kavya I.", t: "Cold", watch: "2m", q: 0, tone: "muted" },
];

function Host() {
  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-[var(--live)]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--live)]">
            <span className="h-1.5 w-1.5 rounded-full bg-live pulse-live" />
            Broadcasting · 18:42
          </div>
          <h1 className="text-2xl font-bold tracking-tight">War Room — M3M Golf Estate</h1>
          <div className="text-sm text-muted-foreground">
            Co-host: Anika Sharma · Stream healthy · 1080p / 60fps
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Pause Stream</Button>
          <Button variant="destructive">End Broadcast</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Live Viewers",
            value: "1,284",
            delta: "+184",
            icon: Eye,
            color: "oklch(0.32 0.13 255)",
            data: [12, 18, 22, 30, 28, 36, 42, 50, 48, 60],
          },
          {
            label: "Intent Clicks",
            value: "412",
            delta: "+38",
            icon: MousePointerClick,
            color: "oklch(0.72 0.14 195)",
            data: [4, 6, 9, 8, 14, 16, 18, 22, 24, 28],
          },
          {
            label: "Hot Leads",
            value: "47",
            delta: "+9",
            icon: Flame,
            color: "oklch(0.62 0.22 25)",
            data: [1, 2, 2, 3, 5, 6, 7, 8, 9, 11],
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </div>
                <div className="mt-1 text-3xl font-bold leading-none">{m.value}</div>
                <div className="mt-1 inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  {m.delta} last 5m
                </div>
              </div>
              <div
                className="grid h-9 w-9 place-items-center rounded-lg"
                style={{ background: `${m.color}20`, color: m.color as string }}
              >
                <m.icon className="h-4 w-4" />
              </div>
            </div>
            <Sparkline values={m.data} color={m.color as string} />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold">Attendees</h2>
              <Badge variant="secondary">1,284</Badge>
            </div>
            <div className="flex gap-1.5">
              {["All", "Hot", "Warm", "Cold"].map((t, i) => (
                <button
                  key={t}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-border">
            {ATTENDEES.map((a) => (
              <div key={a.n} className="flex items-center gap-3 p-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-sm font-bold">
                  {a.n[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{a.n}</div>
                  <div className="text-[11px] text-muted-foreground">
                    Watched {a.watch} · {a.q} questions asked
                  </div>
                </div>
                <Badge
                  className={
                    a.tone === "live"
                      ? "bg-[var(--live)]/15 text-[var(--live)]"
                      : a.tone === "gold"
                        ? "bg-[var(--gold)]/20 text-[var(--gold-foreground)]"
                        : "bg-secondary text-muted-foreground"
                  }
                >
                  {a.t}
                </Badge>
                <div className="flex gap-1">
                  <button
                    title="Invite to mic"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:text-primary"
                  >
                    <Mic2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    title="Mute"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:text-[var(--live)]"
                  >
                    <MicOff className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
            <h2 className="mb-3 text-sm font-bold">Moderation Queue</h2>
            <div className="space-y-2">
              {[
                { q: "What's the actual loaded SBA?", from: "Vivek Rao", action: "Pin" },
                { q: "Maintenance hike pattern?", from: "Priya Mehta", action: "Pin" },
                { q: "[Flagged] off-topic", from: "Anonymous", action: "Review" },
              ].map((m) => (
                <div key={m.q} className="rounded-xl border border-border bg-background p-3">
                  <div className="text-sm font-medium leading-snug">{m.q}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">— {m.from}</div>
                  <div className="mt-2 flex gap-1.5">
                    <Button size="sm" className="h-7 gap-1 px-2 text-[11px]">
                      <Pin className="h-3 w-3" />
                      {m.action}
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]">
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
            <h2 className="mb-3 text-sm font-bold">Geo Heat — Live Viewers</h2>
            <div className="space-y-2">
              {[
                { s: "Sector 65", v: 412, w: 92 },
                { s: "Sector 76", v: 318, w: 71 },
                { s: "Sector 84", v: 264, w: 60 },
                { s: "Golf Course Ext.", v: 188, w: 42 },
                { s: "DLF Phase 5", v: 102, w: 24 },
              ].map((g) => (
                <div key={g.s}>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="font-semibold">{g.s}</span>
                    <span className="text-muted-foreground">{g.v}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal to-primary"
                      style={{ width: `${g.w}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
