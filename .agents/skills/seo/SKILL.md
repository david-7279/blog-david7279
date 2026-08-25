---
name: seo
description: Optimizes SEO for this Next.js blog using App Router metadata, canonical URLs, Open Graph, Twitter cards, robots, sitemap, structured data, and semantic HTML. Use when creating or modifying pages, blog posts, layouts, metadata, SEO configuration, indexing behavior, social previews, or search engine visibility. Do not use for generic UI styling, database-only changes, API implementation, or MDX content unrelated to search visibility.
---

# SEO Skill

## Workflow

1. Inspect the target route, layout, and existing metadata implementation.
2. Determine whether the change affects page metadata, blog post SEO, indexing, structured data, sitemap, robots, or social previews.
3. Reuse the project's existing SEO patterns before creating new ones.
4. Implement the smallest focused SEO change.
5. Preserve canonical URL consistency across the application.
6. Validate generated metadata and route behavior.
7. Run lint and build when metadata, layouts, or routes are affected.

## Metadata

Use the Next.js App Router metadata system.

Before modifying metadata:

1. Inspect the nearest route and parent layout.
2. Reuse existing metadata patterns.
3. Preserve title templates and metadata inheritance.
4. Keep titles and descriptions unique and meaningful.
5. Avoid duplicate metadata definitions across layouts and pages.

Read `references/metadata.md` only when detailed metadata rules are required.

## Canonical URLs

Maintain one canonical URL per public page.

Before changing canonical behavior:

1. Inspect the existing site URL configuration.
2. Verify the production domain.
3. Ensure canonical URLs match the public route.
4. Avoid placeholder domains.
5. Keep canonical, Open Graph, and sitemap URLs consistent.

Read `references/canonical.md` only when canonical logic is being modified.

## Blog Posts

For blog post routes:

1. Derive SEO metadata from MDX frontmatter whenever possible.
2. Preserve title, description, date, author, and publication state consistency.
3. Ensure unpublished posts are not indexed.
4. Verify generated metadata matches rendered content.
5. Avoid duplicating post metadata outside the content pipeline.

For MDX-specific behavior, read:

`../mdx/SKILL.md`

## Open Graph and Twitter

When modifying social sharing metadata:

1. Inspect existing Open Graph implementation.
2. Keep titles and descriptions aligned with page metadata.
3. Use the existing image strategy.
4. Preserve absolute URLs where required.
5. Avoid introducing duplicate or conflicting social metadata.

Read `references/social.md` only when modifying Open Graph or Twitter metadata.

## Structured Data

Use structured data only when the page type benefits from it.

Before adding JSON-LD:

1. Confirm the route represents a supported entity.
2. Match structured data with visible page content.
3. Avoid fabricated values.
4. Keep schema generation server-side.
5. Validate JSON structure before completing the change.

Read `references/structured-data.md` only when implementing JSON-LD.

## Indexing

Before changing indexing behavior:

1. Inspect existing robots configuration.
2. Identify whether the route should be public or private.
3. Preserve backoffice exclusion from search engines.
4. Ensure unpublished content remains non-indexable.
5. Avoid blocking public pages accidentally.

Read `references/indexing.md` only when modifying robots or indexing rules.

## Sitemap

When adding or removing public pages:

1. Inspect the existing sitemap implementation.
2. Include only indexable public routes.
3. Exclude backoffice and private routes.
4. Preserve canonical URLs.
5. Verify new blog posts are discoverable when published.

Read `references/sitemap.md` only when modifying sitemap generation.

## Semantic HTML

Preserve semantic structure because it directly supports SEO and accessibility.

Verify:

* one logical H1
* sequential heading hierarchy
* meaningful landmarks
* descriptive links
* semantic article structure
* valid image alt text

For component implementation details, read:

`../ui/SKILL.md`

## Validation

After SEO changes:

1. Inspect generated metadata.
2. Verify canonical URLs.
3. Verify Open Graph values when applicable.
4. Verify indexing behavior.
5. Run:

```bash
npm run lint
```

6. Run:

```bash
npm run build
```

when routes, metadata, layouts, sitemap, robots, or structured data are affected.

Do not claim validation passed unless it was actually executed.

## Scope

Keep SEO changes focused.

Do not modify:

* database schema
* migrations
* authentication
* API contracts
* unrelated UI styling
* MDX article content

unless the SEO requirement explicitly depends on them.

Load the appropriate specialized skill instead of duplicating its rules.
