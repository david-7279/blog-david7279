import { eq, and, isNull } from "drizzle-orm";
import { db, postStats } from "@/lib/db";
import type { PostStats, VoteType } from "./types";

/**
 * Obtém as estatísticas de um post
 */
export async function getPostStats(slug: string): Promise<PostStats> {
  const stats = await db.query.postStats.findFirst({
    where: and(eq(postStats.slug, slug), isNull(postStats.deletedAt)),
    columns: {
      views: true,
      upvotes: true,
      downvotes: true,
    },
  });

  return {
    views: stats?.views ?? 0,
    upvotes: stats?.upvotes ?? 0,
    downvotes: stats?.downvotes ?? 0,
  };
}

/**
 * Incrementa as views de um post (cria o registo se não existir)
 */
export async function incrementViews(slug: string): Promise<number> {
  const existing = await db.query.postStats.findFirst({
    where: and(eq(postStats.slug, slug), isNull(postStats.deletedAt)),
  });

  if (existing) {
    const [updated] = await db
      .update(postStats)
      .set({ views: existing.views + 1 })
      .where(eq(postStats.slug, slug))
      .returning({ views: postStats.views });

    return updated.views;
  }

  const [created] = await db
    .insert(postStats)
    .values({ slug, views: 1 })
    .returning({ views: postStats.views });

  return created.views;
}

/**
 * Atualiza o voto de um post
 * - previous: voto anterior do utilizador
 * - next: novo voto (null = remover voto)
 */
export async function updateVote(
  slug: string,
  next: VoteType,
  previous: VoteType = null,
): Promise<PostStats> {
  // Busca ou cria o registo
  let stats = await db.query.postStats.findFirst({
    where: and(eq(postStats.slug, slug), isNull(postStats.deletedAt)),
  });

  if (!stats) {
    const [created] = await db.insert(postStats).values({ slug }).returning();
    stats = created;
  }

  let upvotes = stats.upvotes;
  let downvotes = stats.downvotes;

  // Remove o voto anterior
  if (previous === "up") upvotes = Math.max(0, upvotes - 1);
  if (previous === "down") downvotes = Math.max(0, downvotes - 1);

  // Adiciona o novo voto
  if (next === "up") upvotes += 1;
  if (next === "down") downvotes += 1;

  const [updated] = await db
    .update(postStats)
    .set({ upvotes, downvotes })
    .where(eq(postStats.slug, slug))
    .returning({
      views: postStats.views,
      upvotes: postStats.upvotes,
      downvotes: postStats.downvotes,
    });

  return updated;
}

/**
 * Lista todas as estatísticas (para o dashboard)
 */
export async function getAllStats() {
  return db.query.postStats.findMany({
    where: isNull(postStats.deletedAt),
    orderBy: (stats, { desc }) => [desc(stats.views)],
  });
}

// Re-export dos tipos
export type { PostStats, VoteType };
