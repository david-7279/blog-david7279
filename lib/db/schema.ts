import { sql } from "drizzle-orm";
import {
  check,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Posts
 *
 * Stores the metadata and publication state of blog posts.
 *
 * The actual article content can remain in MDX files tracked by Git.
 *
 * Responsibilities:
 * - Public URL slug
 * - SEO metadata
 * - Publication date
 * - Lifecycle timestamps
 *
 * The database is intentionally NOT responsible for storing the MDX content.
 */
export const posts = pgTable(
  "posts",
  {
    /**
     * Internal database identifier.
     *
     * Uses PostgreSQL IDENTITY instead of the legacy SERIAL type.
     */
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

    /**
     * Public URL identifier.
     *
     * Example:
     * "building-my-first-startup"
     */
    slug: varchar("slug", {
      length: 255,
    }).notNull(),

    /**
     * Post title.
     */
    title: varchar("title", {
      length: 255,
    }).notNull(),

    /**
     * Short description used for:
     * - Blog cards
     * - SEO description
     * - Open Graph metadata
     */
    description: text("description"),

    /**
     * Publication timestamp.
     *
     * NULL means the post has not been published yet.
     */
    publishedAt: timestamp("published_at", {
      withTimezone: true,
    }),

    /**
     * Record creation timestamp.
     */
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    /**
     * Last metadata update timestamp.
     */
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    /**
     * A slug must be unique because it is used as
     * the public URL of the post.
     */
    uniqueIndex("posts_slug_unique").on(table.slug),
  ],
);

/**
 * Post statistics
 *
 * Stores aggregate engagement metrics for a post.
 *
 * The counters are intentionally kept separate from the
 * actual post entity.
 */
export const postStats = pgTable(
  "post_stats",
  {
    /**
     * Internal database identifier.
     */
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

    /**
     * Related post.
     *
     * One post has exactly one statistics record.
     *
     * CASCADE ensures that statistics are automatically
     * removed if the post itself is permanently deleted.
     */
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    /**
     * Total page views.
     *
     * Must never be negative.
     */
    views: integer("views").default(0).notNull(),

    /**
     * Total upvotes.
     *
     * Must never be negative.
     */
    upvotes: integer("upvotes").default(0).notNull(),

    /**
     * Total downvotes.
     *
     * Must never be negative.
     */
    downvotes: integer("downvotes").default(0).notNull(),

    /**
     * Statistics creation timestamp.
     */
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    /**
     * One statistics record per post.
     *
     * This also creates an efficient index for:
     *
     * WHERE post_id = ?
     */
    uniqueIndex("post_stats_post_id_unique").on(table.postId),

    /**
     * Data integrity constraints.
     */
    check("post_stats_views_non_negative", sql`${table.views} >= 0`),

    check("post_stats_upvotes_non_negative", sql`${table.upvotes} >= 0`),

    check("post_stats_downvotes_non_negative", sql`${table.downvotes} >= 0`),
  ],
);

/**
 * Post votes
 *
 * Stores individual visitor votes.
 *
 * This table is optional from a UI perspective but important
 * if votes need server-side deduplication.
 *
 * A visitor can only have one active vote per post.
 */
export const postVotes = pgTable(
  "post_votes",
  {
    /**
     * Internal database identifier.
     */
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

    /**
     * Related post.
     */
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    /**
     * Anonymous visitor identifier.
     *
     * This should NOT contain the raw IP address.
     *
     * Store a server-generated / privacy-preserving
     * identifier instead.
     */
    visitorId: varchar("visitor_id", {
      length: 128,
    }).notNull(),

    /**
     * Vote type.
     *
     *  1 = upvote
     * -1 = downvote
     */
    vote: integer("vote").notNull(),

    /**
     * Vote creation timestamp.
     */
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    /**
     * Last time this visitor changed their vote.
     */
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    /**
     * Prevents the same visitor from creating
     * multiple vote records for the same post.
     */
    uniqueIndex("post_votes_post_visitor_unique").on(
      table.postId,
      table.visitorId,
    ),

    /**
     * Vote can only be:
     *
     *  1  → upvote
     * -1  → downvote
     */
    check("post_votes_valid_vote", sql`${table.vote} IN (-1, 1)`),
  ],
);

/**
 * Type-safe database types.
 */
export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

export type PostStat = typeof postStats.$inferSelect;
export type InsertPostStat = typeof postStats.$inferInsert;

export type PostVote = typeof postVotes.$inferSelect;
export type InsertPostVote = typeof postVotes.$inferInsert;
