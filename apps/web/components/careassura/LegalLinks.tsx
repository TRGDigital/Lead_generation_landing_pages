'use client'

import { useEffect, useState } from 'react'

// Footer legal links that open the policy as an on-page overlay (no navigation),
// mirroring the CareStream demos landing pages. Content is consumer-facing and
// reflects CareAssura's model: enquiries are passed to local care homes with
// availability, who then make contact. Items in [brackets] need the registered
// company details before going fully live.
const COMPANY = 'TRG Digital Ltd' // [confirm registered company name]
const CONTACT_EMAIL = 'hello@careassura.co.uk' // [confirm contact inbox]
const UPDATED = 'June 2026'

type LegalKey = 'privacy' | 'terms' | 'cookies'

const TITLES: Record<LegalKey, string> = {
  privacy: 'Privacy policy',
  terms: 'Terms and conditions',
  cookies: 'Cookie policy',
}

function Privacy() {
  return (
    <>
      <h3>1. Who we are</h3>
      <p>
        CareAssura (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a service operated by {COMPANY},
        registered in England and Wales [company number], registered address [registered address]. We are the data
        controller for the information you submit through this website. You can contact us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h3>2. What we collect</h3>
      <p>When you complete an enquiry form we collect the details you give us:</p>
      <ul>
        <li>Your name, phone number and email address</li>
        <li>Who the care is for and when it is needed</li>
        <li>Any message or additional information you choose to share</li>
      </ul>
      <p>
        We also collect automatically: your IP address, browser and device type, the pages you view, and any campaign or
        referral information (for example UTM tags or a Google click identifier).
      </p>

      <h3>3. How we use your information</h3>
      <p>We use your information to:</p>
      <ul>
        <li>Pass your enquiry to care homes in your chosen area that have genuine availability, so they can contact you to arrange a visit</li>
        <li>Respond to your enquiry and provide the service you have asked for</li>
        <li>Understand how the site is used and improve it</li>
        <li>Meet our legal obligations</li>
      </ul>

      <h3>4. Who we share it with</h3>
      <p>
        When you submit an enquiry, we share your details with one or more care homes (and their operators) in your
        selected area that have availability. Those homes become a separate data controller for your information once they
        receive it, and they will contact you directly. We never sell your data. We also use trusted service providers to
        run our website:
      </p>
      <ul>
        <li>Supabase (database hosting)</li>
        <li>Vercel (website hosting)</li>
      </ul>

      <h3>5. Legal basis</h3>
      <p>
        We process your personal data on the basis of your consent (given when you submit the enquiry form) and our
        legitimate interests in operating and improving the service. You can withdraw your consent at any time by
        contacting us.
      </p>

      <h3>6. How long we keep it</h3>
      <p>We keep enquiry details for [24 months] and then delete them. You can ask us to delete your data sooner.</p>

      <h3>7. Your rights</h3>
      <p>Under UK GDPR you have the right to access, correct, erase, object to or restrict the processing of your data, and to data portability. You can also complain to the Information Commissioner&apos;s Office at ico.org.uk. To exercise any of these rights, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>

      <h3>8. Changes</h3>
      <p>We may update this policy from time to time. Any material changes will be shown on this page.</p>
    </>
  )
}

function Terms() {
  return (
    <>
      <h3>1. About our service</h3>
      <p>
        CareAssura is a free introduction service for families looking for care. We help connect you with care homes in
        your area that have availability. We are not a care provider, and we do not provide care or medical advice.
      </p>

      <h3>2. How it works</h3>
      <p>
        When you submit an enquiry, you agree that we may pass your details to one or more care homes in your chosen area
        so that they can contact you directly to arrange a visit. The choice of care home is always yours.
      </p>

      <h3>3. No guarantee</h3>
      <p>
        We do not guarantee availability, a placement, or any particular outcome. While we take care to work with
        reputable homes, we are not responsible for the services provided by any care home you go on to deal with.
      </p>

      <h3>4. CQC ratings</h3>
      <p>
        Where we refer to a Good or Outstanding rating, these are published by the Care Quality Commission and can change
        over time. Always check a home&apos;s current rating at cqc.org.uk before making a decision.
      </p>

      <h3>5. Cost</h3>
      <p>Our service is completely free for families. There is no obligation at any stage.</p>

      <h3>6. Liability and governing law</h3>
      <p>
        Nothing in these terms limits our liability where it would be unlawful to do so. These terms are governed by the
        laws of England and Wales. For any questions, contact <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </>
  )
}

function Cookies() {
  return (
    <>
      <h3>1. What cookies we use</h3>
      <p>We use a small number of cookies to make the site work and to understand how it is used:</p>
      <ul>
        <li><strong>Essential cookies</strong> — needed for the website to function and for security. These are always on.</li>
        <li><strong>Analytics cookies</strong> — used, with your consent, to measure how visitors use the site so we can improve it.</li>
        <li><strong>Campaign measurement</strong> — where you arrive from an advert, we may record campaign tags to understand which adverts are helpful.</li>
      </ul>

      <h3>2. Managing cookies</h3>
      <p>
        You can accept or decline non-essential cookies when you first visit, and you can change your browser settings to
        block or delete cookies at any time. Blocking some cookies may affect how the site works.
      </p>

      <h3>3. Questions</h3>
      <p>If you have any questions about our use of cookies, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </>
  )
}

const BODY: Record<LegalKey, () => JSX.Element> = {
  privacy: Privacy,
  terms: Terms,
  cookies: Cookies,
}

export function LegalLinks({ className }: { className?: string }) {
  const [open, setOpen] = useState<LegalKey | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  const links: [LegalKey, string][] = [
    ['privacy', 'Privacy'],
    ['terms', 'Terms and conditions'],
    ['cookies', 'Cookie policy'],
  ]

  const Content = open ? BODY[open] : null

  return (
    <nav className={className ?? 'flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400'}>
      {links.map(([key, label]) => (
        <button key={key} type="button" onClick={() => setOpen(key)} className="transition-colors hover:text-violet-600">
          {label}
        </button>
      ))}

      {open && Content && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={TITLES[open]}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(null)}
        >
          <div className="relative my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">{TITLES[open]}</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-6 text-left">
              <p className="mb-4 text-xs text-slate-400">Last updated: {UPDATED}</p>
              <div className="text-[15px] leading-relaxed text-slate-600 [&_a]:font-medium [&_a]:text-violet-600 [&_a:hover]:underline [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3:first-child]:mt-0 [&_li]:mb-1 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
                <Content />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
