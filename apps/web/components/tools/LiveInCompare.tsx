'use client'

import { useState } from 'react'
import { ToolButton, OptionCard, Field, MoneyInput, ResultBadge, Disclaimer, ToolLeadCapture, ACCENT_SOFT, gbp } from './ui'
import { CFG } from '@/lib/funding'

// "Live-in care or a care home?" Families compare the weekly cost of live-in care with care
// home fees, for one person or a couple, and see the point most families miss: when care is
// given at home, the value of the home is not counted in the council's means test. Figures
// are the family's own quotes; the capital threshold is England's upper limit from lib/funding.

const UPPER = CFG.england.upper

export function LiveInCompare({ site }: { site?: string }) {
  const [couple, setCouple] = useState<boolean | null>(null)
  const [liveIn, setLiveIn] = useState(0)
  const [homeFee, setHomeFee] = useState(0)
  const [ownsHome, setOwnsHome] = useState<boolean | null>(null)
  const [homeValue, setHomeValue] = useState(0)
  const [savings, setSavings] = useState(0)
  const [done, setDone] = useState(false)

  const ready = couple !== null && liveIn > 0 && homeFee > 0 && ownsHome !== null
  const people = couple ? 2 : 1
  const careHomeWeekly = homeFee * people
  const diff = careHomeWeekly - liveIn

  // Capital the council would count. At home, the home is disregarded. In a care home, the
  // home usually counts once the 12 week disregard ends (a couple both moving in is assumed).
  const capitalAtHome = savings
  const capitalInHome = savings + (ownsHome ? homeValue : 0)
  const perPerson = (c: number) => c / people

  if (done && ready) {
    return (
      <div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-brand-line p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink-muted">Live-in care</p>
            <p className="mt-1 text-2xl font-bold text-brand-ink">{gbp(liveIn)} a week</p>
            <p className="text-sm text-brand-ink-soft">{gbp(liveIn * 52)} a year{couple ? ', for both of you' : ''}</p>
          </div>
          <div className="rounded-2xl border border-brand-line p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink-muted">Care home{couple ? ', two places' : ''}</p>
            <p className="mt-1 text-2xl font-bold text-brand-ink">{gbp(careHomeWeekly)} a week</p>
            <p className="text-sm text-brand-ink-soft">{gbp(careHomeWeekly * 52)} a year</p>
          </div>
        </div>

        <div className="mt-4">
          <ResultBadge tone={diff >= 0 ? 'good' : 'info'}>
            <p className="text-lg font-bold text-brand-ink">
              {diff >= 0
                ? `Live-in care is ${gbp(diff)} a week less than a care home`
                : `Live-in care is ${gbp(-diff)} a week more than a care home`}
            </p>
            <p className="mt-1 text-sm text-brand-ink-soft">
              {couple
                ? 'One live-in carer can often support a couple at home, where a care home would charge for two places.'
                : 'Live-in care means one to one support at home, rather than sharing staff with other residents.'}
            </p>
          </ResultBadge>
        </div>

        <div className="mt-4 rounded-2xl p-5" style={{ background: ACCENT_SOFT }}>
          <p className="text-sm font-semibold text-brand-ink">The point many families miss: your home and the means test</p>
          <p className="mt-2 text-sm text-brand-ink-soft">
            When care is provided in your own home, the council does not count the value of your home when it works out
            what you pay. In a care home, the value of the home is usually counted once the first 12 weeks have passed,
            unless a partner or certain relatives still live there.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-brand-ink-soft">
            <li>• Capital counted with care at home: <strong>{gbp(perPerson(capitalAtHome))}</strong>{couple ? ' each' : ''}</li>
            <li>• Capital counted in a care home: <strong>{gbp(perPerson(capitalInHome))}</strong>{couple ? ' each' : ''}</li>
            <li>
              • In England, anyone with more than {gbp(UPPER)} usually pays the full cost themselves.
              {perPerson(capitalAtHome) < UPPER && perPerson(capitalInHome) >= UPPER
                ? ' Staying at home could mean you qualify for help with the cost that you would not get in a care home.'
                : ''}
            </li>
          </ul>
        </div>

        {site && (
          <ToolLeadCapture
            site={site}
            toolName="live-in-compare"
            intent="results"
            answers={{
              'Care for': couple ? 'A couple' : 'One person',
              'Live-in weekly': gbp(liveIn),
              'Care home weekly': gbp(careHomeWeekly),
              'Weekly difference': gbp(diff),
            }}
          />
        )}

        <button type="button" onClick={() => setDone(false)} className="mt-4 text-sm text-brand-ink-muted underline hover:text-brand-ink">
          Change my figures
        </button>

        <Disclaimer>
          A guide using your own figures and the England means test, not financial advice. Rules differ in Scotland, Wales
          and Northern Ireland, and your council will carry out its own financial assessment. Nothing you enter is stored.
        </Disclaimer>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Field label="Who needs care?">
        <div className="grid gap-2 sm:grid-cols-2">
          <OptionCard label="One person" selected={couple === false} onClick={() => setCouple(false)} />
          <OptionCard label="A couple" sub="Both need support" selected={couple === true} onClick={() => setCouple(true)} />
        </div>
      </Field>
      <Field label="Weekly cost of live-in care" hint="Ask live-in care providers for a weekly quote.">
        <MoneyInput value={liveIn} onChange={setLiveIn} placeholder="Weekly quote" />
      </Field>
      <Field label="Weekly care home fee, per person" hint="Use a quote from a local residential or nursing home.">
        <MoneyInput value={homeFee} onChange={setHomeFee} placeholder="Weekly fee" />
      </Field>
      <Field label="Do they own their home?">
        <div className="grid gap-2 sm:grid-cols-2">
          <OptionCard label="Yes" selected={ownsHome === true} onClick={() => setOwnsHome(true)} />
          <OptionCard label="No" selected={ownsHome === false} onClick={() => setOwnsHome(false)} />
        </div>
      </Field>
      {ownsHome && (
        <Field label="Approximate value of the home">
          <MoneyInput value={homeValue} onChange={setHomeValue} placeholder="Home value" />
        </Field>
      )}
      <Field label="Savings and investments" hint={couple ? 'Combined, not including the home.' : 'Not including the home.'}>
        <MoneyInput value={savings} onChange={setSavings} placeholder="Savings" />
      </Field>
      <ToolButton onClick={() => setDone(true)} disabled={!ready}>Compare the costs</ToolButton>
      <Disclaimer>Private and anonymous. Nothing you enter is stored.</Disclaimer>
    </div>
  )
}
