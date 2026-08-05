import type { Metadata } from 'next'
import { WorkFeatureCards, WorkFeatureBand, WorkFeatureProof } from '@/components/marketing/WorkFeature'

// Internal preview: three candidate homepage "Our work" sections stacked for
// comparison. Not linked from anywhere and not indexed; deleted once Len picks.
export const metadata: Metadata = {
  title: 'Work section preview — internal',
  robots: { index: false, follow: false },
}

function Divider({ label, note }: { label: string; note: string }) {
  return (
    <div className="border-y-4 border-dashed border-brand-pop/40 bg-brand-bg-warm px-6 py-6">
      <div className="mx-auto max-w-6xl">
        <p className="font-display text-lg font-bold uppercase tracking-tight text-brand-pop">{label}</p>
        <p className="mt-1 text-sm text-brand-ink-soft">{note}</p>
      </div>
    </div>
  )
}

export default function WorkSectionPreviewPage() {
  return (
    <main>
      <div className="bg-brand-ink px-6 py-10 text-center text-white">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Homepage &ldquo;Our work&rdquo; section — 3 options</h1>
        <p className="mt-2 text-sm text-white/70">Scroll to compare. Each renders with real case-study content, exactly as it would on the homepage.</p>
      </div>

      <Divider label="Option A · Case files" note="Two equal cards, one per home — screenshot, CQC badge, lede and a read-the-case-study link. Balanced, lets each home sell itself." />
      <WorkFeatureCards />

      <Divider label="Option B · Enquiry engine" note="Dark band telling one story — the WordPress-to-enquiry-engine transformation, bullet proof-points, Crossways hero shot. Strongest narrative punch." />
      <WorkFeatureBand />

      <Divider label="Option C · Inspect us" note="Yellow proof strip — bold 'Before you hire us, inspect us' line, stat cards, compact links to both case studies. Boldest, most confident." />
      <WorkFeatureProof />
    </main>
  )
}
