import {
  Building2,
  MapPin,
  TrainFront,
  TrendingUp,
  ArrowRight,
  Users,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Topic = {
  title: string;
  icon: typeof Building2;
  points: string[];
  value: number;
};

const TOPICS: Topic[] = [
  {
    title: "Live Project Tour",
    icon: Building2,
    points: [
      "Tower walkthrough",
      "Construction status",
      "Sample flat live demo",
      "Amenities showcase",
    ],
    value: 90,
  },
  {
    title: "Locality Insights",
    icon: MapPin,
    points: ["Schools & hospitals", "Traffic analysis", "Daily convenience", "Safety & livability"],
    value: 78,
  },
  {
    title: "Infrastructure & Master Plan",
    icon: TrainFront,
    points: ["Metro connectivity", "Upcoming highways", "Commercial hubs", "Government plans"],
    value: 72,
  },
  {
    title: "Rental ROI Trends",
    icon: TrendingUp,
    points: ["Current rental demand", "Yield comparison", "Future rent forecast", "Tenant profile"],
    value: 84,
  },
];

const DECISION_METRICS = [
  { label: "Rental Demand", value: 85 },
  { label: "Connectivity", value: 72 },
  { label: "Future Growth", value: 90 },
  { label: "Affordability", value: 68 },
  { label: "Lifestyle Score", value: 80 },
];

const FUNNEL = [
  { label: "Registrations", value: "2,450", width: 100 },
  { label: "Live Attendees", value: "1,720", width: 74 },
  { label: "Site Visits", value: "520", width: 32 },
  { label: "Bookings", value: "88", width: 16 },
];

export function LiveTourTemplate({ dashboard }: { dashboard: "demand" | "seller" }) {
  const ctaLabel = dashboard === "seller" ? "Host This Event" : "Join Live Event";
  const badgeLabel = dashboard === "seller" ? "Organizer View" : "Buyer View";

  return (
    <div className="space-y-6 px-4 py-6 md:px-8 md:py-8">
      <section
        className="overflow-hidden rounded-3xl border border-border p-6 text-primary-foreground shadow-[var(--shadow-elegant)] md:p-8"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <Badge className="mb-3 gap-1 bg-white/20 text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-live pulse-live" />
              Event Detail
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Why this virtual event is worth attending
            </h1>
            <p className="mt-2 text-sm text-white/90 md:text-base">
              Get high-confidence buying signals through live walkthroughs, locality intelligence,
              infrastructure outlook, and ROI context before you plan your site visit.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="glass rounded-2xl px-4 py-3 text-center">
              <div className="text-2xl font-black text-foreground">4</div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Core Themes
              </div>
            </div>
            <div className="glass rounded-2xl px-4 py-3 text-center">
              <div className="text-2xl font-black text-foreground">92%</div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Avg Interest
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Buyer Decision Parameters</h2>
            <Badge variant="secondary">{badgeLabel}</Badge>
          </div>
          <div className="space-y-3">
            {DECISION_METRICS.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold">{item.value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal to-primary"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-bold">Event Funnel</h2>
          <div className="mt-4 space-y-3">
            {FUNNEL.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${item.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-secondary p-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Conversion</div>
            <div className="text-2xl font-black text-primary">5.1%</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {TOPICS.map((topic) => (
          <article
            key={topic.title}
            className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition hover:border-primary/40"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <topic.icon className="h-5 w-5" />
              </div>
              <Badge variant="outline">{topic.value}% Value</Badge>
            </div>
            <h3 className="text-base font-bold">{topic.title}</h3>
            <div className="mt-2 space-y-1.5">
              {topic.points.map((point) => (
                <div key={point} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Audience Interest</span>
                <span className="font-semibold">{topic.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-teal"
                  style={{ width: `${topic.value}%` }}
                />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">What attendees gain from this event</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Clarity on product quality, locality future-readiness, and rental performance so they
              can shortlist confidently.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1">
                <Users className="h-3.5 w-3.5 text-primary" />
                1,720 live attendees
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1">
                <Calendar className="h-3.5 w-3.5 text-teal" />
                Thu 7:00 PM IST
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Verified host + resident panel
              </span>
            </div>
          </div>
          <Button className="gap-2">
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
