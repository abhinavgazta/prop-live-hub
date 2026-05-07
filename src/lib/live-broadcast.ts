import { createServerFn } from "@tanstack/react-start";

let liveEventId: string | null = null;
let liveStartedAt: number | null = null;

export const setLiveBroadcast = createServerFn({ method: "POST" })
  .inputValidator((input: { eventId: string }) => input)
  .handler(async ({ data }) => {
    liveEventId = data.eventId;
    liveStartedAt = Date.now();
    return { eventId: liveEventId, startedAt: liveStartedAt };
  });

export const clearLiveBroadcast = createServerFn({ method: "POST" }).handler(async () => {
  liveEventId = null;
  liveStartedAt = null;
  return { ok: true };
});

export const getLiveBroadcast = createServerFn({ method: "GET" }).handler(async () => {
  return { eventId: liveEventId, startedAt: liveStartedAt };
});
