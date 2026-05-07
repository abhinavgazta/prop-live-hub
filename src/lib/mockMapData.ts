import type { LatLngTuple } from "leaflet";

export type MapViewId = "streets" | "satellite" | "dark" | "terrain" | "transport";

export interface MapView {
  id: MapViewId;
  label: string;
  description: string;
  url: string;
  attribution: string;
  maxZoom: number;
  /** Tiles look light or dark — used to swap UI overlay tone. */
  tone: "light" | "dark";
}

export const MAP_VIEWS: MapView[] = [
  {
    id: "streets",
    label: "Streets",
    description: "Standard OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
    tone: "light",
  },
  {
    id: "satellite",
    label: "Satellite",
    description: "Esri World Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    maxZoom: 19,
    tone: "dark",
  },
  {
    id: "dark",
    label: "Dark",
    description: "CartoDB Dark Matter",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; CARTO &copy; OpenStreetMap",
    maxZoom: 19,
    tone: "dark",
  },
  {
    id: "terrain",
    label: "Terrain",
    description: "OpenTopoMap relief",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap (CC-BY-SA)",
    maxZoom: 17,
    tone: "light",
  },
  {
    id: "transport",
    label: "Transport",
    description: "Roads & transit emphasis",
    url: "https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png",
    attribution: "&copy; CARTO &copy; OpenStreetMap",
    maxZoom: 19,
    tone: "light",
  },
];

export type SessionType = "live" | "upcoming" | "replay" | "property";

export interface Joiner {
  id: string;
  name: string;
  initial: string;
  tier: "legend" | "gold" | "silver" | "none";
}

export interface LiveSession {
  id: string;
  title: string;
  developer: string;
  locality: string;
  position: LatLngTuple;
  type: SessionType;
  /** Concurrent viewers right now. */
  viewers: number;
  /** Total joiners since session began. */
  joiners: number;
  joiningPerMinute: number;
  hostName: string;
  hostTier: "legend" | "gold" | "silver";
  startedAt?: string;
  startsAt?: string;
  durationMin?: number;
  recentJoiners?: Joiner[];
}

export interface ReplaySession {
  id: string;
  title: string;
  developer: string;
  locality: string;
  position: LatLngTuple;
  /** ISO timestamp of original live broadcast. */
  airedAt: string;
  durationMin: number;
  liveViewers: number;
  replayViews: number;
  highlightCount: number;
  /** 0-100 score for engagement / shareability. */
  engagement: number;
}

export interface PointOfInterest {
  id: string;
  name: string;
  position: LatLngTuple;
  category: "Food" | "Shopping" | "Transit" | "Park" | "Education" | "Healthcare";
  description?: string;
}

export interface LocalityInsight {
  id: string;
  /** Locality boundary as GeoJSON Polygon — drawn directly on the map. */
  name: string;
  position: LatLngTuple;
  geoJson: GeoJSON.Feature<GeoJSON.Polygon>;
  liveSessions: number;
  upcomingSessions: number;
  replayCount: number;
  totalViewersLast7d: number;
  avgPriceCr: number;
  pricePerSqftK: number;
  yoyAppreciation: number;
  inventoryUnits: number;
  legendBrokers: number;
  buildingDensity: number;
  /** Heights for 3D extrusion when locality is opened in 3D view. */
  buildings: Array<{ x: number; y: number; w: number; d: number; h: number; live?: boolean }>;
  hotness: number;
}

const polygon = (coords: number[][]): GeoJSON.Feature<GeoJSON.Polygon> => ({
  type: "Feature",
  properties: {},
  geometry: { type: "Polygon", coordinates: [coords] },
});

export const mockLocalities: LocalityInsight[] = [
  {
    id: "loc-cyber",
    name: "DLF Cyber City",
    position: [28.4953, 77.0892],
    geoJson: polygon([
      [77.082, 28.491],
      [77.084, 28.498],
      [77.09, 28.4995],
      [77.097, 28.4965],
      [77.097, 28.49],
      [77.092, 28.487],
      [77.085, 28.488],
      [77.082, 28.491],
    ]),
    liveSessions: 3,
    upcomingSessions: 2,
    replayCount: 18,
    totalViewersLast7d: 42_500,
    avgPriceCr: 4.2,
    pricePerSqftK: 22.4,
    yoyAppreciation: 14.3,
    inventoryUnits: 312,
    legendBrokers: 11,
    buildingDensity: 0.85,
    hotness: 92,
    buildings: [
      { x: -180, y: -120, w: 60, d: 60, h: 220, live: true },
      { x: -90, y: -90, w: 50, d: 80, h: 280 },
      { x: 0, y: -140, w: 70, d: 55, h: 320, live: true },
      { x: 90, y: -100, w: 55, d: 70, h: 240 },
      { x: 170, y: -50, w: 60, d: 60, h: 180 },
      { x: -150, y: 40, w: 45, d: 90, h: 140 },
      { x: -40, y: 60, w: 70, d: 50, h: 200 },
      { x: 60, y: 80, w: 55, d: 55, h: 260, live: true },
      { x: 140, y: 60, w: 70, d: 60, h: 160 },
      { x: 0, y: 160, w: 90, d: 55, h: 130 },
    ],
  },
  {
    id: "loc-golf",
    name: "Golf Course Road",
    position: [28.4646, 77.0846],
    geoJson: polygon([
      [77.075, 28.456],
      [77.075, 28.471],
      [77.094, 28.474],
      [77.099, 28.461],
      [77.092, 28.453],
      [77.082, 28.452],
      [77.075, 28.456],
    ]),
    liveSessions: 2,
    upcomingSessions: 3,
    replayCount: 24,
    totalViewersLast7d: 51_200,
    avgPriceCr: 5.8,
    pricePerSqftK: 28.1,
    yoyAppreciation: 17.2,
    inventoryUnits: 248,
    legendBrokers: 16,
    buildingDensity: 0.72,
    hotness: 96,
    buildings: [
      { x: -180, y: -100, w: 80, d: 60, h: 260 },
      { x: -60, y: -120, w: 70, d: 70, h: 340, live: true },
      { x: 60, y: -80, w: 60, d: 80, h: 300 },
      { x: 170, y: -100, w: 50, d: 60, h: 220 },
      { x: -120, y: 60, w: 90, d: 50, h: 180, live: true },
      { x: 20, y: 60, w: 60, d: 60, h: 240 },
      { x: 130, y: 80, w: 70, d: 70, h: 200 },
      { x: -30, y: 170, w: 80, d: 50, h: 150 },
      { x: 110, y: 180, w: 55, d: 55, h: 170 },
    ],
  },
  {
    id: "loc-s84",
    name: "Sector 84",
    position: [28.4089, 77.051],
    geoJson: polygon([
      [77.04, 28.402],
      [77.041, 28.418],
      [77.061, 28.42],
      [77.064, 28.408],
      [77.058, 28.398],
      [77.046, 28.397],
      [77.04, 28.402],
    ]),
    liveSessions: 1,
    upcomingSessions: 4,
    replayCount: 9,
    totalViewersLast7d: 18_800,
    avgPriceCr: 1.6,
    pricePerSqftK: 9.2,
    yoyAppreciation: 22.1,
    inventoryUnits: 540,
    legendBrokers: 6,
    buildingDensity: 0.45,
    hotness: 88,
    buildings: [
      { x: -160, y: -100, w: 70, d: 70, h: 90 },
      { x: -40, y: -90, w: 90, d: 70, h: 110, live: true },
      { x: 80, y: -110, w: 60, d: 60, h: 130 },
      { x: 170, y: -60, w: 50, d: 60, h: 80 },
      { x: -100, y: 60, w: 80, d: 80, h: 100 },
      { x: 30, y: 70, w: 70, d: 60, h: 140 },
      { x: 140, y: 90, w: 60, d: 60, h: 90 },
    ],
  },
  {
    id: "loc-s65",
    name: "Sector 65",
    position: [28.4646, 77.0666],
    geoJson: polygon([
      [77.058, 28.458],
      [77.059, 28.471],
      [77.075, 28.473],
      [77.077, 28.461],
      [77.072, 28.453],
      [77.062, 28.453],
      [77.058, 28.458],
    ]),
    liveSessions: 2,
    upcomingSessions: 1,
    replayCount: 14,
    totalViewersLast7d: 33_600,
    avgPriceCr: 3.4,
    pricePerSqftK: 17.6,
    yoyAppreciation: 15.4,
    inventoryUnits: 380,
    legendBrokers: 9,
    buildingDensity: 0.6,
    hotness: 84,
    buildings: [
      { x: -150, y: -90, w: 60, d: 70, h: 180, live: true },
      { x: -40, y: -100, w: 70, d: 60, h: 220 },
      { x: 70, y: -90, w: 80, d: 60, h: 200 },
      { x: 170, y: -40, w: 50, d: 80, h: 160 },
      { x: -110, y: 60, w: 75, d: 60, h: 150 },
      { x: 30, y: 80, w: 70, d: 70, h: 230 },
      { x: 140, y: 70, w: 60, d: 60, h: 180 },
    ],
  },
  {
    id: "loc-s76",
    name: "Sector 76",
    position: [28.4321, 77.0667],
    geoJson: polygon([
      [77.058, 28.426],
      [77.058, 28.44],
      [77.076, 28.441],
      [77.078, 28.428],
      [77.072, 28.42],
      [77.062, 28.421],
      [77.058, 28.426],
    ]),
    liveSessions: 1,
    upcomingSessions: 2,
    replayCount: 11,
    totalViewersLast7d: 21_300,
    avgPriceCr: 2.4,
    pricePerSqftK: 12.8,
    yoyAppreciation: 19.0,
    inventoryUnits: 420,
    legendBrokers: 7,
    buildingDensity: 0.5,
    hotness: 78,
    buildings: [
      { x: -140, y: -80, w: 70, d: 60, h: 130 },
      { x: -30, y: -90, w: 80, d: 70, h: 160, live: true },
      { x: 80, y: -70, w: 60, d: 70, h: 150 },
      { x: 160, y: -30, w: 55, d: 60, h: 110 },
      { x: -90, y: 70, w: 80, d: 60, h: 120 },
      { x: 40, y: 70, w: 60, d: 60, h: 170 },
      { x: 130, y: 60, w: 60, d: 60, h: 140 },
    ],
  },
];

export const mockLiveSessions: LiveSession[] = [
  {
    id: "live-1",
    title: "M3M Golf Estate · Live Tour",
    developer: "M3M India",
    locality: "Sector 65",
    position: [28.4646, 77.0666],
    type: "live",
    viewers: 1284,
    joiners: 2174,
    joiningPerMinute: 38,
    hostName: "Aarav K.",
    hostTier: "legend",
    startedAt: "2026-05-07T11:48:00Z",
    durationMin: 24,
    recentJoiners: [
      { id: "j1", name: "Riya S.", initial: "R", tier: "gold" },
      { id: "j2", name: "Karan M.", initial: "K", tier: "silver" },
      { id: "j3", name: "Devika P.", initial: "D", tier: "legend" },
      { id: "j4", name: "Yash V.", initial: "Y", tier: "none" },
      { id: "j5", name: "Meera J.", initial: "M", tier: "gold" },
    ],
  },
  {
    id: "live-2",
    title: "DLF Privana South",
    developer: "DLF",
    locality: "Sector 76",
    position: [28.4321, 77.0667],
    type: "live",
    viewers: 812,
    joiners: 1480,
    joiningPerMinute: 22,
    hostName: "Naina R.",
    hostTier: "gold",
    startedAt: "2026-05-07T11:32:00Z",
    durationMin: 41,
    recentJoiners: [
      { id: "j6", name: "Arjun B.", initial: "A", tier: "silver" },
      { id: "j7", name: "Pooja T.", initial: "P", tier: "gold" },
      { id: "j8", name: "Ishaan G.", initial: "I", tier: "none" },
    ],
  },
  {
    id: "live-3",
    title: "Tata Primanti — Open House",
    developer: "Tata Realty",
    locality: "Sector 72",
    position: [28.44, 77.075],
    type: "live",
    viewers: 521,
    joiners: 940,
    joiningPerMinute: 14,
    hostName: "Vikram S.",
    hostTier: "legend",
    startedAt: "2026-05-07T11:55:00Z",
    durationMin: 18,
    recentJoiners: [
      { id: "j9", name: "Sahil D.", initial: "S", tier: "silver" },
      { id: "j10", name: "Tara N.", initial: "T", tier: "gold" },
    ],
  },
  {
    id: "upc-1",
    title: "Sector 84 Masterclass",
    developer: "Locality Legends",
    locality: "Sector 84",
    position: [28.4089, 77.051],
    type: "upcoming",
    viewers: 0,
    joiners: 2412,
    joiningPerMinute: 0,
    hostName: "Asha N.",
    hostTier: "gold",
    startsAt: "2026-05-09T13:30:00Z",
  },
  {
    id: "upc-2",
    title: "Smart Buyer Workshop",
    developer: "Locality Legends",
    locality: "DLF Cyber City",
    position: [28.49, 77.085],
    type: "upcoming",
    viewers: 0,
    joiners: 1180,
    joiningPerMinute: 0,
    hostName: "Rohan T.",
    hostTier: "legend",
    startsAt: "2026-05-10T12:30:00Z",
  },
];

export const mockReplaySessions: ReplaySession[] = [
  {
    id: "rep-1",
    title: "Emaar Digi Homes — Walkthrough",
    developer: "Emaar India",
    locality: "DLF Cyber City",
    position: [28.4972, 77.0905],
    airedAt: "2026-05-04T14:00:00Z",
    durationMin: 38,
    liveViewers: 4218,
    replayViews: 12_840,
    highlightCount: 6,
    engagement: 92,
  },
  {
    id: "rep-2",
    title: "Sobha City — Resident Q&A",
    developer: "Sobha",
    locality: "Sector 108",
    position: [28.475, 77.04],
    airedAt: "2026-05-02T10:00:00Z",
    durationMin: 47,
    liveViewers: 2104,
    replayViews: 8_316,
    highlightCount: 4,
    engagement: 84,
  },
  {
    id: "rep-3",
    title: "Adani Samsara — Villa Tour",
    developer: "Adani Realty",
    locality: "Sector 60",
    position: [28.42, 77.03],
    airedAt: "2026-04-28T16:00:00Z",
    durationMin: 29,
    liveViewers: 1820,
    replayViews: 6_204,
    highlightCount: 5,
    engagement: 78,
  },
  {
    id: "rep-4",
    title: "Golf Course Rd — Pricing Deep-Dive",
    developer: "PropLive Editorial",
    locality: "Golf Course Road",
    position: [28.4646, 77.0846],
    airedAt: "2026-05-05T18:00:00Z",
    durationMin: 52,
    liveViewers: 5_802,
    replayViews: 14_290,
    highlightCount: 8,
    engagement: 95,
  },
];

export const mockPOIs: PointOfInterest[] = [
  {
    id: "poi-1",
    name: "Cyber Hub",
    position: [28.4945, 77.0892],
    category: "Food",
    description: "Dining and entertainment hub",
  },
  {
    id: "poi-2",
    name: "Ambience Mall",
    position: [28.5042, 77.0988],
    category: "Shopping",
    description: "Major shopping mall",
  },
  {
    id: "poi-3",
    name: "HUDA City Centre Metro",
    position: [28.4595, 77.0724],
    category: "Transit",
    description: "Yellow Line interchange",
  },
  {
    id: "poi-4",
    name: "Leisure Valley Park",
    position: [28.4664, 77.0617],
    category: "Park",
    description: "Central green spine",
  },
  {
    id: "poi-5",
    name: "Medanta Hospital",
    position: [28.4395, 77.0414],
    category: "Healthcare",
    description: "Multi-specialty hospital",
  },
  {
    id: "poi-6",
    name: "GD Goenka School",
    position: [28.4202, 77.0431],
    category: "Education",
    description: "K-12 international school",
  },
];

export const TYPE_COLORS: Record<SessionType, string> = {
  live: "#e11d48",
  upcoming: "#0ea5b7",
  replay: "#a855f7",
  property: "#94a3b8", // Grey for completed/property listings
};
