import { NextResponse } from "next/server";
import { isValidSlug } from "@/lib/slug";

import { getPostStats, incrementViewsBySlug } from "@/lib/stats";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

type ViewsResponse = {
  views: number;
};

type StatsResponse = {
  views: number;
  upvotes: number;
};

/**
 * POST /api/views/[slug]
 *
 * Atomically increments the view counter for the specified post.
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
 *
 * This endpoint is intentionally non-cacheable because it performs
 * a state-changing operation.
 */
export async function POST(
  _request: Request,
  { params }: RouteContext,
): Promise<NextResponse<ViewsResponse | { error: string }>> {
  try {
    const { slug } = await params;

    if (!isValidSlug(slug)) {
      return NextResponse.json(
        {
          error: "Invalid post slug",
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
    console.error("Failed to increment post views:", error);

    /**
     * Keep internal database and infrastructure errors out of the
     * public API response. The client only needs a stable error contract.
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
 * Returns the current public engagement statistics for the specified post.
 *
 * Example:
 *
 * GET /api/views/my-first-post
 *
 * Response:
 *
 * {
 *   "views": 42,
 *   "upvotes": 10
 * }
 *
 * The response can be cached because it contains public aggregate data
 * and does not expose visitor-specific state.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext,
): Promise<NextResponse<StatsResponse | { error: string }>> {
  try {
    const { slug } = await params;

    if (!isValidSlug(slug)) {
      return NextResponse.json(
        {
          error: "Invalid post slug",
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
    console.error("Failed to fetch post statistics:", error);

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
