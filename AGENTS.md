# AGENTS.md

## Project

`blog-david7279` is David Vieira's personal technical blog.

Stack:

* Next.js 16 + App Router
* React 19
* TypeScript
* Tailwind CSS 4
* shadcn/ui + Radix UI + Base UI
* MDX
* Drizzle ORM + PostgreSQL/Neon
* React Hook Form + Zod
* Resend
* Motion
* Lenis
* Shiki
* Biome
* npm

The project prioritizes clean architecture, accessibility, performance, readable code, and minimal complexity.

---

## Core Rules

1. **Inspect before modifying.**
2. **Prefer existing patterns over new abstractions.**
3. **Make the smallest change that correctly solves the task.**
4. **Do not introduce dependencies unless clearly necessary.**
5. **Keep Server Components as the default.**
6. **Keep client boundaries as small as possible.**
7. **Never expose secrets or server-only data to the client.**
8. **Do not perform destructive database operations unless explicitly requested.**
9. **MDX is the source of truth for post content and metadata.**
10. **Run relevant validation before considering work complete.**

Do not perform unrelated refactors while implementing a feature.

---

## Repository Structure

```text
app/
├── (blog)/              # Public blog routes and blog-specific code
├── (backoffice)/        # Backoffice routes
├── api/                 # API route handlers
└── layout.tsx

components/
├── ui/                  # Generic reusable UI primitives
├── footer/
├── nav/
└── shared application UI

content/
└── posts/               # MDX source of truth

lib/
├── db/                  # Database configuration/access
├── posts/               # Post loading/parsing/types
├── stats/               # Post engagement/statistics
└── *.ts                 # Shared utilities

scripts/
└── sync-posts.ts        # MDX → database synchronization

drizzle/
└── migrations

public/
└── static assets
```

---

## Architecture

The application separates content from dynamic data:

```text
MDX posts
   ↓
Post loader
   ↓
Next.js UI

MDX frontmatter
   ↓
sync-posts.ts
   ↓
PostgreSQL / Neon
```

### Content

`content/posts/` is the source of truth for:

* article content;
* title;
* description;
* date;
* tags;
* author;
* publication status;
* other post frontmatter.

Never make PostgreSQL the source of truth for article content.

### Database

PostgreSQL stores dynamic/persistent data such as:

* post identifiers/metadata required by the application;
* views;
* votes;
* engagement data.

Database access must remain server-side.

---

## Next.js

Use Server Components by default.

Only add:

```tsx
"use client";
```

when client-side behavior is actually required, such as:

* state;
* effects;
* browser APIs;
* event handlers;
* client-only libraries;
* interactive UI.

Keep `"use client"` boundaries as small as possible.

Do not turn an entire page into a Client Component to support one interactive child.

Prefer:

```text
Server Component
    ↓
small Client Component
```

over:

```text
Client Page
    ↓
everything client-side
```

---

## Data Fetching

Prefer direct server-side data access from Server Components.

Do not create an API route merely so another server-side component can call it.

Avoid:

```text
Server Component
    ↓
HTTP request
    ↓
own API route
    ↓
database
```

when this is possible:

```text
Server Component
    ↓
server function / database
```

Use API routes for genuine HTTP boundaries such as browser submissions or external consumers.

---

## API Routes

API routes live under:

```text
app/api/
```

Every externally supplied payload must be validated server-side.

For API changes:

* validate input;
* handle malformed requests;
* return appropriate status codes;
* avoid leaking internal errors;
* keep secrets server-side.

Never rely exclusively on client-side validation.

---

## Forms

The project uses:

* React Hook Form
* Zod
* `@hookform/resolvers`

Prefer shared Zod schemas where validation rules are reused.

Client validation is for UX.

Server validation is required for correctness and security.

Do not duplicate validation logic unnecessarily.

---

## Contact Form

The contact flow is:

```text
React Hook Form
    ↓
Zod
    ↓
Next.js API route
    ↓
Resend
    ↓
email
```

Never expose `RESEND_API_KEY` to the client.

Validate contact submissions again on the server before sending email.

---

## MDX

Posts live in:

```text
content/posts/
```

When creating or modifying a post:

1. Update the MDX file.
2. Validate frontmatter.
3. Verify the rendered article.
4. Run synchronization if metadata changed.

Use:

```bash
npm run sync
```

Do not manually edit synchronized post records to fix content that belongs in MDX.

### Sync safety

Before running:

```bash
npm run sync
```

verify the `DATABASE_URL`.

Never intentionally run synchronization against production unless the task explicitly requires it.

---

## Database

Use Drizzle ORM for database access and schema changes.

For schema changes:

1. Inspect the current schema.
2. Modify the schema definition.
3. Generate a migration.
4. Review the generated SQL.
5. Apply it to the intended environment.
6. Validate the application.

Never:

* manually rewrite applied migrations;
* delete migration history;
* drop/recreate the database as a shortcut;
* destroy existing data without explicit intent.

Treat migrations as permanent history.

---

## UI

Before creating a component, inspect:

```text
components/ui/
app/(blog)/_components/
```

Reuse existing primitives and patterns.

Use `components/ui/` for generic reusable primitives.

Use route-local `_components/` for feature-specific components.

Do not put blog business logic inside generic UI primitives.

Avoid introducing another UI library when the existing stack can solve the problem.

---

## Styling

Use Tailwind CSS and the existing design system.

Prefer existing:

* design tokens;
* spacing;
* typography;
* variants;
* UI primitives;
* utility functions.

Avoid unnecessary custom CSS.

Use `app/globals.css` for genuinely global styles.

Do not introduce arbitrary values when an existing token or utility is appropriate.

---

## Responsive UI

Every UI change must consider:

* mobile;
* tablet;
* desktop;
* long content;
* empty states;
* loading states;
* overflow.

Never assume desktop-only layouts.

Wide content such as tables and code blocks must remain usable on small screens.

---

## Accessibility

Use semantic HTML and accessible interaction patterns.

Check:

* keyboard navigation;
* focus states;
* labels;
* heading hierarchy;
* button/link semantics;
* meaningful `alt` text;
* reduced motion.

Do not use ARIA as a replacement for correct HTML semantics.

---

## Animation

The project uses Motion and Lenis.

Animations should be subtle and purposeful.

Do not add animation unless it improves UX.

Avoid unnecessary layout animations and excessive client-side animation.

Respect reduced-motion preferences where applicable.

---

## TypeScript

Keep TypeScript strict and meaningful.

Avoid:

```ts
any
```

unless unavoidable at an external boundary.

Do not use `@ts-ignore` to hide errors.

Avoid unsafe type assertions when proper narrowing or typing is possible.

Prefer domain-specific types over generic types.

---

## Naming

Use descriptive domain names.

Components:

```text
PostCard
PostTable
ContactForm
ThemeToggle
```

Hooks:

```text
usePostSearch
usePostFilter
usePostSort
```

Types:

```text
Post
PostMetadata
PostSortOption
ContactFormValues
```

Avoid meaningless names such as:

```text
Data
Item
Thing
Helper
```

when a domain-specific name is available.

---

## Utilities and Hooks

Before creating a utility or hook:

1. Search the repository.
2. Check `lib/`.
3. Check feature-local `_hooks/`.
4. Reuse or extend existing functionality when appropriate.

Do not create duplicate utilities with overlapping responsibilities.

Feature-specific logic should remain close to the feature.

---

## Search / Filtering / Sorting

Preserve existing behavior when modifying search, filters, or sorting.

Handle:

* empty results;
* invalid values;
* stable sorting;
* responsive UI;
* URL state when applicable.

Do not silently change existing filter semantics.

---

## Security

Never commit or expose:

* API keys;
* database credentials;
* tokens;
* passwords;
* private credentials.

Never expose server secrets through `NEXT_PUBLIC_*`.

Never trust client-provided data.

Never disable security checks simply to make development easier.

Follow `SECURITY.md` for security-specific requirements.

---

## Environment Variables

Local environment configuration belongs in:

```text
.env.local
```

Never commit secrets.

Current important variables include:

```text
DATABASE_URL
RESEND_API_KEY
CONTACT_TO_EMAIL
CONTACT_FROM_EMAIL
```

When adding an environment variable:

* document it;
* use a descriptive name;
* keep secrets server-side;
* update relevant environment documentation.

---

## Git

Keep changes focused.

Do not mix unrelated:

* refactors;
* dependency upgrades;
* formatting changes;
* renames;
* feature work.

Avoid modifying unrelated files.

Before finishing, inspect the diff.

---

## Dependencies

Before adding a dependency:

1. Check `package.json`.
2. Search the repository for an existing solution.
3. Prefer the current stack if it can solve the problem.
4. Add a dependency only when it provides meaningful value.

Do not add libraries for trivial functionality.

Use npm.

Do not switch package managers.

---

## Validation

Available commands:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run sync
```

After code changes, run the relevant checks.

For normal application changes:

```bash
npm run lint
npm run build
```

For formatting:

```bash
npm run format
```

For post synchronization:

```bash
npm run sync
```

Do not claim validation passed unless the command was actually run.

If validation cannot be run, explicitly report that.

---

## Change Workflow

Use this workflow by default:

```text
1. Understand the task
2. Inspect relevant files
3. Search for existing patterns
4. Identify the smallest correct change
5. Implement
6. Format
7. Lint
8. Build when practical
9. Review the diff
10. Report changes + validation
```

For database changes:

```text
inspect
→ modify schema
→ generate migration
→ review SQL
→ apply migration
→ validate
```

For MDX changes:

```text
edit MDX
→ validate frontmatter/content
→ sync metadata when required
→ verify rendering
```

For UI changes:

```text
inspect existing UI
→ reuse primitives
→ implement
→ check responsive behavior
→ check accessibility
→ validate
```

---

## Do Not

Do not:

* rewrite unrelated code;
* introduce unnecessary abstractions;
* add unnecessary dependencies;
* expose secrets;
* bypass TypeScript errors;
* disable lint rules to hide problems;
* turn Server Components into Client Components unnecessarily;
* create API routes as unnecessary server-side proxies;
* manually edit applied migrations;
* drop/recreate databases as a shortcut;
* treat PostgreSQL as the source of truth for MDX content;
* run post synchronization against production without explicit intent;
* claim tests/build/lint passed without running them.

---

## Definition of Done

A task is complete when:

* requested behavior is implemented;
* existing architecture is preserved;
* TypeScript remains valid;
* no unnecessary dependencies were added;
* responsive/accessibility concerns were considered;
* relevant validation passes;
* database/content synchronization is handled when applicable;
* no secrets were introduced;
* unrelated code was not modified;
* the final diff is understandable and focused.

---

## Priority

When rules conflict, prefer:

```text
1. Security
2. Correctness
3. Existing architecture
4. Maintainability
5. Performance
6. Accessibility / UX
7. Simplicity
8. Developer convenience
```

When uncertain, inspect the existing code and follow the established project pattern rather than inventing a new one.