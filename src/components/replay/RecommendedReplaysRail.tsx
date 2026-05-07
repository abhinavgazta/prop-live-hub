import { useRef } from "react";
import { ChevronLeft, ChevronRight, PlayCircle, Eye, Clock, Sparkles } from "lucide-react";
import { RECOMMENDED_REPLAYS } from "@/lib/replayAnalyticsData";

export function RecommendedReplaysRail() {
  const scroller = useRef<HTMLDivElement | null>(null);
  const scrollBy = (dx: number) => scroller.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            More like this
          </div>
          <h3 className="text-sm font-bold text-slate-900">Recommended replays</h3>
          <p className="text-[11px] text-slate-600">
            Same locality cluster, similar price band, or by trusted hosts.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scrollBy(-360)}
            aria-label="Scroll left"
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollBy(360)}
            aria-label="Scroll right"
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div
        ref={scroller}
        className="flex gap-3 overflow-x-auto px-5 pb-5 pt-2 [scrollbar-width:thin]"
      >
        {RECOMMENDED_REPLAYS.map((r) => (
          <article
            key={r.id}
            className="group flex w-[260px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md"
          >
            <div className="relative aspect-video bg-slate-100">
              <img
                src={r.thumbnail}
                alt={r.title}
                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {r.duration}
              </span>
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700 backdrop-blur">
                <Sparkles className="h-3 w-3 text-violet-600" /> {r.reason}
              </span>
              <span className="absolute inset-0 m-auto grid h-12 w-12 place-items-center rounded-full bg-white/90 text-primary opacity-0 transition group-hover:opacity-100">
                <PlayCircle className="h-7 w-7" />
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1 p-3">
              <div className="line-clamp-2 text-[13px] font-bold leading-tight text-slate-900">
                {r.title}
              </div>
              <div className="text-[11px] text-slate-600">
                {r.developer} · {r.locality}
              </div>
              <div className="mt-auto flex items-center gap-3 pt-1 text-[10px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {r.views.toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {r.liveDate}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecommendedReplaysRail;
