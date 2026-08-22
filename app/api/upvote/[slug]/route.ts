import { NextRequest, NextResponse } from "next/server";
import { updateVote, type VoteType } from "@/lib/stats";

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const next = body.type as VoteType;
    const previous = (body.previous as VoteType) ?? null;

    if (!["up", "down", null].includes(next)) {
      return NextResponse.json(
        { error: "type must be 'up', 'down' or null" },
        { status: 400 },
      );
    }

    const stats = await updateVote(slug, next, previous);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error updating votes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
