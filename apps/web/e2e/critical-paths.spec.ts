import { test, expect } from '@playwright/test'

/**
 * Critical-path E2E tests.
 *
 * In CI these run against a deployed preview URL (PLAYWRIGHT_BASE_URL).
 * Locally they spin up the dev server via playwright.config.ts webServer.
 *
 * Auth-gated pages (/admin, /portal) are tested via the public redirect
 * behaviour — we verify the auth wall rather than the page content itself,
 * because seeding test credentials in E2E is out of scope for the pilot.
 */

// ── 1. Lead capture form ──────────────────────────────────────────────────────

test('lead capture form — happy path submits and shows thank-you', async ({ page }) => {
  // Navigate to the first care home landing page
  await page.goto('/')
  // Find a care home link; if the homepage has a CTA, follow it
  const ctaLink = page.locator('a[href*="/homes/"]').first()
  if (await ctaLink.isVisible()) {
    await ctaLink.click()
    await page.waitForURL('**/homes/**')
  }

  // Locate the lead form
  const form = page.locator('form').filter({ has: page.locator('input[name="full_name"]') })
  await expect(form).toBeVisible()

  await form.locator('input[name="full_name"]').fill('Test Enquirer')
  await form.locator('input[name="email"]').fill('e2e-test@example.com')
  await form.locator('input[name="phone"]').fill('07700900000')

  await form.locator('button[type="submit"]').click()

  // Should show a success state
  await expect(
    page.locator('text=/thank you|enquiry received|we.ll be in touch/i').first()
  ).toBeVisible({ timeout: 10_000 })
})

// ── 2. Marketing home page ────────────────────────────────────────────────────

test('marketing home page loads and renders key sections', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/CareBeds/i)

  // Hero
  await expect(page.locator('h1').first()).toBeVisible()

  // Navigation links
  await expect(page.locator('a[href="/how-it-works"]').first()).toBeVisible()
  await expect(page.locator('a[href="/pricing"]').first()).toBeVisible()
})

// ── 3. Admin redirect — unauthenticated ───────────────────────────────────────

test('admin dashboard redirects to sign-in when unauthenticated', async ({ page }) => {
  await page.goto('/admin')
  // Should land on sign-in or be redirected; either way /admin itself must not load
  await expect(page).not.toHaveURL('/admin', { timeout: 5_000 })
  // Should end up at an auth page
  await expect(page.url()).toMatch(/auth|sign.?in|login/i)
})

// ── 4. Blog index and post rendering ─────────────────────────────────────────

test('blog index renders posts and a post page loads', async ({ page }) => {
  await page.goto('/blog')
  await expect(page).toHaveTitle(/blog/i)

  const firstPost = page.locator('a[href^="/blog/"]').first()
  if (await firstPost.isVisible()) {
    const href = await firstPost.getAttribute('href')
    await page.goto(href!)
    // Post page should have an h1
    await expect(page.locator('h1').first()).toBeVisible()
    // Should not show a 404
    await expect(page.locator('text=/not found|404/i').first()).not.toBeVisible()
  } else {
    // No posts yet — page should still render without error
    await expect(page.locator('body')).toBeVisible()
  }
})
