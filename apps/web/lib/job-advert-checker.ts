// Care Job Advert Checker: rule-based scorer.
//
// Pure and dependency-free so it runs in the browser (instant free score) and on
// the server (to tell the AI rewrite which facts are missing). No AI here.
//
// Each check has a weight. pass earns the full weight, warn earns half, fail earns
// nothing, and 'na' checks (e.g. driving on a care home role) are left out of the
// total so they never help or hurt. Score = earned / applicable weight x 100.

export type AdvertStatus = 'pass' | 'warn' | 'fail' | 'na'

export type AdvertCheck = {
  id: string
  label: string
  status: AdvertStatus
  weight: number
  detail: string // what we found in their advert
  why: string // why it matters to carers
}

export type RoleType = 'home-care' | 'nurse' | 'senior' | 'entry' | 'other'

export type AdvertResult = {
  score: number
  band: 'strong' | 'good' | 'needs-work' | 'struggling'
  bandLabel: string
  roleType: RoleType
  roleLabel: string
  wordCount: number
  checks: AdvertCheck[]
  /** Short list of missing facts, used to guide the AI rewrite placeholders. */
  missing: string[]
}

export const ADVERT_MAX_CHARS = 6000
export const ADVERT_MIN_CHARS = 80

const countMatches = (res: RegExp[], s: string) => res.filter((r) => r.test(s)).length

// ── Role detection ───────────────────────────────────────────────────────────
function detectRole(t: string): RoleType {
  if (/\b(home care|homecare|domiciliary|in the community|community care|clients'? (own )?homes|people'?s (own )?homes|care visits|care calls|home carer|visiting carer)\b/.test(t)) return 'home-care'
  if (/\b(registered nurse|rgn|rmn|staff nurse|nurse|nmc pin|nursing associate)\b/.test(t)) return 'nurse'
  if (/\b(senior (care|carer|support)|team leader|deputy|shift leader|care coordinator|care manager)\b/.test(t)) return 'senior'
  if (/\b(care assistant|carer|care worker|support worker|healthcare assistant|hca|care giver|caregiver)\b/.test(t)) return 'entry'
  return 'other'
}

const ROLE_LABEL: Record<RoleType, string> = {
  'home-care': 'Home care role',
  nurse: 'Nursing role',
  senior: 'Senior or leadership role',
  entry: 'Entry level care role',
  other: 'Care role',
}

// ── Individual checks ────────────────────────────────────────────────────────
function checkPay(t: string): AdvertCheck {
  const base = {
    id: 'pay',
    label: 'Pay shown as a real figure',
    weight: 20,
    why: 'Pay is the first thing carers look for. Adverts with a clear hourly rate get far more applications, and Indeed and Google for Jobs rank adverts with pay above those without.',
  }
  const hourly = /£\s?\d{1,2}(\.\d{1,2})?\s*(p\/?h|ph\b|per hour|an hour|\/\s?(hr|hour)|hourly|per hr)/.test(t) ||
    /£\s?\d{1,2}(\.\d{1,2})?\s*(to|-|\u2013|\u2014)\s*£?\s?\d{1,2}(\.\d{1,2})?\s*(p\/?h|ph\b|per hour|an hour|\/\s?(hr|hour)|hourly)/.test(t) ||
    /(hourly rate|per hour|pay rate)[^.\n]{0,30}£\s?\d{1,2}(\.\d{1,2})?/.test(t)
  const annual = /£\s?\d{2},?\d{3}/.test(t)
  const anyPounds = /£\s?\d/.test(t)
  const vague = /\b(competitive (salary|pay|rates?)|negotiable|doe\b|depending on experience|dependent on experience|attractive (salary|pay)|excellent rates of pay|market leading pay)\b/.exec(t)

  if (hourly) return { ...base, status: 'pass', detail: 'You give an hourly rate. That is exactly what carers are scanning for.' }
  if (annual) return { ...base, status: 'warn', detail: 'You show a yearly salary but no hourly rate. Most carers compare jobs by the hour, so add the hourly figure too.' }
  if (anyPounds) return { ...base, status: 'warn', detail: 'There is a pound figure, but we could not tell if it is the pay rate. Make the hourly rate unmistakable, for example "£12.60 per hour".' }
  if (vague) return { ...base, status: 'fail', detail: `You say "${vague[0]}" rather than a figure. Carers read that as "below average" and scroll past.` }
  return { ...base, status: 'fail', detail: 'We could not find any pay figure. Adverts with no pay get a fraction of the applications.' }
}

function checkHours(t: string): AdvertCheck {
  const base = {
    id: 'hours',
    label: 'Hours and shift pattern',
    weight: 10,
    why: 'Carers juggle childcare, second jobs and study. They need to know the hours and shifts before they can say yes.',
  }
  const hoursNum = /\b\d{1,2}(\.\d)?\s*(hours|hrs)\b|\b(hours|hrs) per week\b/.test(t)
  const pattern = /\b(long days?|days and nights|day shifts?|night shifts?|nights|early shifts?|late shifts?|earlies|lates|12[ -]?hour|8[ -]?hour|\d{1,2}(:\d{2})?\s?(am|pm)\s*(to|-|\u2013)\s*\d{1,2}(:\d{2})?\s?(am|pm)|alternate weekends|every other weekend|weekends?|rota|shift pattern|4 on 4 off|school hours|flexible hours)\b/.test(t)
  const type = /\b(full[ -]time|part[ -]time|bank|zero hours|permanent|temporary)\b/.test(t)
  if (hoursNum && pattern) return { ...base, status: 'pass', detail: 'You give both the hours and the shift pattern.' }
  if (hoursNum || pattern) return { ...base, status: 'warn', detail: hoursNum ? 'You give the hours but not the shift pattern (days, nights, long days, weekends).' : 'You mention shifts but not how many hours a week.' }
  if (type) return { ...base, status: 'warn', detail: 'You say full time or part time, but not the actual hours or shifts.' }
  return { ...base, status: 'fail', detail: 'We could not find the hours or shift pattern.' }
}

function checkLocation(raw: string, t: string): AdvertCheck {
  const base = {
    id: 'location',
    label: 'Location is clear',
    weight: 8,
    why: 'Most carers work within a few miles of home. A clear town or area also helps your advert show in local job searches.',
  }
  const postcode = /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/.test(raw) || /\b[A-Z]{1,2}\d{1,2}[A-Z]?\b/.test(raw)
  const phrase = /\b(based in|located in|location:|near|close to|minutes from|in the (town|village|heart) of|covering|across (the )?[a-z]+ area|areas? of|in and around)\b/.test(t)
  const named = /\b([Bb]ased in|[Ll]ocated in|[Nn]ear|[Cc]lose to|minutes from|[Cc]overing|in and around|Location:|[Aa]rea:)\s+(the\s+)?[A-Z][a-z]+/.test(raw)
  const context = /\b(home|homes|agency|service|office|branch|team|provider|carers?|work|jobs?|roles?|clients|people) (in|across|around)\s+[A-Z][a-z]+/.test(raw) ||
    /\b(across|around|surrounding|throughout)\s+(the\s+)?[A-Z][a-z]+/.test(raw)
  // A place name in the title line, e.g. "Home Care Worker, Cheltenham, £13.50 per hour".
  const NOT_PLACE = /^(days?|nights?|full time|part time|bank|permanent|temporary|nursing home|care home|residential|dementia|nursing|home care|live in|immediate start|urgent|uk|nhs|cqc|good|outstanding)$/i
  const firstLine = raw.split('\n')[0] ?? ''
  const titlePlace = firstLine.split(/[,|/()]/).slice(1).map((x) => x.trim())
    .some((seg) => /^[A-Z][a-z]+(?:[ -](?:upon|on|in|under)?[ -]?[A-Z][a-z]+){0,2}$/.test(seg) && !NOT_PLACE.test(seg))
  if (postcode || named || context || titlePlace) return { ...base, status: 'pass', detail: 'You say where the job is.' }
  if (phrase) return { ...base, status: 'warn', detail: 'You hint at the area but a town name or postcode would make it clearer.' }
  return { ...base, status: 'fail', detail: 'We could not find a town, area or postcode.' }
}

function checkDriving(t: string, role: RoleType): AdvertCheck {
  const base = {
    id: 'driving',
    label: 'Driving and car needs',
    weight: 5,
    why: 'In home care, driving is often the deciding factor. Say whether a licence and car are needed, and if non drivers or walking rounds are welcome.',
  }
  if (role !== 'home-care') return { ...base, status: 'na', detail: 'Not a home care role, so this does not apply.' }
  const drive = /\b(driv(er|ing|e)|licen[cs]e|own car|access to a (car|vehicle)|vehicle|business insurance|car scheme|company car|walking rounds?|non[ -]?drivers?|walkers?)\b/.test(t)
  if (drive) return { ...base, status: 'pass', detail: 'You say whether driving or a car is needed.' }
  return { ...base, status: 'fail', detail: 'This looks like home care, but you do not say whether a driving licence or car is needed.' }
}

const BENEFITS: { label: string; re: RegExp }[] = [
  { label: 'paid training', re: /\b(paid training|fully funded training|free training|paid induction|funded (qualifications?|diplomas?|nvq)|care certificate)\b/ },
  { label: 'paid DBS', re: /\b(free dbs|dbs (paid|covered|free)|paid dbs|we pay (for )?(your )?dbs)\b/ },
  { label: 'mileage', re: /\b(mileage|travel time paid|paid travel)\b/ },
  { label: 'guaranteed hours', re: /\b(guaranteed hours|contracted hours|no zero hours)\b/ },
  { label: 'weekly pay', re: /\b(paid weekly|weekly pay|pay weekly|wagestream|early access to (your )?pay|flexible pay)\b/ },
  { label: 'pension', re: /\bpension\b/ },
  { label: 'holiday', re: /\b(holiday|annual leave|\d{2}(\.\d)? days)\b/ },
  { label: 'enhanced rates', re: /\b(enhanced|overtime|bank holiday (pay|rates?)|weekend (enhancements?|rates?))\b/ },
  { label: 'sick pay', re: /\b(company sick pay|enhanced sick pay|sick pay)\b/ },
  { label: 'refer a friend', re: /\b(refer a friend|referral bonus)\b/ },
  { label: 'welcome bonus', re: /\b(welcome bonus|joining bonus|sign(ing)?[ -]on bonus)\b/ },
  { label: 'free meals or parking', re: /\b(free meals?|meals provided|free parking|on[ -]site parking)\b/ },
  { label: 'uniform', re: /\b(uniform (provided|supplied)|free uniform)\b/ },
  { label: 'progression', re: /\b(career progression|progression|development opportunities|promotion)\b/ },
  { label: 'staff discounts', re: /\b(blue light card|staff discounts?|employee assistance|wellbeing)\b/ },
]

function checkBenefits(t: string): AdvertCheck & { found: string[] } {
  const found = BENEFITS.filter((b) => b.re.test(t)).map((b) => b.label)
  const base = {
    id: 'benefits',
    label: 'Benefits carers care about',
    weight: 15,
    why: 'Paid training, a paid DBS, mileage, guaranteed hours and weekly pay are what tip a carer towards you when the hourly rates are close.',
    found,
  }
  if (found.length >= 4) return { ...base, status: 'pass', detail: `You list ${found.length} benefits: ${found.join(', ')}.` }
  const suggest = ['paid training', 'paid DBS', 'guaranteed hours', 'weekly pay', 'pension', 'holiday'].filter((b) => !found.includes(b)).slice(0, 4)
  const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`)
  if (found.length >= 2) return { ...base, status: 'warn', detail: `You list ${list(found)}. Add more of what carers look for, such as ${list(suggest).replace(/ and ([^,]+)$/, ' or $1')}.` }
  if (found.length === 1) return { ...base, status: 'fail', detail: `Only one benefit found (${found[0]}). Carers compare these closely.` }
  return { ...base, status: 'fail', detail: 'We could not find any benefits listed.' }
}

const JARGON: RegExp[] = [
  /\bservice users?\b/, /\bkloes?\b/, /\badls?\b/, /\bstakeholders?\b/, /\bsynerg/, /\bfast[ -]paced environment\b/,
  /\bself[ -]starter\b/, /\bgo[ -]getter\b/, /\bcommensurate\b/, /\bdoe\b/, /\bote\b/, /\bad hoc\b/, /\bdynamic individual\b/,
  /\bthe successful (candidate|applicant)\b/, /\bthe post[ -]?holder\b/, /\bremuneration\b/, /\bcompetencies\b/, /\bkpis?\b/,
  /\bin line with (company )?polic(y|ies)\b/, /\bregulatory framework\b/, /\bmulti[ -]disciplinary\b/,
]

function checkJargon(t: string): AdvertCheck & { terms: string[] } {
  const terms = JARGON.map((r) => r.exec(t)?.[0]).filter((x): x is string => !!x)
  const base = {
    id: 'jargon',
    label: 'Plain English, no jargon',
    weight: 6,
    why: 'Carers read adverts on their phone between shifts. HR phrases and sector jargon make the job sound cold and harder than it is.',
    terms,
  }
  if (terms.length === 0) return { ...base, status: 'pass', detail: 'No jargon or HR speak found.' }
  if (terms.length <= 2) return { ...base, status: 'warn', detail: `Consider swapping: ${terms.map((x) => `"${x}"`).join(', ')}.` }
  return { ...base, status: 'fail', detail: `Lots of jargon: ${terms.slice(0, 6).map((x) => `"${x}"`).join(', ')}.` }
}

function checkLength(words: number): AdvertCheck {
  const base = {
    id: 'length',
    label: 'Right length',
    weight: 8,
    why: 'Too short and carers cannot tell if the job suits them. Too long and it becomes a wall of text on a phone. Around 150 to 600 words works well.',
  }
  if (words < 100) return { ...base, status: 'fail', detail: `Only ${words} words. That is too short to answer the basic questions a carer has.` }
  if (words < 150) return { ...base, status: 'warn', detail: `${words} words. A little short. Check you cover pay, shifts, benefits and what the role involves.` }
  if (words <= 700) return { ...base, status: 'pass', detail: `${words} words. A good length.` }
  if (words <= 1000) return { ...base, status: 'warn', detail: `${words} words. On the long side, so trim anything a carer would skip.` }
  return { ...base, status: 'fail', detail: `${words} words. This is a wall of text on a phone screen.` }
}

function checkApply(raw: string, t: string): AdvertCheck {
  const base = {
    id: 'apply',
    label: 'Clear way to apply',
    weight: 8,
    why: 'Many carers do not have a CV ready. A phone number, WhatsApp or a quick apply button removes the biggest reason people give up.',
  }
  const contact = /\b0\d{3,4}\s?\d{3}\s?\d{3,4}\b|\b07\d{3}\s?\d{6}\b/.test(raw) || /[\w.+-]+@[\w-]+\.[\w.]+/.test(raw) || /https?:\/\/|www\./.test(t)
  const easy = /\b(apply now|apply today|click apply|quick apply|easy apply|call us|call (the|our)|ring|text|whatsapp|pop in|drop in|come and see us|no cv (needed|required)|without a cv)\b/.test(t)
  const mentioned = /\b(apply|application|send (us )?your cv|contact)\b/.test(t)
  if (contact || easy) return { ...base, status: 'pass', detail: 'You tell people how to apply.' }
  if (mentioned) return { ...base, status: 'warn', detail: 'You mention applying but not how. Add a phone number, email or "no CV needed" route.' }
  return { ...base, status: 'fail', detail: 'We could not find how to apply.' }
}

function checkCulture(t: string): AdvertCheck {
  const base = {
    id: 'culture',
    label: 'Your team and culture',
    weight: 6,
    why: 'Carers leave managers, not jobs. A line about your team, your values and how you support new starters helps people picture themselves with you.',
  }
  const n = countMatches([
    /\bteam\b/, /\b(friendly|supportive|welcoming|close[ -]knit|family[ -]run|family feel|like a family)\b/,
    /\b(our values|values|culture|ethos)\b/, /\b(our residents|the people we support|our clients)\b/,
    /\b(buddy|mentor|shadow shifts?|shadowing|induction)\b/, /\b(we are|we're) (a|an|proud)\b/,
    /\b(rated (good|outstanding)|cqc)\b/, /\b(recognition|employee of the month|staff awards?|thank you)\b/,
  ], t)
  if (n >= 3) return { ...base, status: 'pass', detail: 'You give a real sense of the team and what it is like to work there.' }
  if (n >= 1) return { ...base, status: 'warn', detail: 'You touch on your team, but a couple of specific lines (support for new starters, your values, your rating) would help.' }
  return { ...base, status: 'fail', detail: 'Nothing about your team or what it is like to work with you.' }
}

function checkBarriers(t: string, role: RoleType): AdvertCheck {
  const base = {
    id: 'barriers',
    label: 'Welcoming to new starters',
    weight: 6,
    why: 'Many great carers come from retail, hospitality or caring for family. Demanding qualifications or years of experience for an entry role shuts them out when you could train them.',
  }
  if (role === 'nurse' || role === 'senior') {
    return { ...base, status: 'na', detail: 'Senior and nursing roles can reasonably ask for qualifications or a PIN, so this does not apply.' }
  }
  const welcomes = /\b(no experience (needed|necessary|required)|full training (given|provided)|we will train|we'?ll train|new to care|career changers?|training provided)\b/.test(t)
  const demandsQual = /\b(must (have|hold)|essential|required|minimum)\b[^.\n]{0,40}\b(nvq|qcf|diploma|level [23])\b|\b(nvq|qcf|diploma|level [23])\b[^.\n]{0,30}\b(essential|required|is a must|mandatory)\b/.exec(t)
  const demandsExp = /\b(minimum (of )?\d+ (years?|months?)|\d+\+? years?'? experience|experience (is )?(essential|required|a must))\b/.exec(t)
  if (demandsQual) return { ...base, status: 'fail', detail: `You require "${demandsQual[0].trim()}". For an entry role this puts off people you could train, and the Care Certificate covers the basics.` }
  if (demandsExp && !welcomes) return { ...base, status: 'warn', detail: `You ask for "${demandsExp[0].trim()}". Consider "experience welcome, full training given" instead.` }
  if (welcomes) return { ...base, status: 'pass', detail: 'You make it clear new starters are welcome and will be trained.' }
  return { ...base, status: 'warn', detail: 'You do not say whether people new to care are welcome. One line like "no experience needed, full paid training" widens your pool.' }
}

function checkYou(t: string): AdvertCheck {
  const base = {
    id: 'you',
    label: 'Written to "you", the carer',
    weight: 4,
    why: 'Adverts that talk to the reader ("you will", "your shifts") feel personal. Adverts about "the candidate" or all about the company feel like a form.',
  }
  const you = (t.match(/\b(you|your|you'll|you're|yourself)\b/g) ?? []).length
  const we = (t.match(/\b(we|our|us|the company|the organisation)\b/g) ?? []).length
  const cand = (t.match(/\b(the (successful )?(candidate|applicant)|post[ -]?holder|the employee)\b/g) ?? []).length
  const other = we + cand * 3
  if (you >= 5 && you >= other) return { ...base, status: 'pass', detail: `"You" appears ${you} times. It reads as a conversation with the carer.` }
  if (you >= 3 && you * 2 >= other) return { ...base, status: 'warn', detail: `"You" appears ${you} times, but the advert talks more about the organisation.${cand ? ' Swap phrases like "the candidate" or "the post holder" for "you".' : ''}` }
  return { ...base, status: 'fail', detail: cand ? 'It talks about "the candidate" or "the post holder" rather than to the reader.' : 'Very little "you". It reads as a description of the company, not an invitation.' }
}

function checkFirstPara(raw: string): AdvertCheck {
  const base = {
    id: 'first-para',
    label: 'Short opening for mobile',
    weight: 4,
    why: 'Job sites show only the first two or three lines on a phone. A short, punchy opening with pay and location earns the tap.',
  }
  const paras = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  // Skip a short title line if the advert starts with one.
  let first = paras[0] ?? ''
  if (first.split(/\s+/).length <= 8 && paras[1]) first = paras[1]
  const words = first.split(/\s+/).filter(Boolean).length
  if (words <= 60) return { ...base, status: 'pass', detail: `Your opening paragraph is ${words} words. Easy to read on a phone.` }
  if (words <= 100) return { ...base, status: 'warn', detail: `Your opening paragraph is ${words} words. Aim for under 60 so the key facts show before "read more".` }
  return { ...base, status: 'fail', detail: `Your opening paragraph is ${words} words, so most of it is hidden on a phone. Break it up and lead with pay and location.` }
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function scoreAdvert(input: string): AdvertResult {
  const raw = input.slice(0, ADVERT_MAX_CHARS).replace(/\r\n/g, '\n').trim()
  const t = raw.toLowerCase()
  const words = raw.split(/\s+/).filter(Boolean).length
  const roleType = detectRole(t)

  const checks: AdvertCheck[] = [
    checkPay(t),
    checkHours(t),
    checkBenefits(t),
    checkLocation(raw, t),
    checkLength(words),
    checkApply(raw, t),
    checkDriving(t, roleType),
    checkJargon(t),
    checkCulture(t),
    checkBarriers(t, roleType),
    checkYou(t),
    checkFirstPara(raw),
  ].map((c) => {
    // strip helper fields
    const { id, label, status, weight, detail, why } = c
    return { id, label, status, weight, detail, why }
  })

  let possible = 0
  let earned = 0
  for (const c of checks) {
    if (c.status === 'na') continue
    possible += c.weight
    earned += c.status === 'pass' ? c.weight : c.status === 'warn' ? c.weight / 2 : 0
  }
  const score = possible ? Math.round((earned / possible) * 100) : 0
  const band: AdvertResult['band'] = score >= 80 ? 'strong' : score >= 60 ? 'good' : score >= 40 ? 'needs-work' : 'struggling'
  const bandLabel = { strong: 'Strong advert', good: 'Good, with gaps', 'needs-work': 'Needs work', struggling: 'Likely to struggle' }[band]

  const MISSING_LABEL: Record<string, string> = {
    pay: 'hourly rate',
    hours: 'hours and shift pattern',
    location: 'town or area',
    driving: 'whether a driving licence and car are needed',
    benefits: 'benefits (paid training, paid DBS, mileage, pension, holiday)',
    apply: 'how to apply (phone, email or link)',
    culture: 'a line about your team',
  }
  const missing = checks
    .filter((c) => (c.status === 'fail' || (c.status === 'warn' && c.id === 'pay')) && MISSING_LABEL[c.id])
    .map((c) => MISSING_LABEL[c.id]!)

  return { score, band, bandLabel, roleType, roleLabel: ROLE_LABEL[roleType], wordCount: words, checks, missing }
}

/** Replace em and en dashes. Ranges between numbers or times become "to", others become commas. */
export function stripDashes(s: string): string {
  return s
    .replace(/(\d|am|pm)\s*[\u2013\u2014]\s*(£?\d)/gi, '$1 to $2')
    .replace(/\s*[\u2014\u2013]\s*/g, ', ')
    .replace(/,\s*,/g, ',')
    .replace(/^,\s*/gm, '')
}
