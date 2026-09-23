'use client'

import { useState } from 'react'

// Manual control over the two link blocks at the foot of a post:
//   related_slugs  -> the "More from the blog" picks (empty = automatic scoring)
//   service_links  -> the "How we help care providers" links (empty = the default four)
// Both post hidden inputs, so the existing form action saves them with everything else.

export type LinkChoice = { value: string; label: string }

export default function BlogLinksEditor({
  posts,
  services,
  initialPosts,
  initialServices,
  defaultServices,
}: {
  posts: LinkChoice[]
  services: LinkChoice[]
  initialPosts: string[]
  initialServices: string[]
  defaultServices: string[]
}) {
  const [chosenPosts, setChosenPosts] = useState<string[]>(initialPosts)
  const [chosenServices, setChosenServices] = useState<string[]>(initialServices)

  const togglePost = (slug: string) =>
    setChosenPosts((c) => (c.includes(slug) ? c.filter((s) => s !== slug) : c.length >= 3 ? c : [...c, slug]))

  const toggleService = (href: string) =>
    setChosenServices((c) => (c.includes(href) ? c.filter((s) => s !== href) : [...c, href]))

  const box = 'flex items-start gap-2 rounded-lg border border-brand-line px-3 py-2 text-sm'

  return (
    <div className="space-y-6">
      <input type="hidden" name="related_slugs" value={chosenPosts.join(',')} />
      <input type="hidden" name="service_links" value={chosenServices.join(',')} />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-brand-ink">Related posts (up to 3)</p>
          {chosenPosts.length > 0 && (
            <button type="button" onClick={() => setChosenPosts([])} className="text-xs text-brand-ink-muted underline">
              Clear and use automatic picks
            </button>
          )}
        </div>
        <p className="mb-3 text-xs text-brand-ink-muted">
          Leave all unticked and we choose the three closest posts automatically, by shared tags, category and title.
        </p>
        <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
          {posts.map((p) => {
            const on = chosenPosts.includes(p.value)
            return (
              <label key={p.value} className={`${box} ${on ? 'border-brand-accent bg-brand-accent/10' : ''}`}>
                <input type="checkbox" checked={on} onChange={() => togglePost(p.value)} className="mt-0.5" />
                <span className="text-brand-ink">{p.label}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-brand-ink">How we help care providers</p>
          {chosenServices.length > 0 && (
            <button type="button" onClick={() => setChosenServices([])} className="text-xs text-brand-ink-muted underline">
              Clear and use the default links
            </button>
          )}
        </div>
        <p className="mb-3 text-xs text-brand-ink-muted">
          Leave all unticked to show the default links:{' '}
          {defaultServices
            .map((d) => services.find((s) => s.value === d)?.label ?? d)
            .join(', ')}
          .
        </p>
        <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
          {services.map((s) => {
            const on = chosenServices.includes(s.value)
            return (
              <label key={s.value} className={`${box} ${on ? 'border-brand-accent bg-brand-accent/10' : ''}`}>
                <input type="checkbox" checked={on} onChange={() => toggleService(s.value)} className="mt-0.5" />
                <span className="text-brand-ink">{s.label}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
