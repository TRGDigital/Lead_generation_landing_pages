// UK care funding means-test model — ported from the CareAssura calculator.
// Figures are public policy, reviewed each April.

export type Country = 'england' | 'scotland' | 'wales' | 'ni'
export type CareType = 'residential' | 'nursing'

export const CFG: Record<Country, {
  upper: number; lower: number; pea: number; fnc?: number
  personalCare?: number; nursingCare?: number; name: string
}> = {
  england: { upper: 23250, lower: 14250, pea: 30.15, fnc: 235.88, name: 'England' },
  scotland: { upper: 32750, lower: 20250, pea: 32.65, personalCare: 248.7, nursingCare: 111.9, name: 'Scotland' },
  wales: { upper: 50000, lower: 0, pea: 39.5, fnc: 0, name: 'Wales' },
  ni: { upper: 23250, lower: 14250, pea: 30.15, fnc: 235.88, name: 'Northern Ireland' },
}

export type FundingInput = {
  country: Country
  careType: CareType
  weeklyIncome: number
  savings: number
  ownsHome: boolean
  spouseInHome: boolean
  homeValue: number
  mortgage: number
  weeklyFee: number
}

export type FundingResult = {
  nation: string
  status: 'self' | 'partial' | 'council'
  totalCapital: number
  tariff: number
  weeklyIncome: number
  yourWeekly: number
  nhsWeekly: number
  councilWeekly: number
  weeksUntilSupport: number | null
  dpaPossible: boolean
}

export function calculateFunding(f: FundingInput): FundingResult {
  const cfg = CFG[f.country] || CFG.england
  const weeklyIncome = f.weeklyIncome || 0
  const netHome = Math.max(0, (f.homeValue || 0) - (f.mortgage || 0))
  const homeCapital = f.ownsHome && !f.spouseInHome ? netHome : 0
  const totalCapital = (f.savings || 0) + homeCapital

  const status: FundingResult['status'] =
    totalCapital >= cfg.upper ? 'self' : totalCapital > cfg.lower ? 'partial' : 'council'

  const tariff = status === 'partial' ? Math.floor((totalCapital - cfg.lower) / 250) : 0

  let nhsContrib = 0
  if (f.country === 'scotland') {
    nhsContrib = (cfg.personalCare || 0) + (f.careType === 'nursing' ? cfg.nursingCare || 0 : 0)
  } else if (f.careType === 'nursing') {
    nhsContrib = cfg.fnc || 0
  }

  const effectiveFee = Math.max(0, (f.weeklyFee || 0) - nhsContrib)

  const personContrib =
    status === 'self'
      ? f.weeklyFee || 0
      : Math.min(Math.max(0, weeklyIncome - cfg.pea + tariff), effectiveFee)

  const councilContrib = status === 'self' ? 0 : Math.max(0, effectiveFee - personContrib)

  let weeksToSupport: number | null = null
  if (status === 'self') {
    const weeklyDraw = Math.max(0, (f.weeklyFee || 0) - weeklyIncome - nhsContrib)
    if (weeklyDraw > 0) {
      const toUpper = Math.max(0, totalCapital - cfg.upper)
      const toLower = Math.max(0, cfg.upper - cfg.lower)
      weeksToSupport = Math.round((toUpper + toLower) / weeklyDraw)
    }
  }

  return {
    nation: cfg.name,
    status,
    totalCapital,
    tariff,
    weeklyIncome,
    yourWeekly: Math.round(personContrib),
    nhsWeekly: Math.round(nhsContrib),
    councilWeekly: Math.round(councilContrib),
    weeksUntilSupport: weeksToSupport,
    dpaPossible: !!(f.ownsHome && !f.spouseInHome && (f.savings || 0) < cfg.upper),
  }
}

export const gbp = (n: number) => `£${Math.round(n || 0).toLocaleString('en-GB')}`
