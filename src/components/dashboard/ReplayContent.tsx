import { useState } from "react";
import { Play, Eye, Clock, MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { REPLAY_VIDEOS, type ReplayVideo } from "@/lib/replay-videos";

export function ReplayContent() {
  const [selectedVideo, setSelectedVideo] = useState<ReplayVideo | null>(REPLAY_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      {/* Header */}
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1">
          <Play className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Property Tour Replays
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Watch Past Property Tours</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Catch up on property tours you missed. All tours feature verified properties with honest
          resident reviews and expert insights.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_450px]">
        {/* Main Video Player */}
        {selectedVideo && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{selectedVideo.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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
            <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-black shadow-lg">
              {isPlaying ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`${selectedVideo.videoUrl}?autoplay=1`}
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
            <Card className="p-6">
              <h3 className="mb-3 font-bold">Property Details</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-muted-foreground">Property Name</div>
                  <div className="font-medium">{selectedVideo.propertyName}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Type</div>
                  <div className="font-medium">{selectedVideo.propertyType}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Location</div>
                  <div className="font-medium">{selectedVideo.sector}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Price Range</div>
                  <div className="font-medium">{selectedVideo.priceRange}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 text-xs text-muted-foreground">Tour Highlights</div>
                <div className="flex flex-wrap gap-2">
                  {selectedVideo.highlights.map((highlight, idx) => (
                    <Badge key={idx} variant="secondary" className="font-normal">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <div>Originally aired {selectedVideo.liveDate}</div>
                <span>•</span>
                <div>{selectedVideo.liveViewers.toLocaleString()} watched live</div>
              </div>
            </Card>
          </div>
        )}

        {/* Video List */}
        <div className="space-y-3">
          <h3 className="font-bold">All Property Tours</h3>
          <div className="space-y-3">
            {REPLAY_VIDEOS.map((video) => (
              <Card
                key={video.id}
                className={`cursor-pointer overflow-hidden transition-all hover:shadow-md ${
                  selectedVideo?.id === video.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedVideo(video);
                  setIsPlaying(false);
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
                    <h4 className="line-clamp-2 text-sm font-semibold leading-tight">
                      {video.title}
                    </h4>
                    <div className="mt-1 text-xs text-muted-foreground">{video.propertyName}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
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
    </div>
  );
}
