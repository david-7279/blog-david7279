# AGENTS.md

Personal technical blog of David Vieira.

## Stack (exact)

* Next.js 16 (App Router)
* React 19 TypeScript
* Tailwind CSS 4
* shadcn/ui + Radix
* MDX
* Drizzle ORM + Neon
* React Hook Form + Zod
* Resend
* Motion
* Lenis
* Shiki
* Biome
* npm

## Commands

```bash
npm run dev          # start local server
npm run build        # production build (must pass)
npm run lint         # biome check
npm run format       # biome format --write
npm run sync         # MDX → DB sync (scripts/sync-posts.ts)
```

Never run `npm run sync` against production without explicit approval.

## Boundaries

### Always do

* Keep Server Components by default
* Validate every API payload server-side with Zod
* Run `npm run lint` + `npm run build` before finishing
* Prefer existing components in `components/ui/` and route-local `_components/`
* Keep `"use client"` boundaries as small as possible

### Ask first

* Schema / migration changes
* Adding any new dependency
* Running `npm run sync` against non-local DB
* Changing environment variables or secrets

### Never do

* Expose `DATABASE_URL`, `RESEND_API_KEY` or any secret to the client / `NEXT_PUBLIC_*`
* Treat PostgreSQL as source of truth for post content (MDX is the source of truth)
* Manually edit applied migrations or drop/recreate the database
* Push directly to main
* Commit secrets, `.env*`, or credentials
* Rewrite unrelated code or add abstractions “just in case”

## Project Structure

```text
app/
  (blog)/          # public blog routes
  (backoffice)/    # admin routes
  api/             # route handlers only (real HTTP boundaries)
components/
  ui/              # generic reusable primitives
  */               # feature components
content/posts/     # MDX source of truth (title, description, date, tags, status…)
lib/
  db/              # Drizzle + Neon
  posts/           # loaders / types
  stats/           # views / votes
scripts/sync-posts.ts
drizzle/           # migrations (never rewrite history)
```

## Architecture (non-obvious)

```text
MDX (content/posts)  →  post loader  →  UI
MDX frontmatter      →  npm run sync →  PostgreSQL (views, votes, ids only)
```

Database access stays server-side only. Never create an API route just so a Server Component can call it.

## Code Style

```typescript
// Preferred
export function calculateNetRevenue(gross: number, refunds: number): number {
    return gross - refunds;
}

// Avoid
export default function calc(g, r) {
    return g - r
}
```

* Named exports only
* Domain names (`PostCard`, `usePostFilter`, `PostMetadata`)
* No `any`, no `@ts-ignore`
* Tailwind + existing tokens; no arbitrary values when a token exists

## Testing & Validation

* Lint + build are the minimum gate: `npm run lint && npm run build`
* Forms: client UX validation + mandatory server Zod validation
* Contact form flow: RHF → Zod → `/api/...` → Resend (never leak the key)

## Git

* Branch: `feat/…`, `fix/…`, `chore/…`
* Commit: imperative mood (`feat: add post search`)
* One logical change per PR
* Never force-push main

## Skills mapping (`/.agents/skills/`)

| Task                        | Skill                                                    |
|-----------------------------|----------------------------------------------------------|
| Database / Drizzle / Neon   | [database](./.agents/skills/database/SKILL.md)           |
| MDX posts / frontmatter     | [mdx](./.agents/skills/mdx/SKILL.md)                     |
| Next.js App Router patterns | [nextjs](./.agents/skills/nextjs/SKILL.md)               |
| UI / shadcn / Tailwind      | [ui](./.agents/skills/ui/SKILL.md)                       |
| SEO / metadata              | [seo](./.agents/skills/seo/SKILL.md)                     |
| Error handling              | [errors](./.agents/skills/errors/SKILL.md)               |
| Documentation               | [documentation](./.agents/skills/documentation/SKILL.md) |

Load the relevant skill when the task matches.

## Priority (when rules conflict)

* Security
* Correctness
* Existing architecture
* Maintainability
* Simplicity