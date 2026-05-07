// Replay-page data: locality life-index analytics, timestamped chat replay,
// recommended replays, and host's other sessions.

export type MetricId =
  | "life-index"
  | "infrastructure"
  | "water"
  | "aqi"
  | "greenery"
  | "gas"
  | "emergency"
  | "medical"
  | "schools"
  | "walkability"
  | "pet"
  | "shopping"
  | "grocery";

export type IconKey =
  | "sparkles"
  | "construction"
  | "droplet"
  | "wind"
  | "trees"
  | "flame"
  | "siren"
  | "stethoscope"
  | "school"
  | "footprints"
  | "paw"
  | "shopping-bag"
  | "carrot";

export interface LocalityMetric {
  id: MetricId;
  label: string;
  /** Short caption shown under the title. */
  caption: string;
  /** 0–100 platform score. */
  score: number;
  /** Color tone — drives card accent + bar fill. */
  tone: "primary" | "sky" | "emerald" | "amber" | "rose" | "violet" | "lime" | "teal" | "indigo" | "orange" | "slate";
  iconKey: IconKey;
  /** YoY trend in points (+/-). */
  trend: number;
  /** Sub-stats shown under the score. */
  facts: { label: string; value: string }[];
  /** Community ratings — 5-star sentiment from residents. */
  votes: { stars: number; count: number; avg: number };
}

export const LOCALITY_METRICS: LocalityMetric[] = [
  {
    id: "life-index",
    label: "Life Index",
    caption: "Composite quality-of-life score",
    score: 82,
    tone: "primary",
    iconKey: "sparkles",
    trend: 3,
    facts: [
      { label: "Rank in Gurgaon", value: "#4 of 84" },
      { label: "Resident NPS", value: "+62" },
      { label: "Daily commute", value: "28 min avg" },
    ],
    votes: { stars: 4, count: 1284, avg: 4.3 },
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    caption: "Roads · power · drainage",
    score: 76,
    tone: "slate",
    iconKey: "construction",
    trend: 2,
    facts: [
      { label: "Power uptime", value: "99.4%" },
      { label: "Road condition", value: "Good" },
      { label: "Drainage incidents / yr", value: "1.8" },
    ],
    votes: { stars: 4, count: 612, avg: 3.9 },
  },
  {
    id: "water",
    label: "Water Quality",
    caption: "Supply hours · TDS · hardness",
    score: 71,
    tone: "sky",
    iconKey: "droplet",
    trend: -1,
    facts: [
      { label: "Daily supply", value: "18 hrs" },
      { label: "TDS (avg)", value: "182 ppm" },
      { label: "Hardness", value: "Moderate" },
    ],
    votes: { stars: 3, count: 480, avg: 3.4 },
  },
  {
    id: "aqi",
    label: "Air Quality",
    caption: "PM2.5 · seasonal AQI",
    score: 48,
    tone: "amber",
    iconKey: "wind",
    trend: -4,
    facts: [
      { label: "AQI today", value: "142 · Poor" },
      { label: "PM2.5", value: "62 µg/m³" },
      { label: "Best months", value: "Aug–Sep" },
    ],
    votes: { stars: 2, count: 1840, avg: 2.6 },
  },
  {
    id: "greenery",
    label: "Greenery",
    caption: "Parks · tree cover · open space",
    score: 84,
    tone: "emerald",
    iconKey: "trees",
    trend: 1,
    facts: [
      { label: "Tree canopy", value: "31%" },
      { label: "Parks ≤ 1 km", value: "7" },
      { label: "Largest park", value: "Leisure Valley" },
    ],
    votes: { stars: 5, count: 902, avg: 4.6 },
  },
  {
    id: "gas",
    label: "Piped Gas",
    caption: "PNG availability · uptime",
    score: 88,
    tone: "orange",
    iconKey: "flame",
    trend: 4,
    facts: [
      { label: "PNG coverage", value: "Yes (IGL)" },
      { label: "Connection wait", value: "~2 weeks" },
      { label: "Outages / yr", value: "0.4" },
    ],
    votes: { stars: 5, count: 318, avg: 4.5 },
  },
  {
    id: "emergency",
    label: "Emergency Services",
    caption: "Police · fire · ambulance",
    score: 79,
    tone: "rose",
    iconKey: "siren",
    trend: 2,
    facts: [
      { label: "Police response", value: "8 min" },
      { label: "Nearest fire stn.", value: "1.4 km" },
      { label: "Ambulance ETA", value: "11 min" },
    ],
    votes: { stars: 4, count: 522, avg: 4.0 },
  },
  {
    id: "medical",
    label: "Medical Facilities",
    caption: "Hospitals · clinics · pharmacies",
    score: 86,
    tone: "rose",
    iconKey: "stethoscope",
    trend: 0,
    facts: [
      { label: "Hospitals ≤ 5 km", value: "9" },
      { label: "Top facility", value: "Medanta · 2.3 km" },
      { label: "24×7 pharmacies", value: "12" },
    ],
    votes: { stars: 5, count: 706, avg: 4.5 },
  },
  {
    id: "schools",
    label: "Schools",
    caption: "K-12 · early years · daycare",
    score: 81,
    tone: "indigo",
    iconKey: "school",
    trend: 1,
    facts: [
      { label: "Schools ≤ 2 km", value: "12" },
      { label: "Top rated", value: "GD Goenka · 1.8 km" },
      { label: "Daycare ≤ 1 km", value: "5" },
    ],
    votes: { stars: 4, count: 644, avg: 4.2 },
  },
  {
    id: "walkability",
    label: "Walkability",
    caption: "Sidewalks · last-mile · safety",
    score: 58,
    tone: "teal",
    iconKey: "footprints",
    trend: 1,
    facts: [
      { label: "Sidewalk coverage", value: "62%" },
      { label: "Avg block length", value: "180 m" },
      { label: "Night-walk safety", value: "Moderate" },
    ],
    votes: { stars: 3, count: 412, avg: 3.1 },
  },
  {
    id: "pet",
    label: "Pet Friendly",
    caption: "Dog parks · vets · pet-allowed societies",
    score: 74,
    tone: "amber",
    iconKey: "paw",
    trend: 5,
    facts: [
      { label: "Vet clinics ≤ 2 km", value: "6" },
      { label: "Off-leash parks", value: "2" },
      { label: "Pet-allowed RWAs", value: "8 of 11" },
    ],
    votes: { stars: 4, count: 388, avg: 4.1 },
  },
  {
    id: "shopping",
    label: "Shopping",
    caption: "Malls · brand outlets · markets",
    score: 89,
    tone: "violet",
    iconKey: "shopping-bag",
    trend: 2,
    facts: [
      { label: "Malls ≤ 5 km", value: "4" },
      { label: "Closest mall", value: "Ambience · 3.2 km" },
      { label: "Brand outlets", value: "180+" },
    ],
    votes: { stars: 5, count: 824, avg: 4.6 },
  },
  {
    id: "grocery",
    label: "Grocery",
    caption: "Kirana · supermarkets · 10-min apps",
    score: 92,
    tone: "lime",
    iconKey: "carrot",
    trend: 6,
    facts: [
      { label: "Kirana ≤ 500 m", value: "11" },
      { label: "Supermarkets ≤ 2 km", value: "5" },
      { label: "Quick-commerce", value: "Blinkit · Zepto · Instamart" },
    ],
    votes: { stars: 5, count: 1148, avg: 4.7 },
  },
];

// ───────────────── Replay chat (timeline-anchored) ─────────────────

export type ChatTier = "legend" | "gold" | "silver" | "visitor";

export interface ReplayChatComment {
  id: string;
  /** Seconds into the replay video. */
  at: number;
  name: string;
  initial: string;
  tier: ChatTier;
  societyVerified?: boolean;
  isHost?: boolean;
  isQuestion?: boolean;
  text: string;
  likes: number;
}

export const REPLAY_CHAT: ReplayChatComment[] = [
  {
    id: "rc1",
    at: 12,
    name: "Anika Sharma",
    initial: "A",
    tier: "legend",
    isHost: true,
    text: "Welcome to the replay — fact sheet & RERA docs are linked in the description.",
    likes: 84,
  },
  {
    id: "rc2",
    at: 38,
    name: "Vivek M.",
    initial: "V",
    tier: "legend",
    societyVerified: true,
    text: "Resident note: clubhouse pool stays open till 10 PM; gym is fully equipped.",
    likes: 142,
  },
  {
    id: "rc3",
    at: 124,
    name: "Riya P.",
    initial: "R",
    tier: "gold",
    societyVerified: true,
    isQuestion: true,
    text: "Is the metro really 1.8 km? Maps shows 2.4 km via Golf Course Ext Road.",
    likes: 96,
  },
  {
    id: "rc4",
    at: 168,
    name: "Karan T.",
    initial: "K",
    tier: "silver",
    isQuestion: true,
    text: "Tower B 3 BHK — east-facing or west-facing units?",
    likes: 41,
  },
  {
    id: "rc5",
    at: 240,
    name: "Anika Sharma",
    initial: "A",
    tier: "legend",
    isHost: true,
    text: "Updating fact sheet to 2.4 km road distance — fair point, Riya.",
    likes: 218,
  },
  {
    id: "rc6",
    at: 312,
    name: "Sahil B.",
    initial: "S",
    tier: "gold",
    text: "Booked here last year — RERA escrow has been the biggest reassurance for delays.",
    likes: 73,
  },
  {
    id: "rc7",
    at: 408,
    name: "Meera J.",
    initial: "M",
    tier: "silver",
    societyVerified: true,
    isQuestion: true,
    text: "Any HDFC / SBI tie-ups for first-time buyers?",
    likes: 38,
  },
  {
    id: "rc8",
    at: 492,
    name: "Devika S.",
    initial: "D",
    tier: "visitor",
    isQuestion: true,
    text: "Parking — 1 covered slot or 2 per unit?",
    likes: 22,
  },
  {
    id: "rc9",
    at: 588,
    name: "Pooja N.",
    initial: "P",
    tier: "silver",
    text: "PDF floor plan in the Docs tab made deciding so much easier.",
    likes: 51,
  },
];

export interface KeyMoment {
  id: string;
  at: number;
  label: string;
  kind: "rera" | "verified" | "flag" | "question" | "highlight";
}

export const KEY_MOMENTS: KeyMoment[] = [
  { id: "k1", at: 28, label: "RERA disclosure", kind: "rera" },
  { id: "k2", at: 124, label: "Metro distance challenged", kind: "flag" },
  { id: "k3", at: 240, label: "Host updated fact sheet", kind: "verified" },
  { id: "k4", at: 408, label: "Loan tie-ups discussed", kind: "highlight" },
  { id: "k5", at: 492, label: "Parking Q&A", kind: "question" },
];

// ───────────────── Recommended replays ─────────────────

export interface RecommendedReplay {
  id: string;
  title: string;
  developer: string;
  locality: string;
  thumbnail: string;
  duration: string;
  views: number;
  liveDate: string;
  reason: string;
}

export const RECOMMENDED_REPLAYS: RecommendedReplay[] = [
  {
    id: "r1",
    title: "DLF Privana South — Tower walkthrough",
    developer: "DLF",
    locality: "Sector 76",
    thumbnail: "https://img.youtube.com/vi/cGDbHLdLX1M/hqdefault.jpg",
    duration: "27:14",
    views: 8_410,
    liveDate: "5 days ago",
    reason: "Same locality cluster",
  },
  {
    id: "r2",
    title: "Sobha City — Resident Q&A · honest pricing",
    developer: "Sobha",
    locality: "Sector 108",
    thumbnail: "https://img.youtube.com/vi/cGDbHLdLX1M/hqdefault.jpg",
    duration: "47:02",
    views: 6_120,
    liveDate: "1 week ago",
    reason: "Verified resident hosted",
  },
  {
    id: "r3",
    title: "Adani Samsara Vilasa — villa tour",
    developer: "Adani Realty",
    locality: "Sector 60",
    thumbnail: "https://img.youtube.com/vi/cGDbHLdLX1M/hqdefault.jpg",
    duration: "29:48",
    views: 5_240,
    liveDate: "10 days ago",
    reason: "Similar price band",
  },
  {
    id: "r4",
    title: "Golf Course Rd — Pricing deep-dive",
    developer: "PropLive Editorial",
    locality: "Golf Course Road",
    thumbnail: "https://img.youtube.com/vi/cGDbHLdLX1M/hqdefault.jpg",
    duration: "52:11",
    views: 14_290,
    liveDate: "2 weeks ago",
    reason: "Editorial · 95% engagement",
  },
  {
    id: "r5",
    title: "Sector 84 — Metro extension impact",
    developer: "Locality Legends",
    locality: "Sector 84",
    thumbnail: "https://img.youtube.com/vi/cGDbHLdLX1M/hqdefault.jpg",
    duration: "33:20",
    views: 9_870,
    liveDate: "3 weeks ago",
    reason: "Trending in Tier-2 buyers",
  },
  {
    id: "r6",
    title: "M3M India · 5-project comparison",
    developer: "M3M India",
    locality: "Multi-sector",
    thumbnail: "https://img.youtube.com/vi/cGDbHLdLX1M/hqdefault.jpg",
    duration: "41:08",
    views: 11_402,
    liveDate: "1 month ago",
    reason: "Same developer",
  },
];

// ───────────────── Host's past sessions ─────────────────

export interface HostSession {
  id: string;
  hostName: string;
  hostInitial: string;
  title: string;
  locality: string;
  airedAt: string;
  durationMin: number;
  views: number;
  highlightCount: number;
  /** 0-100 engagement %. */
  engagement: number;
}

export const HOST_PAST_SESSIONS: HostSession[] = [
  {
    id: "h1",
    hostName: "Anika Sharma",
    hostInitial: "A",
    title: "M3M Skycity — Tower walkthrough + RERA Q&A",
    locality: "Sector 65",
    airedAt: "2 weeks ago",
    durationMin: 38,
    views: 7_840,
    highlightCount: 6,
    engagement: 88,
  },
  {
    id: "h2",
    hostName: "Anika Sharma",
    hostInitial: "A",
    title: "Sector 65 — Resident-only price reality check",
    locality: "Sector 65",
    airedAt: "3 weeks ago",
    durationMin: 52,
    views: 12_410,
    highlightCount: 9,
    engagement: 94,
  },
  {
    id: "h3",
    hostName: "Anika Sharma",
    hostInitial: "A",
    title: "M3M Antalya — clubhouse + spa preview",
    locality: "Sector 79",
    airedAt: "1 month ago",
    durationMin: 28,
    views: 5_290,
    highlightCount: 4,
    engagement: 82,
  },
  {
    id: "h4",
    hostName: "Anika Sharma",
    hostInitial: "A",
    title: "Golf Course Ext Rd — supply pipeline 2026",
    locality: "Golf Course Ext",
    airedAt: "2 months ago",
    durationMin: 64,
    views: 18_220,
    highlightCount: 12,
    engagement: 96,
  },
];

// ───────────────── Helpers ─────────────────

export function formatTimestamp(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Tonal class map — keeps Material's filled-tonal pairs consistent. */
export const TONE_PAIRS: Record<
  LocalityMetric["tone"],
  { fill: string; ring: string; text: string; bar: string; soft: string }
> = {
  primary: {
    fill: "bg-violet-100",
    ring: "ring-violet-200",
    text: "text-violet-900",
    bar: "bg-violet-500",
    soft: "bg-violet-50",
  },
  slate: {
    fill: "bg-slate-100",
    ring: "ring-slate-200",
    text: "text-slate-900",
    bar: "bg-slate-500",
    soft: "bg-slate-50",
  },
  sky: {
    fill: "bg-sky-100",
    ring: "ring-sky-200",
    text: "text-sky-900",
    bar: "bg-sky-500",
    soft: "bg-sky-50",
  },
  emerald: {
    fill: "bg-emerald-100",
    ring: "ring-emerald-200",
    text: "text-emerald-900",
    bar: "bg-emerald-500",
    soft: "bg-emerald-50",
  },
  amber: {
    fill: "bg-amber-100",
    ring: "ring-amber-200",
    text: "text-amber-900",
    bar: "bg-amber-500",
    soft: "bg-amber-50",
  },
  rose: {
    fill: "bg-rose-100",
    ring: "ring-rose-200",
    text: "text-rose-900",
    bar: "bg-rose-500",
    soft: "bg-rose-50",
  },
  violet: {
    fill: "bg-violet-100",
    ring: "ring-violet-200",
    text: "text-violet-900",
    bar: "bg-violet-500",
    soft: "bg-violet-50",
  },
  lime: {
    fill: "bg-lime-100",
    ring: "ring-lime-200",
    text: "text-lime-900",
    bar: "bg-lime-500",
    soft: "bg-lime-50",
  },
  teal: {
    fill: "bg-teal-100",
    ring: "ring-teal-200",
    text: "text-teal-900",
    bar: "bg-teal-500",
    soft: "bg-teal-50",
  },
  indigo: {
    fill: "bg-indigo-100",
    ring: "ring-indigo-200",
    text: "text-indigo-900",
    bar: "bg-indigo-500",
    soft: "bg-indigo-50",
  },
  orange: {
    fill: "bg-orange-100",
    ring: "ring-orange-200",
    text: "text-orange-900",
    bar: "bg-orange-500",
    soft: "bg-orange-50",
  },
};

export function scoreColor(score: number): { label: string; tone: "emerald" | "lime" | "amber" | "rose" } {
  if (score >= 80) return { label: "Excellent", tone: "emerald" };
  if (score >= 65) return { label: "Good", tone: "lime" };
  if (score >= 45) return { label: "Average", tone: "amber" };
  return { label: "Needs work", tone: "rose" };
}
