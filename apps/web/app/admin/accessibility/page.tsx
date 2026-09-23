import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import { getWebsiteBySlug } from '@/lib/websites'
import { ttsProvider } from '@/lib/tts'
import ListenScriptEditor from '@/components/admin/ListenScriptEditor'

export const metadata: Metadata = { title: 'Listen to page — Admin' }
export const dynamic = 'force-dynamic'

export default async function AccessibilityAdminPage() {
  await requireAdmin()
  const site = await getWebsiteBySlug('trgdigital')

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="font-display text-2xl font-semibold text-brand-ink">Listen to page</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-ink-soft">
        The accessibility bar at the top of trgdigital.co.uk lets a visitor change the text size, turn on high
        contrast, switch to a readable font, or have the site read to them. This is the script it reads.
      </p>

      {site ? (
        <div className="mt-8">
          <ListenScriptEditor
            siteId={site.id}
            initialScript={site.accessibility_intro || ''}
            voiceConfigured={!!ttsProvider()}
          />
        </div>
      ) : (
        <p className="mt-8 rounded-xl border border-brand-line bg-brand-bg-warm p-5 text-sm text-brand-ink-soft">
          No website record found for the slug &ldquo;trgdigital&rdquo;, so there is nowhere to save the script. Add
          it under Websites first.
        </p>
      )}
    </div>
  )
}
