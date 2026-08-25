---
name: nextjs
description: Builds, reviews, debugs, and refactors Next.js applications using the App Router, Server Components, Server Actions, route handlers, metadata, caching, and Next.js conventions. Use when the task directly involves Next.js application architecture, routing, rendering, data fetching, performance, or framework configuration. Do not use for generic React tasks that do not depend on Next.js behavior, or for standalone React Native projects.
---

# Next.js

## Workflow

1. Inspect the project before changing code.
    - Identify the Next.js version from `package.json`.
    - Determine whether the project uses the App Router (`app/`) or Pages Router (`pages/`).
    - Inspect relevant `next.config.*`, TypeScript, linting, and package-manager configuration.
    - Follow existing project conventions before introducing new patterns.

2. Identify the rendering boundary.
    - Treat components as Server Components by default when using the App Router.
    - Add `"use client"` only when client-side interactivity, browser APIs, or client-only hooks require it.
    - Keep server-only logic, secrets, and privileged data access on the server.
    - Do not move a component to the client merely to make a server-side problem disappear.

3. Choose the Next.js-native mechanism for the task.
    - Use file-system routing for routes and layouts.
    - Use Server Components for server-rendered UI and server-side data access.
    - Use Server Actions for appropriate mutations initiated by the application UI.
    - Use Route Handlers for HTTP endpoints and integrations that require an HTTP interface.
    - Use `next/link` and `next/navigation` for navigation and routing APIs.
    - Use Next.js metadata APIs for page metadata and SEO-related configuration.
    - Prefer framework caching and revalidation primitives when they fit the data lifecycle.

4. Preserve data-flow boundaries.
    - Fetch data as close as practical to the Server Component that consumes it.
    - Avoid unnecessary client-side fetching when the data can be loaded on the server.
    - Pass only the data required by client components across the server/client boundary.
    - Never expose server secrets, private environment variables, database credentials, or privileged tokens to client code.

5. Handle mutations deliberately.
    - Validate all input at the server boundary.
    - Authorize the operation before performing privileged work.
    - Revalidate affected paths or tags when mutation changes cached content.
    - Return structured success or failure states appropriate to the consuming UI.

6. Handle loading, errors, and not-found states with the App Router conventions.
    - Use `loading.tsx` for route-level loading UI where appropriate.
    - Use `error.tsx` for recoverable route errors where appropriate.
    - Use `not-found.tsx` and `notFound()` for missing resources.
    - Keep error boundaries client-compatible where Next.js requires them.

7. Optimize without premature complexity.
    - Preserve Server Components where possible to reduce client JavaScript.
    - Avoid unnecessary state, effects, client providers, and duplicated requests.
    - Optimize images with `next/image` when appropriate.
    - Use `next/font` when the project benefits from Next.js font optimization.
    - Use dynamic imports only when they solve a measurable loading or bundling concern.

8. Verify the change.
    - Run the project's existing typecheck, lint, test, and build commands when available.
    - Confirm that server/client boundaries remain valid.
    - Check route behavior, metadata, loading states, and error states when affected.
    - Do not claim a build or test passed unless it was actually executed.

## Routing

1. Inspect the existing route tree before creating or moving routes.
2. Preserve route groups, dynamic segments, parallel routes, intercepting routes, and layouts when present.
3. Prefer nested layouts for shared route UI instead of duplicating wrappers across pages.
4. Use `generateStaticParams` only when static generation is appropriate for the route.
5. Use middleware/proxy-style request interception only when the requirement genuinely concerns request-level behavior; do not use it as a replacement for normal application logic.

## Data fetching and caching

1. Determine whether data is static, revalidated, request-specific, or fully dynamic before choosing a caching strategy.
2. Prefer the simplest correct caching behavior supported by the project's Next.js version.
3. Do not assume that a fetch call has identical caching semantics across Next.js versions; verify the installed version when caching behavior is central to the task.
4. Invalidate cached data deliberately after mutations rather than forcing global dynamic rendering.
5. Avoid redundant fetches caused by unnecessary client/server duplication.

## Environment variables

1. Keep secrets in server-only environment variables.
2. Expose a variable to browser code only when the project explicitly requires it and the variable uses the framework's public-variable convention.
3. Never copy private environment values into client components, serialized props, public configuration, or committed source files.
4. Inspect the project's existing `.env*` conventions before changing environment handling.

## SEO and metadata

1. Use the Metadata API for App Router metadata whenever possible.
2. Prefer route-specific metadata for route-specific content.
3. Use `generateMetadata` when metadata depends on route parameters or fetched content.
4. Keep canonical URLs, robots directives, Open Graph data, and structured data consistent with the site's actual routing and deployment configuration.
5. For broader SEO work, load the `../seo/SKILL.md` skill when available rather than duplicating SEO strategy here.

## Error handling

1. Reproduce the failure before changing implementation when practical.
2. Read the exact Next.js error and identify whether it concerns routing, rendering, server/client boundaries, build tooling, caching, or runtime behavior.
3. Inspect the relevant framework version before applying version-specific fixes.
4. Prefer fixing the underlying boundary or lifecycle mistake over suppressing the error.
5. If a workaround is required because of a framework or dependency limitation, document the reason in code only when the workaround would otherwise be unclear.

## Progressive disclosure

Read supporting files only when the task requires details not covered here:

- Read `references/app-router.md` for complex App Router routing, layouts, route groups, dynamic routes, parallel routes, or intercepting routes.
- Read `references/rendering.md` for detailed Server Component, Client Component, rendering, and data-flow decisions.
- Read `references/caching.md` for version-sensitive caching, revalidation, and invalidation rules.

Do not create README, CHANGELOG, or installation documentation as part of this skill.