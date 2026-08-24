import { eq, inArray } from "drizzle-orm";

import { db, postStats, posts } from "@/lib/db";
import type { PostStat } from "@/lib/db/schema";

/**
 * Retrieves engagement statistics for a single post.
 *
 * @param postId - Database ID of the post.
 * @returns The post statistics, or undefined when no record exists.
 */
export async function getPostStats(
  postId: number,
): Promise<PostStat | undefined> {
  return db.query.postStats.findFirst({
    where: (table, { eq }) => eq(table.postId, postId),
  });
}

/**
 * Retrieves statistics for multiple posts in a single database query.
 *
 * Returning a Map keyed by post ID makes lookups O(1) when enriching
 * post collections and prevents N+1 database queries.
 */
export async function getStatsForPostIds(
  postIds: number[],
): Promise<Map<number, PostStat>> {
  if (postIds.length === 0) {
    return new Map();
  }

  const stats = await db.query.postStats.findMany({
    where: (table) => inArray(table.postId, postIds),
  });

  return new Map(stats.map((stat) => [stat.postId, stat]));
}

/**
 * Retrieves statistics for multiple posts using their slugs.
 *
 * Slugs are the primary identifier used by the content layer, while
 * post IDs are internal database identifiers. The join bridges those
 * two representations without requiring one query per post.
 *
 * Missing statistics are normalized to zero so consumers can safely
 * render engagement metrics without additional null checks.
 */
export async function getStatsForSlugs(slugs: string[]): Promise<
  Map<
    string,
    {
      views: number;
      upvotes: number;
      downvotes: number;
    }
  >
> {
  if (slugs.length === 0) {
    return new Map();
  }

  const result = await db
    .select({
      slug: posts.slug,
      views: postStats.views,
      upvotes: postStats.upvotes,
      downvotes: postStats.downvotes,
    })
    .from(posts)
    .leftJoin(postStats, eq(posts.id, postStats.postId))
    .where(inArray(posts.slug, slugs));

  return new Map(
    result.map((row) => [
      row.slug,
      {
        views: row.views ?? 0,
        upvotes: row.upvotes ?? 0,
        downvotes: row.downvotes ?? 0,
      },
    ]),
  );
}
