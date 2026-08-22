import type { PostMeta } from "@/lib/posts";
import { PostCard } from "@/app/(blog)/_components/post-card-variants";

type PostListProps = {
  posts: PostMeta[];
};

export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} variant="default" />
      ))}
    </div>
  );
}
