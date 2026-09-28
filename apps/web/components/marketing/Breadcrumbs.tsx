import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { JsonLd } from '@/components/JsonLd'
import { breadcrumbLd } from '@/lib/schema'

// The visible "Home > Section > Page" trail and its BreadcrumbList markup, from one list, so
// the markup always describes a trail people can actually see (Google's rule for
// structured data). Pass the trail after Home; the last item is the current page.
export function Breadcrumbs({ trail }: { trail: [name: string, path: string][] }) {
  return (
    <>
      <JsonLd data={breadcrumbLd(trail)} />
      <nav aria-label="Breadcrumb" className="px-6 pt-5">
        <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-brand-ink-muted">
          <li>
            <Link href="/" className="hover:text-brand-pop hover:underline">
              Home
            </Link>
          </li>
          {trail.map(([name, path], i) => (
            <li key={path} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 flex-shrink-0" aria-hidden />
              {i === trail.length - 1 ? (
                <span aria-current="page" className="font-medium text-brand-ink-soft">
                  {name}
                </span>
              ) : (
                <Link href={path} className="hover:text-brand-pop hover:underline">
                  {name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
