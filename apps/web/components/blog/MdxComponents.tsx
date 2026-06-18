import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode, ComponentPropsWithoutRef } from 'react'

type HeadingProps = ComponentPropsWithoutRef<'h2'> & { id?: string; children?: ReactNode }
type BaseProps = { children?: ReactNode }
type AnchorProps = { href?: string; children?: ReactNode }
type ImgProps = { src?: string; alt?: string; width?: number | string; height?: number | string }

export const mdxComponents = {
  // Headings with anchor links
  h2: ({ children, id, ...props }: HeadingProps) => (
    <h2 id={id} className="group mt-10 mb-4 font-display text-2xl font-semibold text-brand-ink scroll-mt-20" {...props}>
      {id ? (
        <a href={`#${id}`} className="no-underline hover:text-brand-accent">
          {children}
        </a>
      ) : children}
    </h2>
  ),
  h3: ({ children, id, ...props }: HeadingProps) => (
    <h3 id={id} className="mt-8 mb-3 font-display text-xl font-semibold text-brand-ink scroll-mt-20" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, id, ...props }: HeadingProps) => (
    <h4 id={id} className="mt-6 mb-2 font-semibold text-brand-ink scroll-mt-20" {...props}>
      {children}
    </h4>
  ),
  p: ({ children }: BaseProps) => (
    <p className="mb-4 leading-relaxed text-brand-ink-soft">{children}</p>
  ),
  ul: ({ children }: BaseProps) => (
    <ul className="mb-4 ml-4 space-y-1.5 list-disc text-brand-ink-soft">{children}</ul>
  ),
  ol: ({ children }: BaseProps) => (
    <ol className="mb-4 ml-4 space-y-1.5 list-decimal text-brand-ink-soft">{children}</ol>
  ),
  li: ({ children }: BaseProps) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }: AnchorProps) => {
    const isExternal = href?.startsWith('http')
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-accent underline underline-offset-2 hover:text-brand-ink"
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href ?? '#'} className="text-brand-accent underline underline-offset-2 hover:text-brand-ink">
        {children}
      </Link>
    )
  },
  blockquote: ({ children }: BaseProps) => (
    <blockquote className="my-6 border-l-4 border-brand-accent pl-6 italic text-brand-ink-soft">
      {children}
    </blockquote>
  ),
  // Images with next/image for optimisation
  img: ({ src, alt, width, height }: ImgProps) => {
    if (!src) return null
    return (
      <span className="my-6 block overflow-hidden rounded-xl">
        <Image
          src={src}
          alt={alt ?? ''}
          width={Number(width) || 800}
          height={Number(height) || 450}
          className="w-full object-cover"
          sizes="(min-width: 768px) 700px, 100vw"
        />
      </span>
    )
  },
  // Pull quote callout, usage: <Callout>text</Callout>
  Callout: ({ children }: { children: ReactNode }) => (
    <div className="my-6 rounded-xl border border-brand-accent/30 bg-brand-accent/5 px-6 py-4 text-brand-ink-soft">
      {children}
    </div>
  ),
  hr: () => <hr className="my-10 border-brand-line" />,
  table: ({ children }: BaseProps) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-brand-line">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  th: ({ children }: BaseProps) => (
    <th className="border-b border-brand-line bg-brand-bg-warm px-4 py-3 text-left font-semibold text-brand-ink">
      {children}
    </th>
  ),
  td: ({ children }: BaseProps) => (
    <td className="border-b border-brand-line/50 px-4 py-3 text-brand-ink-soft last:border-0">
      {children}
    </td>
  ),
}
