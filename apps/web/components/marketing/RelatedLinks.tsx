import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { BookOpen, Scale } from 'lucide-react'
import { TOOLS } from '@/lib/tools'

// A band of contextual links: on service pages to the free tools that go with them, and on
// every tool page to its neighbours. Body links like these carry more weight than the menu
// and footer, and they are the links people actually follow.

export type RelatedItem = { title: string; body: string; href: string; icon: LucideIcon }

export const COMPARE_LINK: RelatedItem = {
  icon: Scale,
  title: 'Compare your options',
  body: 'A care specialist against Wix, WordPress, a general agency and directory listings, fairly.',
  href: '/compare',
}

export const GUIDE_LINK: RelatedItem = {
  icon: BookOpen,
  title: 'Free buyer’s guide',
  body: 'How to choose a website agency for your care service: the questions to ask, and a scorecard.',
  href: '/guides/choosing-a-care-website-agency',
}

/** Tool cards by href, in the order given. Unknown hrefs are skipped. */
export function toolItems(hrefs: string[]): RelatedItem[] {
  return hrefs.flatMap((h) => {
    const t = TOOLS.find((x) => x.href === h)
    return t ? [{ title: t.title, body: t.short, href: t.href, icon: t.icon }] : []
  })
}

export function RelatedLinks({
  heading,
  items,
  footer,
}: {
  heading: string
  items: RelatedItem[]
  footer?: { label: string; href: string }
}) {
  if (items.length === 0) return null
  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">{heading}</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, body, href }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-4 rounded-2xl border border-brand-line bg-white p-5 shadow-soft transition-all hover:border-brand-pop/40 hover:shadow-card"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop transition-colors group-hover:bg-brand-pop group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold uppercase tracking-wide text-brand-ink group-hover:text-brand-pop">
                  {title}
                </span>
                <span className="mt-1 block text-sm leading-snug text-brand-ink-soft">{body}</span>
              </span>
            </Link>
          ))}
        </div>
        {footer && (
          <Link
            href={footer.href}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-pop underline-offset-2 hover:underline"
          >
            {footer.label} <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </section>
  )
}
