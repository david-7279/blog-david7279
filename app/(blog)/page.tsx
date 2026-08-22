import { getAllPosts } from "@/lib/posts";
import { PostList } from "./_components/post-list";
import { EmptyState } from "./_components/empty-state";
import { ThemeToggle } from "@/components/theme-toggle";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen">
      <header className="max-w-2xl mx-auto px-6 pt-20 pb-16">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              David7279
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              Pensamentos, side projects e anotações sobre tecnologia e criação.
            </p>
          </div>
          <ThemeToggle className="mt-1 shrink-0" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pb-24">
        {posts.length === 0 ? <EmptyState /> : <PostList posts={posts} />}
      </main>
    </div>
  );
}
