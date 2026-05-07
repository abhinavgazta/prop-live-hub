import { useState } from "react";
import {
  Send,
  Heart,
  Calendar,
  FileText,
  ShieldCheck,
  Pin,
  Mic,
  Volume2,
  Maximize2,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Msg = {
  id: number;
  user: string;
  initial: string;
  tier: "legend" | "gold" | "silver" | "none";
  text: string;
  verified?: boolean;
  isBroker?: boolean;
};

const MESSAGES: Msg[] = [
  {
    id: 1,
    user: "Anika S.",
    initial: "A",
    tier: "legend",
    text: "Resident here for 4 years — clubhouse access is genuinely 24/7. Happy to answer.",
  },
  {
    id: 2,
    user: "Vivek R.",
    initial: "V",
    tier: "gold",
    text: "What's the actual loaded SBA vs carpet on the 3BHK?",
  },
  {
    id: 3,
    user: "Sales · DLF",
    initial: "D",
    tier: "none",
    isBroker: true,
    verified: true,
    text: "Carpet 1,820 sq.ft, SBA 2,450 sq.ft. Loading 34.6%. RERA-listed.",
  },
  {
    id: 4,
    user: "Priya M.",
    initial: "P",
    tier: "silver",
    text: "Maintenance hike last year was 12% — flag this if it matters to you.",
  },
  {
    id: 5,
    user: "Rohan K.",
    initial: "R",
    tier: "none",
    text: "Can we see the kids' play area next?",
  },
  {
    id: 6,
    user: "Anika S.",
    initial: "A",
    tier: "legend",
    text: "Pinning the noise levels report I made last month — link in description.",
  },
];

const tierStyles: Record<Msg["tier"], string> = {
  legend: "bg-[var(--gold)]/10 border-l-2 border-[var(--gold)]",
  gold: "bg-[var(--gold)]/5",
  silver: "bg-secondary",
  none: "",
};

function TierBadge({ tier, isBroker }: { tier: Msg["tier"]; isBroker?: boolean }) {
  if (isBroker)
    return (
      <Badge className="gap-1 bg-primary/10 px-1.5 py-0 text-[9px] text-primary">
        <BadgeCheck className="h-2.5 w-2.5" />
        RERA Broker
      </Badge>
    );
  if (tier === "legend")
    return (
      <Badge className="gap-1 bg-[var(--gold)] px-1.5 py-0 text-[9px] text-[var(--gold-foreground)]">
        <Sparkles className="h-2.5 w-2.5" />
        Legend
      </Badge>
    );
  if (tier === "gold")
    return (
      <Badge className="bg-[var(--gold)]/30 px-1.5 py-0 text-[9px] text-[var(--gold-foreground)]">
        Gold
      </Badge>
    );
  if (tier === "silver")
    return (
      <Badge className="bg-[var(--silver)]/30 px-1.5 py-0 text-[9px] text-foreground">
        Silver Resident
      </Badge>
    );
  return null;
}

export function LiveRoomContent() {
  const [poll, setPoll] = useState<string | null>(null);
  return (
    <div className="grid gap-4 px-4 py-6 md:px-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <div
          className="relative aspect-video overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-elegant)]"
          style={{
            background: "linear-gradient(135deg, oklch(0.25 0.06 250), oklch(0.42 0.15 245))",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.55))]" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <Badge className="gap-1.5 bg-live px-2 py-1 text-[11px] font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-white pulse-live" />
              Live
            </Badge>
            <Badge
              variant="secondary"
              className="bg-black/40 px-2 py-1 text-[11px] text-white backdrop-blur"
            >
              1,284 watching
            </Badge>
          </div>

          <div className="absolute right-4 top-4 flex gap-1.5">
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-black/40 text-white backdrop-blur">
              <Volume2 className="h-4 w-4" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-black/40 text-white backdrop-blur">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div className="glass flex items-center gap-3 rounded-xl px-3 py-2">
              <div
                className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-[var(--gold-foreground)]"
                style={{ background: "var(--gold)" }}
              >
                A
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Co-hosted by
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold">
                  Anika Sharma <Sparkles className="h-3 w-3 text-[var(--gold)]" />
                  <span className="text-[11px] font-medium text-muted-foreground">
                    · Locality Legend · Sector 65
                  </span>
                </div>
              </div>
            </div>
            <div className="glass rounded-xl px-3 py-2 text-xs">
              <span className="font-semibold">Drone Tour</span> · 04:12 / 28:40
            </div>
          </div>
        </div>

        {/* Bottom interactive bar */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Site Visit
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Download RERA Docs
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-[var(--live)]/30 text-[var(--live)] hover:bg-[var(--live)]/10"
          >
            <Heart className="heartbeat h-4 w-4 fill-[var(--live)]" />
            I'm Interested
            <span className="rounded-full bg-[var(--live)]/15 px-1.5 text-[10px] font-bold">
              412
            </span>
          </Button>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Community Verified · 18 insights
          </div>
        </div>

        {/* Poll */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-teal/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal">
              Live Poll
            </span>
            <span className="text-sm font-semibold">
              Is this floor plan better than DLF Privana South?
            </span>
          </div>
          <div className="space-y-2">
            {[
              { k: "Yes, much better", v: 62 },
              { k: "About the same", v: 24 },
              { k: "No, Privana wins", v: 14 },
            ].map((o) => {
              const sel = poll === o.k;
              return (
                <button
                  key={o.k}
                  onClick={() => setPoll(o.k)}
                  className="relative w-full overflow-hidden rounded-lg border border-border bg-background px-3 py-2 text-left text-sm"
                >
                  <div
                    className={`absolute inset-y-0 left-0 ${sel ? "bg-primary/15" : "bg-secondary"}`}
                    style={{ width: `${o.v}%` }}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="font-medium">{o.k}</span>
                    <span className="text-xs font-bold text-muted-foreground">{o.v}%</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">847 votes · ends in 02:14</div>
        </div>
      </div>

      {/* Chat */}
      <aside className="flex h-[calc(100vh-180px)] min-h-[560px] flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <div className="text-sm font-bold">Live Chat</div>
            <div className="text-[11px] text-muted-foreground">
              Moderated by 3 verified residents
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-live pulse-live" />
            Live
          </Badge>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Pin className="h-3 w-3" />
              Pinned by Host
            </div>
            <div className="text-xs">
              Floor plans + RERA docs are linked below the player. Ask any question — Anika is
              verifying answers live.
            </div>
          </div>

          {MESSAGES.map((m) => (
            <div key={m.id} className={`rounded-lg p-2.5 ${tierStyles[m.tier]}`}>
              <div className="mb-1 flex items-center gap-1.5">
                <div
                  className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${m.tier === "legend" ? "bg-[var(--gold)] text-[var(--gold-foreground)]" : "bg-secondary"}`}
                >
                  {m.initial}
                </div>
                <span className="text-xs font-semibold">{m.user}</span>
                <TierBadge tier={m.tier} isBroker={m.isBroker} />
                {m.verified && (
                  <Badge className="gap-0.5 bg-primary/10 px-1.5 py-0 text-[9px] text-primary">
                    <ShieldCheck className="h-2.5 w-2.5" />
                    Community Verified
                  </Badge>
                )}
              </div>
              <div className="text-xs leading-relaxed text-foreground">{m.text}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
            <Mic className="h-4 w-4 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Ask the host or residents…"
            />
            <button className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Trolls? Flag for Locality Review →</span>
            <span>Karma +2 for verified questions</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
