import {
  pgTable,
  serial,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const postStats = pgTable(
  "post_stats",
  {
    id: serial("id").primaryKey(),

    uuid: uuid("uuid").defaultRandom().notNull().unique(),

    slug: text("slug").notNull().unique(),

    views: integer("views").default(0).notNull(),
    upvotes: integer("upvotes").default(0).notNull(),
    downVotes: integer("down_votes").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),

    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("post_stats_slug_idx").on(table.slug),
    index("post_stats_deleted_at_idx").on(table.deletedAt),
    index("post_stats_active_updated_idx").on(table.deletedAt, table.updatedAt),
  ],
);
