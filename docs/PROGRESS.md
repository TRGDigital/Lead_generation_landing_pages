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
**Status:** Complete

### Completed
- [x] Marketing pages: `/`, `/how-it-works`, `/pricing`, `/about`, `/contact`, `/privacy`, `/terms`, `/cookies`
- [x] Blog: index, `[slug]`, category pages, RSS feed
- [x] Admin blog CRUD editor with `@uiw/react-md-editor` and auto-save
- [x] Contact form → `marketing_leads` table → SendGrid
- [x] Sitemap and robots.txt
- [x] Migrations 00010 (marketing_leads), 00011 (blog_posts + storage bucket)

---

## Phase 6 — Integrations + automation
**Status:** Complete

### Completed
- [x] Google Ads API lib (`apps/web/lib/google-ads.ts`) — getCampaignSpend, syncCampaignStatus
- [x] Vercel Cron: google-ads-sync, daily-summary, sla-alerts, data-retention
- [x] Mediahawk webhook with HMAC-SHA256 verification, idempotent, `lead_source='phone'`
- [x] Sentry with PII scrubbing (email, phone, full_name)
- [x] `/api/health` endpoint
- [x] Admin Settings page with integration health badges and cron last-run times
- [x] Non-blocking Google Ads campaign sync on care home toggle and campaign update
- [x] Migrations 00012 (google_ads fields, cron_logs), 00013 (sla_alerted_at), 00014 (lead_source)

---

## Phase 7 — Unit economics, testing, polish
**Status:** Complete

### Completed
- [x] `packages/lib/src/economics.ts` — full calculation library (CPC/CPL/CPQL/CPM/payback/ROAS, classifyPerformance, response time, histograms, formatters)
- [x] `packages/lib/src/economics.test.ts` — 51 unit tests, all passing
- [x] `packages/lib/src/response-time.test.ts` — 11 unit tests (was pre-existing)
- [x] 75/75 unit tests passing across all packages/lib test files
- [x] `apps/web/lib/economics-data.ts` — Supabase data layer (KPIs, breakdown, time series, response stats)
- [x] `/admin/economics` — KPI cards, time window selector, Recharts time series chart
- [x] `/admin/economics` — PerformanceRatings cards (good/monitor/review/insufficient)
- [x] `/admin/economics` — sortable BreakdownTable by home
- [x] `/admin/economics/response-time` — histogram + median/P90 stats
- [x] AdminSidebar — Economics link added (TrendingUp icon)
- [x] `apps/web/playwright.config.ts` + `e2e/critical-paths.spec.ts` — 4 critical-path E2E tests
- [x] CI updated with unit test step
- [x] `.github/workflows/lighthouse.yml` — Lighthouse CI ≥90 mobile on PRs
- [x] `.lighthouserc.json` — mobile configuration
- [x] `docs/RUNBOOK.md` — incident response playbook
- [x] `docs/PILOT.md` — pilot launch checklist
