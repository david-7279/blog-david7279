# blog-david7279

Personal blog built with Next.js — focused on clean design, fast reading, and practical developer content.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[//]: # (**[Live Demo]&#40;https://your-blog-url.com&#41;** · **[Portfolio]&#40;https://david7279.vercel.app&#41;**)

[//]: # ()
[//]: # (![Blog Preview]&#40;./public/images/blog-preview.png&#41;)

---

## Overview

`blog-david7279` is a modern personal blog platform for publishing technical articles, developer notes, and practical
guides.

The project is built around a simple principle: **content should be easy to discover, comfortable to read, and fast to
access**.

Posts are written in MDX and stored as files in the repository, while post engagement data such as views and votes is
persisted in PostgreSQL.

The platform includes search, filtering, tagging, reading-time information, a responsive reading experience, and a
contact form for direct communication.

---

## Key Features

- **MDX posts** — Write articles in Markdown with support for React components
- **Search & filters** — Search by title, description, tags, and author
- **Post filtering** — Filter posts by tags and reading time
- **Sorting** — Sort posts by date and other supported criteria
- **Post statistics** — Track views and upvotes using PostgreSQL
- **Contact form** — Validated with Zod and React Hook Form, with emails sent through Resend
- **Theme support** — Light and dark mode with animated transitions
- **Table of contents** — Automatically generated from post headings
- **Smooth scrolling** — Lenis-powered scrolling experience
- **Animations** — Motion-based transitions and interactions
- **Responsive UI** — Optimized for desktop, tablet, and mobile
- **Empty states** — Clear feedback when searches or filters return no results
- **Post synchronization** — Sync MDX frontmatter and post metadata with the database

---

## Tech Stack

| Category       | Technology                     |
|----------------|--------------------------------|
| **Framework**  | Next.js 15, React, TypeScript  |
| **Styling**    | Tailwind CSS, shadcn/ui        |
| **Content**    | MDX, gray-matter, reading-time |
| **Database**   | PostgreSQL, Neon               |
| **ORM**        | Drizzle ORM                    |
| **Forms**      | React Hook Form, Zod           |
| **Email**      | Resend                         |
| **Animation**  | Motion                         |
| **Scroll**     | Lenis                          |
| **Tooling**    | Biome                          |
| **Deployment** | Vercel                         |

---

## Architecture

The project separates **content**, **presentation**, and **persistent engagement data**.

```text
                         ┌──────────────────┐
                         │   MDX Posts      │
                         │ content/posts/   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Post Loader    │
                         │   lib/posts/     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Next.js UI    │
                         │  Blog / Posts    │
                         └──────────────────┘


MDX Frontmatter
      │
      ▼
┌──────────────────┐
│  Sync Script     │
│ scripts/sync...  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ PostgreSQL / Neon│
│                  │
│ Views / Votes    │
└──────────────────┘
```

### Content

MDX files are the source of truth for blog content. Each post contains frontmatter with metadata such as title,
description, date, tags, author, and publication status.

### Database

Post engagement data is stored separately from the MDX content. PostgreSQL is used for persistent statistics such as
views and upvotes.

### Synchronization

The sync script reads the post metadata from `content/posts/` and synchronizes the relevant information with the
database.

This keeps the actual article content version-controlled while allowing dynamic engagement data to live in the database.

---

## Project Structure

```text
app/
├── (blog)/
│   ├── _components/       # Blog-specific UI components
│   ├── _hooks/            # Search, filters, sorting, tags, ranges
│   └── ...                # Blog routes and pages
│
├── api/
│   └── contact/           # Contact form API
│
components/
├── ui/                    # Shared UI primitives
└── footer/                # Footer and contact form

content/
└── posts/                 # MDX articles

lib/
└── posts/                 # Post loading, types and database helpers

scripts/
└── sync-posts.ts          # Synchronizes MDX posts with the database
```

---

## Prerequisites

- Node.js 20+ [(download)](https://nodejs.org/en/download/)
- npm 9+ (or pnpm / yarn)
- Git [(download)](https://git-scm.com/downloads)

You will also need:

- A **Neon PostgreSQL** database for post statistics
- A **Resend** account for the contact form

---

## Installation & Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/david-7279/blog-david7279.git
cd blog-david7279
```   

### 2. Install dependencies

```bash
npm install
```   

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Then configure the required variables:

```env
# Database
DATABASE_URL=postgresql://...

# Contact form
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=Contact Form <onboarding@resend.dev>
```

### Environment Variables

| Variable             | Description                                          | 
|----------------------|------------------------------------------------------|
| `DATABASE_URL`       | PostgreSQL connection string                         |
| `RESEND_API_KEY`     | Resend API key                                       |
| `CONTACT_TO_EMAIL`   | Email address that receives contact form submissions |
| `CONTACT_FROM_EMAIL` | Sender address used by Resend                        |

> For production, use a sender address from a verified domain in Resend. With `onboarding@resend.dev`, emails can only
> be sent to the email address associated with your Resend account.

### 4. Start the development server

```bash
npm run dev
```    

Open [http://localhost:3000](http://localhost:3000).

---

## Database

The project uses **PostgreSQL** through **Neon** with **Drizzle ORM**.

The database stores dynamic post engagement data while the actual article content remains inside the repository as MDX.

Typical database responsibilities include:

* Post views
* Post upvotes
* Post identifiers and metadata required by the engagement system

The database schema and migrations are managed through Drizzle.

---

## Syncing Posts

MDX files are stored in:

```text
content/posts/
```

After adding or updating a post, run:

```bash
npm run sync
```

The synchronization process reads the post frontmatter and updates the corresponding database records.

Example post:

```markdown
---
title: "How to Write a Great Pull Request"
description: "Practical guide to PRs that get reviewed and merged faster."
date: "2026-08-22"
tags: ["Documentation", "Best Practices"]
published: true
author: "David Vieira"
---
```

The MDX file remains the source of truth for the article itself.

---

## Available Scripts

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Start the production server
npm run form      # Format the codebase with Biome
npm run sync      # Synchronize MDX posts with the database
```

---

## Contact Form

The contact form uses:

* **React Hook Form** for form state
* **Zod** for validation
* **Next.js API routes** for server-side handling
* **Resend** for email delivery

Validation happens on both the client and server to ensure that submitted data is properly validated before sending an
email.

Required environment variables:

```env
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=Contact Form <onboarding@resend.dev>
```

For production, `CONTACT_FROM_EMAIL` should use a verified domain.

---

## Deployment

The application is designed to be deployed on **Vercel**.

The production environment requires:

1. A PostgreSQL database
2. The required environment variables
3. A verified Resend sender domain for production email delivery

The MDX content is deployed together with the application, while dynamic engagement data is stored in PostgreSQL.

---

## Contributing

Contributions, bug reports, and suggestions are welcome.

If you find an issue or have an idea for improving the project, feel free to open an issue or submit a pull request.

For PR structure and descriptions, see the in-blog guide:

**How to Write a Great Pull Request**

---

## License

This project is licensed under the MIT License.

See [LICENSE](./LICENSE) for more information.

---

## Author

David Vieira — Software Engineer

* Email: [david.dev7279@outlook.com](mailto:david.dev7279@outlook.com)
* GitHub: [@david-7279](https://github.com/david-7279)
* Portfolio: [david7279.vercel.app](https://david7279.vercel.app)

---

## Support

If you find a bug or have an idea for improvement:

* Open an issue on GitHub
* Submit a pull request
* Use the contact form on the blog for direct messages