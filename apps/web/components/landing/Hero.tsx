import type { ReactNode } from 'react'
import type { CareHomeContent, PhoneTracking } from '@/lib/types/care-home'
import EnquiryForm from './EnquiryForm'
import PhoneLink from './PhoneLink'

function parseEmphasis(text: string): ReactNode {
  const parts = text.split(/\*([^*]+)\*/)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="not-italic font-semibold text-brand-accent">
        {part}
      </em>
    ) : (
      part
    )
  )
}

interface HeroProps {
  careHomeId: string
  content: CareHomeContent
  phoneDisplay: string
  phoneTracking?: PhoneTracking
}

export default function Hero({ careHomeId, content, phoneDisplay, phoneTracking }: HeroProps) {
  return (
    <section className="bg-brand-bg-warm py-12 md:py-16 px-6">
      <div className="max-w-5xl mx-auto grid pane:grid-cols-2 gap-10 pane:gap-16 items-start">
        {/* Left — copy */}
        <div className="animate-fadeUp">
          <h1 className="font-display text-4xl md:text-5xl text-brand-ink leading-tight mb-5">
            {parseEmphasis(content.headline)}
          </h1>
          <p className="text-brand-ink-soft text-lg leading-relaxed mb-7">
            {content.subheadline}
          </p>
          <ul className="space-y-3 mb-8">
            {content.hero_points.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-brand-ink-soft">
                <span className="text-brand-sage font-bold mt-0.5 shrink-0">✓</span>
                {point}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <span className="text-brand-ink-muted text-sm">Or call us:</span>
            <PhoneLink
              phoneDisplay={phoneDisplay}
              phoneTracking={phoneTracking}
              className="text-brand-accent font-bold text-xl hover:text-brand-accent-soft transition-colors"
            />
          </div>
        </div>

        {/* Right — form card */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
          <h2 className="font-display text-2xl text-brand-ink mb-1">{content.form.title}</h2>
          <p className="text-brand-ink-muted text-sm mb-6">{content.form.subtitle}</p>
          <EnquiryForm careHomeId={careHomeId} formConfig={content.form} />
        </div>
      </div>
    </section>
  )
}
