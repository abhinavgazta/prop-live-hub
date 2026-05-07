// Centralized mock data for the Live Room: gamification, RERA, captions,
// languages, NRI scheduling, Digitour markers, claims governance.

export type LangCode = "en" | "hi" | "ta" | "te" | "mr" | "kn" | "bn";

export interface Language {
  code: LangCode;
  label: string;
  native: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
];

export interface CaptionLine {
  id: string;
  /** Seconds since session start. */
  at: number;
  durationSec: number;
  speaker: string;
  /** Translation per LangCode. */
  text: Record<LangCode, string>;
}

export const CAPTION_TRACK: CaptionLine[] = [
  {
    id: "c1",
    at: 0,
    durationSec: 6,
    speaker: "Anika · Host",
    text: {
      en: "Welcome to the M3M Golf Estate live tour. We'll start at the clubhouse.",
      hi: "M3M गोल्फ एस्टेट के लाइव टूर में आपका स्वागत है। हम क्लबहाउस से शुरू करेंगे।",
      ta: "M3M கோல்ஃப் எஸ்டேட் நேரலை சுற்றுப்பயணத்திற்கு வரவேற்கிறேன். கிளப்ஹவுசில் தொடங்குவோம்.",
      te: "M3M గోల్ఫ్ ఎస్టేట్ లైవ్ టూర్‌కి స్వాగతం. క్లబ్‌హౌస్ నుండి ప్రారంభిస్తాము.",
      mr: "M3M गोल्फ इस्टेटच्या थेट दौर्‍यात स्वागत आहे. आपण क्लबहाऊसपासून सुरुवात करू.",
      kn: "M3M ಗಾಲ್ಫ್ ಎಸ್ಟೇಟ್ ಲೈವ್ ಪ್ರವಾಸಕ್ಕೆ ಸ್ವಾಗತ. ನಾವು ಕ್ಲಬ್‌ಹೌಸ್‌ನಿಂದ ಪ್ರಾರಂಭಿಸುತ್ತೇವೆ.",
      bn: "M3M গল্ফ এস্টেটের লাইভ ট্যুরে স্বাগতম। আমরা ক্লাবহাউস থেকে শুরু করব।",
    },
  },
  {
    id: "c2",
    at: 6,
    durationSec: 7,
    speaker: "Anika · Host",
    text: {
      en: "RERA registration is GGM/736/468/2024 — verified, all approvals on file.",
      hi: "RERA पंजीकरण GGM/736/468/2024 है — सत्यापित, सभी अनुमोदन फ़ाइल में हैं।",
      ta: "RERA பதிவு GGM/736/468/2024 — சரிபார்க்கப்பட்டது, அனைத்து ஒப்புதல்களும் கோப்பில் உள்ளன.",
      te: "RERA నమోదు GGM/736/468/2024 — ధృవీకరించబడింది, అన్ని ఆమోదాలు ఫైల్‌లో ఉన్నాయి.",
      mr: "RERA नोंदणी GGM/736/468/2024 — सत्यापित, सर्व मंजुरी फाइलमध्ये आहेत.",
      kn: "RERA ನೋಂದಣಿ GGM/736/468/2024 — ಪರಿಶೀಲಿಸಲಾಗಿದೆ, ಎಲ್ಲಾ ಅನುಮೋದನೆಗಳು ಫೈಲ್‌ನಲ್ಲಿವೆ.",
      bn: "RERA নিবন্ধন GGM/736/468/2024 — যাচাইকৃত, সমস্ত অনুমোদন ফাইলে রয়েছে।",
    },
  },
  {
    id: "c3",
    at: 13,
    durationSec: 8,
    speaker: "Vivek · Resident · Verified",
    text: {
      en: "Tower B does get traffic noise from Sector 65 road in the evenings — quiet on weekends though.",
      hi: "टावर B को शाम के समय सेक्टर 65 रोड से ट्रैफिक का शोर मिलता है — हालाँकि वीकेंड पर शांत रहता है।",
      ta: "டவர் B-க்கு மாலை நேரங்களில் Sector 65 சாலையிலிருந்து போக்குவரத்து சத்தம் வருகிறது — வார இறுதியில் அமைதியாக இருக்கும்.",
      te: "టవర్ Bకి సాయంత్రం వేళ సెక్టార్ 65 రోడ్డు ట్రాఫిక్ శబ్దం వస్తుంది — వారాంతంలో నిశ్శబ్దంగా ఉంటుంది.",
      mr: "टॉवर B ला संध्याकाळी सेक्टर 65 रस्त्यावरून वाहतुकीचा आवाज येतो — पण वीकेंडला शांत असतो.",
      kn: "ಟವರ್ B ಗೆ ಸಂಜೆ ವೇಳೆ ಸೆಕ್ಟರ್ 65 ರಸ್ತೆಯ ಟ್ರಾಫಿಕ್ ಶಬ್ದ ಕೇಳಿಸುತ್ತದೆ — ವಾರಾಂತ್ಯದಲ್ಲಿ ಶಾಂತ.",
      bn: "টাওয়ার B-তে সন্ধ্যায় সেক্টর 65 রাস্তা থেকে ট্রাফিকের শব্দ আসে — তবে উইকেন্ডে শান্ত থাকে।",
    },
  },
  {
    id: "c4",
    at: 21,
    durationSec: 6,
    speaker: "Anika · Host",
    text: {
      en: "Possession is 12 months out per RERA. Escrow stands at 64% deployment.",
      hi: "RERA के अनुसार पजेशन 12 महीने में है। एस्क्रो 64% तैनाती पर है।",
      ta: "RERA-வின்படி உரிமையாதல் 12 மாதங்களில். எஸ்க்ரோ 64% பயன்பாட்டில் உள்ளது.",
      te: "RERA ప్రకారం స్వాధీనం 12 నెలల్లో. ఎస్క్రో 64% డిప్లాయ్‌మెంట్‌లో ఉంది.",
      mr: "RERA नुसार ताबा 12 महिन्यांत. एस्क्रो 64% तैनातीवर आहे.",
      kn: "RERA ಪ್ರಕಾರ ಸ್ವಾಧೀನ 12 ತಿಂಗಳಲ್ಲಿ. ಎಸ್ಕ್ರೋ 64% ನಿಯೋಜನೆಯಲ್ಲಿದೆ.",
      bn: "RERA অনুসারে দখল 12 মাসে। এসক্রো 64% মোতায়েনে রয়েছে।",
    },
  },
];

// ───────────────── Tier system ─────────────────

export type TierId = "visitor" | "silver" | "gold" | "legend";

export interface Tier {
  id: TierId;
  label: string;
  color: string;
  background: string;
  threshold: number;
  perks: string[];
}

export const TIERS: Tier[] = [
  {
    id: "visitor",
    label: "Visitor",
    color: "#6b7280",
    background: "#f3f4f6",
    threshold: 0,
    perks: ["Watch live", "Ask questions", "React"],
  },
  {
    id: "silver",
    label: "Silver Neighbor",
    color: "#475569",
    background: "#e2e8f0",
    threshold: 250,
    perks: ["Priority Q&A queue", "Highlighted badge in chat"],
  },
  {
    id: "gold",
    label: "Gold Neighbor",
    color: "#b8860b",
    background: "#fff3c4",
    threshold: 1200,
    perks: [
      "Mark answers as Community Verified",
      "Anchor locality posts to live events",
      "Early-bird access to launches",
    ],
  },
  {
    id: "legend",
    label: "Locality Legend",
    color: "#7c3aed",
    background: "#ede9fe",
    threshold: 4500,
    perks: [
      "Co-host privileges on broker events",
      "Pin / verify / flag during live",
      "Executive Previews of upcoming projects",
      "Eligible for moderation bounty payouts",
    ],
  },
];

export function tierFromXp(xp: number): Tier {
  return [...TIERS].reverse().find((t) => xp >= t.threshold) ?? TIERS[0];
}

export function nextTier(xp: number): Tier | null {
  return TIERS.find((t) => t.threshold > xp) ?? null;
}

// ───────────────── Viewer profile (current user mock) ─────────────────

export interface ViewerProfile {
  name: string;
  initial: string;
  locality: string;
  societyVerified: boolean;
  societyName?: string;
  rwaRole?: string;
  xp: number;
  attended7d: number;
  acceptedAnswers: number;
  helpfulRatings: number;
  /** Affiliate credits earned from attributed leads — paid out monthly. */
  creditsRupees: number;
  languages: LangCode[];
}

export const MY_PROFILE: ViewerProfile = {
  name: "You · Aarav K.",
  initial: "A",
  locality: "Sector 65",
  societyVerified: true,
  societyName: "M3M Golf Estate · Tower A",
  rwaRole: "RWA Treasurer",
  xp: 1840,
  attended7d: 6,
  acceptedAnswers: 4,
  helpfulRatings: 27,
  creditsRupees: 1250,
  languages: ["en", "hi"],
};

// ───────────────── Leaderboard ─────────────────

export interface LeaderboardEntry {
  rank: number;
  name: string;
  initial: string;
  tier: TierId;
  xp: number;
  societyVerified: boolean;
  badge?: string;
}

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Anika S.", initial: "A", tier: "legend", xp: 8420, societyVerified: true, badge: "Co-host" },
  { rank: 2, name: "Vivek M.", initial: "V", tier: "legend", xp: 6280, societyVerified: true, badge: "RWA" },
  { rank: 3, name: "Riya P.", initial: "R", tier: "gold", xp: 3140, societyVerified: true, badge: "Architect" },
  { rank: 4, name: "Karan T.", initial: "K", tier: "gold", xp: 2210, societyVerified: false },
  { rank: 5, name: "You · Aarav K.", initial: "A", tier: "gold", xp: 1840, societyVerified: true },
  { rank: 6, name: "Meera J.", initial: "M", tier: "silver", xp: 880, societyVerified: true },
  { rank: 7, name: "Devika S.", initial: "D", tier: "silver", xp: 540, societyVerified: false },
];

// ───────────────── Project / RERA fact sheet ─────────────────

export interface ProjectFactSheet {
  name: string;
  developer: string;
  locality: string;
  reraId: string;
  reraStatus: "Verified" | "Pending" | "Lapsed";
  reraExpiry: string;
  approvals: { label: string; ok: boolean; note?: string }[];
  escrowDeployedPct: number;
  completionPct: number;
  possessionDate: string;
  inventoryUnits: number;
  inventorySoldPct: number;
  facts: { label: string; value: string }[];
  /** Mock PDF blob URL placeholder — wire to real generator later. */
  factSheetUrl: string;
}

export const PROJECT: ProjectFactSheet = {
  name: "M3M Golf Estate",
  developer: "M3M India",
  locality: "Sector 65, Gurgaon",
  reraId: "GGM/736/468/2024",
  reraStatus: "Verified",
  reraExpiry: "2027-12-31",
  approvals: [
    { label: "Building plan sanction (DTCP)", ok: true },
    { label: "Environmental clearance (SEIAA)", ok: true },
    { label: "Fire NOC", ok: true },
    { label: "Occupancy certificate", ok: false, note: "Phase 2 only" },
  ],
  escrowDeployedPct: 64,
  completionPct: 71,
  possessionDate: "2027-05-31",
  inventoryUnits: 412,
  inventorySoldPct: 58,
  facts: [
    { label: "Configurations", value: "3 BHK · 4 BHK · Penthouse" },
    { label: "Tower count", value: "8 towers · 28 floors" },
    { label: "Per sqft (avg)", value: "₹17.6k" },
    { label: "Escrow account", value: "ICICI A/c · 1234···7891" },
    { label: "Distance to metro", value: "2.4 km · Sector 67 (Rapid Metro)" },
  ],
  factSheetUrl: "data:application/pdf;base64,MOCK",
};

// ───────────────── Host / agent reputation ─────────────────

export interface HostReputation {
  name: string;
  initial: string;
  tier: TierId;
  reraAgentId: string;
  reraAgentVerified: boolean;
  yearsActive: number;
  eventsHosted: number;
  attendanceRate: number;
  leadConversion: number;
  complaintRatio: number;
  communityVerifiedAnswers: number;
  /** Public score 0-100. */
  score: number;
}

export const HOST: HostReputation = {
  name: "Anika Sharma",
  initial: "A",
  tier: "legend",
  reraAgentId: "HRERA-AGT-2024-04318",
  reraAgentVerified: true,
  yearsActive: 6,
  eventsHosted: 142,
  attendanceRate: 0.78,
  leadConversion: 0.11,
  complaintRatio: 0.014,
  communityVerifiedAnswers: 89,
  score: 94,
};

// ───────────────── Q&A queue ─────────────────

export interface QAItem {
  id: string;
  asker: string;
  initial: string;
  tier: TierId;
  societyVerified: boolean;
  text: string;
  /** Seconds since session start. */
  at: number;
  pinned: boolean;
  verified: boolean;
  flagged: boolean;
  upvotes: number;
}

export const QA_SEED: QAItem[] = [
  {
    id: "q1",
    asker: "Vivek M.",
    initial: "V",
    tier: "legend",
    societyVerified: true,
    text: "Promised handover was March 2026 in last year's brochure — confirm new date is indeed May 2027?",
    at: 248,
    pinned: true,
    verified: true,
    flagged: false,
    upvotes: 38,
  },
  {
    id: "q2",
    asker: "Riya P.",
    initial: "R",
    tier: "gold",
    societyVerified: true,
    text: "Distance to Sector 67 Rapid Metro — brochure says 1.8 km but maps show 2.4 km?",
    at: 412,
    pinned: false,
    verified: true,
    flagged: false,
    upvotes: 21,
  },
  {
    id: "q3",
    asker: "Karan T.",
    initial: "K",
    tier: "silver",
    societyVerified: false,
    text: "Is the clubhouse fully ready or only one wing operational?",
    at: 540,
    pinned: false,
    verified: false,
    flagged: false,
    upvotes: 9,
  },
  {
    id: "q4",
    asker: "Anonymous",
    initial: "?",
    tier: "visitor",
    societyVerified: false,
    text: "Will give 5 lakh discount if we book today??",
    at: 612,
    pinned: false,
    verified: false,
    flagged: true,
    upvotes: 0,
  },
];

// ───────────────── Claims governance log ─────────────────

export interface ClaimLog {
  id: string;
  /** Seconds since session start. */
  at: number;
  speaker: string;
  claim: string;
  category: "Pricing" | "Handover" | "Amenity" | "Distance" | "Approval";
  verified: boolean;
  evidenceUrl?: string;
  flagged?: { by: string; note: string };
}

export const CLAIMS_LOG: ClaimLog[] = [
  { id: "cl1", at: 142, speaker: "Anika Sharma", claim: "Possession committed for May 2027.", category: "Handover", verified: true, evidenceUrl: "rera.gov.in/agreement/468" },
  { id: "cl2", at: 226, speaker: "Anika Sharma", claim: "Escrow deployed to 64% — verified statement available.", category: "Approval", verified: true, evidenceUrl: "fact-sheet.pdf" },
  { id: "cl3", at: 388, speaker: "Anika Sharma", claim: "Distance to Sector 67 Rapid Metro is 1.8 km.", category: "Distance", verified: false, flagged: { by: "Riya P. (Gold)", note: "Maps measure 2.4 km via Golf Course Ext Road." } },
  { id: "cl4", at: 502, speaker: "Anika Sharma", claim: "Clubhouse is fully operational from Phase 1 launch.", category: "Amenity", verified: false },
  { id: "cl5", at: 588, speaker: "Anika Sharma", claim: "₹2.4 Cr starting price for 3 BHK in Tower B.", category: "Pricing", verified: true, evidenceUrl: "price-list-may.pdf" },
];

// ───────────────── Tipping & bounties ─────────────────

export interface TipPreset {
  amount: number;
  label: string;
  note?: string;
}

export const TIP_PRESETS: TipPreset[] = [
  { amount: 51, label: "₹51", note: "Quick thanks" },
  { amount: 201, label: "₹201", note: "Helpful insight" },
  { amount: 501, label: "₹501", note: "Saved me a site visit" },
  { amount: 1100, label: "₹1,100", note: "Locality Legend bounty" },
];

// ───────────────── Premium reports paywall ─────────────────

export interface PremiumReport {
  id: string;
  title: string;
  author: string;
  authorTier: TierId;
  pages: number;
  pricePaise: number;
  summary: string;
  buyers: number;
}

export const PREMIUM_REPORTS: PremiumReport[] = [
  {
    id: "r1",
    title: "Sector 65 metro extension — noise & price impact",
    author: "Anika Sharma",
    authorTier: "legend",
    pages: 14,
    pricePaise: 19900,
    summary: "Pre vs post construction noise readings, comparable price moves in 5 nearby sectors.",
    buyers: 218,
  },
  {
    id: "r2",
    title: "DTCP approval audit — 12 Gurgaon launches",
    author: "Vivek Malhotra",
    authorTier: "legend",
    pages: 22,
    pricePaise: 49900,
    summary: "Status of building plan, fire NOC, environmental clearance for each project.",
    buyers: 91,
  },
  {
    id: "r3",
    title: "Resident-only · Tower B traffic & amenity report",
    author: "Riya Patel",
    authorTier: "gold",
    pages: 8,
    pricePaise: 9900,
    summary: "Field observations across 30 days — peak hour traffic, pool & gym wait times, security incidents.",
    buyers: 412,
  },
];

// ───────────────── Digitour markers ─────────────────

export type MarkerKind = "noise" | "view" | "sunlight" | "traffic" | "vastu";

export interface DigitourMarker {
  id: string;
  /** Position in % on the static plan/photo (0-100). */
  x: number;
  y: number;
  kind: MarkerKind;
  label: string;
  by: string;
  verified: boolean;
}

export const MARKER_META: Record<MarkerKind, { label: string; color: string; glyph: string }> = {
  noise: { label: "Noise hotspot", color: "#e11d48", glyph: "🔊" },
  view: { label: "View obstruction", color: "#f59e0b", glyph: "👁" },
  sunlight: { label: "Low sunlight", color: "#0ea5b7", glyph: "☀" },
  traffic: { label: "Traffic congestion", color: "#7c3aed", glyph: "🚗" },
  vastu: { label: "Vastu concern", color: "#10b981", glyph: "🧭" },
};

export const DIGITOUR_MARKERS: DigitourMarker[] = [
  { id: "m1", x: 22, y: 38, kind: "noise", label: "Tower A — east face on Sector 65 road", by: "Vivek M.", verified: true },
  { id: "m2", x: 58, y: 24, kind: "view", label: "Tower B floors 4-9 obstructed by upcoming Tower D", by: "Anika S.", verified: true },
  { id: "m3", x: 72, y: 64, kind: "sunlight", label: "Pool deck shaded after 4 PM in winter", by: "Riya P.", verified: false },
  { id: "m4", x: 38, y: 78, kind: "traffic", label: "Exit gate backs up 7-9 AM on weekdays", by: "Karan T.", verified: true },
  { id: "m5", x: 84, y: 44, kind: "vastu", label: "Some 4 BHK units have south-east kitchen", by: "Meera J.", verified: false },
];

// ───────────────── Stream quality / data saver ─────────────────

export type StreamQuality = "audio" | "data-saver" | "auto" | "hd";

export const QUALITY_OPTIONS: { id: StreamQuality; label: string; sub: string }[] = [
  { id: "audio", label: "Audio only", sub: "~50 kbps · saves data" },
  { id: "data-saver", label: "Data saver", sub: "144p · 4G congested" },
  { id: "auto", label: "Auto", sub: "Adapts to bandwidth" },
  { id: "hd", label: "HD 720p", sub: "Best quality · Wi-Fi" },
];

// ───────────────── Mock chat seed ─────────────────

export interface MockChatMessage {
  id: string;
  name: string;
  initial: string;
  tier: TierId;
  societyVerified?: boolean;
  isHost?: boolean;
  text: string;
  /** Seconds since session start. */
  at: number;
  isQuestion?: boolean;
}

export const MOCK_CHAT_MESSAGES: MockChatMessage[] = [
  {
    id: "m1",
    name: "Anika Sharma",
    initial: "A",
    tier: "legend",
    isHost: true,
    text: "Welcome everyone. Walking the clubhouse first, towers next. Drop questions anytime — verifying live.",
    at: 8,
  },
  {
    id: "m2",
    name: "Vivek M.",
    initial: "V",
    tier: "legend",
    societyVerified: true,
    text: "Clubhouse looks great. Resident perspective: pool stays open till 10 PM, gym is fully stocked.",
    at: 42,
  },
  {
    id: "m3",
    name: "Riya P.",
    initial: "R",
    tier: "gold",
    societyVerified: true,
    text: "Quick question — is the metro really 1.8 km? Maps shows 2.4 km via Golf Course Ext Road.",
    at: 78,
    isQuestion: true,
  },
  {
    id: "m4",
    name: "Karan T.",
    initial: "K",
    tier: "silver",
    text: "Are 3 BHK units in Tower B east-facing or west-facing?",
    at: 124,
    isQuestion: true,
  },
  {
    id: "m5",
    name: "Meera J.",
    initial: "M",
    tier: "silver",
    societyVerified: true,
    text: "EMI options for first-time home buyers — any tie-ups with HDFC or SBI?",
    at: 168,
    isQuestion: true,
  },
  {
    id: "m6",
    name: "Anika Sharma",
    initial: "A",
    tier: "legend",
    isHost: true,
    text: "Riya — fair point, brochure number is straight-line. Updating fact sheet to 2.4 km road distance.",
    at: 195,
  },
  {
    id: "m7",
    name: "Devika S.",
    initial: "D",
    tier: "visitor",
    text: "Is parking 1 or 2 covered slots per unit?",
    at: 232,
    isQuestion: true,
  },
  {
    id: "m8",
    name: "Sahil B.",
    initial: "S",
    tier: "gold",
    text: "Booked here last year — handover delays were the only concern, but RERA escrow is reassuring now.",
    at: 268,
  },
  {
    id: "m9",
    name: "Pooja N.",
    initial: "P",
    tier: "silver",
    text: "Can we get the floor plan PDF in the Docs tab?",
    at: 301,
    isQuestion: true,
  },
];

// ───────────────── Code of Conduct ─────────────────

export interface ConductRule {
  id: string;
  title: string;
  description: string;
  /** Lucide icon name — caller picks the component. */
  iconKey: "shield" | "users" | "ban" | "verified" | "scale" | "alert";
}

export const CODE_OF_CONDUCT: ConductRule[] = [
  {
    id: "c1",
    title: "Be respectful, always",
    description:
      "No hate speech, harassment, doxxing, or discriminatory language. First offence is a soft warn; second is a 7-day mute.",
    iconKey: "users",
  },
  {
    id: "c2",
    title: "No promotional spam",
    description:
      "Do not solicit DMs, share affiliate links, or pitch other projects in chat. Hosts may share docs only via the Docs tab.",
    iconKey: "ban",
  },
  {
    id: "c3",
    title: "Resident badges = real residents",
    description:
      "Falsely claiming Verified Resident status results in a permanent ban and removal from the locality leaderboard.",
    iconKey: "verified",
  },
  {
    id: "c4",
    title: "Brokers must be RERA-verified",
    description:
      "Hosting or co-hosting requires a valid state-issued RERA agent ID. Unverified accounts are limited to view-only.",
    iconKey: "shield",
  },
  {
    id: "c5",
    title: "Pricing & promise claims need a source",
    description:
      "Any claim about pricing, possession, amenities, or distances must cite the fact sheet, RERA filing, or be marked Opinion.",
    iconKey: "scale",
  },
  {
    id: "c6",
    title: "Flag, don't fight",
    description:
      "Use the Flag button in Q&A or chat to escalate. Locality Legends review flags within 12 hours.",
    iconKey: "alert",
  },
];

// ───────────────── FAQ ─────────────────

export interface FaqEntry {
  id: string;
  q: string;
  a: string;
  category: "Status" | "Verification" | "Money" | "Privacy" | "Stream";
}

export const FAQ: FaqEntry[] = [
  {
    id: "f1",
    q: "How do I become a Locality Legend?",
    a: "Reach 4,500 XP by attending events, getting Helpful ratings on your insights, and having answers marked Community Verified by Gold+ users. RWA roles or licensed professional status fast-tracks the badge.",
    category: "Status",
  },
  {
    id: "f2",
    q: "What does Community Verified mean?",
    a: "An answer or claim has been independently confirmed by at least one Gold-tier verified resident. Verification is logged in the governance trail and is reversible if challenged with evidence.",
    category: "Verification",
  },
  {
    id: "f3",
    q: "How do tipping and bounty payouts work?",
    a: "Tips are routed via UPI in real time. Brokers can post moderation bounties on Locality Legends — payout is held in escrow until the event ends and is released after a 24-hour dispute window. 2% platform fee.",
    category: "Money",
  },
  {
    id: "f4",
    q: "Are RERA documents on PropLive authentic?",
    a: "Every project we list is matched against the state RERA registry on ingest. The fact sheet PDF is generated from the live registry — if the project's RERA status changes, the badge in the room updates within an hour.",
    category: "Verification",
  },
  {
    id: "f5",
    q: "Can I get a refund on premium reports?",
    a: "Yes. Any premium report can be refunded within 24 hours of purchase, no questions asked. Authors keep IP — you lose access on refund.",
    category: "Money",
  },
  {
    id: "f6",
    q: "How is my data used?",
    a: "Identity is stored only for verified-resident proof and KYC of brokers. Chat is retained for 90 days for moderation. We never sell contact data to brokers — leads only flow on opt-in via the I'm Interested button.",
    category: "Privacy",
  },
  {
    id: "f7",
    q: "Why does chat sometimes drop on 4G?",
    a: "Switch to Data Saver (144p) or Audio-only mode in the stream toolbar. Both work reliably on congested 4G in tier-2/3 cities.",
    category: "Stream",
  },
];

// ───────────────── Helpers ─────────────────

export function formatRupees(rupees: number): string {
  return `₹${rupees.toLocaleString("en-IN")}`;
}

export function formatPaise(paise: number): string {
  return formatRupees(Math.round(paise / 100));
}
