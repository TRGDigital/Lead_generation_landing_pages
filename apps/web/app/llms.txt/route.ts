// Serves /llms.txt, a curated map of the site for AI agents and LLMs, per
// https://llmstxt.org/ . Format: H1 title, blockquote summary, detail paragraph,
// then H2 link-lists, with a final "## Optional" section that can be skipped.

import { SECTORS } from '@/lib/sectors'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
const u = (path: string) => `${SITE_URL}${path}`

const BODY = `# TRG Digital

> TRG Digital is a specialist digital marketing agency for the UK care sector. We help care homes, nursing homes, home care and live-in care providers get more enquiries, fill empty beds and recruit more carers through marketing, websites, SEO, content, conversion optimisation and bespoke software.

TRG Digital works exclusively with the UK care sector. Our services are measured on enquiries and filled beds, not vanity metrics. We also build our own products for the sector: CareStream (an AI policy and compliance platform) and CareAssura (a UK care directory). Contact: hello@trgdigital.co.uk, 020 8064 1596. Address: Suite Ra01, 195-197 Wood Street, London, E17 3NU.

## Services

- [Full Rebranding](${u('/rebranding')}): New logo, identity and a redesigned, rebuilt website.
- [Website Design & Development](${u('/website-development')}): Fast, modern, search-optimised care websites built to convert.
- [What's Included in a Website Build](${u('/website-build')}): Everything in a TRG care website build, from design to launch.
- [Carer Recruitment](${u('/carer-recruitment')}): Careers pages, Google for Jobs listings and mobile applications with CV upload.
- [Accessible Websites](${u('/accessible-websites')}): WCAG 2.2 AA websites with an accessibility bar for older visitors.
- [Search Engine Optimisation (SEO)](${u('/seo')}): Grow organic visibility so families find you before competitors.
- [Local SEO](${u('/local-seo')}): Get found in local search and the map for care in your area.
- [Content Creation](${u('/content-creation')}): Ongoing, care-aware content that grows organic traffic.
- [Conversion Rate Optimisation](${u('/conversion-rate-optimisation')}): Turn more website visitors into enquiries.
- [PPC & Enquiry Generation](${u('/marketing')}): Paid campaigns and landing pages measured on enquiries.
- [Software Development](${u('/development')}): Bespoke tools and platforms for the care sector.

## Free Tools (the Care Toolkit)

- [Care Funding Calculator](${u('/tools/funding-calculator')}): Estimate UK care costs and who pays.
- [Cost of an Empty Bed](${u('/tools/empty-bed-calculator')}): See what vacancies cost and the ROI of filling them.
- [Your Care Website Grader](${u('/tools/website-grader')}): Score a care website the way families and Google judge it.
- [CQC Rating Checker](${u('/tools/cqc-rating-checker')}): Look up any provider's latest CQC rating.
- [How You Look on Google](${u('/tools/google-preview')}): See your live Google search and social previews.

## Company

- [About](${u('/about')}): What TRG Digital is and who we help.
- [How It Works](${u('/how-it-works')}): How we work with care providers.
- [Contact](${u('/contact')}): Get in touch or request a quote.

## Resources

- [Blog](${u('/blog')}): Articles on care marketing, SEO, websites and enquiries.

## Who we serve

${SECTORS.map((x) => `- [${x.name}](${u(`/${x.slug}`)}): ${x.intro.split('. ')[0]}.`).join('\n')}

## Full detail

- [llms-full.txt](${u('/llms-full.txt')}): The full text of our services, care settings, website build approach, tools and articles in one document.

## Optional

- [Privacy Policy](${u('/privacy')})
- [Terms of Service](${u('/terms')})
- [Cookie Policy](${u('/cookies')})
`

export function GET() {
  return new Response(BODY, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
