import { ArrowRight, Sparkles, Rocket, MapPinned, TrendingUp, Receipt, MicVocal, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  {
    title: "Pre-Launch Pricing Access",
    desc: "Unlock first phase pricing before public launch release.",
    icon: Rocket,
  },
  {
    title: "Best Unit Intelligence",
    desc: "Know which towers, views and stacks smart buyers target first.",
    icon: Building2,
  },
  {
    title: "Future Growth Reveal",
    desc: "See upcoming roads, metro impact and appreciation hotspots.",
    icon: MapPinned,
  },
  {
    title: "Rental Demand Forecast",
    desc: "Understand future tenant demand and investor potential.",
    icon: TrendingUp,
  },
  {
    title: "Hidden Cost Breakdown",
    desc: "Maintenance, IFMS, parking and real ownership costs explained.",
    icon: Receipt,
  },
  {
    title: "Live Transparency Q&A",
    desc: "Direct answers from builder team with no scripted pitch.",
    icon: MicVocal,
  },
];

export function PrelaunchTemplate({ dashboard }: { dashboard: "demand" | "seller" }) {
  const cta = dashboard === "seller" ? "Host Pre-Launch Event" : "Reserve Launch Access";

  return (
    <div className="space-y-6 px-4 py-6 md:px-8 md:py-8">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)] md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-52 w-52 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div>
            <Badge className="mb-3 gap-1 bg-primary/10 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Exclusive Pre-Launch Event
            </Badge>
            <h1 className="text-3xl font-black tracking-tight md:text-5xl">
              Get in early, before public demand spikes.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              Private access to pricing intelligence, future growth signals, and strategic unit picks
              before broad market release.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button className="gap-2">
                {cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline">View Event Teaser</Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Event Unlocks
            </div>
            <div className="mt-3 space-y-3">
              <div>
                <div className="text-[11px] text-muted-foreground">Launch Window</div>
                <div className="text-2xl font-black">First 48 Hrs</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Priority Inventory</div>
                <div className="text-2xl font-black">Tower Selection</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Access Type</div>
                <div className="text-2xl font-black">Invite Only</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            What You Gain Inside
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">
            Intelligence that usually comes too late.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:border-primary/40"
            >
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
