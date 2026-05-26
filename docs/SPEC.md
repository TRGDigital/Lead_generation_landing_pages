# Technical Specification

> This document is the single source of truth for the platform's technical design.
> It is updated as phases are completed. Decisions that diverge from this spec are recorded in `DECISIONS.md`.

## 1. Overview

A SaaS platform generating qualified resident enquiries for UK care settings via PPC-driven landing pages. Care homes activate the service when they have empty beds and pause it when full.

## 2. Architecture

Single Next.js monorepo with four surfaces:

| Surface | Route prefix | Auth |
|---|---|---|
| Marketing site | `/` | Public |
| Client landing pages | `/care/[slug]` | Public |
| Admin dashboard | `/admin/*` | `admin` role |
| Client portal | `/portal/*` | `client` or `admin` role |

## 3. Data model (Phase 1)

### `public.users`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, references `auth.users(id)` |
| `email` | `text` | Not null |
| `full_name` | `text` | Nullable |
| `role` | `text` | `'admin'` or `'client'` |
| `phone` | `text` | Nullable |
| `created_at` | `timestamptz` | Default `now()` |

RLS policies: users can read own row; admins can read all.

## 4. Auth

- Provider: Supabase Auth (email/password + magic link)
- Session management: `@supabase/ssr` with cookie-based sessions
- Middleware: refreshes session on every request, enforces role-based access
- Server helpers: `getUser()`, `getSession()`, `requireAdmin()`, `requireClient()`

## 5. Routing

```
/                          → Marketing homepage
/care/[slug]               → Per-client landing page
/admin                     → Admin dashboard (Phase 3)
/portal                    → Client portal (Phase 4)
/auth/sign-in              → Sign-in page
/auth/callback             → Auth code exchange (magic link / OAuth)
/forbidden                 → 403 page
```

## 6. Lead capture (Phase 2)

TBD — will include:
- Lead capture form at `/care/[slug]`
- `POST /api/leads` route handler
- Honeypot + rate limiting
- SendGrid email notification
- Twilio SMS notification

## 7. Design tokens

| Token | Hex |
|---|---|
| bg | `#faf6f0` |
| bg-warm | `#f4ece0` |
| ink | `#2a2620` |
| ink-soft | `#5a5247` |
| ink-muted | `#8a8175` |
| accent | `#6b4423` |
| accent-soft | `#a87242` |
| sage | `#7a8a6f` |
| line | `#e6dccb` |

Fonts: Fraunces (display), Lora (body), Manrope (UI)

## 8. Testing strategy

| Type | Tool | Scope |
|---|---|---|
| Unit | Vitest | Validators, utilities |
| Integration | Vitest + Supabase test client | API routes, RLS policies |
| E2E | Playwright | Lead submission, sign-in, qualification, on/off toggle |

## 9. Integrations

| Service | Purpose | Phase |
|---|---|---|
| SendGrid | Lead email notifications | 2 |
| Twilio | Lead SMS notifications | 2 |
| Mediahawk | Call tracking | 2 |
| Google Ads | PPC conversion tracking | 6 |
| Sentry | Error tracking | 7 |
| GA4 | Analytics | 5 |

## 10. Environment variables

See `.env.example` in the repository root for the full list with documentation.

Required from Phase 1:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
