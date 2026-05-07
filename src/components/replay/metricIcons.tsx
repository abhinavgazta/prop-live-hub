import {
  Sparkles,
  Construction,
  Droplet,
  Wind,
  Trees,
  Flame,
  Siren,
  Stethoscope,
  School,
  Footprints,
  PawPrint,
  ShoppingBag,
  Carrot,
} from "lucide-react";
import type { IconKey, LocalityMetric } from "@/lib/replayAnalyticsData";

export const METRIC_ICONS: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  construction: Construction,
  droplet: Droplet,
  wind: Wind,
  trees: Trees,
  flame: Flame,
  siren: Siren,
  stethoscope: Stethoscope,
  school: School,
  footprints: Footprints,
  paw: PawPrint,
  "shopping-bag": ShoppingBag,
  carrot: Carrot,
};

export const METRIC_STROKE_HEX: Record<LocalityMetric["tone"], string> = {
  primary: "#8b5cf6",
  slate: "#64748b",
  sky: "#0ea5e9",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  violet: "#8b5cf6",
  lime: "#84cc16",
  teal: "#14b8a6",
  indigo: "#6366f1",
  orange: "#f97316",
};
