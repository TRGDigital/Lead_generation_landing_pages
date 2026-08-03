// Minimal WordPress REST API client for publishing content onto a client's own
// WordPress site. Auth = core Application Passwords (wp-admin → Users → Profile →
// Application Passwords) over Basic auth, so nothing needs installing on their site.
//
// Styling note: we publish clean SEMANTIC html only (h2/p/ul/details) — the client's
// active theme wraps and styles the page, so it automatically matches their site.

export type WpCredentials = {
  apiUrl: string // the site root, e.g. https://example.co.uk
  username: string
  appPassword: string
}

export type WpPageInput = {
  title: string
  slug: string
  contentHtml: string
  metaTitle?: string
  metaDescription?: string
  wpPageId?: number | null // set = update that page instead of creating
}

export type WpPublishResult = { ok: true; pageId: number; link: string } | { ok: false; error: string }

function wpBase(apiUrl: string) {
  return apiUrl.replace(/\/+$/, '') + '/wp-json/wp/v2'
}

function authHeader(c: WpCredentials) {
  return 'Basic ' + Buffer.from(`${c.username}:${c.appPassword}`).toString('base64')
}

async function wpFetch(c: WpCredentials, path: string, init?: RequestInit) {
  return fetch(wpBase(c.apiUrl) + path, {
    ...init,
    headers: {
      Authorization: authHeader(c),
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  })
}

/** Verify the credentials work and can write: fetches the connected user. */
export async function testWordPressConnection(c: WpCredentials): Promise<{ ok: boolean; detail: string }> {
  try {
    const r = await wpFetch(c, '/users/me?context=edit')
    if (!r.ok) {
      if (r.status === 401 || r.status === 403) return { ok: false, detail: 'Rejected: check the username and application password.' }
      return { ok: false, detail: `The site responded ${r.status} — is it WordPress with the REST API enabled?` }
    }
    const u = (await r.json()) as { name?: string; capabilities?: Record<string, boolean> }
    const canPublish = !!u.capabilities?.publish_pages
    return {
      ok: true,
      detail: `Connected as ${u.name ?? c.username}${canPublish ? ' (can publish pages)' : ' — WARNING: this user cannot publish pages'}`,
    }
  } catch {
    return { ok: false, detail: 'Could not reach the site — check the URL.' }
  }
}

/** Create or update a page on the client's WordPress. Returns the live page id + link. */
export async function publishWpPage(c: WpCredentials, page: WpPageInput): Promise<WpPublishResult> {
  const body: Record<string, unknown> = {
    title: page.title,
    slug: page.slug,
    content: page.contentHtml,
    status: 'publish',
    // Yoast SEO meta — best-effort: applies when the site exposes these fields over
    // REST (most Yoast installs); harmlessly ignored otherwise.
    meta: {
      _yoast_wpseo_title: page.metaTitle ?? '',
      _yoast_wpseo_metadesc: page.metaDescription ?? '',
    },
  }
  try {
    const path = page.wpPageId ? `/pages/${page.wpPageId}` : '/pages'
    let r = await wpFetch(c, path, { method: 'POST', body: JSON.stringify(body) })
    if (!r.ok && page.wpPageId && r.status === 404) {
      // The page was deleted on their side — create it fresh.
      r = await wpFetch(c, '/pages', { method: 'POST', body: JSON.stringify(body) })
    }
    if (!r.ok) {
      // Some hosts reject unknown meta keys with a 400 — retry once without meta.
      if (r.status === 400) {
        delete body.meta
        r = await wpFetch(c, page.wpPageId ? `/pages/${page.wpPageId}` : '/pages', { method: 'POST', body: JSON.stringify(body) })
      }
      if (!r.ok) {
        const detail = await r.text().catch(() => '')
        return { ok: false, error: `WordPress responded ${r.status}: ${detail.slice(0, 300)}` }
      }
    }
    const data = (await r.json()) as { id: number; link: string }
    return { ok: true, pageId: data.id, link: data.link }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Could not reach the site' }
  }
}

/** Assemble a draft's fields into the clean semantic HTML we publish (theme does the styling). */
export function areaPageHtml(d: {
  heading: string
  intro_html: string
  offer_points: string[] | null
  body_html: string
  faqs: { question: string; answer: string }[] | null
  service: string
  town: string
}) {
  const parts: string[] = []
  if (d.intro_html) parts.push(d.intro_html)
  if (d.offer_points?.length) {
    parts.push(`<h2>What we offer</h2>`)
    parts.push(`<ul>${d.offer_points.map((p) => `<li>${p}</li>`).join('')}</ul>`)
  }
  if (d.body_html) parts.push(d.body_html)
  if (d.faqs?.length) {
    parts.push(`<h2>${d.service} in ${d.town}: your questions answered</h2>`)
    for (const f of d.faqs) {
      parts.push(`<h3>${f.question}</h3>`)
      parts.push(`<p>${f.answer}</p>`)
    }
  }
  return parts.join('\n')
}
