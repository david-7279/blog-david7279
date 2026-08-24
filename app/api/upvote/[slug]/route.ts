// app/api/upvote/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getPostStats,
  hasVisitorUpvoted,
  toggleUpvoteBySlug,
} from "@/lib/stats";
import { db, posts } from "@/lib/db";
import { eq } from "drizzle-orm";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

const VISITOR_COOKIE = "blog_visitor_id";

function getOrCreateVisitorId(request: NextRequest): {
  visitorId: string;
  isNew: boolean;
} {
  const existing = request.cookies.get(VISITOR_COOKIE)?.value;

  if (existing) {
    return { visitorId: existing, isNew: false };
  }

  return {
    visitorId: crypto.randomUUID(),
    isNew: true,
  };
}

async function getPostIdBySlug(slug: string): Promise<number | null> {
  const [post] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  return post?.id ?? null;
}

/**
 * GET /api/upvote/[slug]
 *
 * Returns:
 * {
 *   views: number;
 *   upvotes: number;
 *   voted: boolean;
 * }
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const stats = await getPostStats(slug);
    const visitorId = request.cookies.get(VISITOR_COOKIE)?.value;

    let voted = false;

    if (visitorId) {
      const postId = await getPostIdBySlug(slug);
      if (postId) {
        voted = await hasVisitorUpvoted(postId, visitorId);
      }
    }

    return NextResponse.json(
      {
        ...stats,
        voted,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-cache",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching post stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/upvote/[slug]
 *
 * Toggles upvote for the current visitor.
 * Returns:
 * {
 *   views: number;
 *   upvotes: number;
 *   voted: boolean;
 * }
 */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const { visitorId, isNew } = getOrCreateVisitorId(request);

    let result;
    try {
      result = await toggleUpvoteBySlug(slug, visitorId);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith("Post not found")
      ) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      throw error;
    }

    const response = NextResponse.json(result, { status: 200 });

    if (isNew) {
      response.cookies.set({
        name: VISITOR_COOKIE,
        value: visitorId,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Error toggling upvote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
