---
name: documentation
description: Creates and maintains project documentation for this Next.js blog, including README files, API documentation, code comments, architecture notes, changelogs, guides, and contributor-facing documentation. Use when documenting implemented behavior, APIs, architecture, setup, workflows, or project conventions. Do not use for writing blog/MDX articles, UI copy, commit messages, or code implementation without a documentation requirement.
---

# Documentation Skill

## Workflow

1. Identify the documentation target and its intended audience.
2. Inspect the relevant implementation before writing documentation.
3. Reuse existing project terminology and structure.
4. Document the current behavior; never invent unsupported behavior.
5. Keep documentation concise and task-oriented.
6. Update existing documentation instead of creating duplicates.
7. Verify commands, paths, configuration names, and examples against the repository.
8. Review the final document for outdated or contradictory information.

## Project Documentation

For project-level documentation:

1. Inspect `package.json`, project structure, and relevant configuration.
2. Verify all commands against available npm scripts.
3. Verify paths and filenames before documenting them.
4. Keep setup instructions reproducible.
5. Never document secrets or real environment values.
6. Use `.env.example` only when it actually exists or when the task explicitly requires creating it.

Read `references/project.md` only when detailed project-documentation conventions are required.

## API Documentation

When documenting an API:

1. Inspect the route implementation.
2. Document HTTP method, path, inputs, outputs, and error behavior.
3. Verify validation rules from the actual implementation.
4. Document authentication or authorization requirements when applicable.
5. Do not expose internal implementation details or secrets.
6. Keep examples consistent with the actual API contract.

Read `references/api.md` only when detailed API documentation rules are required.

## Architecture Documentation

When documenting architecture:

1. Inspect the relevant source directories.
2. Trace the actual data flow.
3. Identify server/client boundaries.
4. Identify external services and persistence layers.
5. Document responsibilities rather than implementation trivia.
6. Update architecture documentation when the implementation changes.

Prefer diagrams or concise flow representations when they improve clarity.

Read `references/architecture.md` only when detailed architecture conventions are required.

## Code Comments

Add comments only when the reasoning is not obvious from the code.

Prefer:

- explaining why
- documenting non-obvious constraints
- explaining workarounds
- documenting external behavior that affects the implementation

Avoid:

- restating the code
- obvious type descriptions
- historical commentary with no current value
- comments that duplicate documentation

## Changelogs

When maintaining a changelog:

1. Inspect the actual changes.
2. Group changes by meaningful category.
3. Describe user-visible or developer-relevant impact.
4. Avoid speculative entries.
5. Keep entries concise.

Read `references/changelog.md` only when changelog conventions are required.

## Markdown

Use valid Markdown.

Prefer:

- clear heading hierarchy
- short paragraphs
- lists for procedures
- fenced code blocks for commands and code
- tables only when they improve comparison
- relative links for repository-local resources

Keep examples executable whenever possible.

## Accuracy

Before completing documentation:

1. Verify every command.
2. Verify every referenced path.
3. Verify configuration names.
4. Verify versions when explicitly documented.
5. Remove obsolete instructions.
6. Check for contradictions with existing documentation.

If repository state is ambiguous, inspect the implementation instead of guessing.

## Scope

Keep documentation changes focused.

Do not modify:

- application behavior
- database schema
- API implementation
- UI
- tests

unless the documentation task explicitly requires those changes.

For MDX/blog content, load:

`../mdx/SKILL.md`

For UI-specific documentation or examples, load:

`../ui/SKILL.md`