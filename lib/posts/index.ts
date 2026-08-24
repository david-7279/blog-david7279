import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

import { getStatsForSlugs } from "./query";
import type { Post, PostMeta, PostWithStats } from "./types";

const POSTS_DIRECTORY = path.join(process.cwd(), "content/posts");

const DEFAULT_AUTHOR = "David Vieira";

/**
 * Normalizes the tags field from MDX frontmatter.
 *
 * Invalid or missing values are treated as an empty tag list so that
 * consumers never need to handle undefined tags.
 */
function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (tag): tag is string => typeof tag === "string" && tag.trim() !== "",
  );
}

/**
 * Normalizes the author field from MDX frontmatter.
 *
 * A default author is used when the frontmatter does not provide one.
 */
function parseAuthor(value: unknown): string {
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }

  return DEFAULT_AUTHOR;
}

/**
 * Normalizes the publication date from MDX frontmatter.
 *
 * Gray-matter may return a Date instance depending on the frontmatter
 * parser. Both Date objects and strings are supported here.
 *
 * Invalid or missing dates fall back to the current timestamp.
 */
function parseDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === "string" && value.trim() !== "") {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  return new Date().toISOString();
}

/**
 * Checks whether a filesystem path exists.
 *
 * File system access errors are intentionally normalized to `false`
 * because callers only need to know whether the path is available.
 */
async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parses an MDX file into the application's post domain model.
 *
 * MDX remains the source of truth for post content and metadata.
 */
async function parsePost(filename: string): Promise<Post> {
  const slug = filename.replace(/\.mdx$/, "");
  const fullPath = path.join(POSTS_DIRECTORY, filename);

  const fileContents = await readFile(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const readingTimeMinutes = Math.max(
    1,
    Math.ceil(readingTime(content).minutes),
  );

  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: parseDate(data.date),
    tags: parseTags(data.tags),
    published: typeof data.published === "boolean" ? data.published : true,
    author: parseAuthor(data.author),
    readingTime: readingTimeMinutes,
    content,
  };
}

/**
 * Returns all published posts without their MDX content.
 *
 * Content is intentionally removed from the returned objects because
 * listing pages only require metadata and should not carry unnecessary
 * MDX payloads.
 */
export async function getAllPosts(): Promise<PostMeta[]> {
  if (!(await pathExists(POSTS_DIRECTORY))) {
    return [];
  }

  const entries = await readdir(POSTS_DIRECTORY, {
    withFileTypes: true,
  });

  const filenames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name);

  const posts = await Promise.all(
    filenames.map((filename) => parsePost(filename)),
  );

  return posts
    .filter((post) => post.published)
    .map(({ content: _content, ...metadata }) => metadata)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Returns a published post by its slug.
 *
 * The slug is validated before constructing the filesystem path to
 * prevent path traversal outside the posts directory.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (
    !slug ||
    slug.includes("..") ||
    slug.includes("/") ||
    slug.includes("\\")
  ) {
    return null;
  }

  const filename = `${slug}.mdx`;
  const fullPath = path.join(POSTS_DIRECTORY, filename);

  if (!(await pathExists(fullPath))) {
    return null;
  }

  const post = await parsePost(filename);

  return post.published ? post : null;
}

/**
 * Returns all published posts enriched with engagement statistics.
 *
 * Statistics are fetched in a single database query to avoid N+1
 * database access when rendering a post collection.
 */
export async function getAllPostsWithStats(): Promise<PostWithStats[]> {
  const allPosts = await getAllPosts();

  if (allPosts.length === 0) {
    return [];
  }

  const slugs = allPosts.map((post) => post.slug);
  const statsBySlug = await getStatsForSlugs(slugs);

  return allPosts.map((post) => {
    const stats = statsBySlug.get(post.slug);

    return {
      ...post,
      views: stats?.views ?? 0,
      upvotes: stats?.upvotes ?? 0,
      downvotes: stats?.downvotes ?? 0,
    };
  });
}

export type { Post, PostMeta, PostWithStats };
