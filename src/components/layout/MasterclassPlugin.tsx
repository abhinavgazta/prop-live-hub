import { TrendingUp, Radio, Building2, Star, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MasterclassPlugin() {
  return (
    <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)] relative group/masterclass animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Catchy Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-teal/5 opacity-0 group-hover/masterclass:opacity-100 transition-opacity duration-1000" />

      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="flex flex-col lg:flex-row relative z-10">
        {/* Content Side (50%) */}
        <div className="flex-1 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-border/50 backdrop-blur-[2px]">
          <div className="flex items-center gap-2 mb-6">
            <Badge className="bg-live text-white border-none pulse-live px-2.5 py-0.5 text-[10px] font-bold">
              NEW SERIES
            </Badge>
            <Badge variant="outline" className="bg-teal/5 text-teal border-teal/20">
              Saturday 7 PM
            </Badge>
            <div className="flex -space-x-2 ml-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-6 w-6 rounded-full border-2 border-card bg-secondary flex items-center justify-center overflow-hidden"
                >
                  <div className="h-full w-full bg-gradient-to-br from-primary/20 to-teal/20" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-bold text-muted-foreground ml-1">
              +2.4k interested
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Master the <span className="text-primary">Gurgaon</span> Market
          </h2>

          <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-xl">
            Go beyond brochures. Join our{" "}
            <span className="text-foreground font-semibold">Locality Legends</span> for unscripted,
            resident-led audits that reveal the ground reality of Gurgaon's top sectors.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: <TrendingUp className="h-3.5 w-3.5" />,
                text: "Hidden SBA Charges",
                desc: "True price per sq.ft",
              },
              {
                icon: <Radio className="h-3.5 w-3.5" />,
                text: "Real-time Noise Audits",
                desc: "Decibel testing in-room",
              },
              {
                icon: <Building2 className="h-3.5 w-3.5" />,
                text: "Builder Track Records",
                desc: "Maintenance & delivery",
              },
              {
                icon: <Star className="h-3.5 w-3.5" />,
                text: "Resident Realities",
                desc: "The honest society life",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <div className="mt-1 p-1.5 rounded-lg bg-primary/10 text-primary">{item.icon}</div>
                <div>
                  <div className="text-sm font-bold text-foreground">{item.text}</div>
                  <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-xl px-8 shadow-xl shadow-primary/20 h-12 text-base font-bold"
            >
              Remind Me
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-xl h-12 text-base font-semibold"
            >
              View Schedule
            </Button>
          </div>
        </div>

        {/* Video Side (50%) */}
        <div className="flex-1 p-6 lg:p-10 bg-secondary/10 flex flex-col justify-center items-center">
          <div className="w-full max-w-2xl relative">
            <div className="absolute -inset-4 bg-primary/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover/masterclass:opacity-100 transition-opacity duration-700" />
            <div className="relative w-full aspect-video overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl group/video bg-black">
              <div className="absolute inset-0 bg-black/5 group-hover/video:bg-transparent transition-colors z-10 pointer-events-none" />
              <video
                src="/launchvideo.mp4"
                className="h-full w-full object-contain"
                controls
                autoPlay
                muted
                loop
                playsInline
              />
            </div>

            <div className="mt-6 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/20 grid place-items-center">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary">
                    LIVE PREVIEW
                  </div>
                  <div className="text-sm font-bold">"Testing sound levels at 11 PM"</div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-card/50 backdrop-blur-sm border-border px-3">
                Demo
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
