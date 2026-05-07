import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@livekit/components-react";
import {
  MessageSquare,
  HelpCircle,
  Trophy,
  FileText,
  Send,
  Pin,
  ShieldCheck,
  Flag,
  Sparkles,
  ChevronUp,
  Crown,
  Star,
  ArrowRight,
  Download,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CLAIMS_LOG,
  HOST,
  LEADERBOARD,
  MOCK_CHAT_MESSAGES,
  MY_PROFILE,
  PROJECT,
  QA_SEED,
  TIERS,
  nextTier,
  tierFromXp,
  type QAItem,
  type TierId,
} from "@/lib/liveRoomMockData";

type Tab = "chat" | "qa" | "status" | "docs";

type Props = {
  onOpenTip: (target: { name: string; role: "Locality Legend" | "Host" }) => void;
  onOpenPaywall: () => void;
};

export function LiveSidebarTabs({ onOpenTip, onOpenPaywall }: Props) {
  const [tab, setTab] = useState<Tab>("chat");

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: "chat", label: "Chat", icon: <MessageSquare className="h-3.5 w-3.5" /> },
    {
      id: "qa",
      label: "Q&A",
      icon: <HelpCircle className="h-3.5 w-3.5" />,
      badge: QA_SEED.filter((q) => !q.flagged).length,
    },
    { id: "status", label: "Status", icon: <Trophy className="h-3.5 w-3.5" /> },
    { id: "docs", label: "Docs", icon: <FileText className="h-3.5 w-3.5" /> },
  ];

  return (
    <aside className="flex h-[640px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex shrink-0 items-center gap-1 border-b border-slate-200 p-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            data-sidebar-tab={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[12px] font-semibold transition ${
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.icon}
            {t.label}
            {t.badge !== undefined && (
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  tab === t.id ? "bg-white/25" : "bg-slate-200 text-slate-700"
                }`}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === "chat" && <ChatPane />}
        {tab === "qa" && <QaPane />}
        {tab === "status" && (
          <StatusPane onOpenTip={onOpenTip} onOpenPaywall={onOpenPaywall} />
        )}
        {tab === "docs" && <DocsPane />}
      </div>
    </aside>
  );
}

// ───────────────── Chat (LiveKit + mock seed) ─────────────────

type RenderableChat = {
  id: string;
  name: string;
  initial: string;
  tier: TierId;
  isHost: boolean;
  isLocal: boolean;
  isQuestion: boolean;
  societyVerified: boolean;
  text: string;
  /** Display string like "0:42" or "now". */
  ts: string;
};

function ChatPane() {
  const { chatMessages, send, isSending } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const merged = useMemo<RenderableChat[]>(() => {
    const seeded: RenderableChat[] = MOCK_CHAT_MESSAGES.map((m) => ({
      id: `seed-${m.id}`,
      name: m.name,
      initial: m.initial,
      tier: m.tier,
      isHost: !!m.isHost,
      isLocal: false,
      isQuestion: !!m.isQuestion,
      societyVerified: !!m.societyVerified,
      text: m.text,
      ts: formatClock(m.at),
    }));

    const live: RenderableChat[] = chatMessages.map((m) => {
      const name = m.from?.name || m.from?.identity || "Anonymous";
      return {
        id: m.id ?? `${name}-${m.timestamp}`,
        name,
        initial: name[0]?.toUpperCase() ?? "?",
        tier: pickTier(m.from?.identity ?? name),
        isHost: !!m.from?.identity?.startsWith("host-"),
        isLocal: !!m.from?.isLocal,
        isQuestion: m.message.trim().endsWith("?"),
        societyVerified: false,
        text: m.message,
        ts: "now",
      };
    });

    return [...seeded, ...live];
  }, [chatMessages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [merged.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    if (send) await send(text);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2.5">
        <Pin className="h-3.5 w-3.5 text-primary" />
        <div className="min-w-0">
          <div className="text-[11px] font-semibold text-slate-900">
            Pinned · Anika Sharma
          </div>
          <div className="truncate text-[11px] text-slate-600">
            Floor plans + RERA fact sheet are in the Docs tab.
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
        {merged.map((m) => (
          <ChatBubble key={m.id} m={m} />
        ))}
      </div>

      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 focus-within:border-primary focus-within:bg-white">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Ask anything…"
          />
          <button
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            aria-label="Send"
            className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-2 px-1 text-[10px] text-slate-500">
          Be respectful · End with ? to mark as a question · +2 XP for verified questions
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ m }: { m: RenderableChat }) {
  const tier = TIERS.find((t) => t.id === m.tier)!;
  // Material approach: filled tonal surface for hosts; outlined surface for everyone else.
  const surface = m.isHost
    ? "bg-amber-50 border border-amber-200"
    : m.isQuestion
      ? "bg-sky-50 border border-sky-200"
      : "bg-white border border-slate-200";

  return (
    <div className={`rounded-xl px-3 py-2 ${surface}`}>
      <div className="flex items-center gap-1.5">
        <div
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold"
          style={{ background: tier.color, color: "white" }}
        >
          {m.initial}
        </div>
        <span className="truncate text-[12px] font-semibold text-slate-900">{m.name}</span>
        <TierChip tier={m.tier} />
        {m.societyVerified && (
          <span
            title="Verified resident"
            className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0 text-[9px] font-semibold text-emerald-900"
          >
            <ShieldCheck className="h-2.5 w-2.5" />
            Resident
          </span>
        )}
        {m.isHost && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0 text-[9px] font-semibold text-amber-900">
            <Sparkles className="h-2.5 w-2.5" />
            Host
          </span>
        )}
        {m.isLocal && (
          <span className="rounded-full bg-primary/15 px-1.5 py-0 text-[9px] font-semibold text-primary">
            You
          </span>
        )}
        <span className="ml-auto shrink-0 text-[10px] text-slate-500">{m.ts}</span>
      </div>
      <div className="mt-1 pl-7 text-[13px] leading-snug text-slate-900">{m.text}</div>
    </div>
  );
}

// ───────────────── Q&A queue (Material tonal surfaces) ─────────────────

function QaPane() {
  const myTier = tierFromXp(MY_PROFILE.xp).id;
  const canModerate = myTier === "gold" || myTier === "legend";
  const [items, setItems] = useState<QAItem[]>(QA_SEED);

  const sorted = [...items].sort((a, b) => {
    if (a.flagged !== b.flagged) return a.flagged ? 1 : -1;
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (tierWeight(b.tier) !== tierWeight(a.tier)) return tierWeight(b.tier) - tierWeight(a.tier);
    return b.upvotes - a.upvotes;
  });

  const update = (id: string, patch: Partial<QAItem>) =>
    setItems((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] text-slate-700">
        Higher tiers move up the queue.{" "}
        {canModerate ? (
          <span className="font-semibold text-primary">
            You have Gold+ moderation: pin / verify / flag.
          </span>
        ) : (
          <>Gold+ residents can mark answers as Community Verified.</>
        )}
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {sorted.map((q) => (
          <QaCard key={q.id} q={q} canModerate={canModerate} update={update} />
        ))}
      </div>
    </div>
  );
}

function QaCard({
  q,
  canModerate,
  update,
}: {
  q: QAItem;
  canModerate: boolean;
  update: (id: string, patch: Partial<QAItem>) => void;
}) {
  // Material-style tonal surfaces: explicit 50-shade fill + 200-shade border + 900-shade text.
  const surface = q.flagged
    ? "bg-amber-50 border-amber-200"
    : q.pinned
      ? "bg-violet-50 border-violet-200"
      : q.verified
        ? "bg-emerald-50 border-emerald-200"
        : "bg-white border-slate-200";

  const tier = TIERS.find((t) => t.id === q.tier)!;

  return (
    <div className={`rounded-xl border p-3 ${surface}`}>
      <div className="flex items-start gap-2">
        <div
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white"
          style={{ background: tier.color }}
        >
          {q.initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[12px] font-semibold text-slate-900">{q.asker}</span>
            <TierChip tier={q.tier} />
            {q.societyVerified && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0 text-[9px] font-semibold text-emerald-900">
                <ShieldCheck className="h-2.5 w-2.5" /> Resident
              </span>
            )}
            {q.pinned && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-200 px-1.5 py-0 text-[9px] font-semibold text-violet-900">
                <Pin className="h-2.5 w-2.5" /> Pinned
              </span>
            )}
            {q.verified && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-200 px-1.5 py-0 text-[9px] font-semibold text-emerald-900">
                <ShieldCheck className="h-2.5 w-2.5" /> Verified
              </span>
            )}
            {q.flagged && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-200 px-1.5 py-0 text-[9px] font-semibold text-amber-900">
                <Flag className="h-2.5 w-2.5" /> Flagged
              </span>
            )}
          </div>
          <div className="mt-1 text-[13px] leading-snug text-slate-900">{q.text}</div>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-600">
            <span className="font-mono">at {formatClock(q.at)}</span>
            <button
              onClick={() => update(q.id, { upvotes: q.upvotes + 1 })}
              className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 hover:bg-slate-200"
            >
              <ChevronUp className="h-3 w-3" />
              {q.upvotes}
            </button>
            {canModerate && (
              <div className="ml-auto flex items-center gap-1">
                <ModBtn
                  active={q.pinned}
                  icon={<Pin className="h-3 w-3" />}
                  label="Pin"
                  onClick={() => update(q.id, { pinned: !q.pinned })}
                />
                <ModBtn
                  active={q.verified}
                  icon={<ShieldCheck className="h-3 w-3" />}
                  label="Verify"
                  onClick={() => update(q.id, { verified: !q.verified })}
                />
                <ModBtn
                  active={q.flagged}
                  icon={<Flag className="h-3 w-3" />}
                  label="Flag"
                  danger
                  onClick={() => update(q.id, { flagged: !q.flagged })}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModBtn({
  active,
  icon,
  label,
  onClick,
  danger,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={`${active ? "Un-" : ""}${label.toLowerCase()}`}
      className={`inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-[10px] font-semibold transition ${
        active
          ? danger
            ? "bg-amber-600 text-white"
            : "bg-primary text-primary-foreground"
          : danger
            ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
            : "bg-slate-100 text-slate-700 hover:bg-primary/10 hover:text-primary"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ───────────────── Status (gamification) ─────────────────

function StatusPane({
  onOpenTip,
  onOpenPaywall,
}: {
  onOpenTip: (target: { name: string; role: "Locality Legend" | "Host" }) => void;
  onOpenPaywall: () => void;
}) {
  const me = MY_PROFILE;
  const tier = tierFromXp(me.xp);
  const next = nextTier(me.xp);
  const progress = next
    ? Math.min(100, ((me.xp - tier.threshold) / (next.threshold - tier.threshold)) * 100)
    : 100;

  return (
    <div className="h-full overflow-y-auto p-3">
      {/* Identity */}
      <div
        className="rounded-2xl border p-3"
        style={{ borderColor: `${tier.color}40`, background: tier.background }}
      >
        <div className="flex items-center gap-3">
          <div
            className="grid h-12 w-12 place-items-center rounded-full text-base font-bold text-white"
            style={{ background: tier.color }}
          >
            {me.initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-slate-900">{me.name}</div>
            <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: tier.color }}>
              <Crown className="h-3 w-3" />
              {tier.label}
              {me.societyVerified && (
                <span className="inline-flex items-center gap-0.5 text-emerald-700">
                  · <ShieldCheck className="h-3 w-3" /> Resident
                </span>
              )}
            </div>
            {me.societyName && (
              <div className="text-[11px] text-slate-600">
                {me.societyName} · {me.rwaRole}
              </div>
            )}
          </div>
        </div>

        {next && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span>{me.xp.toLocaleString()} XP</span>
              <span className="text-slate-600">
                {next.threshold.toLocaleString()} → {next.label}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/70">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: tier.color }}
              />
            </div>
          </div>
        )}

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Cell label="Attended 7d" value={String(me.attended7d)} />
          <Cell label="Verified ✓" value={String(me.acceptedAnswers)} />
          <Cell label="Helpful 👍" value={String(me.helpfulRatings)} />
        </div>
      </div>

      {/* Affiliate credits */}
      <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-900">
          <Sparkles className="h-3.5 w-3.5" /> Attribution credits
        </div>
        <div className="mt-1 text-lg font-bold text-emerald-900">
          ₹{me.creditsRupees.toLocaleString("en-IN")}
        </div>
        <div className="text-[11px] leading-snug text-emerald-900/80">
          Buyers credited your insight in their booking. Paid out monthly via UPI.
        </div>
      </div>

      {/* Tier ladder + perks */}
      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          Powers unlocked by tier
        </div>
        <div className="space-y-2">
          {TIERS.map((t) => {
            const reached = me.xp >= t.threshold;
            return (
              <div
                key={t.id}
                className={`rounded-lg border p-2 ${
                  reached ? "border-slate-200 bg-slate-50" : "border-dashed border-slate-200 opacity-70"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="grid h-5 w-5 place-items-center rounded-full text-white"
                    style={{ background: t.color }}
                  >
                    {reached ? <Star className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  </span>
                  <span className="text-[12px] font-bold" style={{ color: t.color }}>
                    {t.label}
                  </span>
                  <span className="ml-auto text-[10px] text-slate-600">
                    {t.threshold.toLocaleString()} XP
                  </span>
                </div>
                <ul className="mt-1 space-y-0.5 text-[11px] leading-snug text-slate-800">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-1">
                      <ArrowRight
                        className="mt-0.5 h-3 w-3 shrink-0"
                        style={{ color: t.color }}
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Locality leaderboard
          </div>
          <span className="text-[10px] text-slate-500">{MY_PROFILE.locality}</span>
        </div>
        <div className="space-y-1">
          {LEADERBOARD.map((e) => {
            const meRow = e.name === MY_PROFILE.name;
            return (
              <div
                key={e.rank}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] ${
                  meRow ? "bg-primary/10" : ""
                }`}
              >
                <span className="w-5 text-center text-[10px] font-bold text-slate-500">
                  #{e.rank}
                </span>
                <span
                  className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: TIERS.find((t) => t.id === e.tier)!.color }}
                >
                  {e.initial}
                </span>
                <div className="min-w-0 flex-1 truncate font-semibold text-slate-900">
                  {e.name}
                </div>
                <TierChip tier={e.tier} />
                {e.societyVerified && (
                  <ShieldCheck className="h-3 w-3 shrink-0 text-emerald-600" />
                )}
                <span className="w-12 text-right text-[10px] font-bold text-slate-700">
                  {e.xp.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tipping & paywall */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="h-9 gap-1 border-amber-300 bg-amber-50 text-xs font-semibold text-amber-900 hover:bg-amber-100"
          onClick={() => onOpenTip({ name: HOST.name, role: "Host" })}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Tip host
        </Button>
        <Button
          variant="outline"
          className="h-9 gap-1 border-violet-300 bg-violet-50 text-xs font-semibold text-violet-900 hover:bg-violet-100"
          onClick={() => onOpenTip({ name: "Vivek M.", role: "Locality Legend" })}
        >
          <Crown className="h-3.5 w-3.5" />
          Bounty Legend
        </Button>
      </div>
      <Button
        className="mt-2 h-9 w-full gap-1 text-xs font-semibold"
        onClick={onOpenPaywall}
      >
        <Lock className="h-3.5 w-3.5" />
        Premium reports · from ₹99
      </Button>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-2 py-1.5">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </div>
      <div className="text-sm font-bold leading-tight text-slate-900">{value}</div>
    </div>
  );
}

// ───────────────── Docs (RERA fact sheet + claims log) ─────────────────

function DocsPane() {
  return (
    <div className="h-full overflow-y-auto p-3">
      {/* Fact sheet */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              RERA fact sheet
            </div>
            <div className="text-sm font-bold text-slate-900">{PROJECT.name}</div>
            <div className="text-[11px] text-slate-600">
              {PROJECT.developer} · {PROJECT.locality}
            </div>
          </div>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-[11px]">
            <Download className="h-3 w-3" /> PDF
          </Button>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <Stat label="RERA ID" value={PROJECT.reraId} mono />
          <Stat label="Status" value={PROJECT.reraStatus} accent="emerald" />
          <Stat
            label="Possession"
            value={new Date(PROJECT.possessionDate).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })}
          />
          <Stat label="Completion" value={`${PROJECT.completionPct}%`} />
          <Stat label="Escrow deployed" value={`${PROJECT.escrowDeployedPct}%`} />
          <Stat label="Sold" value={`${PROJECT.inventorySoldPct}%`} />
        </div>

        <div className="mt-3 space-y-1 text-[12px]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Approvals
          </div>
          {PROJECT.approvals.map((a) => (
            <div key={a.label} className="flex items-center gap-2 text-slate-900">
              <span
                className={`grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold ${
                  a.ok ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"
                }`}
              >
                {a.ok ? "✓" : "!"}
              </span>
              <span className="flex-1">{a.label}</span>
              {a.note && <span className="text-[10px] text-slate-500">{a.note}</span>}
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-0.5 text-[12px]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Quick facts
          </div>
          {PROJECT.facts.map((f) => (
            <div key={f.label} className="flex items-baseline justify-between gap-2">
              <span className="text-slate-600">{f.label}</span>
              <span className="text-right font-semibold text-slate-900">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Host reputation */}
      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
          Host · RERA agent reputation
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-300 text-sm font-bold text-amber-950">
            {HOST.initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-slate-900">{HOST.name}</div>
            <div className="font-mono text-[10px] text-slate-600">{HOST.reraAgentId}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-700">{HOST.score}</div>
            <div className="text-[9px] text-slate-500">public score</div>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Stat label="Events hosted" value={String(HOST.eventsHosted)} />
          <Stat label="Years active" value={String(HOST.yearsActive)} />
          <Stat
            label="Attendance"
            value={`${Math.round(HOST.attendanceRate * 100)}%`}
            accent="emerald"
          />
          <Stat label="Lead conv." value={`${Math.round(HOST.leadConversion * 100)}%`} />
          <Stat
            label="Complaint ratio"
            value={`${(HOST.complaintRatio * 100).toFixed(1)}%`}
            accent={HOST.complaintRatio > 0.05 ? "amber" : "emerald"}
          />
          <Stat label="Verified ✓" value={String(HOST.communityVerifiedAnswers)} />
        </div>
      </div>

      {/* Claims governance log */}
      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
          <AlertTriangle className="h-3.5 w-3.5" />
          Governance · live claims log
        </div>
        <div className="space-y-2">
          {CLAIMS_LOG.map((c) => (
            <div
              key={c.id}
              className={`rounded-lg border px-2.5 py-1.5 text-[12px] ${
                c.flagged
                  ? "border-amber-200 bg-amber-50"
                  : c.verified
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="mb-0.5 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                <span className="font-mono">at {formatClock(c.at)}</span>
                <span>· {c.category}</span>
                {c.verified && (
                  <span className="inline-flex items-center gap-0.5 text-emerald-800">
                    <ShieldCheck className="h-2.5 w-2.5" /> Verified
                  </span>
                )}
                {c.flagged && (
                  <span className="inline-flex items-center gap-0.5 text-amber-800">
                    <Flag className="h-2.5 w-2.5" /> Flagged
                  </span>
                )}
              </div>
              <div className="leading-snug text-slate-900">{c.claim}</div>
              {c.evidenceUrl && (
                <a
                  href={`#${c.evidenceUrl}`}
                  className="mt-0.5 inline-block text-[10px] font-semibold text-primary hover:underline"
                >
                  Evidence: {c.evidenceUrl}
                </a>
              )}
              {c.flagged && (
                <div className="mt-0.5 text-[11px] text-amber-900">
                  ⚑ {c.flagged.by}: {c.flagged.note}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 text-[11px] leading-snug text-slate-600">
          Every claim made on stream is captured here — RERA-aligned record of promises on
          handover, pricing, and amenities.
        </div>
      </div>
    </div>
  );
}

// ───────────────── Helpers ─────────────────

function Stat({
  label,
  value,
  mono,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: "emerald" | "amber";
}) {
  const tone =
    accent === "emerald"
      ? "text-emerald-800"
      : accent === "amber"
        ? "text-amber-800"
        : "text-slate-900";
  return (
    <div className="rounded-lg bg-slate-50 px-2 py-1.5">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </div>
      <div className={`text-xs font-bold leading-tight ${tone} ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function TierChip({ tier }: { tier: TierId }) {
  const t = TIERS.find((x) => x.id === tier)!;
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0 text-[9px] font-bold"
      style={{ background: t.background, color: t.color }}
    >
      <Crown className="h-2.5 w-2.5" />
      {t.label.split(" ")[0]}
    </span>
  );
}

function tierWeight(t: TierId): number {
  return TIERS.findIndex((x) => x.id === t);
}

function pickTier(seed: string): TierId {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const r = Math.abs(h) % 100;
  if (r < 5) return "legend";
  if (r < 25) return "gold";
  if (r < 60) return "silver";
  return "visitor";
}

function formatClock(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default LiveSidebarTabs;
