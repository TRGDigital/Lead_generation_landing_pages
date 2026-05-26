# Architectural Decision Records

## ADR-001: Path aliases over package imports for monorepo cross-references

**Date:** 2026-05-26  
**Status:** Accepted

**Context:**  
In a Turborepo monorepo, cross-package imports can use either npm package names (e.g., `import from '@repo/db'`) with `transpilePackages`, or TypeScript path aliases (e.g., `import from '@db/server'`) with webpack aliases. The brief specifies path aliases.

**Decision:**  
Use TypeScript path aliases (`@db/*`, `@ui/*`, `@lib/*`) configured in `apps/web/tsconfig.json` with corresponding webpack aliases in `next.config.ts`. Packages are listed as workspace dependencies for pnpm resolution but imports use the aliases, not package names.

**Consequences:**  
- Simpler — no separate build step for packages  
- TypeScript and webpack both resolve through aliases  
- Slightly non-standard (Turborepo typically uses package imports); documented here to avoid confusion

---

## ADR-002: Middleware role check via database (not JWT claims)

**Date:** 2026-05-26  
**Status:** Accepted (revisit in Phase 3)

**Context:**  
Checking user role in middleware requires either (a) a database query per protected request, or (b) a role claim embedded in the JWT token. JWT claims require Supabase Auth hooks to set `app_metadata`, which adds complexity.

**Decision:**  
For Phase 1, use a lightweight database query in middleware for role checking on `/admin/*` routes. Public routes and `/portal/*` (auth-only) have no DB call.

**Consequences:**  
- Adds ~1 DB round-trip per admin request  
- Acceptable for Phase 1 with minimal users  
- **Action:** In Phase 3, add a Supabase Auth hook to embed `role` in JWT `app_metadata`, eliminating the middleware DB call

---

## ADR-003: Direct package source imports in server actions and route handlers

**Date:** 2026-05-26  
**Status:** Accepted

**Context:**  
Server Actions and Route Handlers at `app/auth/sign-in/actions.ts` and `app/auth/callback/route.ts` import directly from relative paths (`../../../../packages/db/src/server`) rather than the `@db/*` alias. This is because the `@db` webpack alias may not be available during Server Action compilation in some Next.js versions.

**Decision:**  
Use relative imports in files where the `@db` alias is not reliably resolved. Use `@db/*` path aliases everywhere else. Revisit when the alias reliably works in all compilation contexts.

**Consequences:**  
- Minor inconsistency in import style  
- Avoids build-time resolution failures  
- Can be unified in a later phase once confirmed working
