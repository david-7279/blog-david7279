import { and, eq, sql } from "drizzle-orm";

import { db, postStats, postVotes, posts } from "@/lib/db";

import type { PostStats, ToggleUpvoteResult } from "./types";

/**
 * Retrieves engagement statistics for a post using its slug.
 *
 * A missing statistics record is normalized to zero so callers can
 * safely render statistics without handling nullable database values.
 */
export async function getPostStats(slug: string): Promise<PostStats> {
  const [result] = await db
    .select({
      views: postStats.views,
      upvotes: postStats.upvotes,
    })
    .from(posts)
    .leftJoin(postStats, eq(posts.id, postStats.postId))
    .where(eq(posts.slug, slug))
    .limit(1);

  return {
    views: result?.views ?? 0,
    upvotes: result?.upvotes ?? 0,
  };
}

/**
 * Retrieves engagement statistics using the internal database post ID.
 */
export async function getPostStatsByPostId(postId: number): Promise<PostStats> {
  const [stats] = await db
    .select({
      views: postStats.views,
      upvotes: postStats.upvotes,
    })
    .from(postStats)
    .where(eq(postStats.postId, postId))
    .limit(1);

  return {
    views: stats?.views ?? 0,
    upvotes: stats?.upvotes ?? 0,
  };
}

/**
 * Ensures that a statistics record exists for the specified post.
 *
 * The operation is idempotent and relies on the database uniqueness
 * constraint for `postStats.postId` to safely handle concurrent calls.
 */
export async function ensurePostStats(postId: number): Promise<void> {
  await db
    .insert(postStats)
    .values({
      postId,
    })
    .onConflictDoNothing({
      target: postStats.postId,
    });
}

/**
 * Atomically increments the view count for a post.
 *
 * The increment is performed directly in the database to prevent
 * lost updates when multiple requests are processed concurrently.
 */
export async function incrementViews(postId: number): Promise<number> {
  await ensurePostStats(postId);

  const [updated] = await db
    .update(postStats)
    .set({
      views: sql`${postStats.views} + 1`,
    })
    .where(eq(postStats.postId, postId))
    .returning({
      views: postStats.views,
    });

  if (!updated) {
    throw new Error(`Failed to increment views for post ${postId}`);
  }

  return updated.views;
}

/**
 * Resolves a post slug to its database ID and increments its views.
 *
 * Throws when the requested post does not exist.
 */
export async function incrementViewsBySlug(slug: string): Promise<number> {
  const [post] = await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }

  return incrementViews(post.id);
}

/**
 * Checks whether a visitor currently has an active upvote for a post.
 *
 * The visitor is identified by the application-level visitor ID.
 */
export async function hasVisitorUpvoted(
  postId: number,
  visitorId: string,
): Promise<boolean> {
  const [vote] = await db
    .select({
      id: postVotes.id,
    })
    .from(postVotes)
    .where(
      and(eq(postVotes.postId, postId), eq(postVotes.visitorId, visitorId)),
    )
    .limit(1);

  return Boolean(vote);
}

/**
 * Toggles an upvote for a visitor.
 *
 * Behavior:
 * - No existing vote → creates an upvote.
 * - Existing upvote → removes the upvote.
 *
 * The application intentionally supports upvotes only. There is no
 * downvote state or downvote transition in the domain model.
 */
export async function toggleUpvote(
  postId: number,
  visitorId: string,
): Promise<ToggleUpvoteResult> {
  await ensurePostStats(postId);

  const [currentVote] = await db
    .select({
      id: postVotes.id,
    })
    .from(postVotes)
    .where(
      and(eq(postVotes.postId, postId), eq(postVotes.visitorId, visitorId)),
    )
    .limit(1);

  if (!currentVote) {
    await db.insert(postVotes).values({
      postId,
      visitorId,
      vote: 1,
    });

    await db
      .update(postStats)
      .set({
        upvotes: sql`${postStats.upvotes} + 1`,
      })
      .where(eq(postStats.postId, postId));

    const stats = await getPostStatsByPostId(postId);

    return {
      ...stats,
      voted: true,
    };
  }

  await db.delete(postVotes).where(eq(postVotes.id, currentVote.id));

  await db
    .update(postStats)
    .set({
      upvotes: sql`GREATEST(${postStats.upvotes} - 1, 0)`,
    })
    .where(eq(postStats.postId, postId));

  const stats = await getPostStatsByPostId(postId);

  return {
    ...stats,
    voted: false,
  };
}

/**
 * Toggles an upvote using the public post slug.
 *
 * The slug is resolved to the internal database ID before performing
 * the vote operation.
 */
export async function toggleUpvoteBySlug(
  slug: string,
  visitorId: string,
): Promise<ToggleUpvoteResult> {
  const [post] = await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }

  return toggleUpvote(post.id, visitorId);
}

/**
 * Retrieves statistics for all published posts.
 *
 * Results are ordered by view count in descending order, making the
 * returned collection suitable for admin dashboards and analytics views.
 */
export async function getAllStats() {
  return db
    .select({
      postId: posts.id,
      slug: posts.slug,
      title: posts.title,
      views: postStats.views,
      upvotes: postStats.upvotes,
    })
    .from(posts)
    .innerJoin(postStats, eq(posts.id, postStats.postId))
    .where(sql`${posts.publishedAt} IS NOT NULL`)
    .orderBy(sql`${postStats.views} DESC`);
}

/**
 * Resets all engagement data for a post.
 *
 * This is intended for administrative operations and removes both
 * the aggregated counters and the individual visitor vote records.
 */
export async function resetVotes(postId: number): Promise<PostStats> {
  await db
    .update(postStats)
    .set({
      upvotes: 0,
    })
    .where(eq(postStats.postId, postId));

  await db.delete(postVotes).where(eq(postVotes.postId, postId));

  return getPostStatsByPostId(postId);
}

export type { PostStats, ToggleUpvoteResult };
