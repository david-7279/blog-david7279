import type { PostWithStats } from "@/lib/posts/types";

import { PostCard } from "@/app/(blog)/_components/post-card";

type PostListProps = {
  posts: PostWithStats[];
};

/**
 * Renders the collection of published blog posts.
 *
 * This component remains a Server Component because it does not require
 * client-side state, effects, browser APIs, or event handlers.
 */
export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
