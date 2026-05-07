import { useMemo, useState } from "react";
import { X, Glasses, Users, Plus, ShieldCheck, Mic } from "lucide-react";
import {
  DIGITOUR_MARKERS,
  MARKER_META,
  PROJECT,
  type DigitourMarker,
  type MarkerKind,
} from "@/lib/liveRoomMockData";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function DigitourModal({ open, onClose }: Props) {
  const [partyMode, setPartyMode] = useState(true);
  const [activeKinds, setActiveKinds] = useState<Set<MarkerKind>>(
    new Set(Object.keys(MARKER_META) as MarkerKind[]),
  );
  const [selected, setSelected] = useState<DigitourMarker | null>(null);
  const [newMarker, setNewMarker] = useState<{ x: number; y: number; kind: MarkerKind } | null>(null);
  const [draftLabel, setDraftLabel] = useState("");
  const [extraMarkers, setExtraMarkers] = useState<DigitourMarker[]>([]);

  const allMarkers = useMemo(
    () => [...DIGITOUR_MARKERS, ...extraMarkers].filter((m) => activeKinds.has(m.kind)),
    [extraMarkers, activeKinds],
  );

  if (!open) return null;

  const toggleKind = (k: MarkerKind) => {
    setActiveKinds((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const onCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selected) {
      setSelected(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setNewMarker({ x, y, kind: "noise" });
    setDraftLabel("");
  };

  const saveMarker = () => {
    if (!newMarker || !draftLabel.trim()) return;
    setExtraMarkers((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        x: newMarker.x,
        y: newMarker.y,
        kind: newMarker.kind,
        label: draftLabel.trim(),
        by: "You",
        verified: false,
      },
    ]);
    setNewMarker(null);
    setDraftLabel("");
  };

  return (
    <div
      className="fixed inset-0 z-[1800] grid place-items-center bg-black/65 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-[86vh] w-[min(1100px,95vw)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/60">
              <Glasses className="h-3.5 w-3.5" /> Digitour · 3D walkthrough
            </div>
            <div className="text-base font-bold leading-tight">
              {PROJECT.name} · Tower B floor plan
            </div>
            <div className="text-[11px] text-white/55">
              Mid-webinar VR cut-in · markers from verified residents
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPartyMode((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${
                partyMode
                  ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                  : "border-white/15 bg-white/5 text-white/80"
              }`}
              title="Digitour Party — voice-walk with residents"
            >
              <Users className="h-3.5 w-3.5" />
              Party mode {partyMode ? "ON" : "OFF"}
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" /> Close
            </button>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[1fr_260px] overflow-hidden">
          {/* Canvas */}
          <div className="relative overflow-hidden">
            <div
              onClick={onCanvasClick}
              className="absolute inset-0 cursor-crosshair"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #1f2a55 0%, #0b1020 60%), repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 12px, transparent 12px 24px)",
              }}
            >
              {/* Stylized 3D-ish grid */}
              <svg
                className="absolute inset-0 h-full w-full opacity-50"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1="0"
                    y1={(i + 1) * 10}
                    x2="100"
                    y2={(i + 1) * 10}
                    stroke="#5e7bd0"
                    strokeWidth="0.1"
                  />
                ))}
                {Array.from({ length: 9 }).map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={(i + 1) * 10}
                    y1="0"
                    x2={(i + 1) * 10}
                    y2="100"
                    stroke="#5e7bd0"
                    strokeWidth="0.1"
                  />
                ))}
                {/* Tower outline */}
                <polygon
                  points="20,28 60,18 80,30 80,72 60,82 20,70"
                  fill="rgba(124,58,237,0.18)"
                  stroke="#7c3aed"
                  strokeWidth="0.4"
                />
                <polyline
                  points="60,18 60,82"
                  stroke="#7c3aed"
                  strokeWidth="0.3"
                  strokeDasharray="1 1"
                  fill="none"
                />
              </svg>

              {/* Markers */}
              {allMarkers.map((m) => {
                const meta = MARKER_META[m.kind];
                return (
                  <button
                    key={m.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(m);
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${m.x}%`, top: `${m.y}%` }}
                    title={`${meta.label} · ${m.label}`}
                  >
                    <span
                      className="grid h-7 w-7 place-items-center rounded-full text-[12px] shadow-lg ring-2 ring-white/30"
                      style={{ background: meta.color }}
                    >
                      {meta.glyph}
                    </span>
                    {m.verified && (
                      <span className="absolute -right-1 -top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-emerald-500 text-[8px] text-white">
                        <ShieldCheck className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}

              {/* New marker draft */}
              {newMarker && (
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/20 bg-black/85 p-2 backdrop-blur"
                  style={{ left: `${newMarker.x}%`, top: `${newMarker.y}%`, minWidth: 220 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-1 flex flex-wrap gap-1">
                    {(Object.keys(MARKER_META) as MarkerKind[]).map((k) => (
                      <button
                        key={k}
                        onClick={() => setNewMarker({ ...newMarker, kind: k })}
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                          newMarker.kind === k ? "bg-white text-black" : "bg-white/10 text-white"
                        }`}
                      >
                        {MARKER_META[k].glyph} {MARKER_META[k].label}
                      </button>
                    ))}
                  </div>
                  <input
                    autoFocus
                    value={draftLabel}
                    onChange={(e) => setDraftLabel(e.target.value)}
                    placeholder="What did you observe?"
                    className="mb-1 w-full rounded-md bg-white/10 px-2 py-1 text-[11px] outline-none placeholder:text-white/40"
                  />
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => setNewMarker(null)}
                      className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] hover:bg-white/15"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveMarker}
                      disabled={!draftLabel.trim()}
                      className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white disabled:opacity-50"
                    >
                      Drop pin
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Party mode HUD */}
            {partyMode && (
              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-200 backdrop-blur">
                <Mic className="h-3 w-3" /> 4 residents on voice · 1 host walking
              </div>
            )}

            {/* Selected marker popover */}
            {selected && (
              <div className="pointer-events-auto absolute bottom-3 left-3 right-3 mx-auto max-w-md rounded-xl border border-white/10 bg-black/75 p-3 backdrop-blur">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                      {MARKER_META[selected.kind].label}
                    </div>
                    <div className="text-sm font-bold leading-tight">{selected.label}</div>
                    <div className="mt-0.5 text-[11px] text-white/60">
                      Pinned by {selected.by}
                      {selected.verified && (
                        <span className="ml-1 inline-flex items-center gap-0.5 text-emerald-300">
                          <ShieldCheck className="h-3 w-3" /> Community verified
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-full bg-white/10 p-1 text-white/70 hover:bg-white/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — marker types */}
          <div className="border-l border-white/10 bg-black/30 p-3">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/55">
              Marker filters
            </div>
            <div className="space-y-1">
              {(Object.keys(MARKER_META) as MarkerKind[]).map((k) => {
                const m = MARKER_META[k];
                const on = activeKinds.has(k);
                return (
                  <button
                    key={k}
                    onClick={() => toggleKind(k)}
                    className={`flex w-full items-center justify-between rounded-lg border px-2 py-1.5 text-[11px] transition ${
                      on
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/5 bg-white/0 text-white/40"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      <span
                        className="grid h-4 w-4 place-items-center rounded-full text-[10px]"
                        style={{ background: m.color }}
                      >
                        {m.glyph}
                      </span>
                      {m.label}
                    </span>
                    <span className="text-[9px] uppercase">{on ? "on" : "off"}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-2 text-[10px] text-white/70">
              <div className="mb-1 inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-white/85">
                <Plus className="h-3 w-3" /> Drop a marker
              </div>
              Click anywhere on the canvas to leave a noise / view / sunlight / traffic / vastu
              annotation. Verified residents earn XP for accepted markers.
            </div>

            <Button
              variant="outline"
              className="mt-3 h-8 w-full border-white/20 bg-white/5 text-[11px] font-semibold text-white hover:bg-white/10"
            >
              Stream markers to live chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DigitourModal;
