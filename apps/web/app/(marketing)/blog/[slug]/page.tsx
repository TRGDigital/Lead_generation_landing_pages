import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ArrowLeft } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import { getPostBySlug, getRelatedPosts, getAllPublishedSlugs, formatDate } from '@/lib/blog'
import { mdxComponents } from '@/components/blog/MdxComponents'
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
      ? { '@type': 'Person', name: post.author.name }
      : { '@type': 'Organization', name: 'CareBeds' },
    publisher: {
      '@type': 'Organization',
      name: 'CareBeds',
      url: SITE_URL,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-6 py-12">
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
                <p className="text-sm font-medium text-brand-ink">{post.author.name}</p>
                {post.author.bio && (
                  <p className="text-xs text-brand-ink-muted">{post.author.bio}</p>
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
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 700px, 100vw"
            />
          </div>
        )}

        {/* Body */}
        <div className="prose-custom">
          <MDXRemote
            source={post.body_mdx}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                  [rehypePrettyCode, { theme: 'github-light' }],
                ],
              },
            }}
          />
        </div>

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
          <p className="font-display text-xl font-semibold text-white">
            Ready to fill your empty beds?
          </p>
          <p className="mt-2 text-sm text-white/80">
            Book a free demo and see how CareBeds works for your home.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex h-10 items-center rounded-xl bg-white px-6 text-sm font-semibold text-brand-accent transition-all hover:bg-brand-bg"
          >
            Book a demo
          </Link>
        </div>
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
