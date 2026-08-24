import { db, posts, postStats } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";

import type { PostStat } from "@/lib/db/schema";

/**
 * Get statistics for a single post.
 *
 * The post itself is identified by its database ID.
 */
export async function getPostStats(
  postId: number,
): Promise<PostStat | undefined> {
  return db.query.postStats.findFirst({
    where: (table, { eq }) => eq(table.postId, postId),
  });
}

/**
 * Get statistics for multiple posts in one query.
 *
 * Used to avoid N+1 database queries when rendering
 * lists of posts.
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
 * Get statistics for multiple posts by their slugs.
 *
 * This requires a join with the posts table and is useful
 * when the application works primarily with MDX slugs.
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
