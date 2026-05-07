import { useState } from "react";
import { X, Lock, FileText, ShieldCheck, Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PREMIUM_REPORTS,
  TIERS,
  formatPaise,
  type PremiumReport,
} from "@/lib/liveRoomMockData";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function PaywallDialog({ open, onClose }: Props) {
  const [selected, setSelected] = useState<PremiumReport | null>(null);
  const [purchased, setPurchased] = useState<string | null>(null);

  if (!open) return null;

  const buy = (r: PremiumReport) => {
    setSelected(r);
    setTimeout(() => {
      setPurchased(r.id);
      setTimeout(() => {
        setSelected(null);
        setPurchased(null);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[1500] grid place-items-center bg-black/55 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[min(560px,100%)] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Premium insights · UPI micro-pay
            </div>
            <div className="text-base font-bold leading-tight">Locality Legend reports</div>
            <div className="text-[11px] text-muted-foreground">
              Long-form analyses authored by verified residents and Legends
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full border border-border bg-card hover:bg-secondary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="max-h-[60vh] space-y-2 overflow-y-auto p-3">
          {PREMIUM_REPORTS.map((r) => {
            const tier = TIERS.find((t) => t.id === r.authorTier);
            const isSelected = selected?.id === r.id;
            const isPurchased = purchased === r.id;
            return (
              <div
                key={r.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-3"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold leading-tight">{r.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    by{" "}
                    <span className="font-semibold" style={{ color: tier?.color }}>
                      {r.author}
                    </span>{" "}
                    · {tier?.label} · {r.pages} pages
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-foreground/85">
                    {r.summary}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      {r.buyers} buyers
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <ShieldCheck className="h-3 w-3" />
                      Refund within 24h
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="text-base font-bold">{formatPaise(r.pricePaise)}</div>
                  <Button
                    size="sm"
                    onClick={() => buy(r)}
                    disabled={!!selected}
                    className="h-7 gap-1 text-[11px]"
                  >
                    {isPurchased ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Unlocked
                      </>
                    ) : isSelected ? (
                      "Confirming…"
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5" /> Unlock
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border bg-secondary/20 px-5 py-3 text-[10px] text-muted-foreground">
          85% goes to the author · 15% platform · authors keep IP and can edit anytime
        </div>
      </div>
    </div>
  );
}

export default PaywallDialog;
