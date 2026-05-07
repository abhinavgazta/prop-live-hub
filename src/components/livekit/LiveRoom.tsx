import { useEffect, useState, type ReactNode } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { getLiveKitToken } from "@/lib/livekit-token";

type Props = {
  room: string;
  identity: string;
  role: "publisher" | "viewer";
  children: ReactNode;
  connect?: boolean;
};

export function LiveRoom({ room, identity, role, children, connect = true }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connect) return;
    let cancelled = false;
    getLiveKitToken({ data: { room, identity, role } })
      .then((res) => {
        if (cancelled) return;
        setToken(res.token);
        setServerUrl(res.url);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message ?? "Failed to fetch token");
      });
    return () => {
      cancelled = true;
    };
  }, [room, identity, role, connect]);

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        LiveKit error: {error}
      </div>
    );
  }

  if (!connect || !token || !serverUrl) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Connecting to stream…
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect
      audio={false}
      video={false}
      data-lk-theme="default"
    >
      {children}
    </LiveKitRoom>
  );
}
