import { useState, useEffect, useRef } from "react";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  Star,
  Building2,
  TrendingUp,
  Eye,
  ChevronRight,
  MapPin,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { DiscoveryMap, Pin } from "@/components/map/DiscoveryMap";
import { Suspense } from "react";
import { searchLocality, formatLocationName, type GeocodingResult } from "@/lib/geocoding";
import { mockReplaySessions } from "@/lib/mockMapData";
import {
  FILTER_OPTIONS,
  filterProperties,
  getAllProperties,
  registerForEvent,
  isUserRegistered,
  type Property,
} from "@/lib/property-data";
import { getLiveBroadcast } from "@/lib/live-broadcast";

const Map = DiscoveryMap;

function getEventDetailRoute(
  property: Property,
  dashboard: "demand" | "seller",
): `/demand/event-detail` | `/seller/event-detail` | `/demand/prelaunch` | `/seller/prelaunch` {
  const normalizedType = property.eventType?.toLowerCase().replace(/\s+/g, "-");
  const isPrelaunch =
    normalizedType === "prelaunch" ||
    normalizedType === "pre-launch" ||
    normalizedType === "launch-event";

  if (isPrelaunch) {
    return `/${dashboard}/prelaunch` as `/demand/prelaunch` | `/seller/prelaunch`;
  }

  return `/${dashboard}/event-detail` as `/demand/event-detail` | `/seller/event-detail`;
}

// Convert property data to pins for the map
function propertyToPins(properties: Property[]): Pin[] {
  return properties.map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    type: p.type,
    title: p.title,
    meta:
      p.type === "live"
        ? `${p.viewers?.toLocaleString()} watching · ${p.sector}`
        : p.type === "upcoming"
          ? p.liveDate || "Coming soon"
          : `${p.propertyType} · ${p.priceDisplay}`,
    viewers: p.viewers,
  }));
}

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

export function DiscoverHeader({
  propertyCount,
}: {
  propertyCount: { live: number; upcoming: number; total: number };
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-live pulse-live" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {propertyCount.live} events live in Gurgaon
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Discover properties live.</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Live property tours, virtual walkthroughs and verified resident insights — explore homes
          on the map, ranked by community trust.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <StatPill label="Live Now" value={propertyCount.live.toString()} tone="live" />
        <StatPill label="This Week" value={propertyCount.upcoming.toString()} />
        <StatPill label="Properties" value={propertyCount.total.toString()} tone="gold" />
      </div>
    </div>
  );
}

export function DiscoverFilters({
  activeFilters,
  setActiveFilters,
  searchQuery,
  setSearchQuery,
  onLocationSelect,
}: {
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLocationSelect?: (lat: number, lng: number, name: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        const results = await searchLocality(searchQuery);
        setSuggestions(results);
        setShowSuggestions(true);
        setIsSearching(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      setActiveFilters(activeFilters.filter((f) => f !== filterId));
    } else {
      setActiveFilters([...activeFilters, filterId]);
    }
  };

  const handleSuggestionClick = (suggestion: GeocodingResult) => {
    const locationName = formatLocationName(suggestion);
    setSearchQuery(locationName);
    setShowSuggestions(false);
    if (onLocationSelect) {
      onLocationSelect(parseFloat(suggestion.lat), parseFloat(suggestion.lon), locationName);
    }
  };

  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1" ref={searchRef}>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 shadow-[var(--shadow-soft)]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search Sector 84, Golf Course Road, Gurgaon…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full z-50 mt-2 w-full rounded-xl border border-border bg-card shadow-[var(--shadow-elegant)]">
            <div className="max-h-64 overflow-y-auto p-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={`${suggestion.lat}-${suggestion.lon}-${idx}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-secondary"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{formatLocationName(suggestion)}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {suggestion.display_name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {isSearching && (
          <div className="absolute top-full z-50 mt-2 w-full rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground shadow-[var(--shadow-elegant)]">
            Searching locations...
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {FILTER_OPTIONS.map((filter) => {
          const isActive = activeFilters.includes(filter.id);
          return (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LiveCard({
  property,
  dashboard,
}: {
  property: Property;
  dashboard: "demand" | "seller";
}) {
  const to = getEventDetailRoute(property, dashboard);
  const isLive = property.type === "live";

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
          {isLive && (
            <>
              <Badge className="absolute left-1.5 top-1.5 gap-1 bg-live px-1.5 py-0 text-[9px]">
                <span className="h-1 w-1 rounded-full bg-white" />
                LIVE
              </Badge>
              <div className="absolute bottom-1 right-1.5 inline-flex items-center gap-0.5 text-[9px] font-bold text-white">
                <Eye className="h-2.5 w-2.5" />
                {property.viewers?.toLocaleString()}
              </div>
            </>
          )}
          {!isLive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white/80" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{property.title}</div>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">{property.location}</div>
          <div className="mt-1.5 flex items-center gap-1.5">
            {property.verified && (
              <Badge variant="secondary" className="gap-1 px-1.5 py-0 text-[9px]">
                <Star className="h-2.5 w-2.5 fill-[var(--gold)] text-[var(--gold)]" />
                Verified
              </Badge>
            )}
            <Badge variant="outline" className="px-1.5 py-0 text-[9px]">
              {property.priceDisplay}
            </Badge>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  );
}

export function DiscoverMapSection({
  pins,
  onPinClick,
  onReplayClick,
}: {
  pins: Pin[];
  onPinClick?: (pin: Pin) => void;
  onReplayClick?: () => void;
}) {
  return (
    <div className="relative h-[560px] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <Suspense
        fallback={
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            Loading map…
          </div>
        }
      >
        <Map
          pins={pins}
          replays={mockReplaySessions}
          onSelect={onPinClick}
          onSelectReplay={onReplayClick}
        />
      </Suspense>

      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
        <div className="glass pointer-events-auto rounded-xl px-3 py-2 shadow-[var(--shadow-soft)]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Property Heat
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
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
            Replays
          </span>
        </div>
        <div className="glass pointer-events-auto rounded-xl px-3 py-2 text-xs text-muted-foreground">
          Gurgaon · 28.46°N 77.03°E
        </div>
      </div>
    </div>
  );
}

// Main DiscoverContent component
export default function DiscoverContent({ dashboard }: { dashboard: "demand" | "seller" }) {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  const SYNTHETIC_LIVE_ID = "__live_broadcast__";

  // Load properties from localStorage
  useEffect(() => {
    const loadProperties = async () => {
      let liveEventId: string | null = null;
      try {
        const live = await getLiveBroadcast();
        if (live?.eventId && typeof window !== "undefined") {
          localStorage.setItem("proplive_live_event_id", live.eventId);
          liveEventId = live.eventId;
        } else if (typeof window !== "undefined") {
          localStorage.removeItem("proplive_live_event_id");
        }
      } catch (err) {
        console.error("Failed to fetch live broadcast:", err);
      }
      const properties = await getAllProperties();
      // If broadcast active but no events in localStorage, inject synthetic live card
      if (liveEventId && properties.length === 0) {
        properties.push({
          id: SYNTHETIC_LIVE_ID,
          title: "Live Property Tour",
          developer: "PropLive Host",
          location: "Sector 65, Gurgaon",
          sector: "Sector 65",
          city: "Gurgaon",
          lat: 28.4646,
          lng: 77.0266,
          type: "live",
          propertyType: "3BHK",
          price: 3,
          priceDisplay: "₹3 Cr",
          viewers: 1,
          status: "under-construction",
          verified: true,
        });
      }
      setAllProperties(properties);
    };

    loadProperties();

    const poll = setInterval(loadProperties, 3000);

    // Listen for storage and custom events
    const handleUpdate = () => {
      loadProperties();
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("proplive_event_created", handleUpdate);
    window.addEventListener("proplive_registration_changed", handleUpdate);

    return () => {
      clearInterval(poll);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("proplive_event_created", handleUpdate);
      window.removeEventListener("proplive_registration_changed", handleUpdate);
    };
  }, []);

  // Filter properties based on search and active filters
  const filteredProperties = filterProperties(allProperties, activeFilters, searchQuery);

  // Convert to pins for the map
  const pins = propertyToPins(filteredProperties);

  // Calculate statistics
  const stats = {
    live: allProperties.filter((p) => p.type === "live").length,
    upcoming: allProperties.filter((p) => p.type === "upcoming").length,
    total: allProperties.length,
  };

  // Handle pin click on map
  const handlePinClick = (pin: Pin) => {
    // Find the full property data
    const property = allProperties.find((p) => p.id === pin.id);
    if (!property) return;

    // Navigate based on property type
    if (property.type === "live" || property.type === "upcoming") {
      navigate({ to: getEventDetailRoute(property, dashboard) });
    } else {
      // For regular properties, navigate to discover page with search for that property
      // You could also create a property detail page in the future
      navigate({ to: `/${dashboard}/live` });
    }
  };

  // Handle replay click on map
  const handleReplayClick = () => {
    navigate({ to: `/${dashboard}/replay` });
  };

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <DiscoverHeader propertyCount={stats} />
      <DiscoverFilters
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <DiscoverMapSection
          pins={pins}
          onPinClick={handlePinClick}
          onReplayClick={handleReplayClick}
        />
        <DiscoverSidebar
          properties={filteredProperties}
          dashboard={dashboard}
          onPropertyUpdate={() => {
            const loadProperties = async () => {
              const properties = await getAllProperties();
              setAllProperties(properties);
            };
            loadProperties();
          }}
        />
      </div>
    </div>
  );
}

export function DiscoverSidebar({
  properties,
  dashboard,
  onPropertyUpdate,
}: {
  properties: Property[];
  dashboard: "demand" | "seller";
  onPropertyUpdate?: () => void;
}) {
  const liveProperties = properties.filter((p) => p.type === "live").slice(0, 3);
  const upcoming = properties.filter((p) => p.type === "upcoming").slice(0, 3);
  const allUpcoming = properties.filter((p) => p.type === "upcoming");

  const handleRegister = (eventId: string) => {
    const success = registerForEvent(eventId);
    if (success && onPropertyUpdate) {
      onPropertyUpdate();
    }
  };

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
      {liveProperties.length > 0 ? (
        liveProperties.map((property) => (
          <LiveCard key={property.id} property={property} dashboard={dashboard} />
        ))
      ) : (
        <div className="rounded-2xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
          No live tours right now
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal" />
              <h3 className="text-sm font-bold">Upcoming Tours</h3>
            </div>
            {allUpcoming.length > 3 && (
              <Link
                to={`/${dashboard}/my-events`}
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all ({allUpcoming.length})
              </Link>
            )}
          </div>
          <div className="space-y-3">
            {upcoming.map((property) => {
              const isRegistered = isUserRegistered(property.id);
              const registrationText = property.maxAttendees
                ? `${property.registeredCount || 0}/${property.maxAttendees}`
                : `${property.registeredCount || 0} registered`;
              const detailRoute = getEventDetailRoute(property, dashboard);

              return (
                <div key={property.id} className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal/10 text-teal">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <div className="truncate text-sm font-semibold">{property.title}</div>
                      {isRegistered && (
                        <Badge
                          variant="secondary"
                          className="shrink-0 bg-emerald-500/10 text-emerald-600"
                        >
                          ✓ Registered
                        </Badge>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{property.sector}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {property.liveDate || property.location}
                    </div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">
                      {registrationText}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`http://localhost:8080${detailRoute}`}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      View more
                    </a>
                    <Button
                      size="sm"
                      variant={isRegistered ? "ghost" : "outline"}
                      className={
                        isRegistered
                          ? "h-7 cursor-default px-2 text-[11px] text-muted-foreground"
                          : "h-7 px-2 text-[11px]"
                      }
                      onClick={() => !isRegistered && handleRegister(property.id)}
                      disabled={isRegistered}
                    >
                      {isRegistered ? "✓" : "Register"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        className="rounded-2xl border border-border p-4 text-primary-foreground"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80">
          <TrendingUp className="h-3.5 w-3.5" />
          Hot sector this week
        </div>
        <div className="mt-2 text-2xl font-bold">Sector 84</div>
        <div className="text-xs opacity-80">
          {properties.filter((p) => p.sector.includes("84")).length} properties · High demand
        </div>
        <a
          href="https://housing.com/sector-84-gurgaon-overview-P3vidvqx6uu31gzb4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="sm" variant="secondary" className="mt-3 h-8 w-full text-xs">
            Explore Sector 84
          </Button>
        </a>
      </div>
    </aside>
  );
}
