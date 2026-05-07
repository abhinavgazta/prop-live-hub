import { createServerFn } from "@tanstack/react-start";
import { AccessToken } from "livekit-server-sdk";

export const getLiveKitToken = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { room: string; identity: string; role: "publisher" | "viewer" }) => input,
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const url = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !url) {
      throw new Error("LiveKit env vars missing. Set LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET.");
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: data.identity,
      ttl: "2h",
    });

    at.addGrant({
      room: data.room,
      roomJoin: true,
      canPublish: data.role === "publisher",
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();
    return { token, url };
  });
