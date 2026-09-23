import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import { getWebsiteBySlug } from '@/lib/websites'
import { ttsProvider } from '@/lib/tts'
import { getAllListenScripts } from '@/lib/listen-scripts'
import { SITE_PAGES } from '@/lib/site-pages'
import ListenScriptsManager, { type PageChoice } from '@/components/admin/ListenScriptsManager'

export const metadata: Metadata = { title: 'Listen to page — Admin' }
export const dynamic = 'force-dynamic'

export default async function AccessibilityAdminPage() {
  await requireAdmin()
  const [site, saved] = await Promise.all([getWebsiteBySlug('trgdigital'), getAllListenScripts()])

  const scripts: Record<string, string> = {}
  for (const row of saved) scripts[row.path] = row.script
  // The homepage script started life on the website record, so show it here until it is saved per page.
  if (!scripts['/'] && site?.accessibility_intro) scripts['/'] = site.accessibility_intro

  const pages: PageChoice[] = [
    { path: '/', label: 'Homepage', group: 'Main' },
    ...SITE_PAGES.filter((p) => p.path !== '/').map((p) => ({ path: p.path, label: p.label, group: p.group })),
  ]
  const written = Object.values(scripts).filter((s) => s.trim()).length

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="font-display text-2xl font-semibold text-brand-ink">Listen to page</h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-brand-ink-soft">
        The accessibility bar at the top of trgdigital.co.uk lets a visitor change the text size, turn on high
        contrast, switch to a readable font, pause movement, or have the page read to them. Each page can have its own
        script, written to be heard rather than read. {written} written so far. Any page without one is read from its
        own content, so nobody ever hears the homepage welcome on the wrong page.
      </p>

      <div className="mt-8">
        <ListenScriptsManager pages={pages} scripts={scripts} voiceConfigured={!!ttsProvider()} />
      </div>
    </div>
  )
}
