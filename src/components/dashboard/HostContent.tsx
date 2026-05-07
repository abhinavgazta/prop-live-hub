import { useEffect, useMemo, useRef, useState } from "react";
import {
  Eye,
  Flame,
  Pin,
  MicOff,
  Mic2,
  Users,
  ArrowUpRight,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  HelpCircle,
  SwitchCamera,
} from "lucide-react";
import {
  useLocalParticipant,
  useParticipants,
  useTracks,
  ParticipantTile,
  useChat,
  useDataChannel,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveRoom } from "@/components/livekit/LiveRoom";

const ROOM_NAME = "event-1";

export function HostContent() {
  const identity = useMemo(() => `host-${Math.random().toString(36).slice(2, 6)}`, []);
  return (
    <LiveRoom room={ROOM_NAME} identity={identity} role="publisher">
      <Host />
    </LiveRoom>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${100 - (v / max) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-12 w-full">
      <defs>
        <linearGradient id={`g-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,100 ${points} 100,100`} fill={`url(#g-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function Host() {
  const { localParticipant } = useLocalParticipant();
  const { send: sendData } = useDataChannel("stream-control");
  const participants = useParticipants();
  const { chatMessages } = useChat();
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [screenOn, setScreenOn] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [pinnedQuestion, setPinnedQuestion] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const isMobile =
    typeof window !== "undefined" && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const viewerCount = participants.filter((p) => p.identity !== localParticipant?.identity).length;

  const allTracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: false },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  const selfCameraTrack = allTracks.find(
    (t) => t.participant.isLocal && t.source === Track.Source.Camera,
  );
  const selfScreenTrack = allTracks.find(
    (t) => t.participant.isLocal && t.source === Track.Source.ScreenShare,
  );

  const questions = chatMessages.filter((m) => m.message.startsWith("❓"));
  const regularChat = chatMessages.filter((m) => !m.message.startsWith("❓"));

  const MAX_POINTS = 20;
  const viewerHistory = useRef<number[]>([0]);
  const questionHistory = useRef<number[]>([0]);
  const leadsHistory = useRef<number[]>([0]);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!isStreaming) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [isStreaming]);

  // Sample metrics every 3s while streaming
  useEffect(() => {
    if (!isStreaming) return;
    const push = (ref: React.MutableRefObject<number[]>, val: number) => {
      ref.current = [...ref.current, val].slice(-MAX_POINTS);
    };
    const t = setInterval(() => {
      push(viewerHistory, viewerCount);
      push(questionHistory, questions.length);
      push(leadsHistory, Math.max(Math.floor(viewerCount * 0.3), 0));
      forceUpdate((n) => n + 1);
    }, 3000);
    return () => clearInterval(t);
  }, [isStreaming, viewerCount, questions.length]);

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  const goLive = async () => {
    if (!localParticipant) {
      alert("LiveKit not connected yet — wait a moment and retry");
      return;
    }
    try {
      await localParticipant.setCameraEnabled(true);
      await localParticipant.setMicrophoneEnabled(true);
      setCameraOn(true);
      setMicOn(true);
      setIsStreaming(true);
    } catch (e) {
      alert(`Camera failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const toggleScreen = async () => {
    if (!localParticipant) return;
    try {
      await localParticipant.setScreenShareEnabled(!screenOn);
      setScreenOn(!screenOn);
    } catch (e) {
      alert(`Screen share failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const toggleMic = async () => {
    if (!localParticipant) return;
    try {
      await localParticipant.setMicrophoneEnabled(!micOn);
      setMicOn(!micOn);
    } catch (e) {
      console.error("Mic toggle failed", e);
    }
  };

  const toggleCamera = async () => {
    if (!localParticipant) return;
    try {
      await localParticipant.setCameraEnabled(!cameraOn);
      setCameraOn(!cameraOn);
    } catch (e) {
      console.error("Camera toggle failed", e);
    }
  };

  const flipCamera = async () => {
    if (!localParticipant || !cameraOn) return;
    const next = facingMode === "user" ? "environment" : "user";
    try {
      await localParticipant.setCameraEnabled(true, { facingMode: next });
      setFacingMode(next);
    } catch (e) {
      alert(`Flip camera failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const endBroadcast = async () => {
    if (!localParticipant) return;
    try {
      // Signal viewers before unpublishing
      sendData(new TextEncoder().encode("stream-ended"), { reliable: true });
      await localParticipant.setCameraEnabled(false);
      await localParticipant.setMicrophoneEnabled(false);
      await localParticipant.setScreenShareEnabled(false);
      setCameraOn(false);
      setMicOn(false);
      setScreenOn(false);
      setIsStreaming(false);
      setElapsed(0);
      setPinnedQuestion(null);
      viewerHistory.current = [0];
      questionHistory.current = [0];
      leadsHistory.current = [0];
    } catch (e) {
      console.error("End broadcast failed", e);
    }
  };

  return (
    <div className="space-y-4 px-4 py-6 md:px-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div
            className={`mb-1 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${isStreaming ? "bg-[var(--live)]/10 text-[var(--live)]" : "bg-secondary text-foreground/60"}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isStreaming ? "bg-live pulse-live" : "bg-foreground/30"}`}
            />
            {isStreaming ? `Broadcasting · ${fmtTime(elapsed)}` : "Offline"}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            War Room — M3M Golf Estate
          </h1>
          <div className="text-sm text-foreground/60">
            {isStreaming
              ? `${cameraOn ? "Camera on" : "Camera off"} · ${screenOn ? "Screen sharing" : "No screen share"} · ${micOn ? "Mic on" : "Mic off"}`
              : "Stream not started"}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isStreaming ? (
            <Button
              onClick={goLive}
              className="gap-2 bg-[var(--live)] text-white hover:bg-[var(--live)]/90"
            >
              <Video className="h-4 w-4" />
              Go Live
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={toggleScreen}
                className={`gap-2 border-border bg-card text-foreground hover:bg-accent ${screenOn ? "border-primary text-primary" : ""}`}
              >
                {screenOn ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                {screenOn ? "Stop Share" : "Share Screen"}
              </Button>
              <Button
                variant="outline"
                onClick={toggleCamera}
                className={`gap-2 border-border bg-card text-foreground hover:bg-accent ${!cameraOn ? "border-amber-500/60 text-amber-600" : ""}`}
              >
                {cameraOn ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                {cameraOn ? "Camera Off" : "Camera On"}
              </Button>
              {isMobile && cameraOn && (
                <Button
                  variant="outline"
                  onClick={flipCamera}
                  className="gap-2 border-border bg-card text-foreground hover:bg-accent"
                >
                  <SwitchCamera className="h-4 w-4" />
                  Flip
                </Button>
              )}
              <Button
                variant="outline"
                onClick={toggleMic}
                className={`gap-2 border-border bg-card text-foreground hover:bg-accent ${!micOn ? "border-amber-500/60 text-amber-600" : ""}`}
              >
                {micOn ? <Mic2 className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                {micOn ? "Mute" : "Unmute"}
              </Button>
              <Button variant="destructive" onClick={endBroadcast}>
                End Broadcast
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Row 1: Video + Chat side by side */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Video preview */}
        <div
          className="relative aspect-video overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-soft)]"
          style={{
            background: "linear-gradient(135deg, oklch(0.18 0.04 250), oklch(0.28 0.08 245))",
          }}
        >
          {selfScreenTrack && screenOn ? (
            <ParticipantTile
              trackRef={selfScreenTrack}
              disableSpeakingIndicator
              className="absolute inset-0 h-full w-full"
            />
          ) : selfCameraTrack && cameraOn ? (
            <ParticipantTile
              trackRef={selfCameraTrack}
              disableSpeakingIndicator
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-center">
              <div className="text-sm font-semibold text-white/70">Camera off</div>
              <div className="mt-1 text-xs text-white/40">
                Click "Go Live" to start broadcasting
              </div>
            </div>
          )}
          {selfCameraTrack && cameraOn && screenOn && (
            <div className="absolute bottom-3 right-3 h-24 w-40 overflow-hidden rounded-xl border-2 border-white/20 shadow-lg">
              <ParticipantTile
                trackRef={selfCameraTrack}
                disableSpeakingIndicator
                className="h-full w-full"
              />
            </div>
          )}
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <Badge className="bg-black/40 text-[11px] text-white backdrop-blur">Self preview</Badge>
            {screenOn && (
              <Badge className="gap-1 bg-primary/80 text-[11px] text-white backdrop-blur">
                <Monitor className="h-3 w-3" />
                Sharing
              </Badge>
            )}
          </div>
        </div>

        {/* Live Chat — beside video */}
        <div
          className="flex flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]"
          style={{ minHeight: 0 }}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Live Chat</span>
              <Badge variant="secondary" className="text-foreground">
                {regularChat.length}
              </Badge>
            </div>
            {questions.length > 0 && (
              <Badge className="gap-1 bg-amber-100 text-amber-700 text-[10px]">
                <HelpCircle className="h-3 w-3" />
                {questions.length} Q
              </Badge>
            )}
          </div>
          <div
            className="flex-1 overflow-y-auto divide-y divide-border"
            style={{ maxHeight: "calc(100% - 48px)" }}
          >
            {regularChat.length === 0 && questions.length === 0 && (
              <div className="p-6 text-center text-xs text-foreground/50">No messages yet.</div>
            )}
            {/* Questions first */}
            {questions.map((m, i) => {
              const name = m.from?.name || m.from?.identity || "Anonymous";
              const isPinned = pinnedQuestion === m.id;
              return (
                <div
                  key={`q-${m.id ?? i}`}
                  className={`p-3 ${isPinned ? "bg-primary/5 border-l-2 border-primary" : "bg-amber-50/50"}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <HelpCircle className="h-3 w-3 text-amber-600 shrink-0" />
                    <span className="text-xs font-semibold text-amber-700 truncate">{name}</span>
                  </div>
                  <div className="text-sm leading-snug text-foreground">
                    {m.message.replace(/^❓\s*/, "")}
                  </div>
                  <div className="mt-1.5 flex gap-1">
                    <Button
                      size="sm"
                      variant={isPinned ? "default" : "outline"}
                      className={`h-6 gap-1 px-2 text-[10px] ${isPinned ? "text-primary-foreground" : "border-border bg-white text-foreground hover:bg-accent"}`}
                      onClick={() => setPinnedQuestion(isPinned ? null : (m.id ?? null))}
                    >
                      <Pin className="h-2.5 w-2.5" />
                      {isPinned ? "Pinned" : "Pin"}
                    </Button>
                  </div>
                </div>
              );
            })}
            {/* Regular chat */}
            {regularChat.map((m, i) => {
              const name = m.from?.name || m.from?.identity || "Anonymous";
              return (
                <div key={`c-${m.id ?? i}`} className="p-3">
                  <div className="text-xs font-semibold text-primary mb-0.5 truncate">{name}</div>
                  <div className="text-sm leading-snug text-foreground">{m.message}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Metrics */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Live Viewers",
            value: viewerCount.toString(),
            delta: `+${viewerCount}`,
            icon: Eye,
            color: "oklch(0.45 0.18 255)",
            data: viewerHistory.current.length > 1 ? viewerHistory.current : [0, viewerCount],
          },
          {
            label: "Questions",
            value: questions.length.toString(),
            delta: `+${questions.length}`,
            icon: HelpCircle,
            color: "oklch(0.55 0.16 195)",
            data:
              questionHistory.current.length > 1 ? questionHistory.current : [0, questions.length],
          },
          {
            label: "Hot Leads",
            value: Math.max(Math.floor(viewerCount * 0.3), 0).toString(),
            delta: `+${Math.max(Math.floor(viewerCount * 0.3), 0)}`,
            icon: Flame,
            color: "oklch(0.55 0.22 25)",
            data:
              leadsHistory.current.length > 1
                ? leadsHistory.current
                : [0, Math.max(Math.floor(viewerCount * 0.3), 0)],
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60">
                  {m.label}
                </div>
                <div className="mt-0.5 text-3xl font-bold leading-none text-foreground">
                  {m.value}
                </div>
                <div className="mt-1 inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-500">
                  <ArrowUpRight className="h-3 w-3" />
                  {m.delta} live
                </div>
              </div>
              <div
                className="grid h-9 w-9 place-items-center rounded-xl"
                style={{ background: `${m.color}18`, color: m.color }}
              >
                <m.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="rounded-lg overflow-hidden bg-muted/40">
              <Sparkline values={m.data} color={m.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Row 3: Attendees + Geo */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Attendees</span>
              <Badge variant="secondary" className="text-foreground">
                {viewerCount}
              </Badge>
            </div>
          </div>
          <div className="divide-y divide-border">
            {participants
              .filter((p) => p.identity !== localParticipant?.identity)
              .map((p, i) => {
                const name = p.name || p.identity;
                const tone = i < 2 ? "live" : i < 4 ? "gold" : "muted";
                const tier = i < 2 ? "Hot" : i < 4 ? "Warm" : "Cold";
                return (
                  <div key={p.identity} className="flex items-center gap-3 p-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-sm font-bold text-foreground shrink-0">
                      {name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-foreground truncate">{name}</div>
                    </div>
                    <Badge
                      className={
                        tone === "live"
                          ? "bg-[var(--live)]/15 text-[var(--live)]"
                          : tone === "gold"
                            ? "bg-[var(--gold)]/20 text-[var(--gold-foreground)]"
                            : "bg-secondary text-foreground/60"
                      }
                    >
                      {tier}
                    </Badge>
                  </div>
                );
              })}
            {viewerCount === 0 && (
              <div className="p-6 text-center text-xs text-foreground/50">
                No viewers yet. Open /demand/live in another tab.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
          <h2 className="mb-3 text-sm font-bold text-foreground">Geo Heat — Live Viewers</h2>
          <div className="space-y-3">
            {[
              { s: "Sector 65", v: 412, w: 92 },
              { s: "Sector 76", v: 318, w: 71 },
              { s: "Sector 84", v: 264, w: 60 },
              { s: "Golf Course Ext.", v: 188, w: 42 },
              { s: "DLF Phase 5", v: 102, w: 24 },
            ].map((g) => (
              <div key={g.s}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="font-semibold text-foreground">{g.s}</span>
                  <span className="text-foreground/60">{g.v}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal to-primary"
                    style={{ width: `${g.w}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
