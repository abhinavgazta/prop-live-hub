import { useMemo, useState } from "react";
import { Sparkles, TrendingUp, TrendingDown, Star, Check } from "lucide-react";
import {
  LOCALITY_METRICS,
  TONE_PAIRS,
  scoreColor,
  type LocalityMetric,
  type MetricId,
} from "@/lib/replayAnalyticsData";
import { METRIC_ICONS, METRIC_STROKE_HEX } from "@/components/replay/metricIcons";

type Vote = { stars: number; submitted: boolean };

export function LocalityScoreGrid({ localityName = "Sector 65" }: { localityName?: string }) {
  const [votes, setVotes] = useState<Record<MetricId, Vote>>({} as Record<MetricId, Vote>);
  const [hovering, setHovering] = useState<Record<MetricId, number>>({} as Record<MetricId, number>);

  const headline = useMemo(() => LOCALITY_METRICS[0], []);
  const grid = useMemo(() => LOCALITY_METRICS.slice(1), []);

  const submit = (id: MetricId, stars: number) =>
    setVotes((prev) => ({ ...prev, [id]: { stars, submitted: true } }));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Locality Life Index
          </div>
          <h3 className="text-base font-bold text-slate-900">
            How {localityName} actually lives — community-rated
          </h3>
          <p className="mt-0.5 text-[12px] text-slate-600">
            Platform scores from public data + local sensors. Tap stars to rate from your lived
            experience — votes feed back into the index.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700">
          <Sparkles className="h-3.5 w-3.5 text-violet-600" />
          {LOCALITY_METRICS.reduce((sum, m) => sum + m.votes.count, 0).toLocaleString()} community
          votes
        </span>
      </header>

      <HeadlineCard
        metric={headline}
        myVote={votes[headline.id]}
        hover={hovering[headline.id] ?? 0}
        onHover={(stars) =>
          setHovering((prev) => ({ ...prev, [headline.id]: stars }))
        }
        onLeave={() =>
          setHovering((prev) => ({ ...prev, [headline.id]: 0 }))
        }
        onVote={(stars) => submit(headline.id, stars)}
      />

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {grid.map((m) => (
          <MetricCard
            key={m.id}
            metric={m}
            myVote={votes[m.id]}
            hover={hovering[m.id] ?? 0}
            onHover={(stars) =>
              setHovering((prev) => ({ ...prev, [m.id]: stars }))
            }
            onLeave={() =>
              setHovering((prev) => ({ ...prev, [m.id]: 0 }))
            }
            onVote={(stars) => submit(m.id, stars)}
          />
        ))}
      </div>

      <p className="mt-4 text-[11px] leading-snug text-slate-500">
        Voting data is aggregated at the society + locality level, anonymised, and refreshed daily.
        Verified residents' votes carry 2× weight; Locality Legends 4×.
      </p>
    </section>
  );
}

function HeadlineCard({
  metric,
  myVote,
  hover,
  onHover,
  onLeave,
  onVote,
}: {
  metric: LocalityMetric;
  myVote?: Vote;
  hover: number;
  onHover: (stars: number) => void;
  onLeave: () => void;
  onVote: (stars: number) => void;
}) {
  const tone = TONE_PAIRS[metric.tone];
  const judgement = scoreColor(metric.score);
  const Icon = METRIC_ICONS[metric.iconKey];

  return (
    <div
      className={`relative grid items-center gap-4 rounded-2xl border border-slate-200 ${tone.soft} p-5 md:grid-cols-[auto_1fr_auto]`}
    >
      <Gauge score={metric.score} stroke={METRIC_STROKE_HEX[metric.tone]} size={92} />

      <div>
        <div className="flex items-center gap-2">
          <span className={`grid h-8 w-8 place-items-center rounded-full ${tone.fill} ${tone.text}`}>
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              {metric.label}
            </div>
            <div className="text-base font-bold text-slate-900">{metric.caption}</div>
          </div>
          <TrendChip trend={metric.trend} />
        </div>

        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {metric.facts.map((f) => (
            <div key={f.label} className="rounded-lg bg-white px-3 py-1.5 ring-1 ring-slate-200">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {f.label}
              </div>
              <div className="text-[13px] font-bold text-slate-900">{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="md:text-right">
        <ScoreBadge label={judgement.label} tone={judgement.tone} />
        <div className="mt-2 flex items-center justify-end gap-2 md:flex-col md:items-end">
          <StarRow
            value={myVote?.stars ?? 0}
            hover={hover}
            avg={metric.votes.avg}
            onHover={onHover}
            onLeave={onLeave}
            onVote={onVote}
            size="lg"
          />
          <VoteSummary metric={metric} myVote={myVote} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  metric,
  myVote,
  hover,
  onHover,
  onLeave,
  onVote,
}: {
  metric: LocalityMetric;
  myVote?: Vote;
  hover: number;
  onHover: (stars: number) => void;
  onLeave: () => void;
  onVote: (stars: number) => void;
}) {
  const tone = TONE_PAIRS[metric.tone];
  const judgement = scoreColor(metric.score);
  const Icon = METRIC_ICONS[metric.iconKey];

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-md">
      <header className="flex items-start gap-2.5">
        <span className={`grid h-9 w-9 place-items-center rounded-full ${tone.fill} ${tone.text}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-bold leading-tight text-slate-900">{metric.label}</div>
          <div className="text-[11px] leading-snug text-slate-600">{metric.caption}</div>
        </div>
        <TrendChip trend={metric.trend} small />
      </header>

      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900">{metric.score}</span>
          <span className="text-[11px] font-semibold text-slate-500">/ 100</span>
          <span className="ml-auto">
            <ScoreBadge label={judgement.label} tone={judgement.tone} small />
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${tone.bar} transition-all`}
            style={{ width: `${metric.score}%` }}
          />
        </div>
      </div>

      <ul className="space-y-0.5 text-[11px]">
        {metric.facts.map((f) => (
          <li key={f.label} className="flex items-baseline justify-between gap-2">
            <span className="text-slate-500">{f.label}</span>
            <span className="text-right font-semibold text-slate-900">{f.value}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto rounded-xl bg-slate-50 px-3 py-2">
        <div className="flex items-center justify-between">
          <StarRow
            value={myVote?.stars ?? 0}
            hover={hover}
            avg={metric.votes.avg}
            onHover={onHover}
            onLeave={onLeave}
            onVote={onVote}
          />
          <VoteSummary metric={metric} myVote={myVote} compact />
        </div>
      </div>
    </article>
  );
}

function Gauge({
  score,
  stroke,
  size = 84,
}: {
  score: number;
  stroke: string;
  size?: number;
}) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(15,23,42,0.08)"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeLinecap="round"
          strokeWidth={10}
          strokeDasharray={c}
          strokeDashoffset={offset}
          stroke={stroke}
          className="transition-[stroke-dashoffset]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold leading-none text-slate-900">{score}</span>
        <span className="text-[9px] font-semibold uppercase text-slate-500">/ 100</span>
      </div>
    </div>
  );
}

function StarRow({
  value,
  hover,
  avg,
  onHover,
  onLeave,
  onVote,
  size = "sm",
}: {
  value: number;
  hover: number;
  avg: number;
  onHover: (stars: number) => void;
  onLeave: () => void;
  onVote: (stars: number) => void;
  size?: "sm" | "lg";
}) {
  const px = size === "lg" ? 20 : 16;
  const display = hover || value || Math.round(avg);

  return (
    <div className="inline-flex items-center gap-0.5" onMouseLeave={onLeave}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display;
        const isMine = value >= star;
        return (
          <button
            key={star}
            onMouseEnter={() => onHover(star)}
            onClick={() => onVote(star)}
            aria-label={`Rate ${star} stars`}
            className="rounded-sm p-0.5 transition hover:scale-110"
          >
            <Star
              className={
                filled
                  ? isMine
                    ? "fill-amber-500 text-amber-500"
                    : hover && star <= hover
                      ? "fill-amber-500 text-amber-500"
                      : "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              }
              style={{ width: px, height: px }}
            />
          </button>
        );
      })}
    </div>
  );
}

function VoteSummary({
  metric,
  myVote,
  compact,
}: {
  metric: LocalityMetric;
  myVote?: Vote;
  compact?: boolean;
}) {
  const totalVotes =
    metric.votes.count + (myVote?.submitted ? 1 : 0);
  return (
    <div className={`text-right ${compact ? "" : "space-y-0.5"}`}>
      {!compact && (
        <div className="text-[11px] font-bold text-slate-900">
          {metric.votes.avg.toFixed(1)} / 5 avg
        </div>
      )}
      <div className="text-[10px] font-medium text-slate-500">
        {compact ? `${metric.votes.avg.toFixed(1)} · ${shortNum(totalVotes)}` : `${shortNum(totalVotes)} votes`}
      </div>
      {myVote?.submitted && (
        <div className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700">
          <Check className="h-3 w-3" /> Recorded
        </div>
      )}
    </div>
  );
}

function ScoreBadge({
  label,
  tone,
  small,
}: {
  label: string;
  tone: "emerald" | "lime" | "amber" | "rose";
  small?: boolean;
}) {
  const map: Record<typeof tone, string> = {
    emerald: "bg-emerald-100 text-emerald-900",
    lime: "bg-lime-100 text-lime-900",
    amber: "bg-amber-100 text-amber-900",
    rose: "bg-rose-100 text-rose-900",
  };
  return (
    <span
      className={`inline-block rounded-full font-semibold ${map[tone]} ${
        small ? "px-2 py-0 text-[9px]" : "px-2.5 py-1 text-[11px]"
      }`}
    >
      {label}
    </span>
  );
}

function TrendChip({ trend, small }: { trend: number; small?: boolean }) {
  const positive = trend >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full font-semibold ${
        positive ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
      } ${small ? "px-1.5 py-0 text-[9px]" : "px-2 py-0.5 text-[10px]"}`}
    >
      <Icon className="h-3 w-3" />
      {positive ? "+" : ""}
      {trend} YoY
    </span>
  );
}

function shortNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default LocalityScoreGrid;
