import { Info } from "lucide-react";

export type LegendItem = {
  label: string;
  description?: string;
} & (
  | { kind: "dot"; color: string; pulse?: boolean }
  | { kind: "polygon"; color: string }
  | { kind: "swatch"; from: string; to: string }
  | { kind: "symbol"; symbol: string }
);

export function MapLegend({
  items,
  title = "Legend",
  tone = "light",
}: {
  items: LegendItem[];
  title?: string;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  return (
    <div
      className={`pointer-events-auto w-[210px] rounded-xl px-3 py-2.5 shadow-[var(--shadow-soft)] ${
        isDark
          ? "border border-white/10 bg-black/55 text-white backdrop-blur-md"
          : "glass text-foreground"
      }`}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <Info className={`h-3.5 w-3.5 ${isDark ? "text-white/70" : "text-muted-foreground"}`} />
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider ${
            isDark ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          {title}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-[11px]">
            <LegendGlyph item={item} />
            <div className="min-w-0 flex-1">
              <div className="font-semibold leading-tight">{item.label}</div>
              {item.description && (
                <div
                  className={`text-[10px] leading-tight ${
                    isDark ? "text-white/55" : "text-muted-foreground"
                  }`}
                >
                  {item.description}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LegendGlyph({ item }: { item: LegendItem }) {
  if (item.kind === "dot") {
    return (
      <span className="relative inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
        <span
          className="h-2.5 w-2.5 rounded-full ring-2 ring-white/80"
          style={{ background: item.color }}
        />
        {item.pulse && (
          <span
            className="absolute inset-0 animate-ping rounded-full opacity-60"
            style={{ background: item.color }}
          />
        )}
      </span>
    );
  }
  if (item.kind === "polygon") {
    return (
      <span
        className="inline-block h-4 w-4 shrink-0 rounded-sm border"
        style={{
          background: `${item.color}33`,
          borderColor: `${item.color}cc`,
        }}
      />
    );
  }
  if (item.kind === "swatch") {
    return (
      <span
        className="inline-block h-3 w-5 shrink-0 rounded-full"
        style={{ background: `linear-gradient(90deg, ${item.from}, ${item.to})` }}
      />
    );
  }
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-sm">
      {item.symbol}
    </span>
  );
}

export default MapLegend;
