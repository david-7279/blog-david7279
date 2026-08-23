import { NextRequest, NextResponse } from "next/server";
import { getPostStats, updateVote } from "@/lib/stats";

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const stats = await getPostStats(slug);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const next = body.type;
    const previous = body.previous ?? null;

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
