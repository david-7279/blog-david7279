/**
 * Database Queries for Post Statistics
 *
 * All queries use Drizzle ORM for type safety and query optimization.
 * Each function is documented with:
 * - Purpose and use case
 * - Return type
 * - Potential errors
 * - Performance notes
 */

import { db, postStats } from "@/lib/db";
import { desc, eq, isNull, sql } from "drizzle-orm";
import type { PostStat } from "@/lib/db/schema";

// ============================================
// READ QUERIES
// ============================================

/**
 * Get statistics for a single post by slug
 *
 * @param slug - Post slug (URL identifier)
 * @returns PostStat record or undefined if not found
 *
 * Use when:
 * - Fetching stats to display on blog post page
 * - Checking if post exists
 *
 * Performance: O(log n) via index on slug
 */
export async function getPostStats(
  slug: string,
): Promise<PostStat | undefined> {
  const result = await db.query.postStats.findFirst({
    where: (table) => eq(table.slug, slug),
  });
  return result;
}

/**
 * Get statistics for a single post by UUID
 *
 * @param uuid - Post UUID (internal identifier)
 * @returns PostStat record or undefined if not found
 *
 * Use when:
 * - Looking up by internal ID
 * - API endpoints that use UUID in request body
 *
 * Performance: O(log n) via unique constraint
 */
export async function getPostStatsByUUID(
  uuid: string,
): Promise<PostStat | undefined> {
  const result = await db.query.postStats.findFirst({
    where: (table) => eq(table.uuid, uuid),
  });
  return result;
}

/**
 * Get top viewed posts (active only)
 *
 * @param limit - Number of posts to return (default: 5)
 * @returns Array of PostStat records sorted by views DESC
 *
 * Use when:
 * - "Most read posts" widget
 * - Homepage featured section
 * - Analytics dashboard
 *
 * Performance: O(log n) via partial index on active posts
 */
export async function getTopViewedPosts(
  limit: number = 5,
): Promise<PostStat[]> {
  return await db.query.postStats.findMany({
    where: (table) => isNull(table.deletedAt),
    orderBy: (table) => desc(table.views),
    limit,
  });
}

/**
 * Get most liked posts (active only)
 *
 * @param limit - Number of posts to return (default: 5)
 * @returns Array of PostStat records sorted by engagement
 *
 * Use when:
 * - "Community favorites" section
 * - Trending posts widget
 *
 * Performance: O(n log n) - no index for this, full scan + sort
 * Consider adding index if becomes bottleneck
 */
export async function getMostLikedPosts(
  limit: number = 5,
): Promise<PostStat[]> {
  return await db.query.postStats.findMany({
    where: (table) => isNull(table.deletedAt),
    orderBy: (table) =>
      desc(
        sql`${table.upvotes}
            -
            ${table.downvotes}`,
      ),
    limit,
  });
}

/**
 * Get recently updated posts (active only)
 *
 * @param limit - Number of posts to return (default: 10)
 * @returns Array of PostStat records sorted by updatedAt DESC
 *
 * Use when:
 * - Recent activity feed
 * - Analytics dashboard
 *
 * Performance: O(log n) via partial index (deletedAt, updatedAt)
 */
export async function getRecentlyUpdatedPosts(
  limit: number = 10,
): Promise<PostStat[]> {
  return await db.query.postStats.findMany({
    where: (table) => isNull(table.deletedAt),
    orderBy: (table) => desc(table.updatedAt),
    limit,
  });
}

/**
 * Get all active posts
 *
 * @returns Array of all non-deleted PostStat records
 *
 * Use when:
 * - Listing all posts for admin
 * - Generating sitemaps
 * - Analytics exports
 *
 * ⚠️ Performance: O(n) full table scan
 * Use pagination for large datasets
 */
export async function getAllActivePosts(): Promise<PostStat[]> {
  return await db.query.postStats.findMany({
    where: (table) => isNull(table.deletedAt),
    orderBy: (table) => desc(table.createdAt),
  });
}

/**
 * Get deleted posts (for recovery/admin purposes)
 *
 * @returns Array of all deleted PostStat records
 *
 * Use when:
 * - Admin: recovering deleted posts
 * - Audit logs
 * - Data recovery
 *
 * Performance: O(log n) via index on deletedAt
 */
export async function getDeletedPosts(): Promise<PostStat[]> {
  return await db.query.postStats.findMany({
    where: (table) => sql`${table.deletedAt}
        IS NOT NULL`,
  });
}

// ============================================
// WRITE QUERIES
// ============================================

/**
 * Create stats entry for a new post
 *
 * @param slug - Post slug
 * @returns Created PostStat record with generated uuid
 *
 * Use when:
 * - New blog post is published
 * - Admin creates post
 *
 * Note: uuid and timestamps are auto-generated
 * Error: throws if slug already exists (unique constraint)
 */
export async function createPostStats(slug: string): Promise<PostStat> {
  const [result] = await db.insert(postStats).values({ slug }).returning();

  if (!result) {
    throw new Error(`Failed to create post stats for slug: ${slug}`);
  }

  return result;
}

/**
 * Increment view count for a post
 *
 * ⚠️ IMPORTANT: Implement rate limiting in your API route!
 * Without rate limiting, bot traffic will inflate views.
 *
 * Suggested rate limiting:
 * - Max 1 view per unique IP address per 24 hours
 * - Store in Redis or session storage
 *
 * @param slug - Post slug
 * @returns Updated PostStat record
 *
 * Use when:
 * - User loads blog post page
 * - In API route with rate limiting
 *
 * Performance: O(log n) via index on slug
 */
export async function incrementViews(
  slug: string,
): Promise<PostStat | undefined> {
  const [result] = await db
    .update(postStats)
    .set({
      views: sql`${postStats.views}
            + 1`,
      updatedAt: new Date(),
    })
    .where(eq(postStats.slug, slug))
    .returning();

  return result;
}

/**
 * Increment upvotes for a post
 *
 * ⚠️ IMPORTANT: Implement deduplication in your API!
 * Store which posts each user has upvoted to prevent duplicate votes.
 *
 * Suggested approach:
 * - Store vote in browser localStorage (client-side dedup)
 * - OR store in database with user ID + post ID
 * - OR use signed cookies
 *
 * @param slug - Post slug
 * @returns Updated PostStat record
 *
 * Performance: O(log n) via index on slug
 */
export async function incrementUpvotes(
  slug: string,
): Promise<PostStat | undefined> {
  const [result] = await db
    .update(postStats)
    .set({
      upvotes: sql`${postStats.upvotes}
            + 1`,
      updatedAt: new Date(),
    })
    .where(eq(postStats.slug, slug))
    .returning();

  return result;
}

/**
 * Increment downvotes for a post
 *
 * ⚠️ IMPORTANT: Implement deduplication (same as upvotes)
 *
 * @param slug - Post slug
 * @returns Updated PostStat record
 *
 * Performance: O(log n) via index on slug
 */
export async function incrementDownvotes(
  slug: string,
): Promise<PostStat | undefined> {
  const [result] = await db
    .update(postStats)
    .set({
      downvotes: sql`${postStats.downvotes}
            + 1`,
      updatedAt: new Date(),
    })
    .where(eq(postStats.slug, slug))
    .returning();

  return result;
}

/**
 * Reset vote counts for a post
 *
 * Use when:
 * - Detected vote manipulation
 * - Admin: cleaning up spam/bot votes
 * - Testing
 *
 * @param slug - Post slug
 * @returns Updated PostStat record
 *
 * ⚠️ DANGEROUS: This resets votes to 0. Use with caution.
 */
export async function resetVotes(slug: string): Promise<PostStat | undefined> {
  const [result] = await db
    .update(postStats)
    .set({
      upvotes: 0,
      downvotes: 0,
      updatedAt: new Date(),
    })
    .where(eq(postStats.slug, slug))
    .returning();

  return result;
}

/**
 * Soft delete a post (mark as deleted without removing data)
 *
 * @param slug - Post slug
 * @returns Updated PostStat record with deletedAt timestamp
 *
 * Use when:
 * - Admin deletes post but wants to preserve history
 * - Archiving old posts
 * - Data recovery scenarios
 *
 * Note: Post can be recovered by clearing deletedAt
 * Performance: O(log n) via index on slug
 */
export async function softDeletePost(
  slug: string,
): Promise<PostStat | undefined> {
  const [result] = await db
    .update(postStats)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(postStats.slug, slug))
    .returning();

  return result;
}

/**
 * Recover a soft-deleted post
 *
 * @param slug - Post slug
 * @returns Updated PostStat record with deletedAt = null
 *
 * Use when:
 * - Admin restores accidentally deleted post
 * - Reverting archive decision
 *
 * Performance: O(log n) via index on slug
 */
export async function recoverDeletedPost(
  slug: string,
): Promise<PostStat | undefined> {
  const [result] = await db
    .update(postStats)
    .set({
      deletedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(postStats.slug, slug))
    .returning();

  return result;
}

/**
 * Permanently delete a post (hard delete)
 *
 * ⚠️ DANGER: This permanently removes all data. Cannot be recovered.
 * Only use for:
 * - GDPR data deletion requests
 * - Spam/abuse removal
 * - Admin explicitly chose hard delete
 *
 * @param slug - Post slug
 * @returns boolean - true if deleted, false if not found
 *
 * Better alternative: Use softDeletePost() instead
 */
export async function hardDeletePost(slug: string): Promise<boolean> {
  const result = await db
    .delete(postStats)
    .where(eq(postStats.slug, slug))
    .returning({ id: postStats.id });

  return result.length > 0;
}

// ============================================
// AGGREGATE/ANALYTICS QUERIES
// ============================================

/**
 * Get engagement statistics across all posts
 *
 * @returns Object with total views, upvotes, downvotes, post count
 *
 * Use when:
 * - Dashboard showing overall blog stats
 * - Analytics page
 * - SEO reports
 *
 * Performance: O(n) - requires full table scan
 * Consider caching this result (recompute every 1 hour)
 */
export async function getGlobalStats(): Promise<{
  totalViews: number;
  totalUpvotes: number;
  totalDownvotes: number;
  totalPosts: number;
  averageViews: number;
}> {
  const [stats] = await db
    .select({
      totalViews: sql`COALESCE(SUM(
            ${postStats.views}
            ),
            0
            )`,
      totalUpvotes: sql`COALESCE(SUM(
            ${postStats.upvotes}
            ),
            0
            )`,
      totalDownvotes: sql`COALESCE(SUM(
            ${postStats.downvotes}
            ),
            0
            )`,
      totalPosts: sql`COUNT(*)`,
    })
    .from(postStats)
    .where(isNull(postStats.deletedAt));

  const totalPosts = Number(stats.totalPosts);
  const totalViews = Number(stats.totalViews);

  return {
    totalViews,
    totalUpvotes: Number(stats.totalUpvotes),
    totalDownvotes: Number(stats.totalDownvotes),
    totalPosts,
    averageViews: totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0,
  };
}

/**
 * Calculate engagement score for a post
 *
 * Formula: (upvotes * 2) + (views * 0.1) - (downvotes * 1.5)
 * Weights: upvotes matter most, views matter little, downvotes penalize
 *
 * @param slug - Post slug
 * @returns Engagement score (can be negative)
 */
export async function getEngagementScore(slug: string): Promise<number> {
  const stat = await getPostStats(slug);
  if (!stat) return 0;

  return stat.upvotes * 2 + stat.views * 0.1 - stat.downvotes * 1.5;
}
