import { useEffect, useState } from "react";
import { Captions, ChevronDown, X } from "lucide-react";
import { CAPTION_TRACK, LANGUAGES, type LangCode } from "@/lib/liveRoomMockData";

type Props = {
  enabled: boolean;
  onToggle: (next: boolean) => void;
  lang: LangCode;
  onLangChange: (lang: LangCode) => void;
  /** Seconds since session start — drives which caption shows. */
  elapsed: number;
};

export function CaptionsOverlay({ enabled, onToggle, lang, onLangChange, elapsed }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  // Loop through the mock caption track so it keeps animating in demos.
  const cycle = elapsed % (CAPTION_TRACK[CAPTION_TRACK.length - 1].at + 8);
  const active = [...CAPTION_TRACK]
    .reverse()
    .find((c) => cycle >= c.at && cycle < c.at + c.durationSec);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-x-4 bottom-20 z-20 flex flex-col items-center gap-2">
      {active && (
        <div className="pointer-events-auto max-w-[640px] rounded-xl bg-black/72 px-4 py-2.5 text-center shadow-lg backdrop-blur">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/55">
            {active.speaker} · {LANGUAGES.find((l) => l.code === lang)?.label}
          </div>
          <div className="mt-0.5 text-sm font-medium leading-snug text-white">
            {active.text[lang]}
          </div>
        </div>
      )}

      <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-black/55 px-1 py-1 backdrop-blur">
        <button
          onClick={() => onToggle(false)}
          title="Hide captions"
          className="grid h-7 w-7 place-items-center rounded-full text-white/80 hover:bg-white/10"
        >
          <Captions className="h-3.5 w-3.5" />
        </button>
        <div className="relative">
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className="flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold text-white/90 hover:bg-white/10"
          >
            {LANGUAGES.find((l) => l.code === lang)?.native}
            <ChevronDown className="h-3 w-3" />
          </button>
          {pickerOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-black/85 p-1 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                <span>Caption language</span>
                <button onClick={() => setPickerOpen(false)} className="text-white/50 hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    onLangChange(l.code);
                    setPickerOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[11px] transition ${
                    l.code === lang ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <span className="font-semibold">{l.native}</span>
                  <span className="text-[10px] text-white/55">{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function useCaptionTimer(running: boolean): number {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      setElapsed((performance.now() - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  return elapsed;
}

export default CaptionsOverlay;
