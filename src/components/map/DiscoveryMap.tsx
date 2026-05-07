import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  Circle,
  useMap,
  Polygon,
  Polyline,
  Marker,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { School, Hospital, ShoppingBag, TreePine, MapPin, Info } from "lucide-react";
import { renderToString } from "react-dom/server";

// Fixing leaflet icon issue
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "leaflet-gesture-handling";

export type Pin = {
  id: string;
  lat: number;
  lng: number;
  type: "live" | "upcoming" | "property";
  title: string;
  meta: string;
  viewers?: number;
};

type POI = {
  id: string;
  lat: number;
  lng: number;
  type: "school" | "hospital" | "mall" | "park";
  name: string;
};

const POI_DATA: POI[] = [
  { id: "p1", type: "school", name: "DPS International", lat: 28.415, lng: 77.065 },
  { id: "p2", type: "hospital", name: "Medanta - The Medicity", lat: 28.442, lng: 77.042 },
  { id: "p3", type: "mall", name: "Ambience Mall Gurgaon", lat: 28.503, lng: 77.097 },
  { id: "p4", type: "park", name: "Leisure Valley Park", lat: 28.469, lng: 77.065 },
  { id: "p5", type: "school", name: "The Heritage School", lat: 28.435, lng: 77.095 },
  { id: "p6", type: "hospital", name: "Fortis Memorial", lat: 28.459, lng: 77.072 },
];

const SECTORS = [
  {
    name: "Sector 65",
    color: "#e11d48",
    bounds: [
      [28.41, 77.06],
      [28.42, 77.06],
      [28.42, 77.075],
      [28.41, 77.075],
    ] as [number, number][],
  },
  {
    name: "Sector 84",
    color: "#0ea5b7",
    bounds: [
      [28.395, 76.94],
      [28.41, 76.94],
      [28.41, 76.96],
      [28.395, 76.96],
    ] as [number, number][],
  },
  {
    name: "Sector 76",
    color: "#3b5fbf",
    bounds: [
      [28.425, 77.055],
      [28.44, 77.055],
      [28.44, 77.07],
      [28.425, 77.07],
    ] as [number, number][],
  },
  {
    name: "Sector 54",
    color: "#8b5cf6",
    bounds: [
      [28.435, 77.1],
      [28.45, 77.1],
      [28.45, 77.115],
      [28.435, 77.115],
    ] as [number, number][],
  },
  {
    name: "Sector 29",
    color: "#f59e0b",
    bounds: [
      [28.465, 77.06],
      [28.475, 77.06],
      [28.475, 77.075],
      [28.465, 77.075],
    ] as [number, number][],
  },
];

// Mock property lines for a few pins
const PROPERTY_LINES = [
  {
    pinId: "1",
    path: [
      [28.464, 77.026],
      [28.4652, 77.026],
      [28.4652, 77.0272],
      [28.464, 77.0272],
      [28.464, 77.026],
    ] as [number, number][],
  },
];

export function DiscoveryMap({ pins, onSelect }: { pins: Pin[]; onSelect?: (p: Pin) => void }) {
  const [showPOIs, setShowPOIs] = useState(true);

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

  const createCustomIcon = (type: POI["type"]) => {
    const color =
      type === "school"
        ? "#8b5cf6"
        : type === "hospital"
          ? "#ef4444"
          : type === "mall"
            ? "#f59e0b"
            : "#10b981";
    const iconMap = {
      school: <School size={16} color="white" />,
      hospital: <Hospital size={16} color="white" />,
      mall: <ShoppingBag size={16} color="white" />,
      park: <TreePine size={16} color="white" />,
    };

    return L.divIcon({
      html: `<div style="background-color: ${color}; padding: 6px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
      ${renderToString(iconMap[type])}
    </div>`,
      className: "custom-poi-icon",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  if (typeof window === "undefined") {
    return <div className="h-full w-full bg-[#f6f8fb]" />;
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[28.4595, 77.0266]}
        zoom={12}
        scrollWheelZoom={false}
        gestureHandling={true}
        className="h-full w-full"
        style={{ background: "#f6f8fb" }}
      >
        <Resize />

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Light Map">
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution="&copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="Sectors">
            <LayerGroup>
              {SECTORS.map((s) => (
                <Polygon
                  key={s.name}
                  positions={s.bounds}
                  pathOptions={{
                    color: s.color,
                    fillColor: s.color,
                    fillOpacity: 0.1,
                    weight: 2,
                    dashArray: "5, 10",
                  }}
                >
                  <Tooltip
                    permanent
                    direction="center"
                    className="bg-transparent border-none shadow-none text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60"
                  >
                    {s.name}
                  </Tooltip>
                </Polygon>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Points of Interest">
            <LayerGroup>
              {POI_DATA.map((poi) => (
                <Marker
                  key={poi.id}
                  position={[poi.lat, poi.lng]}
                  icon={createCustomIcon(poi.type)}
                >
                  <Tooltip direction="top" offset={[0, -10]}>
                    <div className="text-xs font-semibold">{poi.name}</div>
                    <div className="text-[10px] opacity-70 capitalize">{poi.type}</div>
                  </Tooltip>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        <HeatGlow pins={pins} />

        {/* Property Lines / Boundaries */}
        {PROPERTY_LINES.map((pl, i) => (
          <Polygon
            key={`pl-${i}`}
            positions={pl.path}
            pathOptions={{
              color: "#3b82f6",
              weight: 2,
              fillColor: "#3b82f6",
              fillOpacity: 0.2,
            }}
          />
        ))}

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          polygonOptions={{
            fillColor: "#ffffff00",
            color: "#ffffff00",
            weight: 0,
            opacity: 0,
          }}
        >
          {pins.map((p) => {
            const color =
              p.type === "live" ? "#e11d48" : p.type === "upcoming" ? "#0ea5b7" : "#1e3a8a";
            return (
              <CircleMarker
                key={p.id}
                center={[p.lat, p.lng]}
                radius={p.type === "live" ? 11 : 8}
                pathOptions={{ color: "white", weight: 2, fillColor: color, fillOpacity: 1 }}
                eventHandlers={{ click: () => onSelect?.(p) }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                  <div className="text-xs">
                    <div className="font-bold">{p.title}</div>
                    <div className="text-[10px] opacity-70">{p.meta}</div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Custom Map Legend */}
      <div className="absolute left-4 bottom-20 z-[1000] flex flex-col gap-2 pointer-events-none">
        <div className="glass pointer-events-auto rounded-xl p-3 shadow-lg border border-white/20">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
            <Info size={12} /> Map Legend
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-medium">
              <span className="w-3 h-3 rounded-full bg-[#e11d48]" /> Live Tours
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium">
              <span className="w-3 h-3 rounded-full bg-[#0ea5b7]" /> Upcoming Events
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium">
              <span className="w-3 h-3 rounded-full bg-[#1e3a8a]" /> Properties
            </div>
            <div className="h-px bg-white/10 my-1" />
            <div className="flex items-center gap-2 text-[10px] font-medium">
              <span className="w-3 h-0.5 bg-[#e11d48] border-t border-dashed border-[#e11d48]" />{" "}
              Sector Boundary
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium">
              <span className="w-3 h-3 rounded bg-[#3b82f6]/40 border border-[#3b82f6]" /> Property
              Plot
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
