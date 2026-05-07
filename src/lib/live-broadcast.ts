const LIVE_EVENT_ID_KEY = "proplive_live_event_id";
const LIVE_STARTED_AT_KEY = "proplive_live_started_at";

export async function setLiveBroadcast(input: { data: { eventId: string } }) {
  if (typeof window === "undefined") {
    return { eventId: input.data.eventId, startedAt: Date.now() };
  }
  const startedAt = Date.now();
  localStorage.setItem(LIVE_EVENT_ID_KEY, input.data.eventId);
  localStorage.setItem(LIVE_STARTED_AT_KEY, String(startedAt));
  return { eventId: input.data.eventId, startedAt };
}

export async function clearLiveBroadcast() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LIVE_EVENT_ID_KEY);
    localStorage.removeItem(LIVE_STARTED_AT_KEY);
  }
  return { ok: true };
}

export async function getLiveBroadcast() {
  if (typeof window === "undefined") {
    return { eventId: null as string | null, startedAt: null as number | null };
  }
  const eventId = localStorage.getItem(LIVE_EVENT_ID_KEY);
  const startedAtRaw = localStorage.getItem(LIVE_STARTED_AT_KEY);
  const startedAt = startedAtRaw ? Number(startedAtRaw) : null;
  return { eventId, startedAt };
}
