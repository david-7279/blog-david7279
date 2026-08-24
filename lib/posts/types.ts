/**
 * Metadata defined by an MDX post frontmatter.
 *
 * This type represents the data required to render post listings,
 * cards, SEO metadata, and other post-level UI.
 */
export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  author: string;
  readingTime: number;
};

/**
 * A fully parsed post including its MDX content.
 *
 * The MDX file is the source of truth for both the content and
 * frontmatter represented by this type.
 */
export type Post = PostMeta & {
  content: string;
};

/**
 * Post metadata enriched with engagement statistics from the database.
 *
 * Statistics are intentionally kept separate from the MDX model because
 * they are dynamic application data rather than content authored in MDX.
 */
export type PostWithStats = PostMeta & {
  views: number;
  upvotes: number;
  downvotes: number;
};

/**
 * A heading extracted from the post content.
 */
export type Heading = {
  id: string;
  text: string;
  level: number;
};
