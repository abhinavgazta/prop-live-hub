import { ShieldCheck, Globe2, Languages, BadgeCheck } from "lucide-react";
import { HOST, LANGUAGES, PROJECT, type LangCode } from "@/lib/liveRoomMockData";

type Props = {
  activeLang: LangCode;
  onLangChange: (lang: LangCode) => void;
  onOpenDocs: () => void;
};

export function ProjectRibbon({ activeLang, onLangChange, onOpenDocs }: Props) {
  return (
    <div className="grid gap-2 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] md:grid-cols-[1fr_auto]">
      <div className="flex flex-wrap items-center gap-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Live event
          </div>
          <div className="text-base font-bold leading-tight">{PROJECT.name}</div>
          <div className="text-[11px] text-muted-foreground">
            {PROJECT.developer} · {PROJECT.locality}
          </div>
        </div>

        <button
          onClick={onOpenDocs}
          className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-500/15"
          title="View RERA fact sheet"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          RERA {PROJECT.reraStatus} · {PROJECT.reraId}
        </button>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
            HOST.reraAgentVerified
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-amber-500/30 bg-amber-500/10 text-amber-700"
          }`}
          title="Host's RERA agent ID"
        >
          <BadgeCheck className="h-3.5 w-3.5" />
          Agent · {HOST.reraAgentId}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/40 px-1.5 py-1 text-[11px]">
          <Languages className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
          {LANGUAGES.slice(0, 5).map((l) => (
            <button
              key={l.code}
              onClick={() => onLangChange(l.code)}
              className={`rounded-full px-1.5 py-0.5 font-semibold transition ${
                activeLang === l.code
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.code.toUpperCase()}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/40 px-2 py-1 text-[10px] text-muted-foreground">
          <Globe2 className="h-3 w-3" />
          Tier-2/3 ready · 200+ cities
        </span>
      </div>
    </div>
  );
}

export default ProjectRibbon;
