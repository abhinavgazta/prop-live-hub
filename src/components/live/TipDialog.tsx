import { useState } from "react";
import { X, Sparkles, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TIP_PRESETS, formatRupees, type TipPreset } from "@/lib/liveRoomMockData";

type Props = {
  open: boolean;
  onClose: () => void;
  recipientName: string;
  recipientRole: "Locality Legend" | "Verified Resident" | "Host";
  /** When true, dialog is framed as a paid moderation bounty rather than a tip. */
  bountyMode?: boolean;
};

export function TipDialog({
  open,
  onClose,
  recipientName,
  recipientRole,
  bountyMode = false,
}: Props) {
  const [preset, setPreset] = useState<TipPreset>(TIP_PRESETS[1]);
  const [custom, setCustom] = useState("");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const amount = custom ? Math.max(0, Number(custom)) : preset.amount;

  const submit = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1700);
  };

  return (
    <div
      className="fixed inset-0 z-[1500] grid place-items-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[min(460px,100%)] rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-elegant)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--gold-foreground)]">
              {bountyMode ? "Moderation bounty" : "Send a tip · UPI"}
            </div>
            <div className="mt-0.5 text-base font-bold leading-tight">
              {bountyMode ? `Co-host bounty for ${recipientName}` : `Tip ${recipientName}`}
            </div>
            <div className="text-[11px] text-muted-foreground">{recipientRole}</div>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full border border-border bg-card hover:bg-secondary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {!success ? (
          <>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {TIP_PRESETS.map((p) => (
                <button
                  key={p.amount}
                  onClick={() => {
                    setPreset(p);
                    setCustom("");
                  }}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    preset.amount === p.amount && !custom
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/40 hover:border-primary/40"
                  }`}
                >
                  <div className="font-bold">{p.label}</div>
                  {p.note && <div className="text-[10px] opacity-70">{p.note}</div>}
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
              <span className="text-sm font-bold text-muted-foreground">₹</span>
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="Custom amount"
                inputMode="numeric"
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={140}
              placeholder={
                bountyMode
                  ? "Why this Legend? Public note shown beside their profile…"
                  : "Add a note (optional)"
              }
              className="mt-2 h-16 w-full resize-none rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />

            <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[11px] text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Routed via UPI · platform fee 2% · attribution recorded for monthly payout
            </div>

            <Button
              onClick={submit}
              disabled={amount <= 0}
              className="mt-3 h-10 w-full gap-1.5 text-sm font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              {bountyMode
                ? `Post bounty · ${formatRupees(amount)}`
                : `Send tip · ${formatRupees(amount)}`}
            </Button>
          </>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-2 py-6 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">
              <Check className="h-6 w-6" />
            </div>
            <div className="text-sm font-bold">
              {bountyMode ? "Bounty posted" : "Tip sent"}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {formatRupees(amount)} to {recipientName}
              {note ? ` · "${note}"` : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TipDialog;
