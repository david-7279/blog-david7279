import { getAllPostsWithStats } from "@/lib/posts";
import { PostList } from "./_components/post-list";
import { EmptyState } from "./_components/empty-state";

export const metadata = {
  title: "Blog",
  description: "Articles about technology and development.",
};

export default async function BlogPage() {
  const posts = await getAllPostsWithStats();

  return (
    <main className="pb-24">
      {posts.length === 0 ? <EmptyState /> : <PostList posts={posts} />}
    </main>
  );
}
