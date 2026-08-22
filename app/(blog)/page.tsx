import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAllPosts } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen">
      {/* Header minimalista */}
      <header className="max-w-2xl mx-auto px-6 pt-20 pb-16">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              david7279
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-md">
              Pensamentos, side projects e anotações sobre tecnologia e criação.
            </p>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle className="mt-1 shrink-0" />
        </div>
      </header>

      {/* Lista de posts */}
      <main className="max-w-2xl mx-auto px-6 pb-24">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            Ainda não há posts publicados.
          </p>
        ) : (
          <div className="space-y-1">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.slug}`}
                className="group block py-5 border-b border-border/40 last:border-0 transition-colors hover:bg-muted/30 -mx-3 px-3 rounded-lg"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <div className="space-y-1.5 min-w-0">
                    <h2 className="text-lg font-medium text-foreground group-hover:text-foreground/80 transition-colors truncate">
                      {post.title}
                    </h2>

                    {post.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {post.description}
                      </p>
                    )}
                  </div>

                  <time className="text-sm text-muted-foreground/70 whitespace-nowrap tabular-nums">
                    {new Date(post.date).toLocaleDateString("pt-PT", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer minimalista */}
      <footer className="max-w-2xl mx-auto px-6 pb-16">
        <div className="border-t border-border/40 pt-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()}</span>
          <div className="flex gap-6">
            <Link
              href="/dashboard"
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            {/* Podes adicionar links de redes sociais aqui depois */}
          </div>
        </div>
      </footer>
    </div>
  );
}
