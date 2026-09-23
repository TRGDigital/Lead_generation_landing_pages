// Accreditation strip, ported from the CareStream site so both carry the same marks in the
// same way. Deliberately sits OUTSIDE <footer>: these are claims about the business, not
// footer navigation, so above the footer they read as a closing statement, not small print.
// An accreditation mark is a claim, so nothing here is decoration: each one links to the
// issuer (or, for our own statement, to the page where we actually make it).

type Badge = {
  src: string
  alt: string
  href: string
  label: string
  /** Natural size of the asset, so the space is reserved and nothing shifts on load. */
  w: number
  h: number
  /** Landscape lockup with fine print, so it needs a slightly larger cap to stay legible. */
  wide?: boolean
  /** Our own statement rather than a third party's mark: stays internal, no new tab. */
  selfDeclared?: boolean
}

const BADGES: Badge[] = [
  {
    src: '/badges/gbc-accredited.png',
    w: 112,
    h: 120,
    alt: 'Good Business Charter accredited',
    href: 'https://www.goodbusinesscharter.com/',
    label: 'Good Business Charter',
  },
  {
    src: '/badges/cpd-certification-service.png',
    w: 189,
    h: 120,
    wide: true,
    // An accredited CPD PROVIDER (No. 50224). Nothing here may say or imply "CPD certified
    // training": that claim belongs to a certified module, not to the business.
    alt: 'CPD Certification Service accredited provider',
    href: 'https://www.cpduk.co.uk/providers/carestream',
    label: 'CPD accredited provider',
  },
  {
    src: '/badges/ico-registered.png',
    w: 119,
    h: 120,
    alt: "Registered with the Information Commissioner's Office",
    // TRG Digital Ltd, register entry ZC221613.
    href: 'https://ico.org.uk/ESDWebPages/Entry/ZC221613',
    label: 'ICO registered',
  },
  {
    // Level 1, Committed: the file DWP issued with the accreditation. The mark is Crown
    // Copyright, so do not rebuild, recolour, stretch or substitute a redrawn copy, and do
    // not swap in another level's badge. Valid for 3 years from sign-up, so it comes down
    // (or moves up a level) when the accreditation is renewed.
    src: '/badges/disability-confident-committed.png',
    w: 249,
    h: 120,
    alt: 'Disability Confident Committed',
    href: 'https://www.gov.uk/government/collections/disability-confident-campaign',
    label: 'Disability Confident Committed',
  },
  {
    // Unlike the four above, this is NOT issued or checked by anyone: there is no general
    // "GDPR compliant" certification, and the graphic carries no issuer. It is our own
    // statement about how we handle data, so it links to the privacy policy where that
    // statement is actually made and can be read, rather than standing as a bare claim.
    // Keep it last, after the marks a third party did issue.
    src: '/badges/gdpr-compliant.png',
    w: 286,
    h: 120,
    alt: 'GDPR compliant',
    href: '/privacy',
    label: 'GDPR compliant',
    selfDeclared: true,
  },
]

export function Accreditations() {
  return (
    <section className="border-t border-brand-line bg-white px-6 py-10 sm:py-11" aria-label="Accreditations and registrations">
      <div className="mx-auto max-w-6xl">
        <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.08em] text-brand-ink">
          Accreditations and compliance
        </p>
        {/* Five marks: a 2x2 grid on a phone with the last spanning the row, so nothing
            sits alone in one column. From sm up they sit on one centred line. */}
        <ul className="grid list-none grid-cols-2 items-center justify-items-center gap-x-5 gap-y-7 p-0 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-[84px] sm:gap-y-[30px]">
          {BADGES.map((b) => (
            <li key={b.label} className="flex items-center last:col-span-2 sm:last:col-span-1">
              <a
                href={b.href}
                title={b.label}
                /* A trademark must not be tinted, so hover is opacity only. */
                className="inline-flex items-center opacity-85 transition-opacity hover:opacity-100 focus-visible:opacity-100"
                {...(b.selfDeclared ? {} : { rel: 'noopener noreferrer', target: '_blank' })}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.src}
                  alt={b.alt}
                  width={b.w}
                  height={b.h}
                  loading="lazy"
                  className={
                    b.wide
                      ? 'block h-[58px] w-auto max-w-full sm:h-[78px]'
                      : 'block h-[52px] w-auto max-w-full sm:h-[68px]'
                  }
                />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-brand-ink-muted">
          CPD Provider No. 50224 · ICO registration ZC221613
        </p>
      </div>
    </section>
  )
}
