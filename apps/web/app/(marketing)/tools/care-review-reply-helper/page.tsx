import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { Check, MessageSquareText, ShieldCheck, UserX, PhoneForwarded, Scissors, MapPin } from 'lucide-react'
import { ReviewReplyHelper } from '@/components/marketing/ReviewReplyHelper'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/care-review-reply-helper', META)
}

const META: Metadata = {
  title: 'Care Review Reply Helper | Reply to Care Reviews Safely',
  description:
    'Free tool for care managers. Draft a short, confidential reply to Google, carehome.co.uk, homecare.co.uk and Facebook reviews that never discloses who you care for.',
  alternates: { canonical: `${SITE_URL}/tools/care-review-reply-helper` },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Should care providers reply to online reviews?', a: 'Yes. Families read reviews before they call, and a calm, sincere reply shows how you treat people when things go well and when they do not. Replying to reviews on your Google Business Profile is also one of the signals Google uses for local search, so it can help you appear when people search for care near them.' },
  { q: 'Can I confirm that the reviewer\'s relative lives with us or receives our care?', a: 'No. A public reply that confirms someone is or was a resident or client discloses personal information about them, which is a confidentiality issue and can breach UK GDPR, even if the reviewer mentioned it first. Thank the reviewer for their feedback without confirming the relationship, and keep any detail for a private conversation.' },
  { q: 'How should I reply to a negative care review?', a: 'Keep it short. Acknowledge how they feel, do not argue or share any detail about care, and invite them to contact you directly so you can talk privately. Mention that you have a complaints process and that concerns are looked into properly. The aim is to show future readers that you listen, not to win the argument in public.' },
  { q: 'What if a review alleges abuse or neglect?', a: 'Treat it as a possible safeguarding concern first and a review second. Follow your safeguarding policy, including a referral to the local authority safeguarding team where needed, log it through your complaints procedure and consider whether the CQC needs to be notified. Publicly, post only a short, neutral holding reply that says you take concerns seriously and invites them to contact you. This tool will not draft a public defence for these reviews.' },
  { q: 'Is my review text stored?', a: 'The review you paste is sent to our AI provider to draft the reply and is not saved by us. We keep the name, email and organisation you give us so we can send you occasional tips, which you can unsubscribe from at any time. Please avoid pasting reviews that include contact details or other sensitive information you do not need to.' },
]

const POINTS = [
  'Never confirms who you care for',
  'Handles complaints without arguing',
  'Safeguarding allegations get a holding reply only',
  'A full reply and a shorter version',
]

const GUIDE = [
  { Icon: UserX, title: 'Confirm nothing', text: 'Do not confirm that anyone is or was a resident or client, and never mention names, health, care details or dates. Thank the reviewer, not "your mum".' },
  { Icon: PhoneForwarded, title: 'Take it offline', text: 'For a complaint, acknowledge how they feel, invite them to contact you directly and mention your complaints process. Never argue in public.' },
  { Icon: ShieldCheck, title: 'Safeguarding first', text: 'If a review alleges abuse or neglect, follow your safeguarding and complaints procedures. Publicly, post only a short neutral holding reply.' },
  { Icon: Scissors, title: 'Keep it short', text: 'Around 60 to 120 words is plenty. Plain, sincere language reads better than marketing phrases.' },
  { Icon: MapPin, title: 'Name your service once', text: 'Using your service name naturally, once, helps local search. Repeating it or stuffing in keywords does not.' },
  { Icon: MessageSquareText, title: 'Sign it', text: 'A reply signed by a named manager feels human and accountable, which is what families are looking for.' },
]

export default function CareReviewReplyHelperPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Care Review Reply Helper',
            url: `${SITE_URL}/tools/care-review-reply-helper`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Free tool that drafts short, confidential replies to online reviews for UK care homes, home care agencies and other care services.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
            provider: { '@type': 'Organization', name: 'TRG Digital', '@id': `${SITE_URL}/#organization` },
          }),
        }}
      />

      <section className="relative overflow-x-clip px-6 pb-16 pt-14">
        <Star className="absolute left-6 top-10 hidden h-14 w-14 -rotate-12 text-brand-accent lg:block" />
        <Dots className="absolute bottom-10 right-8 hidden h-16 w-16 text-brand-pop/30 lg:block" />
        <div className="mx-auto max-w-6xl">
          <Link href="/tools" className="text-sm font-semibold text-brand-pop hover:underline">← The Care Toolkit</Link>
          <div className="mt-4 grid items-start gap-12 lg:grid-cols-2">
            <div className="lg:sticky lg:top-24 lg:self-start lg:pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
                <MessageSquareText className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                Care Review Reply Helper
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Paste a review from Google, carehome.co.uk, homecare.co.uk or Facebook and get a short, sincere reply that
                protects the confidentiality of the people you support.
              </p>
              <ul className="mt-6 space-y-2.5">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm font-medium text-brand-ink">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop/10"><Check className="h-3 w-3 text-brand-pop" /></span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <ToolTracker tool="care-review-reply-helper"><ReviewReplyHelper /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            What makes a good reply
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDE.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-brand-line bg-white p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop"><Icon className="h-5 w-5" /></span>
                <p className="mt-4 font-display text-lg font-bold text-brand-ink">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the care review reply helper
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Reviews matter more in care than in almost any other sector. A family choosing a care home or a home care
              agency will read what others have said, and they will read how you replied. A reply that is kind, brief and
              professional builds trust. A reply that argues, or that reveals something about a person you support, does the
              opposite and can put you in breach of your duty of confidentiality.
            </p>
            <p>
              This helper is built around those care-specific rules. Before any drafting, a free check scans the review for
              names, health conditions, dates and other personal details and warns you not to repeat them. The draft then
              follows the same rules: it thanks the reviewer without confirming who they are, takes complaints offline,
              mentions your complaints process, keeps to around 60 to 120 words and names your service once.
            </p>
            <p>
              If a review alleges abuse, neglect or harm, the tool will not write a public response to the allegation. It
              shows you a reminder to follow your safeguarding and complaints procedures and gives you a short, neutral
              holding reply instead. Always read a draft before posting it: it is a starting point, not legal advice.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Replying to care reviews, explained
          </h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group rounded-xl border border-brand-line bg-white px-6 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand-ink">
                  {q}
                  <span className="shrink-0 text-lg leading-none text-brand-pop transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Turn good reviews into enquiries
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            We manage Google Business Profiles for care providers: more reviews, consistent replies and a profile that
            shows up when families search for care near them.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/google-business-profile" className="btn-cta">
              Google Business Profile help
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/tools" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              More free tools →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
