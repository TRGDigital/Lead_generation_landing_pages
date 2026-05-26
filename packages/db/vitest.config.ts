import { defineConfig } from 'vitest/config'

// Env vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY) must be
// set in the environment before running. Copy apps/web/.env.local values, or export them in CI.
// Tests are skipped (not failed) when vars are absent.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    testTimeout: 30000,
  },
})
