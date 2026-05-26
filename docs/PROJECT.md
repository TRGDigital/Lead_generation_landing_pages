# Project Context

## What we're building

A SaaS platform (name TBD) that generates qualified resident enquiries for UK care settings (care homes, nursing homes) via PPC-driven landing pages. Care settings activate the service when they have empty beds, receive qualified leads through a simple portal, and pause the service when full.

The platform has four distinct surfaces, all built in a single Next.js monorepo:

1. **Marketing site** — public site selling the product to care providers, with blog
2. **Client landing pages** — replicable per-care-home landing pages that capture resident enquiries
3. **Admin dashboard** — internal team view: all clients, all leads, campaign control, unit economics
4. **Client portal** — care home view: their own leads, qualification feedback, on/off switch

## Technical stack (locked)

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ App Router |
| Language | TypeScript (strict mode) |
| Hosting | Vercel |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth |
| Blog CMS | Supabase tables (MDX rendered server-side) |
| Styling | Tailwind CSS + CSS variables |
| UI primitives | shadcn/ui (copied into repo) |
| Forms | React Hook Form + Zod |
| Email | SendGrid |
| SMS | Twilio |
| Analytics | GA4 + Google Ads |
| Error tracking | Sentry |
| Package manager | pnpm |
| Monorepo tooling | Turborepo |

## Build phases

| Phase | Focus | Duration |
|---|---|---|
| 1 | Foundation (monorepo, Supabase, auth, deploy pipeline) | 1-2 days |
| 2 | Landing page + lead capture (the conversion engine) | 2-3 days |
| 3 | Admin dashboard | 4-5 days |
| 4 | Client portal | 2-3 days |
| 5 | Marketing site + blog | 3-4 days |
| 6 | Integrations + automation (Google Ads, crons) | 3-4 days |
| 7 | Unit economics, testing, polish | 3-4 days |

**Important:** between phases, the human tests, reviews, and merges. Don't chain phases in a single session.

## Universal rules

### Code quality
- TypeScript strict mode, no `any` — use `unknown` and narrow
- All Supabase types generated from the database, not hand-written
- Zod validation for every input boundary (form, API route, env vars)
- React Server Components by default; only `'use client'` where interactivity demands it

### Security
- All Supabase tables have Row Level Security (RLS) enabled
- Service role key only used in server-side API routes, never exposed
- All API routes that mutate data require auth (except public lead capture)
- Middleware enforces auth on `/admin/*` and `/portal/*`

### Conventions
- Branch naming: `phase-N/short-description`
- Commits: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- PR per phase, merged to `main` only after human review
- Every phase ends with: updated README, updated `docs/PROGRESS.md`, all tests passing
