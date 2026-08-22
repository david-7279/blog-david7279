import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { postStats } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    // Tenta incrementar
    const existing = await db.query.postStats.findFirst({
      where: and(eq(postStats.slug, slug), isNull(postStats.deletedAt)),
    });

    if (existing) {
      const [updated] = await db
        .update(postStats)
        .set({ views: existing.views + 1 })
        .where(eq(postStats.slug, slug))
        .returning({ views: postStats.views });

      return NextResponse.json({ views: updated.views });
    }

    // Se não existir, cria
    const [created] = await db
      .insert(postStats)
      .values({ slug, views: 1 })
      .returning({ views: postStats.views });

    return NextResponse.json({ views: created.views });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET para obter as views de um slug
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const stats = await db.query.postStats.findFirst({
    where: and(eq(postStats.slug, slug), isNull(postStats.deletedAt)),
    columns: { views: true, upvotes: true, downVotes: true },
  });

  return NextResponse.json({
    views: stats?.views ?? 0,
    upvotes: stats?.upvotes ?? 0,
    downVotes: stats?.downVotes ?? 0,
  });
}
