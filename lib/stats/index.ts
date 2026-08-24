import { and, eq, sql } from "drizzle-orm";
import { db, postStats, postVotes, posts } from "@/lib/db";
import type { PostStats, ToggleUpvoteResult } from "./types";

/**
 * Obtém as estatísticas de um post através do slug.
 */
export async function getPostStats(slug: string): Promise<PostStats> {
  const [result] = await db
    .select({
      views: postStats.views,
      upvotes: postStats.upvotes,
    })
    .from(posts)
    .leftJoin(postStats, eq(posts.id, postStats.postId))
    .where(eq(posts.slug, slug))
    .limit(1);

  return {
    views: result?.views ?? 0,
    upvotes: result?.upvotes ?? 0,
  };
}

/**
 * Obtém as estatísticas através do ID do post.
 */
export async function getPostStatsByPostId(postId: number): Promise<PostStats> {
  const [stats] = await db
    .select({
      views: postStats.views,
      upvotes: postStats.upvotes,
    })
    .from(postStats)
    .where(eq(postStats.postId, postId))
    .limit(1);

  return {
    views: stats?.views ?? 0,
    upvotes: stats?.upvotes ?? 0,
  };
}

/**
 * Garante que existe um registo de estatísticas para o post.
 * Idempotente.
 */
export async function ensurePostStats(postId: number): Promise<void> {
  await db
    .insert(postStats)
    .values({
      postId,
    })
    .onConflictDoNothing({
      target: postStats.postId,
    });
}

/**
 * Incrementa as views de forma atómica.
 */
export async function incrementViews(postId: number): Promise<number> {
  await ensurePostStats(postId);

  const [updated] = await db
    .update(postStats)
    .set({
      views: sql`${postStats.views} + 1`,
    })
    .where(eq(postStats.postId, postId))
    .returning({
      views: postStats.views,
    });

  if (!updated) {
    throw new Error(`Failed to increment views for post ${postId}`);
  }

  return updated.views;
}

/**
 * Incrementa views através do slug.
 */
export async function incrementViewsBySlug(slug: string): Promise<number> {
  const [post] = await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }

  return incrementViews(post.id);
}

/**
 * Verifica se um visitante tem upvote ativo neste post.
 */
export async function hasVisitorUpvoted(
  postId: number,
  visitorId: string,
): Promise<boolean> {
  const [vote] = await db
    .select({
      vote: postVotes.vote,
    })
    .from(postVotes)
    .where(
      and(eq(postVotes.postId, postId), eq(postVotes.visitorId, visitorId)),
    )
    .limit(1);

  return vote?.vote === 1;
}

/**
 * Toggle upvote de um visitante.
 *
 * Regras:
 * - sem voto        → cria upvote
 * - já tem upvote   → remove voto
 * - downvote legado → converte para upvote
 */
export async function toggleUpvote(
  postId: number,
  visitorId: string,
): Promise<ToggleUpvoteResult> {
  await ensurePostStats(postId);

  const [current] = await db
    .select({
      id: postVotes.id,
      vote: postVotes.vote,
    })
    .from(postVotes)
    .where(
      and(eq(postVotes.postId, postId), eq(postVotes.visitorId, visitorId)),
    )
    .limit(1);

  // Caso 1: ainda não votou → cria upvote
  if (!current) {
    await db.insert(postVotes).values({
      postId,
      visitorId,
      vote: 1,
    });

    await db
      .update(postStats)
      .set({
        upvotes: sql`${postStats.upvotes} + 1`,
      })
      .where(eq(postStats.postId, postId));

    const stats = await getPostStatsByPostId(postId);
    return { ...stats, voted: true };
  }

  // Caso 2: já tem upvote → remove
  if (current.vote === 1) {
    await db.delete(postVotes).where(eq(postVotes.id, current.id));

    await db
      .update(postStats)
      .set({
        upvotes: sql`GREATEST(${postStats.upvotes} - 1, 0)`,
      })
      .where(eq(postStats.postId, postId));

    const stats = await getPostStatsByPostId(postId);
    return { ...stats, voted: false };
  }

  // Caso 3: tinha downvote legado → passa a upvote
  await db
    .update(postVotes)
    .set({
      vote: 1,
      updatedAt: new Date(),
    })
    .where(eq(postVotes.id, current.id));

  await db
    .update(postStats)
    .set({
      upvotes: sql`${postStats.upvotes} + 1`,
      downvotes: sql`GREATEST(${postStats.downvotes} - 1, 0)`,
    })
    .where(eq(postStats.postId, postId));

  const stats = await getPostStatsByPostId(postId);
  return { ...stats, voted: true };
}

/**
 * Toggle upvote através do slug.
 */
export async function toggleUpvoteBySlug(
  slug: string,
  visitorId: string,
): Promise<ToggleUpvoteResult> {
  const [post] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }

  return toggleUpvote(post.id, visitorId);
}

/**
 * Lista estatísticas dos posts publicados.
 */
export async function getAllStats() {
  return db
    .select({
      postId: posts.id,
      slug: posts.slug,
      title: posts.title,
      views: postStats.views,
      upvotes: postStats.upvotes,
    })
    .from(posts)
    .innerJoin(postStats, eq(posts.id, postStats.postId))
    .where(sql`${posts.publishedAt} IS NOT NULL`)
    .orderBy(sql`${postStats.views} DESC`);
}

/**
 * Reset administrativo dos votos de um post.
 */
export async function resetVotes(postId: number): Promise<PostStats> {
  await db
    .update(postStats)
    .set({
      upvotes: 0,
      downvotes: 0,
    })
    .where(eq(postStats.postId, postId));

  await db.delete(postVotes).where(eq(postVotes.postId, postId));

  return getPostStatsByPostId(postId);
}

export type { PostStats, ToggleUpvoteResult };
