import "dotenv/config";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { eq } from "drizzle-orm";
import { db, posts } from "@/lib/db";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

async function syncPosts(): Promise<void> {
  console.log("🔄 Syncing posts with the database...");

  const files = await readdir(POSTS_DIR);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  if (mdxFiles.length === 0) {
    console.log("⚠️ No .mdx files found.");
    return;
  }

  console.log(`📄 Found ${mdxFiles.length} post(s).`);

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const file of mdxFiles) {
    const slug = file.replace(/\.mdx$/, "");
    const fullPath = path.join(POSTS_DIR, file);

    try {
      const raw = await readFile(fullPath, "utf-8");
      const { data } = matter(raw);

      const title =
        typeof data.title === "string" && data.title.trim() !== ""
          ? data.title
          : slug;

      const description =
        typeof data.description === "string" && data.description.trim() !== ""
          ? data.description
          : null;

      // Map published + date to publishedAt.
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

        updated++;
        console.log(`✅ Updated: ${slug}`);
      } else {
        await db.insert(posts).values({
          slug,
          title,
          description,
          publishedAt,
        });

        created++;
        console.log(`🆕 Created: ${slug}`);
      }
    } catch (error) {
      failed++;

      console.error(`❌ Failed to sync: ${slug}`);
      console.error(error);
    }
  }

  console.log("\n✨ Post synchronization completed.");
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Failed:  ${failed}`);

  if (failed > 0) {
    throw new Error(`${failed} post(s) failed to synchronize.`);
  }
}

async function main(): Promise<void> {
  try {
    await syncPosts();
  } catch (error) {
    console.error("\n❌ Post synchronization failed.");
    console.error(error);

    process.exitCode = 1;
  }
}

void main();
