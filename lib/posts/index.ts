import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostMeta, PostWithStats } from "./types";
import { getStatsForSlugs } from "./query";

const postsDirectory = path.join(process.cwd(), "content/posts");

/**
 * Normalizes the tags value from MDX frontmatter.
 */
function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((tag): tag is string => typeof tag === "string");
}

/**
 * Normalizes the author value from MDX frontmatter.
 */
function parseAuthor(value: unknown): string {
  return typeof value === "string" ? value : "David Vieira";
}

/**
 * Normalizes the date value from MDX frontmatter.
 */
function parseDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }
  return new Date().toISOString();
}

/**
 * Checks if a path exists.
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
 * Parses a single MDX post.
 * The MDX file remains the source of truth.
 */
async function parsePost(filename: string): Promise<Post> {
  const slug = filename.replace(/\.mdx$/, "");
  const fullPath = path.join(postsDirectory, filename);
  const fileContents = await readFile(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const minutes = Math.max(1, Math.ceil(readingTime(content).minutes));

  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: parseDate(data.date),
    tags: parseTags(data.tags),
    published: typeof data.published === "boolean" ? data.published : true,
    author: parseAuthor(data.author),
    readingTime: minutes,
    content,
  };
}

/**
 * Returns all published posts (metadata only).
 */
export async function getAllPosts(): Promise<PostMeta[]> {
  if (!(await pathExists(postsDirectory))) {
    return [];
  }

  const entries = await readdir(postsDirectory, { withFileTypes: true });

  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name);

  const posts = await Promise.all(files.map((filename) => parsePost(filename)));

  return posts
    .filter((post) => post.published)
    .map(({ content: _content, ...post }) => post)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Returns a published post by slug (with content).
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Prevent path traversal
  if (
    !slug ||
    slug.includes("..") ||
    slug.includes("/") ||
    slug.includes("\\")
  ) {
    return null;
  }

  const filename = `${slug}.mdx`;
  const fullPath = path.join(postsDirectory, filename);

  if (!(await pathExists(fullPath))) {
    return null;
  }

  const post = await parsePost(filename);

  if (!post.published) {
    return null;
  }

  return post;
}

/**
 * Returns all published posts with their statistics.
 * Uses a single query to avoid N+1.
 */
export async function getAllPostsWithStats(): Promise<PostWithStats[]> {
  const allPosts = await getAllPosts();

  if (allPosts.length === 0) {
    return [];
  }

  const slugs = allPosts.map((post) => post.slug);
  const stats = await getStatsForSlugs(slugs);

  return allPosts.map((post) => {
    const postStats = stats.get(post.slug);

    return {
      ...post,
      views: postStats?.views ?? 0,
      upvotes: postStats?.upvotes ?? 0,
      downvotes: postStats?.downvotes ?? 0,
    };
  });
}

export type { Post, PostMeta, PostWithStats };
