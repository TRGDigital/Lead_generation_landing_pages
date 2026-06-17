import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import type { PostWithAuthor } from '@/lib/blog'
import { formatDate } from '@/lib/blog'

type Props = { post: PostWithAuthor }

export default function PostCard({ post }: Props) {
  return (
    <article className="group flex flex-col rounded-2xl border border-brand-line bg-white shadow-soft overflow-hidden transition-shadow hover:shadow-card">
      {post.hero_image_url ? (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={post.hero_image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        </div>
      ) : (
        <div className="h-48 w-full bg-brand-bg-warm flex items-center justify-center">
          <span className="font-display text-4xl text-brand-line">Blog</span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-brand-ink-muted">
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
        </div>

        <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-brand-ink transition-colors group-hover:text-brand-pop">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-brand-ink-soft">{post.excerpt}</p>

        <div className="mt-4 flex items-center gap-3 border-t border-brand-line/50 pt-4 text-xs text-brand-ink-muted">
          {post.author && (
            <span className="font-medium text-brand-ink-soft">{post.author.name}</span>
          )}
          {post.published_at && (
            <span className="ml-auto">{formatDate(post.published_at)}</span>
          )}
        </div>

        <Link href={`/blog/${post.slug}`} className="btn-pop mt-5 h-10 px-5 text-xs">
          Read now
          <span className="btn-arrow" aria-hidden>→</span>
        </Link>
      </div>
    </article>
  )
}
