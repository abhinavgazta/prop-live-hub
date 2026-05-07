import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  FileText,
  Mic2,
  Volume2,
  Maximize2,
  Sparkles,
  X,
  LogOut,
  Captions as CaptionsIcon,
  Share2,
  Glasses,
  Wifi,
  Heart,
  ShieldCheck,
} from "lucide-react";
import {
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
import {
  PROJECT,
  QUALITY_OPTIONS,
  type LangCode,
  type StreamQuality,
} from "@/lib/liveRoomMockData";
import { CaptionsOverlay, useCaptionTimer } from "@/components/live/CaptionsOverlay";
import { ProjectRibbon } from "@/components/live/ProjectRibbon";
import { ShareDialog } from "@/components/live/ShareDialog";
import { TipDialog } from "@/components/live/TipDialog";
import { PaywallDialog } from "@/components/live/PaywallDialog";
import { DigitourModal } from "@/components/live/DigitourModal";
import { LiveSidebarTabs } from "@/components/live/LiveSidebarTabs";
import { RoomGuidelines } from "@/components/live/RoomGuidelines";
import { LiveLocalityPulse } from "@/components/live/LiveLocalityPulse";

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

  // India-first state
  const [lang, setLang] = useState<LangCode>("en");
  const [captionsOn, setCaptionsOn] = useState(true);
  const [quality, setQuality] = useState<StreamQuality>("auto");
  const [qualityOpen, setQualityOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [digitourOpen, setDigitourOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [tipTarget, setTipTarget] = useState<{
    name: string;
    role: "Locality Legend" | "Verified Resident" | "Host";
  } | null>(null);

  const elapsed = useCaptionTimer(true);

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

  useEffect(() => {
    if (remoteTracks.length > 0) {
      hadStreamRef.current = true;
      setStreamEnded(false);
      if (checkTimerRef.current) clearTimeout(checkTimerRef.current);
    }
  }, [remoteTracks.length]);

  useDataChannel("stream-control", (msg) => {
    const text = new TextDecoder().decode(msg.payload);
    if (text === "stream-ended") {
      setStreamEnded(true);
      onStreamEnded();
    }
  });

  const screenTrack = remoteTracks.find(
    (t) => t.source === Track.Source.ScreenShare && !t.publication?.isMuted,
  );
  const cameraTrack = remoteTracks.find(
    (t) => t.source === Track.Source.Camera && !t.publication?.isMuted,
  );
  const mainTrack = screenTrack ?? cameraTrack ?? null;
  const audioOnly = quality === "audio";

  const activeQuality = QUALITY_OPTIONS.find((q) => q.id === quality)!;

  return (
    <div className="grid gap-4 px-4 py-6 md:px-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-4">
        <ProjectRibbon
          activeLang={lang}
          onLangChange={setLang}
          onOpenDocs={() => {
            const el = document.querySelector("[data-sidebar-tab='docs']") as HTMLElement | null;
            el?.click();
          }}
        />

        <div
          className="relative aspect-video overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-elegant)]"
          style={{
            background: "linear-gradient(135deg, oklch(0.25 0.06 250), oklch(0.42 0.15 245))",
          }}
        >
          {mainTrack && !streamEnded && !audioOnly ? (
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
                ) : audioOnly ? (
                  <div className="flex flex-col items-center gap-2 rounded-xl bg-black/55 px-5 py-4 text-center backdrop-blur">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10">
                      <Mic2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm font-bold text-white">Audio-only mode</div>
                    <div className="text-[11px] text-white/60">
                      Saves data on congested 4G · still hearing host audio
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                    Waiting for host to go live…
                  </div>
                )}
              </div>
            </>
          )}

          {screenTrack && cameraTrack && !streamEnded && !audioOnly && (
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
            <Badge
              variant="secondary"
              className="gap-1 bg-black/40 px-2 py-1 text-[11px] text-white backdrop-blur"
              title="Streaming quality"
            >
              <Wifi className="h-3 w-3" />
              {activeQuality.label}
            </Badge>
          </div>

          {/* Top-right toolbar — captions / quality / share / digitour / volume / fullscreen / leave */}
          <div className="absolute right-4 top-4 flex flex-wrap items-center gap-1.5">
            <ToolbarBtn
              active={captionsOn}
              title={captionsOn ? "Hide captions" : "Show captions"}
              onClick={() => setCaptionsOn((v) => !v)}
              icon={<CaptionsIcon className="h-4 w-4" />}
            />
            <div className="relative">
              <ToolbarBtn
                active={qualityOpen}
                title="Stream quality"
                onClick={() => setQualityOpen((v) => !v)}
                icon={<Wifi className="h-4 w-4" />}
              />
              {qualityOpen && (
                <div className="absolute right-0 top-10 z-30 w-52 rounded-xl border border-white/10 bg-black/85 p-1 backdrop-blur">
                  {QUALITY_OPTIONS.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setQuality(q.id);
                        setQualityOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[11px] transition ${
                        quality === q.id
                          ? "bg-white/15 text-white"
                          : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{q.label}</div>
                        <div className="text-[10px] text-white/55">{q.sub}</div>
                      </div>
                      {quality === q.id && <span className="text-emerald-300">●</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ToolbarBtn
              title="Share to WhatsApp / Telegram"
              onClick={() => setShareOpen(true)}
              icon={<Share2 className="h-4 w-4" />}
            />
            <ToolbarBtn
              title="Digitour · 3D walkthrough"
              onClick={() => setDigitourOpen(true)}
              icon={<Glasses className="h-4 w-4" />}
              accent
            />
            <ToolbarBtn
              title="Volume"
              onClick={() => {}}
              icon={<Volume2 className="h-4 w-4" />}
            />
            <ToolbarBtn
              title="Fullscreen"
              onClick={() => {
                document.documentElement.requestFullscreen?.().catch(() => {});
              }}
              icon={<Maximize2 className="h-4 w-4" />}
            />
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

          {/* Captions overlay */}
          <CaptionsOverlay
            enabled={captionsOn}
            onToggle={setCaptionsOn}
            lang={lang}
            onLangChange={setLang}
            elapsed={elapsed}
          />

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

        {/* Action row — site visit / RERA fact sheet / share / tip / digitour / interest */}
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
            RERA fact sheet
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-[#25D366]/40 text-[#1d9c52] hover:bg-[#25D366]/10"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-[var(--gold)]/40 bg-[var(--gold)]/5 text-[var(--gold-foreground)]"
            onClick={() => setTipTarget({ name: "Anika Sharma", role: "Host" })}
          >
            <Sparkles className="h-4 w-4 text-[var(--gold)]" />
            Tip host
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-purple-500/40 bg-purple-500/5 text-purple-700"
            onClick={() => setDigitourOpen(true)}
          >
            <Glasses className="h-4 w-4" />
            Digitour
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
          <div className="ml-auto inline-flex items-center gap-2 text-xs text-foreground/60">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Community Verified · 18 insights · governance log live
          </div>
        </div>

        {/* Live poll */}
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
          <div className="mt-2 text-[11px] text-foreground/60">
            847 votes · ends in 02:14 · Karma +5 for verified vote
          </div>
        </div>

        <RoomGuidelines />
      </div>

      <div className="flex flex-col gap-4">
        <LiveSidebarTabs
          onOpenTip={(target) => setTipTarget(target)}
          onOpenPaywall={() => setPaywallOpen(true)}
        />
        <LiveLocalityPulse localityName={PROJECT.locality} compact />
      </div>

      {/* Dialogs */}
      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        elapsed={elapsed}
        roomName={ROOM_NAME}
        insight={`Possession ${new Date(PROJECT.possessionDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })} · escrow ${PROJECT.escrowDeployedPct}% deployed`}
      />
      <TipDialog
        open={!!tipTarget}
        onClose={() => setTipTarget(null)}
        recipientName={tipTarget?.name ?? ""}
        recipientRole={tipTarget?.role ?? "Host"}
        bountyMode={tipTarget?.role === "Locality Legend"}
      />
      <PaywallDialog open={paywallOpen} onClose={() => setPaywallOpen(false)} />
      <DigitourModal open={digitourOpen} onClose={() => setDigitourOpen(false)} />

      {/* Leave confirmation */}
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

function ToolbarBtn({
  icon,
  onClick,
  title,
  active,
  accent,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
  active?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`grid h-8 w-8 place-items-center rounded-lg backdrop-blur transition ${
        accent
          ? "bg-purple-600/70 text-white hover:bg-purple-600"
          : active
            ? "bg-white text-black"
            : "bg-black/40 text-white hover:bg-black/60"
      }`}
    >
      {icon}
    </button>
  );
}
