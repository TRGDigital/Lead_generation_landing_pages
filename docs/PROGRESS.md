# Build Progress

## Phase 1 — Foundation

**Status:** In progress  
**Started:** 2026-05-26

### Completed
- [x] Monorepo scaffold (pnpm workspaces + Turborepo)
- [x] Next.js 14 App Router app with TypeScript strict mode
- [x] Path aliases: `@/*`, `@db/*`, `@ui/*`, `@lib/*`
- [x] `packages/db/` — Supabase server + browser clients, initial migration, placeholder types
- [x] `packages/ui/` — shared component library stub
- [x] `packages/lib/` — env validation with Zod
- [x] `packages/config/` — shared tsconfig, eslint config
- [x] Initial migration `00001_initial.sql` — `users` table + RLS + auth trigger
- [x] Tailwind configured with brand design tokens
- [x] shadcn/ui component stubs (button, input, label, textarea)
- [x] Middleware — session refresh, auth guard on `/admin/*` and `/portal/*`
- [x] Sign-in page + server action with safe redirect
- [x] Auth callback route (magic link / OAuth)
- [x] Placeholder pages: `/`, `/care/[slug]`, `/admin`, `/portal`, `/forbidden`
- [x] `not-found.tsx` and `error.tsx`
- [x] `lib/auth.ts` — `getUser()`, `getSession()`, `requireAdmin()`, `requireClient()`
- [x] `.env.example` documenting all variables
- [x] GitHub Actions CI workflow
- [x] Docs structure in place

### Remaining before Phase 1 sign-off
- [ ] `pnpm install` — verify dependency install
- [ ] Apply migration `00001_initial.sql` to Supabase
- [ ] Regenerate types via `pnpm db:types`
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` (get from Supabase dashboard)
- [ ] Add GitHub Secrets for CI (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- [ ] Link Vercel project to GitHub repo
- [ ] Verify: `pnpm dev` starts at localhost:3000
- [ ] Verify: `/` shows placeholder with correct fonts and colours
- [ ] Verify: `/admin` redirects unauthenticated to `/auth/sign-in`
- [ ] Create test admin user in Supabase, verify sign-in grants `/admin` access
- [ ] Create test client user, verify 403 on `/admin`
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] CI green on test PR

---

## Phase 2 — Landing page + lead capture
**Status:** Not started

## Phase 3 — Admin dashboard
**Status:** Not started

## Phase 4 — Client portal
**Status:** Not started

## Phase 5 — Marketing site + blog
**Status:** Not started

## Phase 6 — Integrations + automation
**Status:** Not started

## Phase 7 — Unit economics, testing, polish
**Status:** Not started
