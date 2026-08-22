import type { PostMeta } from "@/lib/posts";
import { PostCard } from "./post-card";

type PostListProps = {
  posts: PostMeta[];
};

export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-1">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
