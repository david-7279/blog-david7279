import type { Metadata } from "next";

import { getAllPostsWithStats } from "@/lib/posts";

import { BlogContent } from "./_components/blog-content";
import { EmptyState } from "./_components/empty-state";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles about technology and development.",
};

/**
 * Renders the blog index page.
 *
 * Post data is fetched on the server and passed to the client-side
 * blog content layer, where interactive search and filtering are handled.
 */
export default async function BlogPage() {
  const posts = await getAllPostsWithStats();

  if (posts.length === 0) {
    return (
      <main className="pb-24">
        <EmptyState />
      </main>
    );
  }

  return (
    <main className="pb-24">
      <BlogContent posts={posts} />
    </main>
  );
}
