import { useMemo, useState } from "react";
import { Copy, X, Check, MessageCircle, Send as SendIcon, LinkIcon, Clock } from "lucide-react";
import { PROJECT } from "@/lib/liveRoomMockData";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Seconds since session start — embedded in deep link as `t=`. */
  elapsed: number;
  roomName: string;
  /** Optional pinned insight to spotlight in the share preview. */
  insight?: string;
};

function formatTimestamp(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ShareDialog({ open, onClose, elapsed, roomName, insight }: Props) {
  const [copied, setCopied] = useState(false);

  const deepLink = useMemo(() => {
    const t = Math.floor(elapsed);
    const base =
      typeof window !== "undefined"
        ? `${window.location.origin}/demand/live`
        : "https://proplive.in/demand/live";
    return `${base}?room=${encodeURIComponent(roomName)}&t=${t}`;
  }, [elapsed, roomName]);

  const message = useMemo(() => {
    const ts = formatTimestamp(elapsed);
    const lines = [
      `🏠 ${PROJECT.name} · LIVE on PropLive`,
      `${PROJECT.developer} · ${PROJECT.locality}`,
      `RERA ${PROJECT.reraStatus}: ${PROJECT.reraId}`,
      insight ? `\n📌 ${insight}` : "",
      `\nJump in at ${ts} → ${deepLink}`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [deepLink, elapsed, insight]);

  if (!open) return null;

  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(deepLink)}&text=${encodeURIComponent(
    message,
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(deepLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available */
    }
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
            <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Share this moment
            </div>
            <div className="text-base font-bold leading-tight">Send to community</div>
            <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              Deep-link will open at {formatTimestamp(elapsed)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full border border-border bg-card hover:bg-secondary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3 rounded-xl border border-border bg-secondary/40 p-3 text-[11px] leading-relaxed text-foreground">
          <pre className="whitespace-pre-wrap font-sans">{message}</pre>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:opacity-95"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp community
          </a>
          <a
            href={tgUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-3 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:opacity-95"
          >
            <SendIcon className="h-4 w-4" />
            Telegram channel
          </a>
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
          <input
            readOnly
            value={deepLink}
            className="flex-1 bg-transparent text-[11px] outline-none"
          />
          <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 gap-1 text-xs">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShareDialog;
