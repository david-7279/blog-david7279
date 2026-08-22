import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { extractHeadings } from "@/lib/posts/headings";
import { PostHeader } from "../_components/post-header";
import { PostActions } from "../_components/post-actions";
import { PostContent } from "../_components/post-content";
import { PostToc } from "../_components/post-toc";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const headings = extractHeadings(post.content);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_42rem_16rem] gap-x-12">
        {/* Espaço vazio à esquerda */}
        <div className="hidden xl:block" />

        {/* Conteúdo centrado */}
        <article className="min-w-0">
          <PostHeader post={post} />
          <PostActions slug={slug} />
          <PostContent content={post.content} />
        </article>

        {/* TOC à direita */}
        <aside className="hidden xl:block sticky top-16 self-start">
          <PostToc headings={headings} />
        </aside>
      </div>
    </div>
  );
}
