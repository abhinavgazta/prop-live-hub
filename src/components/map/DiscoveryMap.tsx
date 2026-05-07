import { useEffect, useState } from "react";

export type Pin = {
  id: string;
  lat: number;
  lng: number;
  type: "live" | "upcoming" | "property";
  title: string;
  meta: string;
  viewers?: number;
};

export function DiscoveryMap({ pins, onSelect }: { pins: Pin[]; onSelect?: (p: Pin) => void }) {
  const [MapComponents, setMapComponents] = useState<typeof import("react-leaflet") | null>(null);

  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setMapComponents(mod);
    });
  }, []);

  if (!MapComponents || typeof window === "undefined") {
    return (
      <div className="grid h-full place-items-center text-sm text-muted-foreground">
        Loading map…
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Tooltip, Circle, useMap } = MapComponents;

  function HeatGlow({ pins }: { pins: Pin[] }) {
    return (
      <>
        {pins.map((p) => (
          <Circle
            key={`heat-${p.id}`}
            center={[p.lat, p.lng]}
            radius={p.type === "live" ? 600 : 300}
            pathOptions={{
              color: "transparent",
              fillColor:
                p.type === "live" ? "#e11d48" : p.type === "upcoming" ? "#0ea5b7" : "#3b5fbf",
              fillOpacity: p.type === "live" ? 0.18 : 0.08,
            }}
          />
        ))}
      </>
    );
  }

  function Resize() {
    const map = useMap();
    useEffect(() => {
      const t = setTimeout(() => map.invalidateSize(), 100);
      return () => clearTimeout(t);
    }, [map]);
    return null;
  }

  return (
    <MapContainer
      center={[28.4595, 77.0266]}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "#f6f8fb" }}
    >
      <Resize />
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <HeatGlow pins={pins} />
      {pins.map((p) => {
        const color = p.type === "live" ? "#e11d48" : p.type === "upcoming" ? "#0ea5b7" : "#5E23DC";
        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={p.type === "live" ? 11 : 8}
            pathOptions={{
              color: "white",
              weight: 2,
              fillColor: color,
              fillOpacity: 1,
              className: "cursor-pointer",
            }}
            eventHandlers={{
              click: () => onSelect?.(p),
              mouseover: (e) => {
                const target = e.target;
                target.setStyle({ fillOpacity: 0.7, weight: 3 });
              },
              mouseout: (e) => {
                const target = e.target;
                target.setStyle({ fillOpacity: 1, weight: 2 });
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <div className="cursor-pointer text-xs">
                <div className="font-bold">{p.title}</div>
                <div className="text-[10px] opacity-70">{p.meta}</div>
                <div className="mt-1 text-[9px] font-semibold text-primary">Click to view</div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
