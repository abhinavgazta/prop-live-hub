import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { MapPin, Radio, PlayCircle, ShieldCheck, BarChart3, Plus, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: typeof MapPin;
  live?: boolean;
  highlight?: boolean;
};

const demandNav: NavItem[] = [
  { to: "/demand", label: "Discover", icon: MapPin },
  { to: "/demand/live", label: "Live Room", icon: Radio, live: true },
  { to: "/demand/replay", label: "Replays", icon: PlayCircle },
];

const sellerNav: NavItem[] = [
  { to: "/seller", label: "Discover", icon: MapPin },
  { to: "/seller/my-events", label: "My Events", icon: ListChecks },
  { to: "/seller/live", label: "Live Room", icon: Radio, live: true },
  { to: "/seller/replay", label: "Replays", icon: PlayCircle },
  { to: "/seller/reputation", label: "Reputation", icon: ShieldCheck },
  { to: "/seller/host", label: "Host", icon: BarChart3 },
  { to: "/seller/create-event", label: "Create Event", icon: Plus, highlight: true },
];

export function AppShell() {
  const { pathname } = useLocation();
  const isSeller = pathname.startsWith("/seller");
  const isDemand = pathname.startsWith("/demand");

  const nav = isSeller ? sellerNav : isDemand ? demandNav : demandNav;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
          <Link to={isSeller ? "/seller" : "/demand"} className="flex items-center gap-2.5">
            <div
              className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground shadow-[var(--shadow-elegant)]"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Radio className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-bold tracking-tight">
                PropLive {isSeller ? "· Seller" : isDemand ? "· Demand" : ""}
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Hyper-local · Gurgaon
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? n.highlight
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                      : n.highlight
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                  {n.live && (
                    <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-live pulse-live" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 md:flex">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Karma
              </span>
              <span className="text-sm font-bold text-primary">1,284</span>
            </div>
            <div className="relative">
              <div
                className="h-9 w-9 rounded-full ring-2 ring-[var(--gold)] ring-offset-2 ring-offset-background"
                style={{ background: "var(--gradient-primary)" }}
              />
              <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-[var(--gold)] text-[8px] font-black text-[var(--gold-foreground)] ring-2 ring-background">
                L
              </span>
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-2 py-2 md:hidden">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium",
                  active
                    ? n.highlight
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                    : n.highlight
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground",
                )}
              >
                <n.icon className="h-3.5 w-3.5" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-[1400px]">
        <Outlet />
      </main>
    </div>
  );
}
