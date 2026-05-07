import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Send,
  Heart,
  Calendar,
  FileText,
  ShieldCheck,
  Pin,
  Mic,
  Volume2,
  Maximize2,
  Sparkles,
  HelpCircle,
  X,
  LogOut,
} from "lucide-react";
import {
  useChat,
  useParticipants,
  useTracks,
  ParticipantTile,
  RoomAudioRenderer,
  useDataChannel,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveRoom } from "@/components/livekit/LiveRoom";

const ROOM_NAME = "event-1";

export function LiveRoomContent() {
  const identity = useMemo(() => `viewer-${Math.random().toString(36).slice(2, 8)}`, []);
  const [hasLeft, setHasLeft] = useState(false);
  const [leftDueToEnded, setLeftDueToEnded] = useState(false);

  if (hasLeft) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] max-w-sm w-full">
          <div className="mb-2 grid h-14 w-14 place-items-center rounded-full bg-secondary mx-auto">
            <X className="h-7 w-7 text-foreground/50" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground">
            {leftDueToEnded ? "Stream has ended" : "You left the stream"}
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            {leftDueToEnded
              ? "The host stopped broadcasting. Check back later for the next session."
              : "The stream may still be live. Rejoin anytime."}
          </p>
          {!leftDueToEnded ? (
            <>
              <Button
                onClick={() => {
                  setHasLeft(false);
                  setLeftDueToEnded(false);
                }}
                className="mt-6 w-full gap-2 bg-[var(--live)] text-white hover:bg-[var(--live)]/90"
              >
                Rejoin Stream
              </Button>
              <Button
                variant="outline"
                className="mt-2 w-full border-border bg-card text-foreground hover:bg-accent"
                onClick={() => {
                  setHasLeft(false);
                  setLeftDueToEnded(false);
                }}
              >
                Stay on page
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setHasLeft(false);
                  setLeftDueToEnded(false);
                }}
                className="mt-6 w-full border-border bg-card text-foreground hover:bg-accent"
                variant="outline"
              >
                Check again
              </Button>
              <Button
                onClick={() => {
                  window.location.href = "/demand";
                }}
                className="mt-2 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Back to Discover
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <LiveRoom room={ROOM_NAME} identity={identity} role="viewer">
      <RoomAudioRenderer />
      <LiveLayout
        onLeave={() => setHasLeft(true)}
        onStreamEnded={() => {
          setLeftDueToEnded(true);
          setHasLeft(true);
        }}
      />
    </LiveRoom>
  );
}

function LiveLayout({
  onLeave,
  onStreamEnded,
}: {
  onLeave: () => void;
  onStreamEnded: () => void;
}) {
  const [poll, setPoll] = useState<string | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const navigate = useNavigate();
  const [streamEnded, setStreamEnded] = useState(false);
  const checkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hadStreamRef = useRef(false);

  const participants = useParticipants();
  const viewerCount = participants.filter(
    (p) => !p.isLocal && !p.identity.startsWith("host-"),
  ).length;

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: false },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  const remoteTracks = tracks.filter((t) => !t.participant.isLocal);

  // Track when stream goes live; clear ended state when stream resumes
  useEffect(() => {
    if (remoteTracks.length > 0) {
      hadStreamRef.current = true;
      setStreamEnded(false);
      if (checkTimerRef.current) clearTimeout(checkTimerRef.current);
    }
  }, [remoteTracks.length]);

  // Data channel: host sends "stream-ended" signal on End Broadcast
  useDataChannel("stream-control", (msg) => {
    const text = new TextDecoder().decode(msg.payload);
    if (text === "stream-ended") setStreamEnded(true);
  });
  const screenTrack = remoteTracks.find(
    (t) => t.source === Track.Source.ScreenShare && !t.publication?.isMuted,
  );
  const cameraTrack = remoteTracks.find(
    (t) => t.source === Track.Source.Camera && !t.publication?.isMuted,
  );
  const mainTrack = screenTrack ?? cameraTrack ?? null;

  return (
    <div className="grid gap-4 px-4 py-6 md:px-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <div
          className="relative aspect-video overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-elegant)]"
          style={{
            background: "linear-gradient(135deg, oklch(0.25 0.06 250), oklch(0.42 0.15 245))",
          }}
        >
          {mainTrack && !streamEnded ? (
            <ParticipantTile
              trackRef={mainTrack}
              disableSpeakingIndicator
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.18),transparent_55%)]" />
              <div className="absolute inset-0 grid place-items-center">
                {streamEnded ? (
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-black/60 px-6 py-5 backdrop-blur text-center">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                      <X className="h-5 w-5 text-white/80" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Stream has ended</div>
                      <div className="mt-0.5 text-xs text-white/60">
                        The host is no longer broadcasting.
                      </div>
                    </div>
                    <button
                      onClick={() => navigate({ to: "/demand" })}
                      className="mt-1 rounded-lg bg-white/15 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/25 transition-colors"
                    >
                      Leave Room
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                    Waiting for host to go live…
                  </div>
                )}
              </div>
            </>
          )}

          {screenTrack && cameraTrack && !streamEnded && (
            <div className="absolute bottom-14 right-3 h-24 w-40 overflow-hidden rounded-xl border-2 border-white/20 shadow-lg">
              <ParticipantTile
                trackRef={cameraTrack}
                disableSpeakingIndicator
                className="h-full w-full"
              />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.55))]" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <Badge className="gap-1.5 bg-live px-2 py-1 text-[11px] font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-white pulse-live" />
              Live
            </Badge>
            <Badge
              variant="secondary"
              className="bg-black/40 px-2 py-1 text-[11px] text-white backdrop-blur"
            >
              {viewerCount} watching
            </Badge>
          </div>

          <div className="absolute right-4 top-4 flex gap-1.5">
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-black/40 text-white backdrop-blur">
              <Volume2 className="h-4 w-4" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-black/40 text-white backdrop-blur">
              <Maximize2 className="h-4 w-4" />
            </button>
            {mainTrack && (
              <button
                onClick={() => setShowLeaveConfirm(true)}
                className="grid h-8 w-8 place-items-center rounded-lg bg-black/60 text-white backdrop-blur hover:bg-red-600/80 transition-colors"
                title="Leave stream"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div className="glass flex items-center gap-3 rounded-xl px-3 py-2">
              <div
                className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-[var(--gold-foreground)]"
                style={{ background: "var(--gold)" }}
              >
                A
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Co-hosted by
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold">
                  Anika Sharma <Sparkles className="h-3 w-3 text-[var(--gold)]" />
                  <span className="text-[11px] font-medium text-muted-foreground">
                    · Locality Legend · Sector 65
                  </span>
                </div>
              </div>
            </div>
            <div className="glass rounded-xl px-3 py-2 text-xs">
              <span className="font-semibold">{screenTrack ? "Presentation" : "Drone Tour"}</span> ·
              Live
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Site Visit
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-border bg-card text-foreground hover:bg-accent"
          >
            <FileText className="h-4 w-4" />
            Download RERA Docs
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-[var(--live)]/30 text-[var(--live)] hover:bg-[var(--live)]/10"
          >
            <Heart className="heartbeat h-4 w-4 fill-[var(--live)]" />
            I'm Interested
            <span className="rounded-full bg-[var(--live)]/15 px-1.5 text-[10px] font-bold">
              412
            </span>
          </Button>
          <div className="ml-auto flex items-center gap-2 text-xs text-foreground/60">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Community Verified · 18 insights
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-teal/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal">
              Live Poll
            </span>
            <span className="text-sm font-semibold">
              Is this floor plan better than DLF Privana South?
            </span>
          </div>
          <div className="space-y-2">
            {[
              { k: "Yes, much better", v: 62 },
              { k: "About the same", v: 24 },
              { k: "No, Privana wins", v: 14 },
            ].map((o) => {
              const sel = poll === o.k;
              return (
                <button
                  key={o.k}
                  onClick={() => setPoll(o.k)}
                  className="relative w-full overflow-hidden rounded-lg border border-border bg-card px-3 py-2 text-left text-sm"
                >
                  <div
                    className={`absolute inset-y-0 left-0 rounded-lg ${sel ? "bg-primary/15" : "bg-secondary/60"}`}
                    style={{ width: `${o.v}%` }}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="font-medium text-foreground">{o.k}</span>
                    <span className="text-xs font-bold text-foreground/60">{o.v}%</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-[11px] text-foreground/60">847 votes · ends in 02:14</div>
        </div>
      </div>

      <ChatSidebar />

      {/* Leave confirmation overlay */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)]">
            <div className="mb-1 flex items-center gap-2">
              <LogOut className="h-5 w-5 text-[var(--live)]" />
              <h3 className="text-base font-bold text-foreground">Leave the stream?</h3>
            </div>
            <p className="mt-1 text-sm text-foreground/60">
              Stream stays live. You can rejoin anytime from the same page.
            </p>
            <div className="mt-5 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-border bg-card text-foreground hover:bg-accent"
                onClick={() => setShowLeaveConfirm(false)}
              >
                Stay
              </Button>
              <Button
                className="flex-1 bg-[var(--live)] text-white hover:bg-[var(--live)]/90"
                onClick={() => {
                  setShowLeaveConfirm(false);
                  onLeave();
                  navigate({ to: "/demand" });
                }}
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatSidebar() {
  const { chatMessages, send, isSending } = useChat();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !send) return;
    await send(`❓ ${text}`);
    setInput("");
  };

  const questions = chatMessages.filter((m) => m.message.startsWith("❓"));
  const regularChat = chatMessages.filter((m) => !m.message.startsWith("❓"));

  return (
    <aside className="flex h-[calc(100vh-180px)] min-h-[560px] flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-sm font-bold">Live Chat</div>
          <div className="text-[11px] text-foreground/60">Moderated by 3 verified residents</div>
        </div>
        <Badge variant="secondary" className="gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-live pulse-live" />
          Live
        </Badge>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            <Pin className="h-3 w-3" />
            Pinned by Host
          </div>
          <div className="text-xs text-foreground">
            Floor plans + RERA docs are linked below. Ask any question — Anika verifying answers
            live.
          </div>
        </div>

        {questions.length > 0 && (
          <div className="rounded-lg border border-amber-200/40 bg-amber-50/10 p-2.5">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600">
              <HelpCircle className="h-3 w-3" />
              {questions.length} question{questions.length > 1 ? "s" : ""} from viewers
            </div>
            {questions.slice(-3).map((m, i) => {
              const name = m.from?.name || m.from?.identity || "Viewer";
              return (
                <div key={m.id ?? i} className="mb-1 text-xs text-foreground">
                  <span className="font-semibold text-amber-700">{name}: </span>
                  {m.message.replace(/^❓\s*/, "")}
                </div>
              );
            })}
          </div>
        )}

        {regularChat.length === 0 && questions.length === 0 && (
          <div className="rounded-lg bg-secondary p-2.5 text-xs text-muted-foreground">
            No messages yet. Be the first to ask.
          </div>
        )}

        {regularChat.map((m) => {
          const name = m.from?.name || m.from?.identity || "Anonymous";
          const initial = name[0]?.toUpperCase() ?? "?";
          const isHost = m.from?.identity?.startsWith("host-");
          return (
            <div
              key={m.id ?? name}
              className={`rounded-lg p-2.5 ${isHost ? "bg-[var(--gold)]/10 border-l-2 border-[var(--gold)]" : ""}`}
            >
              <div className="mb-1 flex items-center gap-1.5">
                <div
                  className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${isHost ? "bg-[var(--gold)] text-[var(--gold-foreground)]" : "bg-secondary"}`}
                >
                  {initial}
                </div>
                <span className="text-xs font-semibold text-foreground">{name}</span>
                {isHost && (
                  <Badge className="gap-1 bg-[var(--gold)] px-1.5 py-0 text-[9px] text-[var(--gold-foreground)]">
                    <Sparkles className="h-2.5 w-2.5" />
                    Host
                  </Badge>
                )}
                {m.from?.isLocal && (
                  <Badge className="bg-primary/10 px-1.5 py-0 text-[9px] text-primary">You</Badge>
                )}
              </div>
              <div className="text-xs leading-relaxed text-foreground">{m.message}</div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
          <Mic className="h-4 w-4 text-foreground/40" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/40"
            placeholder="Ask the host or residents…"
          />
          <button
            onClick={handleSend}
            disabled={isSending}
            className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-foreground/40">
          <span>Trolls? Flag for Locality Review →</span>
          <span>Karma +2 for verified questions</span>
        </div>
      </div>
    </aside>
  );
}
