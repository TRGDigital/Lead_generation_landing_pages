# Lead Generation & Landing Pages

SaaS platform generating qualified resident enquiries for UK care homes via PPC-driven landing pages.

## Getting started

You need: **Node 18+**, **pnpm 9+**, **Supabase CLI**

```bash
# 1. Install dependencies
pnpm install

# 2. Copy and fill in environment variables
cp .env.example apps/web/.env.local
# Edit apps/web/.env.local — add your Supabase service role key

# 3. Apply database migrations
pnpm db:migrate

# 4. Regenerate TypeScript types from the database
pnpm db:types

# 5. Start the dev server
pnpm dev
```

App runs at **http://localhost:3000**

## Project structure

```
apps/
  web/               Next.js 14 app (all four surfaces)
packages/
  db/                Supabase clients, migrations, generated types
  ui/                Shared component library
  lib/               Shared utilities (env validation, etc.)
  config/            Shared tsconfig, eslint config
docs/
  PROJECT.md         Project context and phase overview
  SPEC.md            Full technical specification
  PROGRESS.md        Phase tracker — what's done, what's next
  DECISIONS.md       Architectural decision records (ADRs)
```

## Surfaces

| Route | Description |
|---|---|
| `/` | Marketing homepage |
| `/care/[slug]` | Per-client lead capture landing page |
| `/admin` | Internal dashboard (admin role required) |
| `/portal` | Client portal (any authenticated user) |
| `/auth/sign-in` | Sign-in page |

## Common commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build
pnpm typecheck    # TypeScript check (must pass before merging)
pnpm lint         # ESLint
pnpm db:migrate   # Push migrations to Supabase
pnpm db:reset     # Reset + reseed database
pnpm db:types     # Regenerate TypeScript types from Supabase schema
```

## Creating test users

Users are created in Supabase Auth. After creation, the database trigger automatically creates a row in `public.users` with `role = 'client'`.

To promote a user to admin, run in the Supabase SQL editor:

```sql
update public.users set role = 'admin' where email = 'your@email.com';
```

## Environment variables

All variables are documented in `.env.example`. Copy to `apps/web/.env.local` for local development.

For CI/Vercel, add the following secrets:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## Branch conventions

```
phase-1/foundation
phase-2/landing-pages
phase-N/short-description
```

PRs are opened against `main`. CI must pass before merge. Human review required.
