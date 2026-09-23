// Search result mockups, so a care provider can see what structured data actually buys them.
// These are illustrations: the providers are the fictional ones from our design examples, and
// Google decides which enhancements to show for any given search.

type Rating = { stars: string; text: string }

export type SerpProps = {
  site: string
  url: string
  title: string
  description: string
  rating?: Rating
  faqs?: string[]
  sitelinks?: string[]
}

const ARIA = 'An illustration of a Google search result'

export function SerpResult({ site, url, title, description, rating, faqs, sitelinks }: SerpProps) {
  return (
    <div
      className="rounded-2xl border border-brand-line bg-white p-6 shadow-soft"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      role="img"
      aria-label={`${ARIA} for ${site}`}
    >
      <div className="mb-1.5 flex items-center gap-2.5">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-bg-warm text-[11px] font-bold text-brand-ink-muted">
          {site.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="text-[13px] leading-tight text-[#202124]">{site}</p>
          <p className="truncate text-[12px] text-[#4d5156]">{url}</p>
        </div>
      </div>
      <p className="text-[19px] leading-snug text-[#1a0dab]">{title}</p>
      <p className="mt-1 text-[13.5px] leading-relaxed text-[#4d5156]">{description}</p>

      {rating && (
        <p className="mt-2 text-[12.5px] text-[#70757a]">
          <span className="tracking-[0.5px] text-[#e7711b]">★★★★★</span> {rating.stars} · {rating.text}
        </p>
      )}

      {sitelinks && sitelinks.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5">
          {sitelinks.map((s) => (
            <span key={s} className="text-[13.5px] text-[#1a0dab] underline underline-offset-2">{s}</span>
          ))}
        </div>
      )}

      {faqs && faqs.length > 0 && (
        <div className="mt-3 border-t border-[#ebebeb]">
          {faqs.map((f) => (
            <div key={f} className="flex items-center justify-between border-b border-[#ebebeb] py-2.5 text-[13.5px] text-[#202124]">
              {f}
              <span className="text-[#70757a]">⌄</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export type JobsProps = {
  heading: string
  jobs: { title: string; meta: string; chips: string[] }[]
}

export function SerpJobs({ heading, jobs }: JobsProps) {
  return (
    <div
      className="rounded-2xl border border-brand-line bg-white p-6 shadow-soft"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      role="img"
      aria-label={`${ARIA}: Google for Jobs listings`}
    >
      <p className="mb-3 text-[15px] text-[#202124]">{heading}</p>
      {jobs.map((j) => (
        <div key={j.title} className="flex gap-3 border-t border-[#ebebeb] py-3">
          <span className="mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded bg-brand-bg-warm text-[11px] font-bold text-brand-ink-muted">
            {j.title.charAt(0)}
          </span>
          <div>
            <p className="text-[14.5px] text-[#202124]">{j.title}</p>
            <p className="text-[12.5px] text-[#4d5156]">{j.meta}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {j.chips.map((c) => (
                <span key={c} className="rounded bg-[#f1f3f4] px-2 py-0.5 text-[11.5px] text-[#3c4043]">{c}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** The JSON-LD that produces the result above, shown the way Google reads it. */
export function SchemaCode({ lines }: { lines: { text: string; tone?: 'comment' | 'key' | 'value' | 'tag' }[] }) {
  const colour = (tone?: string) =>
    tone === 'comment' ? '#9c948a' : tone === 'key' ? '#fbcc33' : tone === 'value' ? '#9fd8b4' : tone === 'tag' ? '#f7a58f' : '#ece8e1'
  return (
    <pre className="overflow-x-auto rounded-2xl bg-brand-ink p-5 text-[12px] leading-relaxed" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
      {lines.map((l, i) => (
        <div key={i} style={{ color: colour(l.tone) }}>{l.text}</div>
      ))}
    </pre>
  )
}
