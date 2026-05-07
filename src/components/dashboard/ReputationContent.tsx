import {
  Sparkles,
  ShieldCheck,
  Trophy,
  Lock,
  BadgeCheck,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ReputationContent() {
  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      {/* Profile card */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="relative h-32" style={{ background: "var(--gradient-primary)" }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.2),transparent_60%)]" />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end justify-between gap-4">
            <div
              className="grid h-24 w-24 place-items-center rounded-2xl text-3xl font-black text-[var(--gold-foreground)] shadow-[var(--shadow-elegant)] ring-4 ring-card"
              style={{ background: "var(--gold)" }}
            >
              A
            </div>
            <div className="flex gap-2 pb-2">
              <Button variant="outline" size="sm">
                Message
              </Button>
              <Button size="sm" className="gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Follow
              </Button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Anika Sharma</h1>
            <Badge className="gap-1 bg-[var(--gold)] px-2 py-0.5 text-xs text-[var(--gold-foreground)]">
              <Sparkles className="h-3 w-3" />
              Locality Legend
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <BadgeCheck className="h-3 w-3 text-primary" />
              Verified Resident · 4 yrs
            </Badge>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Sector 65, Gurgaon · M3M Golf Estate · Moderates Sector 84 & 76
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Events Moderated", value: "84", icon: Trophy, tone: "gold" },
              { label: "Insights Verified", value: "412", icon: ShieldCheck, tone: "primary" },
              { label: "Karma / Trust", value: "12,840", icon: TrendingUp, tone: "teal" },
              { label: "Avg. Rating", value: "4.92", icon: Star, tone: "gold" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-background p-4">
                <div
                  className={`mb-2 inline-grid h-8 w-8 place-items-center rounded-lg ${s.tone === "gold" ? "bg-[var(--gold)]/15 text-[var(--gold-foreground)]" : s.tone === "teal" ? "bg-teal/15 text-teal" : "bg-primary/10 text-primary"}`}
                >
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
                <div className="text-2xl font-bold leading-tight">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Badges */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Reputation Tiers
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                name: "Silver Resident",
                desc: "Verified address, 1 yr+",
                grad: "from-[var(--silver)]/40 to-[var(--silver)]/10",
                earned: true,
              },
              {
                name: "Gold Insider",
                desc: "25 verified insights",
                grad: "from-[var(--gold)]/40 to-[var(--gold)]/10",
                earned: true,
              },
              {
                name: "Locality Legend",
                desc: "Top 1% of community",
                grad: "from-[var(--gold)] to-[oklch(0.7_0.18_60)]",
                earned: true,
                special: true,
              },
            ].map((b) => (
              <div
                key={b.name}
                className={`rounded-xl border border-border bg-gradient-to-br ${b.grad} p-4 ${b.special ? "ring-2 ring-[var(--gold)]" : ""}`}
              >
                <Sparkles
                  className={`mb-2 h-5 w-5 ${b.special ? "text-[var(--gold-foreground)]" : "text-foreground"}`}
                />
                <div className="text-sm font-bold">{b.name}</div>
                <div className="text-[11px] text-muted-foreground">{b.desc}</div>
              </div>
            ))}
          </div>

          <h2 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Recent Verified Insights
          </h2>
          <div className="space-y-2">
            {[
              {
                proj: "M3M Golf Estate",
                line: "Noise Level Analysis · 38 dB master bedroom",
                up: 184,
              },
              {
                proj: "DLF Privana South",
                line: "Tower placement vs. evening sun — east-facing wins",
                up: 142,
              },
              { proj: "Sobha City", line: "Society maintenance hike pattern over 3 years", up: 98 },
            ].map((i) => (
              <div
                key={i.line}
                className="flex items-center justify-between rounded-xl border border-border bg-background p-3"
              >
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">{i.proj}</div>
                  <div className="text-sm font-medium">{i.line}</div>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  {i.up}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Paywall + Broker view */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border-2 border-[var(--gold)]/40 bg-card shadow-[var(--shadow-elegant)]">
            <div className="bg-gradient-to-br from-[var(--gold)]/20 to-transparent p-5">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--gold-foreground)]">
                <Lock className="h-3 w-3" />
                Legend Exclusive
              </div>
              <h3 className="text-lg font-bold leading-tight">Deep-Dive Report on Sector 84</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                42-page breakdown: builder track records, true loaded SBA, traffic and water audit.
                Updated weekly.
              </p>
            </div>
            <div className="border-t border-border p-4">
              <div className="mb-3 flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold">₹99</div>
                  <div className="text-[11px] text-muted-foreground">or 10 PropLive Tokens</div>
                </div>
                <div className="text-right text-[11px] text-muted-foreground">
                  <div>1,284 unlocked</div>
                  <div>★ 4.94 / 5</div>
                </div>
              </div>
              <Button className="w-full gap-2">
                <Lock className="h-3.5 w-3.5" />
                Unlock Report
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold">Broker Ranking — Sector 65</h3>
              <Badge variant="outline" className="text-[10px]">
                Top 5
              </Badge>
            </div>
            <div className="space-y-2">
              {[
                { name: "DLF Direct", attend: "1,128", eng: 92, rera: true },
                { name: "M3M Sales", attend: "894", eng: 87, rera: true },
                { name: "Sobha Realty", attend: "612", eng: 71, rera: true },
              ].map((b, i) => (
                <div
                  key={b.name}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-xs font-bold">
                    #{i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-sm font-semibold">
                      {b.name}
                      {b.rera && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {b.attend} avg attendance · Engagement {b.eng}
                    </div>
                  </div>
                  <div className="h-8 w-16 overflow-hidden rounded bg-secondary">
                    <div className="h-full rounded bg-primary" style={{ width: `${b.eng}%` }} />
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
