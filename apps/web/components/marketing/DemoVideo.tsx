import { PlayCircle } from 'lucide-react'

// "See it in 90 seconds" — a homepage video walkthrough of the enquiry tools, overlay and
// CRM. Renders nothing until NEXT_PUBLIC_DEMO_VIDEO_URL is set in the Vercel env (a YouTube
// or Loom EMBED url, e.g. https://www.youtube.com/embed/<id> or https://www.loom.com/embed/<id>),
// so the section can ship ahead of the recording without leaving a gap on the page.
const VIDEO_URL = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ?? ''

export function DemoVideo() {
  if (!VIDEO_URL) return null

  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand-pop">
            <PlayCircle className="h-4 w-4" /> Watch it working
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-4xl">
            See it in 90 seconds
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft sm:text-base">
            A quick look at the enquiry tools, pop overlay and CRM running on real care websites, and
            the enquiries landing at the other end.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border-2 border-brand-ink shadow-[6px_6px_0_0_#2a2620]">
          <div className="relative aspect-video w-full bg-brand-ink">
            <iframe
              src={VIDEO_URL}
              title="TRG Digital, a 90 second walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
