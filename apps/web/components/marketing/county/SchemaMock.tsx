import { SerpResult } from '@/components/marketing/SerpMock'
import { STICKY_COL } from '@/components/marketing/county/CountySections'

// What schema markup actually buys a care provider, shown rather than described: the code
// on one side, the result it produces on the other.
//
// Everything is a prop so each page can make it its own: the nursing home version with fee
// and rating markup belongs on the SEO page, the home care version with a coverage area
// belongs on the county hub. Both are illustrations, and Google decides which enhancements
// it shows for any given search, which the page says out loud.

export type SchemaMockProps = {
  /** The schema.org type, which is genuinely different per kind of service. */
  schemaType: 'NursingHome' | 'ResidentialCare' | 'HomeAndCommunityService'
  townName: string
  countyName: string
  /** Extra lines inside the JSON, written as "key": value pairs already formatted. */
  extra?: string[]
  serviceList: string[]
  rating?: { value: string; reviews: string }
  serp: {
    site: string
    url: string
    title: string
    description: string
    sitelinks: string[]
    faqs: string[]
  }
  /** The line under the result, so each page draws its own conclusion from it. */
  note: string
}

export function SchemaMock({
  schemaType,
  townName,
  countyName,
  extra = [],
  serviceList,
  rating,
  serp,
  note,
}: SchemaMockProps) {
  const lines = [
    '{',
    '  "@context": "https://schema.org",',
    `  "@type": "${schemaType}",`,
    `  "name": "${serp.site}",`,
    '  "address": {',
    '    "@type": "PostalAddress",',
    `    "addressLocality": "${townName}",`,
    `    "addressRegion": "${countyName}"`,
    '  },',
    ...extra.map((e) => `  ${e},`),
    ...(rating
      ? [
          '  "aggregateRating": {',
          '    "@type": "AggregateRating",',
          `    "ratingValue": "${rating.value}",`,
          `    "reviewCount": "${rating.reviews}"`,
          '  },',
        ]
      : []),
    '  "availableService": [',
    ...serviceList.map((s, i) => `    "${s}"${i === serviceList.length - 1 ? '' : ','}`),
    '  ]',
    '}',
  ]

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border-2 border-brand-ink bg-brand-ink shadow-[6px_6px_0_0_#2a2620]">
        <div className="flex items-center justify-between border-b border-white/15 px-4 py-2.5">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-white">
            What sits in your page code
          </p>
          <span className="text-[10px] text-white/50">JSON-LD</span>
        </div>
        <pre className="overflow-x-auto px-4 py-4 text-[11.5px] leading-relaxed text-white/80">
          <code>{lines.join('\n')}</code>
        </pre>
      </div>

      <div className={STICKY_COL}>
        <p className="mb-3 font-display text-xs font-bold uppercase tracking-widest text-brand-ink-muted">
          What a family sees because of it
        </p>
        <SerpResult
          site={serp.site}
          url={serp.url}
          title={serp.title}
          description={serp.description}
          rating={rating ? { stars: rating.value, text: `${rating.reviews} reviews` } : undefined}
          sitelinks={serp.sitelinks}
          faqs={serp.faqs}
        />
        <p className="mt-3 text-sm leading-relaxed text-brand-ink-muted">{note}</p>
      </div>
    </div>
  )
}
