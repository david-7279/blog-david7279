---
name: database
description: Manage and modify the project's PostgreSQL database using Drizzle ORM and Neon while preserving schema integrity, migrations, and data safety.
---

# Database Skill

## Role

You are responsible for database-related work in this project.

The database uses:

- PostgreSQL
- Neon
- Drizzle ORM
- TypeScript

The Drizzle schema is the source of truth for database structure.

Do not infer database structure from application code when the Drizzle schema is available.

## Core Rules

- Inspect the existing schema before making changes.
- Reuse existing tables, columns, relations, indexes, and constraints.
- Follow existing naming conventions.
- Keep database logic strongly typed.
- Prefer Drizzle queries over raw SQL.
- Keep database access on the server.
- Never expose database credentials to client code.
- Never silently change the database schema.
- Never destroy data without explicit approval.

## Database Structure

Before modifying database code, inspect:

```text
db/
lib/
scripts/
drizzle.config.*
```

The exact locations may differ depending on the repository structure.

Search for:

```text
pgTable
relations
drizzle
DATABASE_URL
drizzle.config
```

before creating new database abstractions.

## Schema Changes

Before changing a schema:

1. Inspect the existing table.
2. Inspect all references to the affected table/column.
3. Check existing migrations.
4. Determine whether the change is backward-compatible.
5. Ask for approval before applying destructive changes.
6. Generate the appropriate migration.
7. Review the generated migration before applying it.

Examples of schema changes requiring approval:

* Dropping tables.
* Dropping columns.
* Renaming columns.
* Changing column types.
* Removing constraints.
* Removing indexes.
* Changing nullable columns to required columns.
* Data migrations that modify existing records.

## Migrations

Never manually modify an already-applied migration unless explicitly instructed.

Create a new migration for schema changes.

Preferred workflow:

```bash
# Generate a migration from schema changes
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate
```

Review the generated SQL before applying it.

Do not automatically run migrations against production.

If the project uses a different migration command, use the command defined in `package.json` or `drizzle.config`.

## Database Push

Do not use schema push as a replacement for migrations in production.

Commands such as:

```bash
npx drizzle-kit push
```

must not be used against a production database without explicit approval.

Prefer migrations for tracked schema changes.

## Destructive Operations

The following operations require explicit user approval:

```text
DROP DATABASE
DROP TABLE
DROP COLUMN
TRUNCATE
DELETE without a constrained WHERE clause
Database reset
Database recreation
Production migrations
Production data migrations
```

Never execute destructive SQL simply because it appears to be the easiest solution.

## Data Safety

Never assume development and production databases are interchangeable.

Before executing a query that modifies data:

* identify the target database;
* identify the affected table;
* verify the WHERE condition;
* estimate the affected rows when possible;
* prefer transactions for multi-step mutations.

Never execute:

```sql
DELETE
FROM posts;
```

when a scoped operation is possible.

Prefer:

```sql
DELETE
FROM posts
WHERE id = $1;
```

## Queries

Prefer Drizzle:

```typescript
const post = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
});
```

over raw SQL:

```typescript
await db.execute(
    sql`SELECT * FROM posts WHERE slug = ${slug}`,
);
```

Raw SQL is allowed when Drizzle cannot express the required operation clearly or efficiently.

When using raw SQL:

* parameterize values;
* never interpolate user input;
* keep the query close to the database operation;
* document non-obvious SQL.

## Inserts

Use typed Drizzle inserts:

```typescript
await db.insert(posts).values({
    slug,
    title,
    content,
});
```

Do not manually construct SQL strings.

Validate external input before inserting it.

## Updates

Always scope updates to the intended records.

Preferred:

```typescript
await db
    .update(posts)
    .set({
        title,
    })
    .where(eq(posts.id, postId));
```

Never perform an unrestricted update unless the operation is intentionally global and explicitly approved.

## Deletes

Deletes are high-risk operations.

Prefer:

```typescript
await db
    .delete(posts)
    .where(eq(posts.id, postId));
```

Never delete records based solely on user-controlled text.

For bulk deletes, ask for approval first.

## Transactions

Use transactions when multiple database operations must succeed or fail together.

Example:

```typescript
await db.transaction(async (tx) => {
    await tx.insert(posts).values(post);
    await tx.insert(postTags).values
    (tags);
});
```

Do not create transactions for independent read-only queries without a reason.

## Relationships

Before creating a new relationship:

1. Inspect existing foreign keys.
2. Inspect existing Drizzle relations.
3. Check whether the relationship already exists.
4. Follow existing `cascade/delete` behavior.

Do not introduce cascading deletes without explicit approval.

## Indexes

Consider indexes when:

* a column is frequently filtered;
* a column is frequently used for ordering;
* a column is used in joins;
* a column has a uniqueness requirement.

Do not add indexes speculatively.

Before adding an index, check whether an equivalent index already exists.

## PostgreSQL / Neon

Treat `DATABASE_URL` as sensitive.

Never:

* print it;
* log it;
* commit it;
* include it in error messages;
* expose it through client-side code.

Use environment variables:

```typescript
const databaseUrl = process.env.DATABASE_URL;
```

Never hardcode:

```typescript
const databaseUrl = "postgresql://user:password@host/database";
```

## Environment Separation

Be aware of the database environment before executing mutations.

Possible environments include:

```text
development
staging
production
```

If the target environment is unclear, stop and ask.

Never assume the configured `DATABASE_URL` points to a disposable database.

## Blog Post Database Flow

Blog posts are authored as MDX.

The expected flow is:

```text
content/posts/*.mdx
        ↓
lib/posts/
        ↓
scripts/sync-posts.ts
        ↓
Drizzle
        ↓
Neon PostgreSQL
```

The MDX source is authoritative for post content.

If a post exists in the application but not in the database:

1. Inspect the MDX frontmatter.
2. Inspect the post parser.
3. Inspect `scripts/sync-posts.ts`.
4. Run the synchronization script.
5. Inspect the database only after verifying the synchronization process.

Do not manually insert the post into Neon as the first solution.

## Post Synchronization

Use:

```bash
npx tsx scripts/sync-posts.ts
```

when synchronizing MDX posts with the database.

Before modifying the synchronization script:

* inspect its current behavior;
* inspect the database schema;
* inspect the post parser;
* inspect existing posts;
* preserve idempotency.

Running synchronization multiple times should not create unintended duplicate records.

## Validation

After database-related code changes:

```bash
npx tsc --noEmit
npm run lint
```

If schema changes were made:

```bash
npx drizzle-kit generate
```

Review the generated migration before applying it.

If the project has database tests, run the relevant test suite.

## Boundaries

### Always

* Inspect schema before modifying queries.
* Use typed Drizzle APIs.
* Validate database mutations.
* Keep credentials in environment variables.
* Review generated migrations.
* Keep database operations server-side.
* Preserve existing relationships and constraints.

### Ask First

* Adding or removing tables.
* Adding or removing columns.
* Changing column types.
* Changing constraints.
* Adding cascading deletes.
* Adding/removing indexes with significant impact.
* Creating migrations.
* Running migrations against shared environments.
* Updating existing production data.
* Bulk updates or deletes.
* Database resets.
* Database recreation.
* Changing database providers.

### Never

* Commit database credentials.
* Log DATABASE_URL.
* Expose database credentials to the browser.
* Drop production tables.
* Reset production databases.
* Run unrestricted destructive queries.
* Modify applied migrations retroactively.
* Delete tests to hide database failures.
* Bypass Drizzle solely for convenience.
* Assume a database operation is safe without checking its target.