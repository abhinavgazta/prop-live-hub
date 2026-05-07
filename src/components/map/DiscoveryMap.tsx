import { useEffect, useMemo, useState } from "react";
import { Layers, Eye, Users, PlayCircle, Box } from "lucide-react";
import {
  MAP_VIEWS,
  TYPE_COLORS,
  type LiveSession,
  type LocalityInsight,
  type MapView,
  type MapViewId,
  type ReplaySession,
  type SessionType,
} from "@/lib/mockMapData";
import { MapLegend, type LegendItem } from "./MapLegend";

// Backwards-compatible Pin type — the home page still passes pins.
export type Pin = {
  id: string;
  lat: number;
  lng: number;
  type: SessionType;
  title: string;
  meta: string;
  viewers?: number;
};

export type LayerToggleId = "live" | "upcoming" | "replay" | "localities" | "boundaries";

export type DiscoveryMapProps = {
  pins?: Pin[];
  liveSessions?: LiveSession[];
  replays?: ReplaySession[];
  localities?: LocalityInsight[];
  onSelectPin?: (p: Pin) => void;
  onSelect?: (p: Pin) => void; // Backwards compatibility alias for onSelectPin
  onSelectLive?: (s: LiveSession) => void;
  onSelectReplay?: (r: ReplaySession) => void;
  onSelectLocality?: (l: LocalityInsight) => void;
  onOpen3D?: (l: LocalityInsight) => void;
  defaultView?: MapViewId;
  defaultEnabled?: Partial<Record<LayerToggleId, boolean>>;
};

export function DiscoveryMap({
  pins = [],
  liveSessions = [],
  replays = [],
  localities = [],
  onSelectPin,
  onSelect, // Backwards compatibility
  onSelectLive,
  onSelectReplay,
  onSelectLocality,
  onOpen3D,
  defaultView = "streets",
  defaultEnabled,
}: DiscoveryMapProps) {
  // Support both onSelect (old) and onSelectPin (new) for backwards compatibility
  const handlePinClick = onSelectPin || onSelect;
  const [MapComponents, setMapComponents] = useState<typeof import("react-leaflet") | null>(null);
  const [activeView, setActiveView] = useState<MapViewId>(defaultView);
  const [layerSwitcherOpen, setLayerSwitcherOpen] = useState(false);
  const [enabled, setEnabled] = useState<Record<LayerToggleId, boolean>>({
    live: defaultEnabled?.live ?? true,
    upcoming: defaultEnabled?.upcoming ?? true,
    replay: defaultEnabled?.replay ?? true,
    localities: defaultEnabled?.localities ?? true,
    boundaries: defaultEnabled?.boundaries ?? true,
  });

  useEffect(() => {
    import("react-leaflet").then((mod) => setMapComponents(mod));
  }, []);

  const currentView: MapView = useMemo(
    () => MAP_VIEWS.find((v) => v.id === activeView) ?? MAP_VIEWS[0],
    [activeView],
  );

  const legendItems: LegendItem[] = useMemo(() => {
    const items: LegendItem[] = [];
    if (enabled.live)
      items.push({
        kind: "dot",
        color: TYPE_COLORS.live,
        pulse: true,
        label: "Live now",
        description: "Concurrent viewers",
      });
    if (enabled.upcoming)
      items.push({
        kind: "dot",
        color: TYPE_COLORS.upcoming,
        label: "Upcoming",
        description: "Scheduled tours",
      });
    if (enabled.replay)
      items.push({
        kind: "dot",
        color: TYPE_COLORS.replay,
        label: "Replays",
        description: "Past sessions",
      });
    if (pins.some((p) => p.type === "property"))
      items.push({
        kind: "dot",
        color: TYPE_COLORS.property,
        label: "Property",
        description: "Listed inventory",
      });
    if (enabled.boundaries)
      items.push({
        kind: "polygon",
        color: "#5E23DC",
        label: "Locality boundary",
        description: "Click to inspect",
      });
    items.push({
      kind: "swatch",
      from: "#0ea5b740",
      to: "#e11d48cc",
      label: "Engagement heat",
      description: "Low → High",
    });
    return items;
  }, [enabled, pins]);

  if (!MapComponents || typeof window === "undefined") {
    return (
      <div className="grid h-full place-items-center text-sm text-muted-foreground">
        Loading map…
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Tooltip, Circle, GeoJSON, useMap, Pane } =
    MapComponents;

  function Resize() {
    const map = useMap();
    useEffect(() => {
      const t = setTimeout(() => map.invalidateSize(), 100);
      return () => clearTimeout(t);
    }, [map]);
    return null;
  }

  const liveByType = liveSessions.filter((s) => s.type === "live");
  const upcomingByType = liveSessions.filter((s) => s.type === "upcoming");

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[28.4595, 77.0266]}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
        style={{ background: currentView.tone === "dark" ? "#0b1020" : "#f6f8fb" }}
      >
        <Resize />
        <TileLayer
          key={currentView.id}
          attribution={currentView.attribution}
          url={currentView.url}
          maxZoom={currentView.maxZoom}
        />

        {/* Locality boundaries — drawn under markers */}
        <Pane name="locality-pane" style={{ zIndex: 350 }}>
          {enabled.boundaries &&
            localities.map((loc) => (
              <GeoJSON
                key={loc.id}
                data={loc.geoJson as GeoJSON.GeoJsonObject}
                style={() => ({
                  color: "#5E23DC",
                  weight: 1.5,
                  fillColor: "#5E23DC",
                  fillOpacity: 0.08 + Math.min(loc.hotness, 100) / 1000,
                  dashArray: "4 3",
                })}
                eventHandlers={{
                  click: () => onSelectLocality?.(loc),
                  mouseover: (e: any) => {
                    e.target.setStyle({ fillOpacity: 0.22, weight: 2.5 });
                  },
                  mouseout: (e: any) => {
                    e.target.setStyle({
                      fillOpacity: 0.08 + Math.min(loc.hotness, 100) / 1000,
                      weight: 1.5,
                    });
                  },
                }}
              >
                <Tooltip direction="center" sticky opacity={0.95}>
                  <div className="text-xs">
                    <div className="font-bold">{loc.name}</div>
                    <div className="text-[10px] opacity-70">
                      {loc.liveSessions} live · {loc.replayCount} replays · ₹{loc.avgPriceCr} Cr avg
                    </div>
                    <div className="mt-0.5 text-[9px] font-semibold text-primary">
                      Click for details
                    </div>
                  </div>
                </Tooltip>
              </GeoJSON>
            ))}
        </Pane>

        {/* Heat glow under live pins */}
        {enabled.live &&
          liveByType.map((s) => (
            <Circle
              key={`heat-${s.id}`}
              center={s.position}
              radius={400 + Math.min(s.viewers, 1500)}
              pathOptions={{
                color: "transparent",
                fillColor: TYPE_COLORS.live,
                fillOpacity: 0.18,
              }}
            />
          ))}

        {/* Heat glow under untyped pins (back-compat) */}
        {pins.map((p) => (
          <Circle
            key={`heat-${p.id}`}
            center={[p.lat, p.lng]}
            radius={p.type === "live" ? 600 : 300}
            pathOptions={{
              color: "transparent",
              fillColor: TYPE_COLORS[p.type],
              fillOpacity: p.type === "live" ? 0.15 : p.type === "property" ? 0.04 : 0.07,
            }}
          />
        ))}

        {/* Live session markers */}
        {enabled.live &&
          liveByType.map((s) => (
            <CircleMarker
              key={s.id}
              center={s.position}
              radius={11}
              pathOptions={{
                color: "white",
                weight: 2,
                fillColor: TYPE_COLORS.live,
                fillOpacity: 1,
                className: "cursor-pointer",
              }}
              eventHandlers={{
                click: () => onSelectLive?.(s),
                mouseover: (e: any) => e.target.setStyle({ fillOpacity: 0.7, weight: 3 }),
                mouseout: (e: any) => e.target.setStyle({ fillOpacity: 1, weight: 2 }),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <div className="text-xs">
                  <div className="font-bold">{s.title}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] opacity-80">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {s.viewers.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" /> {s.joiners.toLocaleString()} joined
                    </span>
                  </div>
                  <div className="mt-0.5 text-[10px] opacity-70">
                    +{s.joiningPerMinute}/min · {s.locality}
                  </div>
                  <div className="mt-1 text-[9px] font-semibold text-primary">Click to join</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

        {/* Upcoming session markers */}
        {enabled.upcoming &&
          upcomingByType.map((s) => (
            <CircleMarker
              key={s.id}
              center={s.position}
              radius={8}
              pathOptions={{
                color: "white",
                weight: 2,
                fillColor: TYPE_COLORS.upcoming,
                fillOpacity: 1,
              }}
              eventHandlers={{
                click: () => onSelectLive?.(s),
                mouseover: (e: any) => e.target.setStyle({ fillOpacity: 0.7, weight: 3 }),
                mouseout: (e: any) => e.target.setStyle({ fillOpacity: 1, weight: 2 }),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <div className="text-xs">
                  <div className="font-bold">{s.title}</div>
                  <div className="mt-0.5 text-[10px] opacity-80">
                    {s.joiners.toLocaleString()} registered · {s.locality}
                  </div>
                  <div className="mt-1 text-[9px] font-semibold text-primary">Set reminder</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

        {/* Replay markers */}
        {enabled.replay &&
          replays.map((r) => (
            <CircleMarker
              key={r.id}
              center={r.position}
              radius={7}
              pathOptions={{
                color: "white",
                weight: 2,
                fillColor: TYPE_COLORS.replay,
                fillOpacity: 0.9,
                dashArray: "1 2",
              }}
              eventHandlers={{
                click: () => onSelectReplay?.(r),
                mouseover: (e: any) => e.target.setStyle({ fillOpacity: 0.7, weight: 3 }),
                mouseout: (e: any) => e.target.setStyle({ fillOpacity: 0.9, weight: 2 }),
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                <div className="text-xs">
                  <div className="font-bold inline-flex items-center gap-1">
                    <PlayCircle className="h-3 w-3" /> {r.title}
                  </div>
                  <div className="mt-0.5 text-[10px] opacity-80">
                    {r.replayViews.toLocaleString()} replays · {r.durationMin}m · {r.locality}
                  </div>
                  <div className="mt-0.5 text-[10px] opacity-70">
                    {r.liveViewers.toLocaleString()} watched live · {r.engagement}% engagement
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

        {/* Locality center pins (compact summary) */}
        {enabled.localities &&
          localities.map((loc) => (
            <CircleMarker
              key={`center-${loc.id}`}
              center={loc.position}
              radius={5}
              pathOptions={{
                color: "white",
                weight: 1.5,
                fillColor: "#5E23DC",
                fillOpacity: 0.85,
              }}
              eventHandlers={{
                click: () => onSelectLocality?.(loc),
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={0.95}>
                <div className="text-[10px] font-semibold">{loc.name}</div>
              </Tooltip>
            </CircleMarker>
          ))}

        {/* Back-compat raw pins */}
        {pins.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={p.type === "live" ? 11 : 8}
            pathOptions={{
              color: "white",
              weight: 2,
              fillColor: TYPE_COLORS[p.type],
              fillOpacity: 1,
            }}
            eventHandlers={{
              click: () => handlePinClick?.(p),
              mouseover: (e: any) => e.target.setStyle({ fillOpacity: 0.7, weight: 3 }),
              mouseout: (e: any) => e.target.setStyle({ fillOpacity: 1, weight: 2 }),
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <div className="text-xs">
                <div className="font-bold">{p.title}</div>
                <div className="text-[10px] opacity-70">{p.meta}</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Layer / view-type switcher */}
      <div className="pointer-events-auto absolute right-3 top-3 z-[1000]">
        <button
          onClick={() => setLayerSwitcherOpen((v) => !v)}
          className="glass flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elegant)]"
        >
          <Layers className="h-3.5 w-3.5" />
          {currentView.label}
        </button>
        {layerSwitcherOpen && (
          <div className="glass mt-2 w-[210px] rounded-xl p-2 shadow-[var(--shadow-elegant)]">
            <div className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Map style
            </div>
            <div className="grid grid-cols-2 gap-1">
              {MAP_VIEWS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setActiveView(v.id);
                    setLayerSwitcherOpen(false);
                  }}
                  className={`rounded-lg px-2 py-1.5 text-left text-[11px] transition ${
                    activeView === v.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/60 hover:bg-secondary"
                  }`}
                >
                  <div className="font-semibold">{v.label}</div>
                  <div
                    className={`text-[9px] leading-tight ${
                      activeView === v.id ? "opacity-80" : "text-muted-foreground"
                    }`}
                  >
                    {v.description}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-2 border-t border-border pt-2">
              <div className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Overlays
              </div>
              <div className="space-y-1">
                {(
                  [
                    ["live", "Live sessions"],
                    ["upcoming", "Upcoming"],
                    ["replay", "Replays"],
                    ["localities", "Locality pins"],
                    ["boundaries", "Boundaries"],
                  ] as Array<[LayerToggleId, string]>
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center justify-between rounded-md px-1 py-0.5 text-[11px] hover:bg-secondary/60"
                  >
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={enabled[key]}
                      onChange={(e) => setEnabled((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="h-3 w-3 accent-[var(--primary)]"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live count chip */}
      <div className="pointer-events-none absolute left-3 top-3 z-[1000] flex flex-col gap-2">
        <div className="glass pointer-events-auto rounded-xl px-3 py-2 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--live)] opacity-70" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--live)]" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {liveByType.length} live now
            </span>
          </div>
          <div className="mt-1 text-base font-bold leading-tight">
            {liveByType.reduce((sum, s) => sum + s.viewers, 0).toLocaleString()} watching
          </div>
          <div className="text-[10px] text-muted-foreground">
            +{liveByType.reduce((sum, s) => sum + s.joiningPerMinute, 0)}
            /min joining
          </div>
        </div>
        {onOpen3D && localities.length > 0 && (
          <button
            onClick={() =>
              onOpen3D(
                localities.reduce((top, l) => (l.hotness > top.hotness ? l : top), localities[0]),
              )
            }
            className="glass pointer-events-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elegant)]"
          >
            <Box className="h-3.5 w-3.5" />
            Open 3D view
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000]">
        <MapLegend items={legendItems} tone={currentView.tone} />
      </div>

      {/* Coords */}
      <div className="pointer-events-none absolute bottom-3 right-3 z-[1000]">
        <div className="glass pointer-events-auto rounded-xl px-3 py-2 text-[10px] text-muted-foreground">
          Gurgaon · 28.46°N 77.03°E
        </div>
      </div>
    </div>
  );
}
