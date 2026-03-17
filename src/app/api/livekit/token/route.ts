import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit not configured" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { roomName, participantId, participantName, canPublish } = body;

    if (!roomName || !participantId) {
      return NextResponse.json(
        { error: "roomName and participantId required" },
        { status: 400 }
      );
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantId,
      name: participantName || participantId,
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: !!canPublish,
      canSubscribe: true,
    });

    const jwt = await token.toJwt();

    return NextResponse.json(
      { token: jwt, url: process.env.LIVEKIT_URL || "wss://your-livekit-url" }
    );
  } catch (err) {
    console.error("[LiveKit token error]", err);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
