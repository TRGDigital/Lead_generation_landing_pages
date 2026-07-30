import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ArrowLeft, ChevronDown } from 'lucide-react'
import { getPostBySlug, getRelatedPosts, getAllPublishedSlugs, formatDate } from '@/lib/blog'
import { isHtmlBody, mdToHtml } from '@/lib/mdx-or-html'
import { withToc } from '@/lib/blog-toc'
import PostCard from '@/components/blog/PostCard'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}

  const title = post.meta_title ?? post.title
  const description = post.meta_description ?? post.excerpt
  const canonical = post.canonical_url ?? `${SITE_URL}/blog/${post.slug}`
  const ogImage = post.hero_image_url ?? `${SITE_URL}/og-blog.jpg`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      authors: post.author ? [post.author.name] : [],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    robots: { index: true, follow: true },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const [post, related] = await Promise.all([
    getPostBySlug(params.slug),
    getPostBySlug(params.slug).then((p) =>
      p ? getRelatedPosts(p.category, p.id) : []
    ),
  ])

  if (!post) notFound()

  // Per-post FAQs (managed in admin). Empty -> no accordion, no schema.
  const faqs = (((post as { faqs?: { q: string; a: string }[] | null }).faqs ?? []) as { q: string; a: string }[])
    .filter((f) => f && f.q && f.a)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.hero_image_url ?? `${SITE_URL}/og-blog.jpg`,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
          ...(post.author.title ? { jobTitle: post.author.title } : {}),
          ...(post.author.avatar_url ? { image: post.author.avatar_url } : {}),
          ...(post.author.bio ? { description: post.author.bio } : {}),
          ...(post.author.linkedin_url ? { sameAs: [post.author.linkedin_url] } : {}),
          worksFor: { '@type': 'Organization', name: 'TRG Digital', '@id': `${SITE_URL}/#organization` },
        }
      : { '@type': 'Organization', name: 'TRG Digital', '@id': `${SITE_URL}/#organization` },
    publisher: { '@type': 'Organization', name: 'TRG Digital', '@id': `${SITE_URL}/#organization`, url: SITE_URL },
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-4xl px-6 py-12">
        {/* Back */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-brand-ink-muted hover:text-brand-ink transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All articles
        </Link>

        {/* Meta */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-brand-ink-muted mb-4">
            {post.category && (
              <Link
                href={`/blog/category/${encodeURIComponent(post.category)}`}
                className="rounded-full bg-brand-accent/10 px-2.5 py-0.5 font-medium text-brand-accent hover:bg-brand-accent/20"
              >
                {post.category}
              </Link>
            )}
            {post.reading_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.reading_minutes} min read
              </span>
            )}
            {post.published_at && <span>{formatDate(post.published_at)}</span>}
          </div>

          <h1 className="font-display text-4xl font-semibold leading-tight text-brand-ink sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-brand-ink-soft">{post.excerpt}</p>

          {/* Author */}
          {post.author && (
            <div className="mt-6 flex items-center gap-3">
              {post.author.avatar_url ? (
                <Image
                  src={post.author.avatar_url}
                  alt={post.author.name}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-accent/10 text-sm font-semibold text-brand-accent">
                  {post.author.name[0]}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-brand-ink">
                  Written by {post.author.name}
                  {post.author.title && (
                    <span className="text-brand-ink-muted">, {post.author.title}</span>
                  )}
                </p>
                {post.author.bio && (
                  <p className="text-xs text-brand-ink-muted">{post.author.bio}</p>
                )}
                {post.author.linkedin_url && (
                  <a
                    href={post.author.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-brand-accent hover:underline"
                  >
                    Connect on LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Hero image */}
        {post.hero_image_url && (
          <div className="relative mb-10 h-64 w-full overflow-hidden rounded-2xl sm:h-80">
            <Image
              src={post.hero_image_url}
              alt={(post as { hero_image_alt?: string | null }).hero_image_alt || post.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 700px, 100vw"
            />
          </div>
        )}

        {/* Body — auto table of contents + content (HTML for new posts, converted for legacy markdown) */}
        <div
          className="blog-html"
          dangerouslySetInnerHTML={{ __html: withToc(isHtmlBody(post.body_mdx) ? post.body_mdx : mdToHtml(post.body_mdx)) }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-brand-line pt-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-brand-line px-3 py-1 text-xs text-brand-ink-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-brand-accent px-8 py-8 text-center">
          <p className="font-display text-xl font-semibold text-brand-ink">
            Ready to fill your empty beds?
          </p>
          <p className="mt-2 text-sm text-brand-ink/75">
            Get in touch and see how our marketing works for your home.
          </p>
          <Link href="/contact" className="btn-pop mt-6">
            Contact us
            <span className="btn-arrow" aria-hidden>→</span>
          </Link>
        </div>

        {/* Related services — descriptive internal links to the core service pages */}
        <div className="mt-12 border-t border-brand-line pt-8">
          <h2 className="mb-4 font-display text-xl font-semibold text-brand-ink">How we help care providers</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: '/seo', label: 'SEO for care homes and nursing homes' },
              { href: '/local-seo', label: 'Local SEO for care providers' },
              { href: '/website-development', label: 'Care home website development' },
              { href: '/marketing', label: 'Care sector marketing and enquiry generation' },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex items-center justify-between gap-3 rounded-xl border border-brand-line bg-white px-4 py-3 text-sm font-medium text-brand-ink transition-colors hover:border-brand-accent hover:text-brand-accent"
              >
                {s.label}
                <span className="text-brand-pop transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQs — only when added in admin */}
        {faqs.length > 0 && (
          <section className="mt-12">
            <script
              type="application/ld+json"
              suppressHydrationWarning
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: faqs.map((f) => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                  })),
                }),
              }}
            />
            <h2 className="mb-6 font-display text-2xl font-semibold text-brand-ink">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-brand-line bg-white shadow-soft">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
                    <span className="font-display text-base font-semibold text-brand-ink sm:text-lg">{f.q}</span>
                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-pop transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-5 text-sm leading-relaxed text-brand-ink-soft sm:text-base">{f.a}</div>
                </details>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="bg-brand-bg-warm px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 font-display text-2xl font-semibold text-brand-ink">
              More from the blog
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
