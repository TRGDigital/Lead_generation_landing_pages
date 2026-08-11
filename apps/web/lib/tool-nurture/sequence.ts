import { SITE, h, p, small, link, btn, bullets, card, divider } from './layout'

// The TRG Digital nurture sequence for people who used a free tool. One email per
// entry, spaced across ~15 working days. `day` is the working-day offset from signup
// (the cron skips weekends). Copy is UK English and avoids dashes.

export type NurtureEmail = {
  id: string
  day: number
  subject: string
  preheader: string
  body: (ctx: { name?: string }) => string
}

const CARESTREAM_CERT = 'https://www.carestreamai.com/staff-training/care-certificate'
const CARESTREAM = 'https://www.carestreamai.com'

const hi = (name?: string) => {
  const first = name?.trim().split(/\s+/)[0]
  return p(`Hi${first ? ` ${first}` : ' there'},`)
}

export const SEQUENCE: NurtureEmail[] = [
  {
    id: 'welcome',
    day: 0,
    subject: 'Your free tool result, and what to do with it',
    preheader: 'Thanks for using the Care Toolkit. Here is how to get the most from it.',
    body: ({ name }) =>
      h('Thanks for trying the Care Toolkit') +
      hi(name) +
      p('You have just used one of our free tools for care managers and owners. The number it gave you is a useful starting point, but the real value is in what you do with it next.') +
      p('Over the next couple of weeks we will send you a short, practical email every few days: the other free tools worth bookmarking, the numbers that quietly shape your margin (staffing, agency, occupancy and fees), and how the best run homes stay inspection ready without living in a spreadsheet. No fluff, and you can unsubscribe at any time.') +
      p('A good place to start is the rest of the toolkit:') +
      btn(`${SITE}/tools`, 'Explore the full Care Toolkit') +
      small('Every tool is free, needs no login, and works on your phone.'),
  },
  {
    id: 'toolkit',
    day: 1,
    subject: '7 free tools every care manager should bookmark',
    preheader: 'Dependency, staffing, agency cost, turnover, fees, CQC and training.',
    body: ({ name }) =>
      h('The rest of your free toolkit') +
      hi(name) +
      p('Most managers find us through one tool and never realise there are seven more sitting alongside it. Here are the ones our care clients open again and again:') +
      card({ eyebrow: 'Dependency', title: 'Care Home Dependency Tool', body: 'Score your residents across six care domains and see the care hours your home actually needs.', href: `${SITE}/tools/care-home-dependency-tool`, cta: 'Measure dependency' }) +
      card({ eyebrow: 'Staffing', title: 'Staffing Calculator', body: 'Turn those care hours into whole-time-equivalent staff and numbers on duty per shift.', href: `${SITE}/tools/staffing-calculator`, cta: 'Work out staffing' }) +
      card({ eyebrow: 'Compliance', title: 'CQC Inspection Readiness', body: 'Self-assess against the five key questions and see the gaps before the inspector does.', href: `${SITE}/tools/cqc-inspection-readiness`, cta: 'Check readiness' }) +
      card({ eyebrow: 'Training', title: 'Mandatory Training Checker', body: 'See how up to date your staff are across the mandatory topics, and exactly what is outstanding.', href: `${SITE}/tools/mandatory-training-checker`, cta: 'Check training' }) +
      btn(`${SITE}/tools`, 'See all the free tools'),
  },
  {
    id: 'staffing',
    day: 3,
    subject: 'Are you staffing to dependency, or to a number?',
    preheader: 'A quick way to sense-check whether your rota matches the people in your home.',
    body: ({ name }) =>
      h('Staff to your residents, not to a habit') +
      hi(name) +
      p('Most rotas are built on history: this is what we have always run. But dependency drifts. A couple of new admissions with higher needs, or a run of falls, and yesterday’s safe number is today’s stretched shift.') +
      p('Two of our tools answer this together in about five minutes:') +
      bullets([
        'The <strong>Dependency Tool</strong> turns your residents into a dependency mix and a total of care hours per day.',
        'The <strong>Staffing Calculator</strong> turns those hours into the carers you need on duty, day and night.',
      ]) +
      card({ title: 'Care Home Dependency Tool', body: 'Six domains, per resident, with standard care-hour bands. See your home’s real dependency picture.', href: `${SITE}/tools/care-home-dependency-tool`, cta: 'Start with dependency' }) +
      p('It is the same logic a good commissioner or inspector will apply, so it is worth knowing your own numbers first.') +
      btn(`${SITE}/tools/staffing-calculator`, 'Open the Staffing Calculator'),
  },
  {
    id: 'agency-turnover',
    day: 5,
    subject: 'The two numbers quietly draining care budgets',
    preheader: 'Agency premium and staff turnover, both costed in a couple of minutes.',
    body: ({ name }) =>
      h('Agency and turnover: the silent margin killers') +
      hi(name) +
      p('Ask most owners what agency is costing them and you get a shrug and a wince. The same goes for turnover. Both are huge, both are largely hidden, and both are easier to tackle once you can see the real figure.') +
      card({ eyebrow: 'Agency', title: 'Agency Cost Calculator', body: 'Your annual agency spend, the premium over permanent staff, and what cutting reliance is worth.', href: `${SITE}/tools/agency-staff-cost-calculator`, cta: 'Cost your agency use' }) +
      card({ eyebrow: 'Turnover', title: 'Staff Turnover Cost Calculator', body: 'What losing and replacing staff really costs each year, recruitment, cover and lost productivity.', href: `${SITE}/tools/staff-turnover-cost-calculator`, cta: 'Cost your turnover' }) +
      p('The fix for both is the same: keep good people. Strong onboarding and training is one of the biggest retention levers there is, which is exactly what our sister product CareStream was built for.') +
      small(`Curious? ${link(CARESTREAM, 'See how CareStream turns your policies into training staff actually finish')}.`),
  },
  {
    id: 'occupancy-fees',
    day: 7,
    subject: "Every empty bed has a price. Here is how to find yours.",
    preheader: 'Empty-bed cost, break-even fee and your funding mix, in minutes.',
    body: ({ name }) =>
      h('What is an empty bed really costing you?') +
      hi(name) +
      p('A void is not just a missing fee. Your fixed costs, staff, rent, insurance, food, carry on regardless, so an empty bed loses money every single day it stays empty. Three tools help you see the full picture:') +
      card({ eyebrow: 'Occupancy', title: 'Cost of an Empty Bed', body: 'Exactly what each void costs per week, month and year, and what filling it is worth.', href: `${SITE}/tools/empty-bed-calculator`, cta: 'Cost your empty beds' }) +
      card({ eyebrow: 'Fees', title: 'Fee Break-Even Calculator', body: 'The weekly fee and occupancy your home needs to break even, and where you stand today.', href: `${SITE}/tools/care-fee-break-even-calculator`, cta: 'Find your break-even' }) +
      card({ eyebrow: 'Funding', title: 'Local Authority vs Private', body: 'How much less your council-funded residents earn than private ones, per bed and across the home.', href: `${SITE}/tools/funding-mix-calculator`, cta: 'Check your funding mix' }) +
      p('Filling those beds is, in the end, a marketing problem. More on that later in the week.') +
      btn(`${SITE}/tools/empty-bed-calculator`, 'Start with the empty-bed cost'),
  },
  {
    id: 'cqc-training',
    day: 9,
    subject: 'Would your home pass an inspection tomorrow?',
    preheader: 'A 5-minute readiness self-check, plus a real Care Certificate lesson to try.',
    body: ({ name }) =>
      h('Inspection ready, without the last-minute panic') +
      hi(name) +
      p('The homes that stay calm at inspection are the ones that treat readiness as a habit, not an event. Two free tools help you keep it that way:') +
      card({ eyebrow: 'Readiness', title: 'CQC Inspection Readiness', body: 'Self-assess against safe, effective, caring, responsive and well-led, and see where the gaps are.', href: `${SITE}/tools/cqc-inspection-readiness`, cta: 'Check your readiness' }) +
      card({ eyebrow: 'Training', title: 'Mandatory Training Checker', body: 'See your compliance across the mandatory topics and exactly which records are outstanding.', href: `${SITE}/tools/mandatory-training-checker`, cta: 'Check training gaps' }) +
      divider() +
      p('Found training gaps? This is where our sister product CareStream comes in. It turns your own policies into role-based training staff actually finish, mapped to the Care Certificate, with tracking and evidence built in.') +
      p(`You can try a real lesson from the Care Certificate module (the exact one your staff would see) right now:`) +
      btn(CARESTREAM_CERT, 'Try a real Care Certificate lesson'),
  },
  {
    id: 'get-found',
    day: 11,
    subject: 'When a family searches for care near you, do they find you?',
    preheader: 'Grade your website the way families judge it, and see your Google preview.',
    body: ({ name }) =>
      h('Filling beds starts on Google') +
      hi(name) +
      p('Nine in ten care searches start online, often with a stressed relative on a phone at 11pm. If your website is slow, your fees are hidden, or you are buried below the aggregators, that enquiry goes to the home that shows up better. The good news: it is fixable, and you can check it for free.') +
      card({ eyebrow: 'Website', title: 'Your Care Website Grader', body: 'Score your site the way families judge it: CQC rating, fees, enquiry journey, speed and accessibility.', href: `${SITE}/tools/website-grader`, cta: 'Grade your website' }) +
      card({ eyebrow: 'Search', title: 'How You Look on Google', body: 'See your live search result and social share preview, then write a title and description that earn the click.', href: `${SITE}/tools/google-preview`, cta: 'See your Google preview' }) +
      p(`When you want a hand fixing what those tools flag, ${link(`${SITE}/local-seo`, 'local SEO')} and your ${link(`${SITE}/google-business-profile`, 'Google Business Profile and reviews')} are usually the fastest wins, and both are what we do for care homes every day.`) +
      btn(`${SITE}/tools/website-grader`, 'Grade your website now'),
  },
  {
    id: 'proof',
    day: 13,
    subject: 'How two care homes filled beds and freed up their managers',
    preheader: 'A quick look at what the right marketing and tools did for Crossways and Ferndale.',
    body: ({ name }) =>
      h('What good looks like') +
      hi(name) +
      p('Everything we have shared this fortnight, dependency-led staffing, cutting agency, filling beds, staying inspection ready, comes together in the homes we work with. Crossways and Ferndale are two of them.') +
      p('They now have:') +
      bullets([
        'A modern website that puts CQC rating, fees and a clear enquiry journey front and centre.',
        'A stronger presence on Google, so local families find them first.',
        'The same free tools in this toolkit, used to keep staffing, occupancy and compliance under control.',
      ]) +
      p('It is not magic, just the fundamentals done properly and consistently.') +
      btn(`${SITE}/work`, 'See the case studies') +
      small(`Want the same for your home? Just reply to this email and tell me a bit about it.`),
  },
  {
    id: 'offer',
    day: 15,
    subject: 'A free 20-minute review of how your home shows up online',
    preheader: 'No pitch. We look at your website, Google presence and fees, and send you the quickest wins.',
    body: ({ name }) =>
      h('One last thing: a free review, on us') +
      hi(name) +
      p('You have spent the last couple of weeks measuring your home with our tools. Let us return the favour.') +
      p('Book a free 20-minute review and we will look at how your home shows up to the families searching for care near you, then send you a short, honest list of the three quickest wins. You will get value whether or not we ever work together.') +
      bullets([
        'How your website compares to the homes you compete with',
        'Where you are losing enquiries, and the easy fixes',
        'What your Google presence and reviews are doing for you',
      ]) +
      btn(`${SITE}/book-a-demo`, 'Book your free review') +
      p(`Prefer email? Just reply to this message and I will pick it up personally.`) +
      small('And if now is not the time, that is fine too. The tools are always free and always here when you need them.'),
  },
]

export const SEQUENCE_BY_ID: Record<string, NurtureEmail> = Object.fromEntries(SEQUENCE.map((e) => [e.id, e]))
