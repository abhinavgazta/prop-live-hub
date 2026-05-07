import { useRef, useState } from "react";
import { Play, Eye, Clock, MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { REPLAY_VIDEOS, type ReplayVideo } from "@/lib/replay-videos";
import { LocalityScoreGrid } from "@/components/replay/LocalityScoreGrid";
import { ReplayChatPanel } from "@/components/replay/ReplayChatPanel";
import { RecommendedReplaysRail } from "@/components/replay/RecommendedReplaysRail";
import { HostPastSessions } from "@/components/replay/HostPastSessions";

export function ReplayContent() {
  const [selectedVideo, setSelectedVideo] = useState<ReplayVideo | null>(REPLAY_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLDivElement | null>(null);

  const handleJumpTo = (sec: number) => {
    if (!selectedVideo) return;
    setIsPlaying(true);
    // Scroll to the player so the user can see the jump.
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // The iframe URL will be re-rendered with start=sec via key prop on the iframe below.
    setJumpSec(sec);
  };

  const [jumpSec, setJumpSec] = useState<number | null>(null);

  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      {/* Header */}
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
          <Play className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Property Tour Replays
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Watch Past Property Tours
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Catch up on tours you missed. Locality life-index scores, replay chat, and recommended
          streams below — vote your lived experience to refine the data.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Main Video Player */}
        {selectedVideo && (
          <div ref={playerRef} className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {selectedVideo.title}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {selectedVideo.developer}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {selectedVideo.sector}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {selectedVideo.duration}
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {selectedVideo.replayViews.toLocaleString()} views
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm">
              {isPlaying ? (
                <iframe
                  key={jumpSec ?? "play"}
                  width="100%"
                  height="100%"
                  src={`${selectedVideo.videoUrl}?autoplay=1${jumpSec ? `&start=${jumpSec}` : ""}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                />
              ) : (
                <>
                  <img
                    src={selectedVideo.thumbnail}
                    alt={selectedVideo.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 m-auto grid h-20 w-20 place-items-center rounded-full bg-white/95 text-primary shadow-2xl transition-transform hover:scale-105"
                  >
                    <Play className="h-9 w-9 fill-primary" />
                  </button>
                </>
              )}
            </div>

            {/* Property Details */}
            <Card className="border-slate-200 p-6 shadow-sm">
              <h3 className="mb-3 font-bold text-slate-900">Property Details</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-500">Property Name</div>
                  <div className="font-medium text-slate-900">{selectedVideo.propertyName}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Type</div>
                  <div className="font-medium text-slate-900">{selectedVideo.propertyType}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Location</div>
                  <div className="font-medium text-slate-900">{selectedVideo.sector}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Price Range</div>
                  <div className="font-medium text-slate-900">{selectedVideo.priceRange}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 text-xs text-slate-500">Tour Highlights</div>
                <div className="flex flex-wrap gap-2">
                  {selectedVideo.highlights.map((highlight, idx) => (
                    <Badge key={idx} variant="secondary" className="font-normal">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <div>Originally aired {selectedVideo.liveDate}</div>
                <span>•</span>
                <div>{selectedVideo.liveViewers.toLocaleString()} watched live</div>
              </div>
            </Card>
          </div>
        )}

        {/* Video List */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900">All Property Tours</h3>
          <div className="space-y-3">
            {REPLAY_VIDEOS.map((video) => (
              <Card
                key={video.id}
                className={`cursor-pointer overflow-hidden border-slate-200 transition-all hover:shadow-md ${
                  selectedVideo?.id === video.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedVideo(video);
                  setIsPlaying(false);
                  setJumpSec(null);
                }}
              >
                <div className="flex gap-3 p-3">
                  <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {video.duration}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="line-clamp-2 text-sm font-semibold leading-tight text-slate-900">
                      {video.title}
                    </h4>
                    <div className="mt-1 text-xs text-slate-600">{video.propertyName}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {video.replayViews.toLocaleString()}
                      </div>
                      <span>•</span>
                      <div>{video.liveDate}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Replay chat — directly below the player */}
      <ReplayChatPanel onJumpTo={handleJumpTo} />

      {/* Locality life-index scores with community voting */}
      <LocalityScoreGrid localityName={selectedVideo?.sector ?? "Sector 65"} />

      {/* Recommended replays */}
      <RecommendedReplaysRail />

      {/* Host's other sessions */}
      <HostPastSessions />
    </div>
  );
}
