import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostMeta, PostWithStats } from "./types";
import { getPostStats } from "@/lib/stats";

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const files = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const minutes = Math.ceil(readingTime(content).minutes);

      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? new Date().toISOString(),
        tags: data.tags ?? [],
        published: data.published ?? true,
        author: data.author,
        readingTime: minutes,
      } satisfies PostMeta;
    })
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const minutes = Math.ceil(readingTime(content).minutes);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? new Date().toISOString(),
    tags: data.tags ?? [],
    published: data.published ?? true,
    author: data.author,
    readingTime: minutes,
    content,
  };
}

export async function getAllPostsWithStats(): Promise<PostWithStats[]> {
  const posts = getAllPosts();

  const postsWithStats = await Promise.all(
    posts.map(async (post) => {
      const stats = await getPostStats(post.slug);
      return {
        ...post,
        views: stats.views,
        upvotes: stats.upvotes,
        downvotes: stats.downvotes,
      };
    }),
  );

  return postsWithStats;
}

export type { Post, PostMeta };
