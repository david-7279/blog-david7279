CREATE TABLE "post_stats" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "post_stats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"post_id" integer NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"downvotes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "post_stats_views_non_negative" CHECK ("post_stats"."views" >= 0),
	CONSTRAINT "post_stats_upvotes_non_negative" CHECK ("post_stats"."upvotes" >= 0),
	CONSTRAINT "post_stats_downvotes_non_negative" CHECK ("post_stats"."downvotes" >= 0)
);
--> statement-breakpoint
CREATE TABLE "post_votes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "post_votes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"post_id" integer NOT NULL,
	"visitor_id" varchar(128) NOT NULL,
	"vote" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "post_votes_valid_vote" CHECK ("post_votes"."vote" IN (-1, 1))
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_stats" ADD CONSTRAINT "post_stats_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "post_stats_post_id_unique" ON "post_stats" USING btree ("post_id");--> statement-breakpoint
CREATE UNIQUE INDEX "post_votes_post_visitor_unique" ON "post_votes" USING btree ("post_id","visitor_id");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_unique" ON "posts" USING btree ("slug");