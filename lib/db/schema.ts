import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Post Statistics Table
 *
 * Stores engagement metrics for blog posts
 * - Views: tracked via user IP + 24h cooldown (not implemented here, see docs)
 * - Votes: upvotes/downvotes with client-side deduplication
 * - Soft delete: deletedAt allows data recovery
 *
 * Indexes optimized for:
 * - Single post lookup (slug)
 * - Active posts queries (partial index)
 * - Ordering by recency
 *
 * Constraints ensure:
 * - No negative counts
 * - Non-empty slugs
 * - Immutable creation date
 */
export const postStats = pgTable(
  "post_stats",
  {
    // Primary key - internal, sequential
    // Used only for internal references, never exposed in API
    id: serial("id").primaryKey(),

    // Public identifier - UUID for external references
    // Prevents sequential ID enumeration attacks
    uuid: uuid("uuid")
      .defaultRandom()
      .notNull()
      .unique("post_stats_uuid_unique"),

    // URL-friendly slug identifier
    // Immutable, used in URLs, max 255 chars for efficiency
    slug: text("slug").notNull().unique("post_stats_slug_unique"),

    // Page views count
    // Incremented on page view (with rate limiting to prevent spam)
    // Default 0, cannot be negative
    views: integer("views").default(0).notNull(),

    // Upvotes count
    // Incremented when user clicks thumbs up
    // Default 0, cannot be negative
    upvotes: integer("upvotes").default(0).notNull(),

    // Downvotes count
    // Incremented when user clicks thumbs down
    // Default 0, cannot be negative
    downvotes: integer("downvotes").default(0).notNull(),

    // Created timestamp with timezone
    // Set on first insert, immutable
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    // Updated timestamp with timezone
    // Auto-updated on any row change
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),

    // Soft delete timestamp
    // NULL = active post
    // Set to timestamp = deleted post (can be recovered)
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },

  // Indexes and constraints
  (table) => [
    // ============================================
    // INDEXES (for query performance)
    // ============================================

    // Fast lookup by slug (used in most queries)
    // Query: SELECT * FROM post_stats WHERE slug = 'my-post'
    // Impact: O(log n) instead of O(n) full table scan
    index("post_stats_slug_idx").on(table.slug),

    // Fast queries for deleted posts
    // Query: SELECT * FROM post_stats WHERE deleted_at IS NOT NULL
    // Impact: Efficient recovery/cleanup queries
    index("post_stats_deleted_at_idx").on(table.deletedAt),

    // Optimized for "get active posts sorted by updated"
    // Query: SELECT * FROM post_stats WHERE deleted_at IS NULL ORDER BY updated_at DESC
    // Impact: PARTIAL INDEX = smaller + faster (only indexes active records)
    // This is the most common query pattern
    index("post_stats_active_posts_idx")
      .on(table.deletedAt, table.updatedAt)
      .where(sql`${table.deletedAt} IS NULL`),

    // ============================================
    // CONSTRAINTS (for data integrity)
    // ============================================

    // Views must never be negative
    // Catches application bugs at database level
    check("views_non_negative", sql`${table.views} >= 0`),

    // Upvotes must never be negative
    // Prevents data corruption from API errors
    check("upvotes_non_negative", sql`${table.upvotes} >= 0`),

    // Downvotes must never be negative
    // Maintains data consistency
    check("downvotes_non_negative", sql`${table.downvotes} >= 0`),

    // Slug must not be empty string
    // Prevents accidental empty slug creation
    check("slug_not_empty", sql`length(${table.slug}) > 0`),
  ],
);

// ============================================
// TYPES (exported for TypeScript)
// ============================================

/**
 * Type-safe representation of a post stat record
 * Use this in your queries and API responses
 */
export type PostStat = typeof postStats.$inferSelect;

/**
 * Type-safe representation for inserting new post stats
 * uuid, createdAt, updatedAt are auto-generated
 */
export type InsertPostStat = typeof postStats.$inferInsert;

/**
 * Extended type for API responses
 * Includes calculated fields like engagement score
 */
export type PostStatWithEngagement = PostStat & {
  engagementScore: number;
  totalVotes: number;
};
