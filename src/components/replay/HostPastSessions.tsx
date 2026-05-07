import { Eye, Clock, Sparkles, ArrowUpRight, ChevronRight } from "lucide-react";
import { HOST_PAST_SESSIONS } from "@/lib/replayAnalyticsData";

export function HostPastSessions({
  hostName = "Anika Sharma",
  hostInitial = "A",
}: {
  hostName?: string;
  hostInitial?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-300 text-base font-bold text-amber-950">
            {hostInitial}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900">{hostName}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-900">
                <Sparkles className="h-3 w-3" /> Locality Legend
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Other sessions hosted by Anika · all RERA-verified
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline">
          See all <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </header>

      <ul className="divide-y divide-slate-100">
        {HOST_PAST_SESSIONS.map((s) => (
          <li key={s.id}>
            <button className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-slate-50">
              <div className="grid h-12 w-20 shrink-0 place-items-center rounded-lg bg-slate-900 text-white">
                <span className="text-[10px] font-bold tracking-wider">REPLAY</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 text-[13px] font-bold leading-tight text-slate-900">
                  {s.title}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                  <span>{s.locality}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {s.durationMin} min
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {s.views.toLocaleString()}
                  </span>
                  <span>·</span>
                  <span>{s.airedAt}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1 max-w-[140px] flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${s.engagement}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700">
                    {s.engagement}% engagement
                  </span>
                  <span className="rounded-full bg-violet-100 px-1.5 py-0 text-[9px] font-semibold text-violet-900">
                    {s.highlightCount} highlights
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default HostPastSessions;
