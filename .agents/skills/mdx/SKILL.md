---
name: mdx
description: Creates, edits, validates, and integrates MDX blog posts and MDX rendering components for this Next.js blog. Use when working with content/posts, post frontmatter, slugs, MDX components, post rendering, headings, tables, code blocks, reading time, publication state, or MDX-to-database synchronization. Do not use for generic React UI work, database-only changes, API routes, or documentation outside blog content.
---

# MDX Skill

## Workflow

1. Inspect the existing MDX implementation before making changes.
2. Identify whether the task affects:
    - post content
    - frontmatter
    - post loading
    - MDX rendering
    - custom MDX components
    - post metadata
    - database synchronization
3. Preserve the existing MDX architecture and conventions.
4. Implement the smallest focused change.
5. Validate affected posts and rendering behavior.
6. Run `npm run lint`.
7. Run `npm run build` when rendering, routing, loaders, or shared MDX components are affected.
8. Inspect the final diff and verify that unrelated files remain unchanged.

## Source of Truth

Treat `content/posts/` as the source of truth for:

- article content
- post frontmatter
- publication state
- post metadata

Do not manually edit database records to change MDX content or frontmatter.

Database synchronization is a derived operation.

## Post Files

Store posts in:

```text
content/posts/
```

Use the existing post filename and slug conventions.

Before creating or renaming a post:

1. Inspect existing posts.
2. Follow the established filename convention.
3. Verify the resulting slug through the existing post loader.
4. Check for slug collisions.

Do not introduce a second slug-generation strategy.

## Frontmatter

Follow the existing frontmatter schema used by the project.

Before adding or changing frontmatter:

1. Inspect `lib/posts/` for the current parser and types.
2. Inspect representative posts in `content/posts/`.
3. Preserve existing field names and types.
4. Keep required metadata complete.
5. Do not silently invent metadata fields.

Treat invalid required metadata as an error rather than masking it with arbitrary fallback values.

## MDX Components

When adding an MDX component:

1. Inspect the existing MDX renderer and component mapping.
2. Reuse an existing shared UI component when appropriate.
3. Keep the component compatible with the current Server/Client Component architecture.
4. Avoid client-side code unless the component requires browser interaction.
5. Add only the component-specific styling and behavior required.
6. Preserve semantic HTML and accessibility.

For UI-specific implementation details, read:

```text
[.agents/skills/ui/SKILL.md](../ui/SKILL.md)
```

## Content Rendering

Preserve the existing rendering pipeline based on:

* **next-mdx-remote**
* existing remark plugins
* existing syntax highlighting
* existing MDX component mappings

Do not replace the MDX pipeline or introduce another renderer unless explicitly required.

When changing rendering behavior, verify:

* headings
* links
* lists
* blockquotes
* tables
* code blocks
* inline code
* images
* long content
* mobile overflow

## Code Blocks

Use the existing syntax-highlighting implementation.

Do not introduce another syntax-highlighting library when the existing Shiki integration can satisfy the requirement.

When changing code block rendering, verify both:

* fenced Markdown code blocks
* language-specific highlighting

## Tables

Use the project's existing MDX table component when available.

When creating or modifying table rendering:

1. Preserve Markdown table compatibility.
2. Keep tables horizontally usable on small screens.
3. Preserve semantic table structure.
4. Avoid forcing authors to use custom JSX when standard Markdown syntax is sufficient.

## Headings and Table of Contents

Preserve the existing heading structure used by the table-of-contents implementation.

Do not create duplicate heading IDs or introduce a second heading parser.

When changing heading rendering, verify:

* generated IDs
* anchor links
* table of contents
* nested heading levels
* duplicate headings

## Publication State

Respect the existing `published` behavior.

Unpublished posts must not become publicly accessible through normal blog routes.

When changing publication logic:

1. Inspect the post loader.
2. Inspect route generation.
3. Inspect post listing behavior.
4. Verify direct access to unpublished slugs.

## Reading Time

Use the existing `reading-time` integration.

Do not calculate reading time independently inside components.

Keep reading-time calculation within the post-loading/content-processing layer.

## Synchronization

When frontmatter changes affect database metadata:

1. Verify the post loader output.
2. Confirm `DATABASE_URL` targets the intended environment.
3. Inspect `scripts/sync-posts.ts`.
4. Run:

```bash
npm run sync
```

only when synchronization is required by the task.

Never run synchronization blindly against an unknown or production database.

For database schema or migration changes, read:

```text
[.agents/skills/database/SKILL.md](../database/SKILL.md)
```

## Validation

For content-only changes:

```bash
npm run lint
```

For rendering or loader changes:

```bash
npm run lint
npm run build
```

For synchronization changes, additionally verify the resulting database state.

Do not claim validation passed unless the command was actually executed.

## Scope

Keep MDX changes focused.

Do not modify:

* database migrations
* database schema
* API contracts
* authentication
* unrelated UI components
* environment configuration

unless the MDX change explicitly requires them.