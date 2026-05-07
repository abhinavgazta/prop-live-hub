import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Star, TrendingUp, TrendingDown, Activity, Check, Radio } from "lucide-react";
import {
  LOCALITY_METRICS,
  TONE_PAIRS,
  scoreColor,
  type LocalityMetric,
  type MetricId,
} from "@/lib/replayAnalyticsData";
import { METRIC_ICONS } from "@/components/replay/metricIcons";

type Vote = { stars: number };

const SAMPLE_VOTERS = [
  { name: "Karan T.", tier: "silver" as const },
  { name: "Riya P.", tier: "gold" as const },
  { name: "Vivek M.", tier: "legend" as const },
  { name: "Meera J.", tier: "silver" as const },
  { name: "Sahil B.", tier: "gold" as const },
  { name: "Anonymous", tier: "visitor" as const },
];

const TIER_BG: Record<"silver" | "gold" | "legend" | "visitor", string> = {
  silver: "bg-slate-200 text-slate-800",
  gold: "bg-amber-200 text-amber-900",
  legend: "bg-violet-200 text-violet-900",
  visitor: "bg-slate-100 text-slate-700",
};

interface ActivityEntry {
  id: number;
  voter: string;
  tier: keyof typeof TIER_BG;
  metricId: MetricId;
  metricLabel: string;
  stars: number;
}

export function LiveLocalityPulse({
  localityName = "Sector 65",
  compact = false,
}: {
  localityName?: string;
  /** Single-column layout for narrow contexts (e.g., 400px sidebar). */
  compact?: boolean;
}) {
  const [votes, setVotes] = useState<Record<MetricId, Vote>>({} as Record<MetricId, Vote>);
  const [hover, setHover] = useState<Record<MetricId, number>>({} as Record<MetricId, number>);
  const [xpGained, setXpGained] = useState(0);
  const [xpFlash, setXpFlash] = useState(false);
  const [voterCount, setVoterCount] = useState(284);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const idRef = useRef(0);

  // Simulate live vote stream while the component is mounted.
  useEffect(() => {
    const tick = () => {
      const metric = LOCALITY_METRICS[Math.floor(Math.random() * LOCALITY_METRICS.length)];
      const voter = SAMPLE_VOTERS[Math.floor(Math.random() * SAMPLE_VOTERS.length)];
      const stars = Math.max(1, Math.min(5, Math.round(metric.votes.avg + (Math.random() - 0.5))));
      idRef.current += 1;
      const entry: ActivityEntry = {
        id: idRef.current,
        voter: voter.name,
        tier: voter.tier,
        metricId: metric.id,
        metricLabel: metric.label,
        stars,
      };
      setActivity((prev) => [entry, ...prev].slice(0, 5));
      setVoterCount((c) => c + 1);
    };
    const i = setInterval(tick, 2400);
    return () => clearInterval(i);
  }, []);

  const submittedCount = useMemo(() => Object.keys(votes).length, [votes]);

  const submit = (metric: LocalityMetric, stars: number) => {
    const isFirstForMetric = !votes[metric.id];
    setVotes((prev) => ({ ...prev, [metric.id]: { stars } }));
    if (isFirstForMetric) {
      setXpGained((x) => x + 5);
      setXpFlash(true);
      setTimeout(() => setXpFlash(false), 1100);
      // Push your own vote to the activity feed
      idRef.current += 1;
      const myEntry: ActivityEntry = {
        id: idRef.current,
        voter: "You",
        tier: "gold",
        metricId: metric.id,
        metricLabel: metric.label,
        stars,
      };
      setActivity((prev) => [myEntry, ...prev].slice(0, 5));
      setVoterCount((c) => c + 1);
    }
  };

  return (
    <section className="relative rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header
        className={`flex flex-wrap items-start gap-3 border-b border-slate-200 ${
          compact ? "px-4 py-3" : "px-5 py-4"
        }`}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-900">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-sm font-bold leading-tight text-slate-900">
              Score this locality, live
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-rose-500 opacity-70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-rose-500" />
              </span>
              Capturing
            </span>
          </div>
          <p className={`text-slate-600 ${compact ? "mt-0.5 text-[11px] leading-snug" : "text-[12px]"}`}>
            Your vote on {localityName} feeds back into the public Life Index shown on replays and
            the discovery map. Verified residents 2× · Legends 4× weight.
          </p>
        </div>
        <div className={`flex items-center gap-3 ${compact ? "w-full justify-between" : ""}`}>
          <div className={compact ? "text-left" : "text-right"}>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Live voters
            </div>
            <div
              className={`flex items-center gap-1 text-base font-bold text-slate-900 tabular-nums ${
                compact ? "" : "justify-end"
              }`}
            >
              <Activity className="h-4 w-4 text-emerald-600" />
              {voterCount.toLocaleString()}
            </div>
          </div>
          <div
            className={`transition ${compact ? "text-right" : "text-right"} ${
              xpFlash ? "scale-110 text-emerald-700" : "text-slate-700"
            }`}
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Your XP
            </div>
            <div className="text-base font-bold tabular-nums">+{xpGained}</div>
          </div>
        </div>
      </header>

      {/* Live activity ticker */}
      <div
        className={`border-b border-slate-100 bg-slate-50 ${
          compact ? "px-4 py-2" : "px-5 py-2.5"
        }`}
      >
        <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          <Radio className="h-3 w-3 text-rose-600" />
          Latest votes
        </div>
        {activity.length === 0 ? (
          <div className="text-[11px] text-slate-500">
            Waiting for the first votes — be the first to score below.
          </div>
        ) : (
          <ul
            className={
              compact
                ? "flex max-h-[80px] flex-col gap-1 overflow-hidden"
                : "flex flex-wrap items-center gap-1.5"
            }
          >
            {(compact ? activity.slice(0, 3) : activity).map((a) => (
              <li
                key={a.id}
                className={`inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-0.5 text-[11px] ring-1 ring-slate-200 ${
                  a.voter === "You" ? "ring-primary/40 bg-primary/5" : ""
                }`}
              >
                <span
                  className={`rounded-full px-1.5 py-0 text-[9px] font-bold ${TIER_BG[a.tier]}`}
                >
                  {a.tier}
                </span>
                <span className="truncate font-semibold text-slate-900">{a.voter}</span>
                <span className="text-slate-500">→</span>
                <span className="truncate text-slate-700">{a.metricLabel}</span>
                <span className="ml-auto inline-flex items-center font-semibold text-amber-600">
                  {a.stars}
                  <Star className="ml-0.5 h-3 w-3 fill-amber-500 text-amber-500" />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sub-header with progress */}
      <div
        className={`flex flex-wrap items-center gap-3 border-b border-slate-100 ${
          compact ? "px-4 py-2" : "px-5 py-2.5"
        }`}
      >
        <div className="text-[11px] font-semibold text-slate-700">
          {submittedCount} / {LOCALITY_METRICS.length} rated
        </div>
        <div className={`h-1.5 ${compact ? "flex-1" : "w-32"} overflow-hidden rounded-full bg-slate-200`}>
          <div
            className="h-full rounded-full bg-violet-500 transition-all"
            style={{
              width: `${(submittedCount / LOCALITY_METRICS.length) * 100}%`,
            }}
          />
        </div>
        <span
          className={`text-[11px] text-slate-500 ${compact ? "w-full" : "ml-auto"}`}
        >
          +5 XP each · +50 bonus for all
        </span>
      </div>

      {/* Metric rows — single column when compact, responsive grid otherwise */}
      <ul
        className={
          compact
            ? "flex flex-col gap-px bg-slate-100"
            : "grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {LOCALITY_METRICS.map((m) => (
          <PulseRow
            key={m.id}
            metric={m}
            myVote={votes[m.id]}
            hover={hover[m.id] ?? 0}
            onHover={(stars) => setHover((p) => ({ ...p, [m.id]: stars }))}
            onLeave={() => setHover((p) => ({ ...p, [m.id]: 0 }))}
            onVote={(stars) => submit(m, stars)}
            compact={compact}
          />
        ))}
      </ul>
    </section>
  );
}

function PulseRow({
  metric,
  myVote,
  hover,
  onHover,
  onLeave,
  onVote,
  compact,
}: {
  metric: LocalityMetric;
  myVote?: Vote;
  hover: number;
  onHover: (stars: number) => void;
  onLeave: () => void;
  onVote: (stars: number) => void;
  compact?: boolean;
}) {
  const tone = TONE_PAIRS[metric.tone];
  const judgement = scoreColor(metric.score);
  const Icon = METRIC_ICONS[metric.iconKey];

  const judgementBg: Record<typeof judgement.tone, string> = {
    emerald: "bg-emerald-100 text-emerald-900",
    lime: "bg-lime-100 text-lime-900",
    amber: "bg-amber-100 text-amber-900",
    rose: "bg-rose-100 text-rose-900",
  };

  return (
    <li
      className={`flex items-center gap-3 bg-white transition hover:bg-slate-50 ${
        compact ? "px-3 py-2.5" : "px-4 py-3"
      }`}
    >
      <span
        className={`grid shrink-0 place-items-center rounded-full ${tone.fill} ${tone.text} ${
          compact ? "h-8 w-8" : "h-9 w-9"
        }`}
      >
        <Icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[13px] font-bold leading-tight text-slate-900">
            {metric.label}
          </span>
          <span
            className={`shrink-0 rounded-full px-1.5 py-0 text-[9px] font-semibold ${judgementBg[judgement.tone]}`}
          >
            {metric.score}
          </span>
          <span
            className={`shrink-0 inline-flex items-center gap-0.5 text-[10px] font-semibold ${
              metric.trend >= 0 ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {metric.trend >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {metric.trend >= 0 ? "+" : ""}
            {metric.trend}
          </span>
        </div>
        {!compact && (
          <div className="mt-0.5 truncate text-[11px] text-slate-600">
            {metric.facts[0]?.value}
          </div>
        )}
        <div className={`overflow-hidden rounded-full bg-slate-100 ${compact ? "mt-1 h-0.5" : "mt-1 h-1"}`}>
          <div
            className={`h-full rounded-full ${tone.bar}`}
            style={{ width: `${metric.score}%` }}
          />
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-0.5" onMouseLeave={onLeave}>
        <div className="inline-flex items-center gap-0">
          {[1, 2, 3, 4, 5].map((star) => {
            const display = hover || myVote?.stars || 0;
            const filled = star <= display;
            const px = compact ? 14 : 16;
            return (
              <button
                key={star}
                onMouseEnter={() => onHover(star)}
                onClick={() => onVote(star)}
                aria-label={`Rate ${metric.label} ${star} stars`}
                className="rounded-sm p-0.5 transition hover:scale-110"
              >
                <Star
                  className={filled ? "fill-amber-500 text-amber-500" : "text-slate-300"}
                  style={{ width: px, height: px }}
                />
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          {myVote ? (
            <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-700">
              <Check className="h-3 w-3" /> +5 XP
            </span>
          ) : compact ? (
            <span>
              {shortNum(metric.votes.count)} · {metric.votes.avg.toFixed(1)}★
            </span>
          ) : (
            <span>
              {shortNum(metric.votes.count)} votes · {metric.votes.avg.toFixed(1)} avg
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

function shortNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default LiveLocalityPulse;
