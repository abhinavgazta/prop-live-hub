import { useMemo, useState } from "react";
import {
  MessageSquare,
  Heart,
  Pin,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Flag,
  PlayCircle,
} from "lucide-react";
import {
  KEY_MOMENTS,
  REPLAY_CHAT,
  formatTimestamp,
  type ChatTier,
  type KeyMoment,
} from "@/lib/replayAnalyticsData";

const TIER_BADGE: Record<ChatTier, { bg: string; text: string; label: string }> = {
  legend: { bg: "bg-violet-100", text: "text-violet-900", label: "Legend" },
  gold: { bg: "bg-amber-100", text: "text-amber-900", label: "Gold" },
  silver: { bg: "bg-slate-200", text: "text-slate-800", label: "Silver" },
  visitor: { bg: "bg-slate-100", text: "text-slate-700", label: "Visitor" },
};

const MOMENT_TONE: Record<KeyMoment["kind"], { bg: string; text: string }> = {
  rera: { bg: "bg-emerald-100", text: "text-emerald-900" },
  verified: { bg: "bg-emerald-100", text: "text-emerald-900" },
  flag: { bg: "bg-amber-100", text: "text-amber-900" },
  question: { bg: "bg-sky-100", text: "text-sky-900" },
  highlight: { bg: "bg-violet-100", text: "text-violet-900" },
};

export function ReplayChatPanel({
  totalDurationSec = 720,
  onJumpTo,
}: {
  totalDurationSec?: number;
  onJumpTo?: (sec: number) => void;
}) {
  const [activeFilter, setActiveFilter] = useState<"all" | "questions" | "host" | "verified">("all");
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [activeMoment, setActiveMoment] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return REPLAY_CHAT;
    if (activeFilter === "questions") return REPLAY_CHAT.filter((c) => c.isQuestion);
    if (activeFilter === "host") return REPLAY_CHAT.filter((c) => c.isHost);
    return REPLAY_CHAT.filter((c) => c.societyVerified || c.tier === "legend");
  }, [activeFilter]);

  const toggleLike = (id: string) =>
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));

  const filters: { id: typeof activeFilter; label: string; icon: React.ReactNode; count: number }[] = [
    { id: "all", label: "All", icon: <MessageSquare className="h-3.5 w-3.5" />, count: REPLAY_CHAT.length },
    {
      id: "questions",
      label: "Questions",
      icon: <HelpCircle className="h-3.5 w-3.5" />,
      count: REPLAY_CHAT.filter((c) => c.isQuestion).length,
    },
    {
      id: "host",
      label: "Host",
      icon: <Sparkles className="h-3.5 w-3.5" />,
      count: REPLAY_CHAT.filter((c) => c.isHost).length,
    },
    {
      id: "verified",
      label: "Verified",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      count: REPLAY_CHAT.filter((c) => c.societyVerified || c.tier === "legend").length,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
            <MessageSquare className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold leading-tight text-slate-900">Replay chat</h3>
            <p className="text-[11px] text-slate-600">
              Comments synced to the moment they were posted — click a timestamp to jump.
            </p>
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                activeFilter === f.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {f.icon}
              {f.label}
              <span
                className={`rounded-full px-1 text-[9px] font-bold ${
                  activeFilter === f.id ? "bg-white/20" : "bg-white text-slate-700"
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Key moments timeline */}
      <div className="border-b border-slate-200 px-5 py-3">
        <div className="mb-2 flex items-center gap-2 text-[11px]">
          <span className="font-semibold uppercase tracking-wider text-slate-600">
            Key moments
          </span>
          <span className="text-slate-500">{KEY_MOMENTS.length} highlights</span>
        </div>
        <div className="relative h-2 rounded-full bg-slate-100">
          {KEY_MOMENTS.map((m) => {
            const left = (m.at / totalDurationSec) * 100;
            const tone = MOMENT_TONE[m.kind];
            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMoment(m.id === activeMoment ? null : m.id);
                  onJumpTo?.(m.at);
                }}
                onMouseEnter={() => setActiveMoment(m.id)}
                onMouseLeave={() => setActiveMoment(null)}
                className={`absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full ring-2 ring-white transition hover:scale-125 ${tone.bg}`}
                style={{ left: `${left}%` }}
                aria-label={`${m.label} at ${formatTimestamp(m.at)}`}
              >
                <span className={`block h-full w-full rounded-full ${tone.bg}`} />
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {KEY_MOMENTS.map((m) => {
            const tone = MOMENT_TONE[m.kind];
            const isActive = activeMoment === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onJumpTo?.(m.at)}
                onMouseEnter={() => setActiveMoment(m.id)}
                onMouseLeave={() => setActiveMoment(null)}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition ${tone.bg} ${tone.text} ${
                  isActive ? "ring-2 ring-slate-900/10" : ""
                }`}
              >
                <PlayCircle className="h-3 w-3" />
                {formatTimestamp(m.at)} · {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <ul className="max-h-[440px] divide-y divide-slate-100 overflow-y-auto">
        {filtered.map((c) => {
          const tier = TIER_BADGE[c.tier];
          const liked = !!likes[c.id];
          return (
            <li
              key={c.id}
              className={`flex gap-3 px-5 py-3 transition hover:bg-slate-50 ${
                c.isHost ? "bg-amber-50/40" : c.isQuestion ? "bg-sky-50/40" : ""
              }`}
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-200 text-[12px] font-bold text-slate-800">
                {c.initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[12px] font-semibold text-slate-900">{c.name}</span>
                  <span className={`rounded-full px-1.5 py-0 text-[9px] font-semibold ${tier.bg} ${tier.text}`}>
                    {tier.label}
                  </span>
                  {c.societyVerified && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0 text-[9px] font-semibold text-emerald-900">
                      <ShieldCheck className="h-2.5 w-2.5" /> Resident
                    </span>
                  )}
                  {c.isHost && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-200 px-1.5 py-0 text-[9px] font-semibold text-amber-900">
                      <Sparkles className="h-2.5 w-2.5" /> Host
                    </span>
                  )}
                  {c.isQuestion && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-100 px-1.5 py-0 text-[9px] font-semibold text-sky-900">
                      <HelpCircle className="h-2.5 w-2.5" /> Question
                    </span>
                  )}
                  <button
                    onClick={() => onJumpTo?.(c.at)}
                    className="ml-auto inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700 hover:bg-slate-200"
                    title={`Jump to ${formatTimestamp(c.at)}`}
                  >
                    <PlayCircle className="h-3 w-3" />
                    {formatTimestamp(c.at)}
                  </button>
                </div>
                <p className="mt-1 text-[13px] leading-snug text-slate-900">{c.text}</p>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-600">
                  <button
                    onClick={() => toggleLike(c.id)}
                    className={`inline-flex items-center gap-1 font-semibold transition ${
                      liked ? "text-rose-600" : "hover:text-slate-900"
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${liked ? "fill-rose-600" : ""}`} />
                    {(c.likes + (liked ? 1 : 0)).toLocaleString()}
                  </button>
                  <button className="inline-flex items-center gap-1 font-semibold hover:text-slate-900">
                    <Pin className="h-3.5 w-3.5" />
                    Save
                  </button>
                  <button className="inline-flex items-center gap-1 font-semibold hover:text-slate-900">
                    <Flag className="h-3.5 w-3.5" />
                    Report
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default ReplayChatPanel;
