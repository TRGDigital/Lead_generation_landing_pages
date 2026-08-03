import type { FamilyToolKey } from '@/lib/family-tools'

// Larger, more detailed CSS mock-ups of each family tool for the scrolling showcase on /care-tools.
// They show more of the real question set families answer before a result, in TRG coral, crisp at
// any size, no screenshots. Presentational only.

function Pill({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
        active ? 'border-brand-pop bg-brand-pop/10 text-brand-ink' : 'border-brand-line bg-white text-brand-ink-soft'
      }`}
    >
      {children}
    </span>
  )
}

function Bar({ pct }: { pct: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-brand-line">
      <div className="h-full rounded-full bg-brand-pop" style={{ width: `${pct}%` }} />
    </div>
  )
}

function Badge({ tone, children }: { tone: 'good' | 'warn'; children: React.ReactNode }) {
  const c = tone === 'good' ? 'border-green-300 bg-green-50 text-green-800' : 'border-amber-300 bg-amber-50 text-amber-800'
  return <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${c}`}>{children}</div>
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-brand-line bg-white px-3 py-2.5 text-xs">
      <span className="text-brand-ink-muted">{label}</span>
      <span className="font-semibold text-brand-ink">{value}</span>
    </div>
  )
}

// A single question with answer options.
function Q({ n, text, options, picked }: { n: number; text: string; options: string[]; picked?: number }) {
  return (
    <div className="rounded-xl border border-brand-line bg-white p-3">
      <p className="text-xs font-medium leading-snug text-brand-ink">
        <span className="text-brand-ink-muted">{n}. </span>
        {text}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((o, i) => (
          <Pill key={o} active={i === picked}>
            {o}
          </Pill>
        ))}
      </div>
    </div>
  )
}

const YND = ['Yes, a change', 'No', 'Not sure']
const YN = ['Yes', 'No']

function Body({ toolKey }: { toolKey: FamilyToolKey }) {
  switch (toolKey) {
    case 'funding':
      return (
        <>
          <div className="flex items-center justify-between text-xs text-brand-ink-muted">
            <span>Step 3 of 4</span>
            <span>75%</span>
          </div>
          <Bar pct={75} />
          <p className="text-sm font-bold uppercase tracking-wide text-brand-ink">Their finances</p>
          <Row label="Savings & investments" value="£18,000" />
          <Row label="Property value" value="£320,000" />
          <Row label="Weekly income" value="£310" />
          <Row label="Do they own their home?" value="Yes" />
          <div className="rounded-xl bg-brand-pop py-2.5 text-center text-sm font-bold text-white">See who pays →</div>
        </>
      )
    case 'dpa':
      return (
        <>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-ink">About the property</p>
          <Row label="Property value" value="£320,000" />
          <Row label="Savings" value="£18,000" />
          <Row label="Weekly care fee" value="£1,250" />
          <Row label="Partner still living there?" value="No" />
          <div className="rounded-xl border border-brand-pop/30 bg-brand-pop/5 p-4 text-center">
            <p className="text-xs text-brand-ink-muted">You could defer up to</p>
            <p className="font-display text-3xl font-bold leading-none text-brand-ink">£85,000</p>
            <p className="mt-1 text-xs text-brand-ink-muted">repaid from the property later, not now</p>
          </div>
        </>
      )
    case 'fnc':
      return (
        <>
          <Q n={1} text="Do they need care from a registered nurse?" options={YN} picked={0} />
          <Q n={2} text="Are those nursing needs ongoing?" options={YN} picked={0} />
          <Badge tone="good">Likely to qualify for Funded Nursing Care</Badge>
          <div className="rounded-xl border border-brand-line bg-white p-3 text-center">
            <p className="text-xs text-brand-ink-muted">NHS pays towards nursing</p>
            <p className="font-display text-2xl font-bold leading-none text-brand-ink">
              £235.88<span className="text-sm font-normal text-brand-ink-muted">/week</span>
            </p>
          </div>
        </>
      )
    case 'chc-checker':
      return (
        <>
          <Q n={1} text="Are the needs complex?" options={YN} picked={0} />
          <Q n={2} text="Are they intense or severe?" options={YN} picked={0} />
          <Q n={3} text="Are they unpredictable?" options={YN} picked={0} />
          <Badge tone="warn">A full CHC assessment looks warranted</Badge>
          <p className="text-xs text-brand-ink-muted">Where the NHS can fund 100% of care costs.</p>
        </>
      )
    case 'chc-dst':
      return (
        <>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-ink">The 12 care domains</p>
          {[
            ['Breathing', 'High'],
            ['Nutrition', 'Moderate'],
            ['Continence', 'Low'],
            ['Mobility', 'Severe'],
            ['Cognition', 'High'],
            ['Behaviour', 'Moderate'],
          ].map(([d, sev]) => (
            <div key={d} className="flex items-center justify-between rounded-lg border border-brand-line px-3 py-2 text-xs text-brand-ink-soft">
              <span>{d}</span>
              <span className="rounded bg-brand-pop/10 px-2 py-0.5 font-semibold text-brand-pop">{sev}</span>
            </div>
          ))}
        </>
      )
    case 'attendance-allowance':
      return (
        <>
          <Q n={1} text="Are they 66 or over?" options={YN} picked={0} />
          <Q n={2} text="Do they have a health condition?" options={YN} picked={0} />
          <Q n={3} text="Do they need help during the day?" options={YN} picked={0} />
          <Q n={4} text="Do they need help at night?" options={YN} picked={0} />
          <Badge tone="good">Likely eligible · £108.55/week (higher rate)</Badge>
        </>
      )
    case 'la-lookup':
      return (
        <>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-pop">Adult social care</p>
          <p className="font-display text-lg font-bold leading-tight text-brand-ink">West Sussex County Council</p>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg border border-brand-line py-2">
              <p className="text-[10px] text-brand-ink-muted">Upper limit</p>
              <p className="text-sm font-bold text-brand-ink">£23,250</p>
            </div>
            <div className="rounded-lg border border-brand-line py-2">
              <p className="text-[10px] text-brand-ink-muted">Lower limit</p>
              <p className="text-sm font-bold text-brand-ink">£14,250</p>
            </div>
          </div>
          {['Paying for care & financial assessment', 'Request a care needs assessment', 'Deferred Payment Agreement scheme'].map((l) => (
            <div key={l} className="rounded-lg border border-brand-line px-3 py-2 text-xs text-brand-ink-soft">
              {l} →
            </div>
          ))}
        </>
      )
    case 'dementia-signs':
      return (
        <>
          <p className="text-xs text-brand-ink-muted">Thinking about changes over recent years…</p>
          <Q n={1} text="Poor judgement or trouble thinking things through?" options={YND} picked={0} />
          <Q n={2} text="Repeating the same questions or stories?" options={YND} picked={0} />
          <Q n={3} text="Trouble using everyday gadgets?" options={YND} picked={1} />
          <Badge tone="warn">2 of 8 · worth speaking to a GP</Badge>
        </>
      )
    case 'funding-guide':
      return (
        <>
          <p className="text-xs text-brand-ink-muted">Tell us a little about your situation…</p>
          <Row label="Type of care needed" value="Residential" />
          <Row label="Savings & property" value="Under £100k" />
          <Row label="Your name" value="Sarah" />
          <Row label="Email" value="sarah@…" />
          <div className="flex items-center gap-3 rounded-xl border border-brand-pop/30 bg-brand-pop/5 px-3 py-3">
            <span className="rounded bg-brand-pop px-2 py-1 text-[10px] font-bold text-white">PDF</span>
            <span className="text-sm font-semibold text-brand-ink">Your care &amp; funding options</span>
          </div>
        </>
      )
    default:
      return null
  }
}

export function ToolMock({ toolKey, name }: { toolKey: FamilyToolKey; name: string }) {
  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-brand-line bg-white shadow-xl">
      <div className="flex items-center gap-2 border-b border-brand-line bg-brand-bg-warm px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-brand-pop" />
        <span className="truncate text-xs font-bold uppercase tracking-wider text-brand-ink-muted">{name}</span>
      </div>
      <div className="flex flex-col gap-2.5 bg-gradient-to-br from-white to-brand-bg-warm/40 p-5">
        <Body toolKey={toolKey} />
      </div>
    </div>
  )
}
