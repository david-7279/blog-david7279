---
name: ui
description: Builds and refactors the blog's user interface using Next.js, React, Tailwind CSS, shadcn/ui, Radix/Base UI, Lucide, Motion, and Lenis. Use when creating or modifying pages, components, layouts, responsive behavior, interactions, animations, accessibility, or visual states. Do not use for database, MDX content, API, testing, or documentation-only tasks.
---

# UI Skill

## Workflow

1. Inspect the target route/component and its nearest existing UI patterns.
2. Identify the Server/Client Component boundary before making changes.
3. Reuse existing components from `components/ui/` and existing project patterns before creating new primitives.
4. Implement the smallest focused change that satisfies the request.
5. Preserve the existing visual language, spacing, typography, responsive behavior, and interaction patterns.
6. Verify accessibility and responsive behavior.
7. Run focused validation.
8. Run broader validation when the change affects shared components or application-wide styling.

## Component Rules

- Prefer Server Components by default.
- Add `"use client"` only when client-side state, effects, browser APIs, or event handlers require it.
- Keep client boundaries as small as possible.
- Reuse existing components before introducing new abstractions.
- Keep feature-specific components close to their route under `app/`.
- Put genuinely reusable primitives in `components/`.
- Avoid duplicating UI logic across components.
- Preserve existing component APIs unless the change requires a breaking modification.

## Styling

- Use Tailwind CSS for styling.
- Follow existing Tailwind patterns before introducing new utility combinations.
- Use `cn()` / existing class-merging utilities where appropriate.
- Do not introduce arbitrary CSS when Tailwind or an existing component pattern is sufficient.
- Avoid inline styles unless a runtime-computed value requires them.
- Preserve the project's spacing, typography, radius, and layout conventions.
- Avoid unnecessary visual redesigns when implementing functional changes.

## Responsive Design

Validate at minimum:

- Mobile
- Tablet
- Desktop

Check:

- horizontal overflow
- text wrapping
- long titles and descriptions
- tables and code blocks
- navigation behavior
- touch targets
- spacing at breakpoint boundaries

Prefer fluid layouts and existing responsive utilities over hard-coded viewport assumptions.

## Accessibility

Use semantic HTML whenever possible.

- Use `button` for actions.
- Use `a` / Next.js `Link` for navigation.
- Use headings in a logical hierarchy.
- Provide accessible names for icon-only controls.
- Preserve visible focus states.
- Ensure interactive elements are keyboard accessible.
- Do not use clickable non-interactive elements such as `<div>` or `<span>` when a semantic element is appropriate.
- Do not rely exclusively on color to communicate state.
- Respect reduced-motion preferences.

## Icons

Use `lucide-react` for interface icons.

- Prefer existing project icons before adding alternatives.
- Do not use text characters or emoji as UI icons when a Lucide icon exists.
- Provide accessible labels for icon-only controls.

## Animation

Use `motion` only when animation improves the interaction or visual hierarchy.

- Prefer subtle, purposeful transitions.
- Respect `prefers-reduced-motion`.
- Avoid animating large numbers of elements unnecessarily.
- Do not add animation solely for decoration.
- Preserve existing animation patterns.

For smooth scrolling, use the project's existing Lenis integration instead of creating another scrolling implementation.

## States

Account for relevant UI states:

- loading
- empty
- error
- success
- disabled
- hover
- focus
- active
- responsive
- reduced motion

Do not invent new state-management patterns when the existing component already provides one.

## shadcn/ui and Primitives

Before creating a new primitive:

1. Check `components/ui/`.
2. Check existing shadcn/ui components.
3. Check existing Radix/Base UI usage.
4. Extend an existing component when appropriate.
5. Create a new primitive only when the existing components cannot satisfy the requirement cleanly.

Do not add a dependency for a component that can reasonably be implemented with the existing stack.

## Validation

After UI changes:

1. Run the relevant Biome checks.
2. Run `npm run build` when the change affects routing, shared components, configuration, or production rendering.
3. Inspect the final diff.
4. Confirm that unrelated files were not modified.

Use:

```bash
npm run format
```

formatting changes are intentionally required.

Do not claim a check passed unless it was actually executed.

## Scope

Keep UI changes focused.

Do not modify:

* database schema
* migrations
* MDX synchronization
* API contracts
* environment configuration

unless the UI change explicitly requires it.