import { getAllPosts } from "@/lib/posts";
import { PostList } from "./_components/post-list";
import { EmptyState } from "./_components/empty-state";
import { ThemeToggle } from "@/components/theme-toggle";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen">
      <header className="max-w-2xl mx-auto px-6 pt-20 pb-16">
        <div className="flex items-center justify-between gap-6">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Blog
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pb-24">
        {posts.length === 0 ? <EmptyState /> : <PostList posts={posts} />}
      </main>
    </div>
  );
}
