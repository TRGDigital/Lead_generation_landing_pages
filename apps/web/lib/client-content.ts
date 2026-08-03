// Client-site SEO content: AI-generated local area pages, drafted + edited in the
// TRG admin and published onto the CLIENT's own website (WordPress REST) — the
// delivery route for customers whose sites we didn't build. Grounded strictly in
// the per-site facts the admin records; the model must not invent beyond them.

import { createServiceClient } from '@/lib/supabase/server'

export type ClientAreaPage = {
  id: string
  website_id: string
  town: string
  service: string
  target_keyword: string
  slug: string
  meta_title: string
  meta_description: string
  heading: string
  intro_html: string
  body_html: string
  offer_points: string[] | null
  faqs: { question: string; answer: string }[] | null
  status: 'draft' | 'published'
  wp_page_id: number | null
  wp_link: string | null
  created_at: string
  updated_at: string
}

export async function getClientAreaPages(websiteId: string): Promise<ClientAreaPage[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('client_area_pages')
    .select('*')
    .eq('website_id', websiteId)
    .order('created_at', { ascending: false })
  return (data as ClientAreaPage[]) ?? []
}

export function slugifyPage(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── AI generation ─────────────────────────────────────────────────────────────

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-5'

/** Ask Claude for a JSON object and parse it (plain-text ask + robust parse — the
 * approach proven in the Crossways generator; Sonnet 5 rejects temperature/prefill). */
async function generateJson<T>(system: string, user: string, maxTokens = 3500): Promise<T> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('AI is not configured: set ANTHROPIC_API_KEY in the platform Vercel project.')
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [
        {
          role: 'user',
          content: `${user}\n\nRespond with ONLY the JSON object described above: no explanation, no preamble, and no markdown code fences.`,
        },
      ],
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`AI request failed (${res.status}). ${detail.slice(0, 200)}`)
  }
  const data = (await res.json()) as { content?: Array<{ text?: string }> }
  let text = (data.content ?? []).map((b) => (typeof b?.text === 'string' ? b.text : '')).join('').trim()
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error(`AI did not return JSON. Reply: ${text.slice(0, 200)}`)
  try {
    return JSON.parse(text.slice(start, end + 1)) as T
  } catch {
    throw new Error(`AI returned invalid JSON. Reply: ${text.slice(0, 200)}`)
  }
}

export type GeneratedAreaContent = {
  metaTitle: string
  metaDescription: string
  heading: string
  intro: string
  body: string
  offerPoints: string[]
  faqs: { question: string; answer: string }[]
}

export async function generateClientAreaContent(opts: {
  siteName: string
  siteUrl: string
  facts: string
  town: string
  service: string
  keyword: string
}): Promise<GeneratedAreaContent> {
  const { siteName, siteUrl, facts, town, service, keyword } = opts
  const serviceLower = service.toLowerCase()

  const system =
    "You are an expert UK care-sector SEO copywriter. You write warm, trustworthy, factually-grounded local landing pages for one specific care provider. You never invent facts, prices, ratings or services beyond what you are given. Write in British English in a warm, reassuring, family tone aimed at the adult children of older people. Never use em dashes or en dashes; use commas, full stops or the word 'to'."

  const user = `Write a local landing page for "${service}" aimed at families near ${town}, optimised for the search keyword "${keyword}".

The page will be published on the provider's own website (${siteUrl}), so write as the provider ("we").

FACTS about ${siteName} (ground everything in these; do not contradict them or invent anything beyond them — if the facts are thin, stay general rather than inventing specifics):
${facts || `${siteName} is a UK care provider. No further facts recorded — keep every claim general.`}

Return ONLY a JSON object with exactly these keys:
- "metaTitle": under 60 characters, includes ${town} and the service.
- "metaDescription": under 155 characters, compelling, includes ${town}.
- "heading": the H1, natural and specific.
- "intro": one or two short HTML paragraphs wrapped in <p></p> introducing the service for families in ${town}.
- "body": three to four HTML paragraphs wrapped in <p></p> of genuinely useful, reassuring content about choosing ${serviceLower} for a loved one near ${town}, grounded in the facts, with no filler or repetition.
- "offerPoints": an array of 4 to 6 short plain-text bullet strings (no HTML) describing what ${siteName} offers for this service, grounded in the facts.
- "faqs": an array of 3 to 4 objects, each { "question": string, "answer": string }, relevant to ${serviceLower} near ${town}; answers one to three sentences, grounded, with no invented specifics.

Be specific to ${town} and ${serviceLower}, write for people not search engines, and keep every claim honest and grounded in the facts. Use only clean semantic HTML (p tags only in intro/body) with no styling, classes or inline CSS, because the client's own website theme will style the page.`

  let out = await generateJson<Record<string, unknown>>(system, user)

  // Defensive recovery if the whole object lands nested in one string field.
  if (!out.heading && !out.metaTitle && !out.intro) {
    for (const v of Object.values(out)) {
      if (typeof v === 'string' && v.includes('"heading"') && v.includes('"metaTitle"')) {
        const s = v.indexOf('{')
        const e = v.lastIndexOf('}')
        if (s >= 0 && e > s) {
          try {
            const reparsed = JSON.parse(v.slice(s, e + 1))
            if (reparsed && typeof reparsed === 'object') out = reparsed as Record<string, unknown>
          } catch { /* keep original */ }
        }
        break
      }
    }
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const points = Array.isArray(out.offerPoints)
    ? (out.offerPoints as unknown[]).filter((x): x is string => typeof x === 'string').slice(0, 6)
    : []
  const faqs = Array.isArray(out.faqs)
    ? (out.faqs as unknown[])
        .filter(
          (f): f is { question: string; answer: string } =>
            !!f && typeof (f as { question?: unknown }).question === 'string' && typeof (f as { answer?: unknown }).answer === 'string',
        )
        .slice(0, 4)
    : []

  const result: GeneratedAreaContent = {
    metaTitle: str(out.metaTitle),
    metaDescription: str(out.metaDescription),
    heading: str(out.heading),
    intro: str(out.intro),
    body: str(out.body),
    offerPoints: points,
    faqs,
  }
  if (!result.heading || !result.intro || !result.body) {
    throw new Error('AI returned incomplete content — try again.')
  }
  return result
}
