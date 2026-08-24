import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllPosts, getPostBySlug } from "@/lib/posts";

import { PostActions } from "@/app/(blog)/[slug]/_components/post-actions";
import { PostContent } from "@/app/(blog)/[slug]/_components/post-content";
import { PostHeader } from "@/app/(blog)/[slug]/_components/post-header";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Generates the static route parameters for all published posts.
 *
 * This allows Next.js to pre-render known blog routes at build time
 * while keeping the MDX files as the source of truth for post content.
 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getAllPosts();

  return posts.map(({ slug }) => ({
    slug,
  }));
}

/**
 * Generates SEO metadata for an individual blog post.
 *
 * Returning an empty object for missing posts allows the page-level
 * `notFound()` boundary to handle the actual 404 response.
 */
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

/**
 * Renders an individual blog post.
 *
 * The page remains a Server Component so MDX content and post metadata
 * can be resolved on the server. Interactive engagement features such
 * as views and upvotes are isolated inside the client-side PostActions
 * component.
 */
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="flex flex-col space-y-4">
      <PostHeader post={post} />

      <PostActions slug={post.slug} />

      <PostContent content={post.content} />
    </article>
  );
}
