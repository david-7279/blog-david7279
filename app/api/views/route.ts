import { NextRequest, NextResponse } from "next/server";

import { getPostStats, incrementViewsBySlug } from "@/lib/stats";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * POST /api/views/[slug]
 *
 * Increments the view counter for the specified post.
 *
 * Example:
 *
 * POST /api/views/my-first-post
 *
 * Response:
 *
 * {
 *   "views": 42
 * }
 */
export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          error: "Slug is required",
        },
        {
          status: 400,
        },
      );
    }

    const views = await incrementViewsBySlug(slug);

    return NextResponse.json(
      {
        views,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Error incrementing post views:", error);

    /**
     * Do not expose database/internal errors
     * to the client.
     */
    if (error instanceof Error && error.message.startsWith("Post not found:")) {
      return NextResponse.json(
        {
          error: "Post not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * GET /api/views/[slug]
 *
 * Returns the current statistics for the post.
 *
 * Example:
 *
 * GET /api/views/my-first-post
 *
 * Response:
 *
 * {
 *   "views": 42,
 *   "upvotes": 10,
 *   "downvotes": 2
 * }
 */
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          error: "Slug is required",
        },
        {
          status: 400,
        },
      );
    }

    const stats = await getPostStats(slug);

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Error fetching post stats:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
