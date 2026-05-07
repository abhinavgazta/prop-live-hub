import { useState } from "react";
import {
  ShieldCheck,
  Users,
  Ban,
  BadgeCheck,
  Scale,
  AlertTriangle,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { CODE_OF_CONDUCT, FAQ, type ConductRule, type FaqEntry } from "@/lib/liveRoomMockData";

const ICONS: Record<ConductRule["iconKey"], React.ComponentType<{ className?: string }>> = {
  shield: ShieldCheck,
  users: Users,
  ban: Ban,
  verified: BadgeCheck,
  scale: Scale,
  alert: AlertTriangle,
};

const CATEGORY_TONE: Record<FaqEntry["category"], string> = {
  Status: "bg-violet-100 text-violet-900",
  Verification: "bg-emerald-100 text-emerald-900",
  Money: "bg-amber-100 text-amber-900",
  Privacy: "bg-sky-100 text-sky-900",
  Stream: "bg-rose-100 text-rose-900",
};

export function RoomGuidelines() {
  return (
    <section className="grid gap-3 lg:grid-cols-2">
      <ConductCard />
      <FaqCard />
    </section>
  );
}

function ConductCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-900">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-bold leading-tight text-slate-900">Code of Conduct</h3>
          <p className="text-[11px] text-slate-600">
            Applies to chat, Q&A, and Digitour annotations
          </p>
        </div>
      </header>

      <ul className="space-y-2">
        {CODE_OF_CONDUCT.map((rule) => {
          const Icon = ICONS[rule.iconKey];
          return (
            <li
              key={rule.id}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold leading-tight text-slate-900">
                  {rule.title}
                </div>
                <p className="mt-0.5 text-[12px] leading-snug text-slate-700">
                  {rule.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-[11px] leading-snug text-slate-500">
        Violations are reviewed by Locality Legends within 12 hours. Repeat offences trigger
        platform-wide bans recorded against the verified KYC.
      </p>
    </div>
  );
}

function FaqCard() {
  const [openId, setOpenId] = useState<string | null>(FAQ[0]?.id ?? null);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-sky-100 text-sky-900">
          <HelpCircle className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-bold leading-tight text-slate-900">FAQ</h3>
          <p className="text-[11px] text-slate-600">
            Quick answers — full policies in{" "}
            <a href="#trust" className="font-semibold text-primary hover:underline">
              Trust Center
            </a>
          </p>
        </div>
      </header>

      <ul className="divide-y divide-slate-100">
        {FAQ.map((entry) => {
          const open = openId === entry.id;
          return (
            <li key={entry.id}>
              <button
                onClick={() => setOpenId(open ? null : entry.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 py-2.5 text-left transition hover:bg-slate-50 rounded-lg px-1"
              >
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_TONE[entry.category]}`}
                >
                  {entry.category}
                </span>
                <span className="flex-1 text-[13px] font-semibold text-slate-900">
                  {entry.q}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open && (
                <p className="px-1 pb-3 pl-[88px] text-[12px] leading-relaxed text-slate-700">
                  {entry.a}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RoomGuidelines;
