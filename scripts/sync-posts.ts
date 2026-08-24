import "dotenv/config";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { eq } from "drizzle-orm";
import { db, posts } from "@/lib/db";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

async function syncPosts() {
  console.log("🔄 A sincronizar posts com a base de dados...");

  const files = await readdir(POSTS_DIR);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

  if (mdxFiles.length === 0) {
    console.log("Nenhum ficheiro .mdx encontrado.");
    return;
  }

  for (const file of mdxFiles) {
    const slug = file.replace(/\.mdx$/, "");
    const fullPath = path.join(POSTS_DIR, file);
    const raw = await readFile(fullPath, "utf-8");
    const { data } = matter(raw);

    const title = typeof data.title === "string" ? data.title : slug;
    const description =
      typeof data.description === "string" ? data.description : null;

    // Mapeamento: published (boolean) + date → publishedAt (timestamp | null)
    const isPublished =
      typeof data.published === "boolean" ? data.published : true;
    const date = parseDate(data.date);
    const publishedAt = isPublished && date ? date : null;

    const existing = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    if (existing) {
      await db
        .update(posts)
        .set({
          title,
          description,
          publishedAt,
          updatedAt: new Date(),
        })
        .where(eq(posts.slug, slug));

      console.log(`✅ Atualizado: ${slug}`);
    } else {
      await db.insert(posts).values({
        slug,
        title,
        description,
        publishedAt,
      });

      console.log(`🆕 Criado: ${slug}`);
    }
  }

  console.log("✨ Sincronização concluída!");
}

syncPosts().catch((err) => {
  console.error("❌ Erro ao sincronizar posts:", err);
  process.exit(1);
});
