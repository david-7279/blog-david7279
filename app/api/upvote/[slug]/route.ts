import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { postStats } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";

type Params = { params: Promise<{ slug: string }> };

type VoteType = "up" | "down" | null;

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const newVote = body.type as VoteType; // "up" | "down" | null
    const previousVote = (body.previous as VoteType) ?? null;

    if (!["up", "down", null].includes(newVote)) {
      return NextResponse.json(
        { error: "type must be 'up', 'down' or null" },
        { status: 400 },
      );
    }

    // Busca ou cria o registo
    let stats = await db.query.postStats.findFirst({
      where: and(eq(postStats.slug, slug), isNull(postStats.deletedAt)),
    });

    if (!stats) {
      const [created] = await db.insert(postStats).values({ slug }).returning();
      stats = created;
    }

    let upvotes = stats.upvotes;
    let downVotes = stats.downVotes;

    // Remove o voto anterior
    if (previousVote === "up") upvotes = Math.max(0, upvotes - 1);
    if (previousVote === "down") downVotes = Math.max(0, downVotes - 1);

    // Adiciona o novo voto
    if (newVote === "up") upvotes += 1;
    if (newVote === "down") downVotes += 1;

    const [updated] = await db
      .update(postStats)
      .set({ upvotes, downVotes })
      .where(eq(postStats.slug, slug))
      .returning({
        upvotes: postStats.upvotes,
        downVotes: postStats.downVotes,
      });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating votes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
