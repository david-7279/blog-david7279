"use client";

import { PostCard } from "@/app/(blog)/[slug]/components/post-card";
import { PostWithStats } from "@/lib/posts/types";

type PostListProps = {
  posts: PostWithStats[];
};

export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
