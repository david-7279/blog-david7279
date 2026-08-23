import { getAllPosts } from "@/lib/posts";
import { PostList } from "./_components/post-list";
import { EmptyState } from "./_components/empty-state";
import { ThemeToggle } from "@/components/theme-toggle";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="pb-24">
      {posts.length === 0 ? <EmptyState /> : <PostList posts={posts} />}
    </main>
  );
}
