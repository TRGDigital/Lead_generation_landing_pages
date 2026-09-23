import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { getPostsBySlugs } from '@/lib/blog'
import { TOPICS, getTopic } from '@/lib/blog-topics'
import PostCard from '@/components/blog/PostCard'
import { Star, Squiggle, Dots } from '@/components/marketing/Decor'

export const revalidate = 3600
export const dynamicParams = false

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.slug }))
}

export async function generateMetadata({ params }: { params: { topic: string } }): Promise<Metadata> {
  const topic = getTopic(params.topic)
  if (!topic) return {}
  return applyPageSeo(`/blog/topics/${topic.slug}`, {
    title: topic.title,
    description: topic.intro.split('. ')[0] + '.',
    alternates: { canonical: `${SITE_URL}/blog/topics/${topic.slug}` },
    robots: { index: true, follow: true },
  })
}

export default async function TopicPage({ params }: { params: { topic: string } }) {
  const topic = getTopic(params.topic)
  if (!topic) notFound()

  const posts = await getPostsBySlugs(topic.posts)
  const others = TOPICS.filter((t) => t.slug !== topic.slug)

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: topic.title,
            url: `${SITE_URL}/blog/topics/${topic.slug}`,
            description: topic.intro,
            hasPart: posts.map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              url: `${SITE_URL}/blog/${p.slug}`,
              datePublished: p.published_at,
            })),
          }),
        }}
      />

      <section className="relative overflow-hidden px-6 pb-10 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-5xl">
          <Link href="/blog" className="text-sm font-semibold text-brand-pop hover:underline">
            Knowledge hub
          </Link>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
            {topic.title}
          </h1>
          <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-brand-ink-soft">{topic.intro}</p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-16">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            How we help with {topic.shortLabel}
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {topic.services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex items-center justify-between gap-3 rounded-xl border border-brand-line bg-white px-4 py-3 text-sm font-medium text-brand-ink transition-colors hover:border-brand-pop/40"
              >
                {s.label}
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-brand-pop transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>

          <h2 className="mt-12 font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            More topics
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {others.map((t) => (
              <Link
                key={t.slug}
                href={`/blog/topics/${t.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-brand-line bg-white px-4 py-3 text-sm font-medium text-brand-ink transition-colors hover:border-brand-pop/40"
              >
                {t.title}
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-brand-pop transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
