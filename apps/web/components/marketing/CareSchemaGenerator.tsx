'use client'

import { useMemo, useState } from 'react'
import { Copy, CheckCheck, Building2, Stethoscope, Home, ShieldCheck, ExternalLink, Info } from 'lucide-react'
import { EnquiryButton } from '@/components/marketing/EnquiryOverlay'

// Deterministic, client-side schema.org (JSON-LD) generator tailored to the care sector.
// No AI, no API, no cost, instant. The one thing this tool does that generic generators get
// dangerously wrong: the CQC rating is emitted as descriptive TEXT (award + additionalProperty),
// never as aggregateRating or Review. A CQC rating is a regulatory judgement, not customer
// reviews, and dressing it up as review stars can trigger a Google manual action.

type BizType = 'care-home' | 'nursing-home' | 'home-care'

const TYPE_META: Record<
  BizType,
  {
    label: string
    icon: typeof Building2
    schemaType: string
    additionalType: string
    idFrag: string
    catalogName: string
    services: string[]
    hasPremises: boolean // residential building families visit vs care delivered in the client's home
    blurb: string
  }
> = {
  'care-home': {
    label: 'Care home',
    icon: Building2,
    schemaType: 'LocalBusiness',
    additionalType: 'https://www.wikidata.org/wiki/Q838936', // residential care / nursing home
    idFrag: 'carehome',
    catalogName: 'Care services',
    services: ['Residential care', 'Dementia care', 'Respite care', 'Palliative and end-of-life care', 'Day care', 'Convalescence care'],
    hasPremises: true,
    blurb: 'A residential care home families visit and move into.',
  },
  'nursing-home': {
    label: 'Nursing home',
    icon: Stethoscope,
    schemaType: 'LocalBusiness',
    additionalType: 'https://www.wikidata.org/wiki/Q64578911', // nursing home (with nursing care)
    idFrag: 'nursinghome',
    catalogName: 'Nursing and care services',
    services: ['Nursing care', 'Residential care', 'Dementia care', 'Palliative and end-of-life care', 'Respite care', 'Complex and continuing care'],
    hasPremises: true,
    blurb: 'A home with registered nurses on site around the clock.',
  },
  'home-care': {
    label: 'Home care agency',
    icon: Home,
    schemaType: 'LocalBusiness',
    additionalType: 'https://www.wikidata.org/wiki/Q1147170', // home care
    idFrag: 'homecare',
    catalogName: 'Home care services',
    services: ['Domiciliary (visiting) care', 'Live-in care', 'Dementia care at home', 'Respite care', 'Personal care', 'Companionship', 'Palliative care at home'],
    hasPremises: false,
    blurb: 'Care delivered in the client’s own home.',
  },
}

const CQC_OPTIONS = [
  { value: 'na', label: 'Prefer not to show / not applicable' },
  { value: 'outstanding', label: 'Outstanding' },
  { value: 'good', label: 'Good' },
  { value: 'requires', label: 'Requires improvement' },
  { value: 'inadequate', label: 'Inadequate' },
  { value: 'awaiting', label: 'Awaiting inspection / not yet rated' },
] as const

const CQC_LABEL: Record<string, string> = {
  outstanding: 'Outstanding',
  good: 'Good',
  requires: 'Requires improvement',
  inadequate: 'Inadequate',
  awaiting: 'Awaiting first inspection',
}

const PRICE_OPTIONS = [
  { value: '', label: 'Not shown' },
  { value: '£', label: '£  (budget)' },
  { value: '££', label: '££  (mid-range)' },
  { value: '£££', label: '£££  (premium)' },
  { value: '££££', label: '££££  (luxury)' },
]

type Form = {
  name: string
  url: string
  phone: string
  email: string
  description: string
  street: string
  town: string
  county: string
  postcode: string
  areasServed: string
  image: string
  lat: string
  lng: string
  priceRange: string
  open247: boolean
  cqc: string
  cqcDate: string
  cqcUrl: string
  facebook: string
  services: string[]
}

const BLANK: Form = {
  name: '',
  url: '',
  phone: '',
  email: '',
  description: '',
  street: '',
  town: '',
  county: '',
  postcode: '',
  areasServed: '',
  image: '',
  lat: '',
  lng: '',
  priceRange: '',
  open247: true,
  cqc: 'na',
  cqcDate: '',
  cqcUrl: '',
  facebook: '',
  services: [],
}

function normUrl(raw: string): string {
  const s = raw.trim().replace(/\/+$/, '')
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) return s
  return `https://${s}`
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function buildSchema(type: BizType, f: Form): Record<string, unknown> {
  const meta = TYPE_META[type]
  const url = normUrl(f.url)
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': meta.schemaType,
  }
  if (url) schema['@id'] = `${url}/#${meta.idFrag}`
  schema.additionalType = meta.additionalType
  if (f.name) schema.name = f.name
  if (f.description) schema.description = f.description
  if (url) schema.url = url
  if (f.phone) schema.telephone = f.phone.trim()
  if (f.email) schema.email = f.email.trim()
  if (f.image) {
    schema.image = f.image.trim()
    schema.logo = f.image.trim()
  }
  if (f.priceRange) schema.priceRange = f.priceRange

  // Address — a physical building for homes; the registered office for a home care agency.
  const addr: Record<string, unknown> = { '@type': 'PostalAddress', addressCountry: 'GB' }
  if (f.street) addr.streetAddress = f.street.trim()
  if (f.town) addr.addressLocality = f.town.trim()
  if (f.county) addr.addressRegion = f.county.trim()
  if (f.postcode) addr.postalCode = f.postcode.trim().toUpperCase()
  if (f.street || f.town || f.postcode) schema.address = addr

  // Geo coordinates (optional) — helps map placement for homes families visit.
  const lat = parseFloat(f.lat)
  const lng = parseFloat(f.lng)
  if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
    schema.geo = { '@type': 'GeoCoordinates', latitude: lat, longitude: lng }
  }

  // Area served — explicit list for home care, town + county for a home.
  let areas: string[] = []
  if (type === 'home-care') {
    areas = f.areasServed.split(',').map((a) => a.trim()).filter(Boolean)
  } else {
    areas = [f.town.trim(), f.county.trim()].filter(Boolean)
  }
  if (areas.length) {
    schema.areaServed = areas.map((name) => ({ '@type': 'City', name }))
  }

  // Opening hours. Residential homes run 24/7; a home care office keeps daytime hours.
  if (f.open247) {
    schema.openingHoursSpecification = [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: DAYS, opens: '00:00', closes: '23:59' },
    ]
  }

  // Services offered — as an OfferCatalog of Services, never as products with prices.
  if (f.services.length) {
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: meta.catalogName,
      itemListElement: f.services.map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    }
  }

  // CQC rating — TEXT ONLY. Regulatory rating, never aggregateRating / Review.
  if (f.cqc && f.cqc !== 'na') {
    const label = CQC_LABEL[f.cqc]
    schema.award =
      f.cqc === 'awaiting'
        ? 'Registered with the Care Quality Commission (CQC), awaiting first inspection'
        : `Rated ${label} by the Care Quality Commission (CQC)${f.cqcDate ? `, last inspected ${f.cqcDate.trim()}` : ''}`
    if (f.cqc !== 'awaiting') {
      schema.additionalProperty = [
        { '@type': 'PropertyValue', name: 'CQC overall rating', value: label },
      ]
    }
  }

  // sameAs — link the entity to its authoritative profiles.
  const sameAs = [f.cqcUrl.trim(), f.facebook.trim()].filter(Boolean)
  if (sameAs.length) schema.sameAs = sameAs

  return schema
}

function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-brand-ink">{label}</span>
      {hint && <span className="ml-1 text-xs text-brand-ink-muted">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  )
}

const inputCls =
  'w-full rounded-lg border border-brand-line px-3 py-2 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20'

export function CareSchemaGenerator() {
  const [type, setType] = useState<BizType>('care-home')
  const [f, setF] = useState<Form>({ ...BLANK, services: TYPE_META['care-home'].services.slice(0, 3) })
  const [copied, setCopied] = useState<'json' | 'tag' | null>(null)

  const meta = TYPE_META[type]

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setF((prev) => ({ ...prev, [key]: value }))
  }

  function switchType(next: BizType) {
    setType(next)
    // Keep the entered details, but reset the service ticks to the new type's list.
    setF((prev) => ({
      ...prev,
      services: TYPE_META[next].services.slice(0, 3),
      open247: TYPE_META[next].hasPremises,
    }))
  }

  function toggleService(name: string) {
    setF((prev) => ({
      ...prev,
      services: prev.services.includes(name) ? prev.services.filter((s) => s !== name) : [...prev.services, name],
    }))
  }

  const schema = useMemo(() => buildSchema(type, f), [type, f])
  const json = useMemo(() => JSON.stringify(schema, null, 2), [schema])
  const scriptTag = `<script type="application/ld+json">\n${json}\n</script>`

  function copy(which: 'json' | 'tag') {
    navigator.clipboard?.writeText(which === 'json' ? json : scriptTag)
    setCopied(which)
    setTimeout(() => setCopied(null), 1600)
  }

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-5 shadow-card sm:p-7">
      {/* Business type selector */}
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Choose your service</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {(Object.keys(TYPE_META) as BizType[]).map((key) => {
          const T = TYPE_META[key]
          const active = key === type
          const Icon = T.icon
          return (
            <button
              key={key}
              type="button"
              onClick={() => switchType(key)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center text-xs font-semibold transition-colors ${
                active
                  ? 'border-brand-pop bg-brand-pop/5 text-brand-pop'
                  : 'border-brand-line bg-white text-brand-ink-soft hover:border-brand-pop/40'
              }`}
            >
              <Icon className="h-5 w-5" />
              {T.label}
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-xs text-brand-ink-muted">{meta.blurb}</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4">
          <Field label="Business name">
            <input className={inputCls} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Crossways Care Home" />
          </Field>
          <Field label="Website address">
            <input className={inputCls} value={f.url} onChange={(e) => set('url', e.target.value)} placeholder="crosswayscarehome.co.uk" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone">
              <input className={inputCls} value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="01234 567890" />
            </Field>
            <Field label="Email" hint="optional">
              <input className={inputCls} value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="hello@…" />
            </Field>
          </div>
          <Field label="One-line description">
            <textarea
              className={`${inputCls} resize-none`}
              rows={2}
              value={f.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder={
                type === 'home-care'
                  ? 'Trusted home care across Essex, helping people stay independent at home.'
                  : 'A warm, family-run care home in Essex with a Good CQC rating.'
              }
            />
          </Field>

          <div className="rounded-xl bg-brand-bg-warm p-3">
            <p className="text-xs font-semibold text-brand-ink">{meta.hasPremises ? 'Address' : 'Registered office'}</p>
            <div className="mt-2 space-y-2">
              <input className={inputCls} value={f.street} onChange={(e) => set('street', e.target.value)} placeholder="Street address" />
              <div className="grid grid-cols-2 gap-2">
                <input className={inputCls} value={f.town} onChange={(e) => set('town', e.target.value)} placeholder="Town / city" />
                <input className={inputCls} value={f.county} onChange={(e) => set('county', e.target.value)} placeholder="County" />
              </div>
              <input className={inputCls} value={f.postcode} onChange={(e) => set('postcode', e.target.value)} placeholder="Postcode" />
            </div>
          </div>

          {type === 'home-care' && (
            <Field label="Areas you cover" hint="comma separated">
              <textarea
                className={`${inputCls} resize-none`}
                rows={2}
                value={f.areasServed}
                onChange={(e) => set('areasServed', e.target.value)}
                placeholder="Chelmsford, Colchester, Braintree, Maldon"
              />
            </Field>
          )}

          {/* CQC — the careful bit */}
          <div className="rounded-xl border border-brand-pop/25 bg-brand-pop/[0.04] p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-pop" />
              <p className="text-xs font-bold uppercase tracking-wide text-brand-pop">CQC rating</p>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <select className={inputCls} value={f.cqc} onChange={(e) => set('cqc', e.target.value)}>
                {CQC_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <input
                className={inputCls}
                value={f.cqcDate}
                onChange={(e) => set('cqcDate', e.target.value)}
                placeholder="Inspected e.g. May 2026"
                disabled={f.cqc === 'na' || f.cqc === 'awaiting'}
              />
            </div>
            <input
              className={`${inputCls} mt-2`}
              value={f.cqcUrl}
              onChange={(e) => set('cqcUrl', e.target.value)}
              placeholder="Your CQC profile URL (optional)"
            />
            <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-brand-ink-soft">
              <Info className="mt-0.5 h-3 w-3 flex-shrink-0 text-brand-pop" />
              We add your rating as an official award, not as review stars. That is the correct, safe way. Faking it as a star rating breaks Google’s rules and can get your site penalised.
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-semibold text-brand-ink">Services offered</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {meta.services.map((s) => {
                const on = f.services.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      on ? 'border-brand-pop bg-brand-pop text-white' : 'border-brand-line bg-white text-brand-ink-soft hover:border-brand-pop/40'
                    }`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Optional extras */}
          <details className="group rounded-xl border border-brand-line bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-xs font-semibold text-brand-ink">
              More detail (image, map pin, price)
              <span className="text-lg leading-none text-brand-pop transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="space-y-3 border-t border-brand-line px-3 py-3">
              <Field label="Logo or photo URL">
                <input className={inputCls} value={f.image} onChange={(e) => set('image', e.target.value)} placeholder="https://…/logo.png" />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Latitude">
                  <input className={inputCls} value={f.lat} onChange={(e) => set('lat', e.target.value)} placeholder="51.7356" />
                </Field>
                <Field label="Longitude">
                  <input className={inputCls} value={f.lng} onChange={(e) => set('lng', e.target.value)} placeholder="0.4685" />
                </Field>
              </div>
              <Field label="Facebook page URL">
                <input className={inputCls} value={f.facebook} onChange={(e) => set('facebook', e.target.value)} placeholder="https://facebook.com/…" />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Price range">
                  <select className={inputCls} value={f.priceRange} onChange={(e) => set('priceRange', e.target.value)}>
                    {PRICE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <label className="flex items-end gap-2 pb-2 text-xs font-medium text-brand-ink">
                  <input type="checkbox" checked={f.open247} onChange={(e) => set('open247', e.target.checked)} className="h-4 w-4 accent-brand-pop" />
                  Open 24 hours
                </label>
              </div>
            </div>
          </details>
        </div>

        {/* Live output */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Your JSON-LD, live</p>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">Ready</span>
          </div>
          <pre className="mt-2 max-h-[26rem] overflow-auto rounded-2xl bg-brand-ink p-4 text-[11px] leading-relaxed text-green-200/90">
            <code>{json}</code>
          </pre>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => copy('tag')} className="btn-pop flex-1 justify-center text-xs">
              {copied === 'tag' ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy script tag
            </button>
            <button type="button" onClick={() => copy('json')} className="btn-cta-outline flex-1 justify-center text-xs">
              {copied === 'json' ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy JSON only
            </button>
          </div>

          <div className="mt-3 rounded-xl bg-brand-bg-warm p-3 text-xs leading-relaxed text-brand-ink-soft">
            <p className="font-semibold text-brand-ink">How to use it</p>
            <p className="mt-1">
              Paste the <span className="font-mono text-[11px]">script</span> tag into the <span className="font-mono text-[11px]">&lt;head&gt;</span> of your homepage (most site
              builders have a “custom code” or “header” box). Then check it:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href="https://search.google.com/test/rich-results"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-brand-pop hover:underline"
              >
                Google Rich Results Test <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://validator.schema.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-brand-pop hover:underline"
              >
                Schema.org validator <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-brand-ink p-4 text-center text-white">
            <p className="font-display text-sm font-bold uppercase tracking-tight">Want this done for you?</p>
            <p className="mt-1 text-xs text-white/70">
              We build care websites with all the right schema baked in, so families and Google both see your rating, fees and services correctly.
            </p>
            <EnquiryButton className="btn-cta btn-on-dark mt-3 text-xs">
              Get a free website review
              <span className="btn-arrow" aria-hidden>→</span>
            </EnquiryButton>
          </div>
        </div>
      </div>
    </div>
  )
}
