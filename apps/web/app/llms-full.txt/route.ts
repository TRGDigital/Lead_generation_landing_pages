// Serves /llms-full.txt, the detailed companion to /llms.txt: the full text of TRG's
// key content in one plain document, so AI assistants can answer specific questions in
// our own words. Built from the same data as the site (services, care settings, tools,
// blog) so it stays current without separate editing.

import { SERVICES } from '@/lib/services'
import { TOOLS } from '@/lib/tools'
import { SECTORS, COLLECTION_SERVICES } from '@/lib/sectors'
import { createServiceClient } from '@/lib/supabase/server'

export const revalidate = 86400

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
const u = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path}`)

async function recentPosts(): Promise<{ slug: string; title: string; excerpt: string | null; category: string | null }[]> {
  try {
    const db = createServiceClient() as unknown as any
    const { data } = await db
      .from('blog_posts')
      .select('slug, title, excerpt, category')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(60)
    return data ?? []
  } catch {
    return []
  }
}

export async function GET() {
  const posts = await recentPosts()
  const lines: string[] = []

  lines.push(`# TRG Digital

> TRG Digital is a digital marketing and website agency built only for the UK care sector. We help care homes, nursing homes, dementia care, home care, live-in care, supported living and retirement living providers win more enquiries from families and recruit more carers.

## About TRG Digital

TRG Digital is led by its founder, Len Burgess, who has worked in the digital sector for more than 20 years, across websites, SEO and digital marketing, and in the care sector for a number of years, with nursing homes and care homes. Care is the only sector we work in. We understand CQC ratings, the different types of care, how care is funded and the families behind every enquiry, and we understand recruitment and how carers look for work.

We measure success on results: more enquiries from people looking for care, more applications from carers, and more value from every website visitor. Marketing, websites and software come from one in-house team, with one point of contact and no outsourcing.

Contact: hello@trgdigital.co.uk, 020 8064 1596. Address: Suite Ra01, 195-197 Wood Street, London, E17 3NU. Website: ${SITE_URL}

## How we build care websites

- We do not use WordPress, page builders or off the shelf website builders. Every website is built from scratch on our own technology.
- We design several homepage options for the provider to choose from, then build every other page around the chosen design.
- Each site comes with our own content management system, so the provider's team can edit pages, jobs, reviews, photos, articles, location pages and SEO settings without a developer.
- SEO is built in: one main heading per page, clean titles and descriptions, structured data (organisation, services, reviews, FAQs, articles, breadcrumbs and job postings), an automatic sitemap, robots.txt, llms.txt, fast mobile pages and planned internal linking.
- Careers are built in: job pages with pay shown up front, a short mobile application form with optional CV upload, secure private CV storage, and listings in Google for Jobs.
- Accessibility is built to the WCAG 2.2 AA standard, with an accessibility bar offering larger text, high contrast, a readable font and listen to page.
- Cookie consent is linked to Google Analytics, so visitors are only tracked after they accept.
- Every page is delivered on a private test link for the provider to review and approve before anything goes live, and old website addresses are redirected so search rankings are protected.
`)

  lines.push('## Services\n')
  for (const s of SERVICES) {
    lines.push(`### ${s.title}\n\n${s.body}\n\nMore: ${u(s.href)}\n`)
  }

  lines.push('## Care settings we work with\n')
  for (const sector of SECTORS) {
    lines.push(`### ${sector.name}\n\n${sector.intro}\n`)
    for (const c of sector.challenges) lines.push(`- ${c.title}: ${c.body}`)
    lines.push('')
    lines.push(
      `Services for ${sector.name.toLowerCase()}: ` +
        COLLECTION_SERVICES.map((svc) => `${svc.name} (${u(`/${sector.slug}/${svc.slug}`)})`).join(', ') +
        `. Overview: ${u(`/${sector.slug}`)}\n`,
    )
  }

  lines.push('## Free tools for care providers\n')
  for (const t of TOOLS) {
    lines.push(`- ${t.title}: ${t.body} (${u(t.href)})`)
  }
  lines.push('')

  if (posts.length) {
    lines.push('## Articles\n')
    for (const p of posts) {
      lines.push(`- [${p.title}](${u(`/blog/${p.slug}`)})${p.excerpt ? `: ${p.excerpt.replace(/\s+/g, ' ').trim()}` : ''}`)
    }
    lines.push('')
  }

  lines.push(`## Company pages

- About: ${u('/about')}
- How it works: ${u('/how-it-works')}
- Our work: ${u('/work')}
- Contact: ${u('/contact')}
- Privacy policy: ${u('/privacy')}
`)

  return new Response(lines.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
