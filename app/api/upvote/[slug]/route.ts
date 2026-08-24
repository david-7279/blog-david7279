import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db, posts } from "@/lib/db";
import {
  getPostStatsByPostId,
  hasVisitorUpvoted,
  toggleUpvote,
} from "@/lib/stats";
import { isValidSlug } from "@/lib/slug";

const VISITOR_COOKIE = "blog_visitor_id";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

type UpvoteResponse = {
  views: number;
  upvotes: number;
  voted: boolean;
};

/**
 * Resolves a public post slug to its internal database ID.
 *
 * Slugs are used by the public API, while database operations use
 * the internal numeric post ID.
 */
async function getPostIdBySlug(slug: string): Promise<number | null> {
  const [post] = await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  return post?.id ?? null;
}

/**
 * Retrieves the visitor identifier from the request cookie.
 *
 * A visitor ID is created lazily on the first write operation so that
 * read-only requests do not unnecessarily create tracking cookies.
 */
function getVisitorId(request: NextRequest): {
  visitorId: string;
  isNew: boolean;
} {
  const existingVisitorId = request.cookies.get(VISITOR_COOKIE)?.value;

  if (existingVisitorId) {
    return {
      visitorId: existingVisitorId,
      isNew: false,
    };
  }

  return {
    visitorId: crypto.randomUUID(),
    isNew: true,
  };
}

/**
 * GET /api/upvote/[slug]
 *
 * Returns the current engagement statistics for a post together with
 * the current visitor's upvote state.
 *
 * The response is explicitly marked as private and non-cacheable because
 * `voted` is visitor-specific state.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse<UpvoteResponse | { error: string }>> {
  try {
    const { slug } = await params;

    if (!isValidSlug(slug)) {
      return NextResponse.json({ error: "Invalid post slug" }, { status: 400 });
    }

    const postId = await getPostIdBySlug(slug);

    if (postId === null) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const stats = await getPostStatsByPostId(postId);

    const visitorId = request.cookies.get(VISITOR_COOKIE)?.value;

    const voted = visitorId
      ? await hasVisitorUpvoted(postId, visitorId)
      : false;

    return NextResponse.json(
      {
        ...stats,
        voted,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch post upvote state:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/upvote/[slug]
 *
 * Toggles the current visitor's upvote for a post.
 *
 * Behavior:
 * - No existing upvote → creates one.
 * - Existing upvote → removes it.
 *
 * A visitor ID is persisted in an HTTP-only cookie so the client cannot
 * directly manipulate the identifier used to associate votes.
 */
export async function POST(
  request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse<UpvoteResponse | { error: string }>> {
  try {
    const { slug } = await params;

    if (!isValidSlug(slug)) {
      return NextResponse.json({ error: "Invalid post slug" }, { status: 400 });
    }

    const postId = await getPostIdBySlug(slug);

    if (postId === null) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const { visitorId, isNew } = getVisitorId(request);

    const result = await toggleUpvote(postId, visitorId);

    const response = NextResponse.json(result, {
      status: 200,
    });

    /**
     * Only persist the cookie when a visitor identifier had to be
     * generated. Existing visitors keep their current cookie unchanged.
     */
    if (isNew) {
      response.cookies.set({
        name: VISITOR_COOKIE,
        value: visitorId,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: VISITOR_COOKIE_MAX_AGE,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Failed to toggle post upvote:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
