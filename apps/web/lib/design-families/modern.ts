import type { SettingKey } from '@/lib/design-settings'

// The Modern design family: one template (components/designs/families/ModernTemplate.tsx),
// written up for each care setting. Every provider here is fictional, with a 000 phone
// number, and every photo is an AI generated illustration (scripts/generate-design-images.mjs
// reads the `prompt` fields below). No em or en dashes anywhere: house style.

export type ModernPalette = { primary: string; soft: string; ink: string; accent: string }

export type ModernContent = {
  slug: string
  setting: SettingKey
  /** The design's name on the index card. */
  name: string
  style: string
  highlights: string[]
  palette: ModernPalette
  provider: { name: string; strapline: string; town: string; county: string; phone: string; intro: string; address: string }
  nav: string[]
  eyebrow: string
  ctas: [primary: string, secondary: string]
  chips: string[]
  floatCard: { label: string; value: string; note: string }
  audiences: { label: string; title: string; body: string; cta: string }[]
  services: { title: string; items: { title: string; body: string }[] }
  feature: { title: string; items: { label: string; title: string; body: string }[] }
  tools: { title: string; body: string }[]
  posts: { title: string; date: string; tag: string }[]
  finalCta: { title: string; body: string; primary: string }
  /** Image prompts: hero, life (the photo band), then one per post. */
  prompts: { hero: string; life: string; posts: [string, string, string] }
  alts: { hero: string; life: string }
}

// Shared prompt tail, so every image in the family has the same look.
export const LOOK =
  'Photorealistic editorial photograph, natural daylight, warm and optimistic, modern UK setting, candid not posed, shallow depth of field, no text, no logos, no watermarks, respectful and dignified portrayal of older and disabled people.'

export type ImagePart = 'hero' | 'life' | 'post-1' | 'post-2' | 'post-3'

/** Where a family's photos live: public/designs/<family>/<slug>-<part>.jpg */
export const familyImage = (family: string, slug: string, part: ImagePart) => `/designs/${family}/${slug}-${part}.jpg`

export const modernImage = (slug: string, part: ImagePart) => familyImage('modern', slug, part)

export const MODERN: ModernContent[] = [
  {
    slug: 'modern-care-home',
    setting: 'care-homes',
    name: 'Hollybrook',
    style: 'Modern family. Coral and warm white, rounded cards, built around visits and room availability.',
    highlights: ['Rooms available shown up front', 'Book a visit on every page', 'Fees and funding explained plainly'],
    palette: { primary: '#d9482f', soft: '#fdeee9', ink: '#1f1917', accent: '#2f7d6d' },
    provider: {
      name: 'Hollybrook House',
      strapline: 'A care home that still feels like home',
      town: 'Ashcombe',
      county: 'Somerset',
      phone: '01460 000 000',
      intro:
        'Hollybrook House is a 38 bedroom residential and respite home on the edge of Ashcombe, where people keep their routines, their friends and their say in how each day goes.',
      address: 'Mill Lane, Ashcombe',
    },
    nav: ['Our home', 'Care', 'Rooms and fees', 'Life here', 'Careers', 'Contact'],
    eyebrow: 'Residential and respite care in Somerset',
    ctas: ['Book a visit', 'See rooms and fees'],
    chips: ['Rated Good by CQC (example)', 'Respite stays from one week', 'Family run since 1998'],
    floatCard: { label: 'Rooms available', value: '2 this month', note: 'Updated by the home every week' },
    audiences: [
      { label: 'For families', title: 'Looking for a care home', body: 'Come and see the home, meet the team and have lunch with us. No forms first.', cta: 'Book a visit' },
      { label: 'For professionals', title: 'Discharge and social work teams', body: 'Current vacancies, the needs we can meet and a direct line to the manager.', cta: 'Make a referral' },
    ],
    services: {
      title: 'Care at Hollybrook',
      items: [
        { title: 'Long term residential care', body: 'Help with personal care, medication and daily life, in a room that is yours.' },
        { title: 'Respite stays', body: 'A break for a carer or a stay after hospital, from one week upwards.' },
        { title: 'Early stage dementia', body: 'Familiar routines and a small team who get to know each person well.' },
        { title: 'Day care', body: 'Lunch, activities and company, and home again by teatime.' },
      ],
    },
    feature: {
      title: 'A day at Hollybrook',
      items: [
        { label: 'Morning', title: 'Up when you like', body: 'Breakfast is served until eleven. There is no set time to be up and dressed.' },
        { label: 'Midday', title: 'Lunch together', body: 'Cooked here every day, with a choice at every meal and room for family to join.' },
        { label: 'Afternoon', title: 'Something to do', body: 'Gardening, music, a trip out, or a quiet read. Always a choice, never a timetable.' },
        { label: 'Evening', title: 'Settled for the night', body: 'Supper, a chat and help to bed, with staff awake and on hand all night.' },
      ],
    },
    tools: [
      { title: 'What will care cost?', body: 'An honest estimate of weekly fees before you pick up the phone.' },
      { title: 'Who pays for care?', body: 'What the council may fund, and what families usually pay themselves.' },
      { title: 'Care home checklist', body: 'What to look for, and what to ask, when you visit any care home.' },
    ],
    posts: [
      { title: 'What to bring when moving into a care home', date: '18 September 2026', tag: 'Moving in' },
      { title: 'How respite care gives family carers a break', date: '4 September 2026', tag: 'Respite' },
      { title: 'Our summer fete, in pictures', date: '21 August 2026', tag: 'Life here' },
    ],
    finalCta: { title: 'Come and see Hollybrook', body: 'Visits are relaxed and take about an hour. Bring whoever you like, and stay for lunch.', primary: 'Book a visit' },
    prompts: {
      hero: `An older woman in her eighties laughing with a young female care assistant in a bright, modern care home lounge with large windows, plants and soft furnishings. ${LOOK}`,
      life: `Residents and staff gardening together in raised flower beds outside a modern single storey care home, summer. ${LOOK}`,
      posts: [
        `A neatly packed small suitcase, framed family photos and a knitted blanket on a bed in a bright care home bedroom. ${LOOK}`,
        `A middle aged daughter hugging her elderly father goodbye at the entrance of a welcoming care home. ${LOOK}`,
        `Older residents and families enjoying a summer fete with bunting on the lawn of a care home. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a resident and a care assistant sharing a laugh in a bright lounge', life: 'An illustration of residents and staff gardening together' },
  },
  {
    slug: 'modern-nursing-home',
    setting: 'nursing-homes',
    name: 'Riverside',
    style: 'Modern family. Clear blue and white, confident type, built for families and discharge teams in a hurry.',
    highlights: ['Admissions enquiry answered same day', 'Clinical services set out clearly', 'Written for discharge teams too'],
    palette: { primary: '#1d4ed8', soft: '#e9f0ff', ink: '#0f172a', accent: '#0ea5a3' },
    provider: {
      name: 'Riverside Lodge Nursing Home',
      strapline: 'Nursing care, with the time to get it right',
      town: 'Kingsmere',
      county: 'Nottinghamshire',
      phone: '01636 000 000',
      intro:
        'Riverside Lodge provides 24 hour nursing care for 52 people, including dementia nursing, end of life care and short stays after hospital, led by a team of registered nurses on every shift.',
      address: 'Wharf Road, Kingsmere',
    },
    nav: ['Nursing care', 'Admissions', 'Our team', 'Life here', 'Careers', 'Contact'],
    eyebrow: 'Nursing care in Nottinghamshire',
    ctas: ['Ask about admission', 'Our nursing services'],
    chips: ['Rated Good by CQC (example)', 'Registered nurses 24 hours', 'Assessments within 24 hours'],
    floatCard: { label: 'Admissions', value: 'Beds today', note: 'Call the nurse in charge for a same day answer' },
    audiences: [
      { label: 'For families', title: 'A parent needs nursing care', body: 'We explain nursing care, funding and what happens next, in plain language.', cta: 'Talk to us today' },
      { label: 'For hospital teams', title: 'Discharge and CHC referrals', body: 'Current beds, the clinical needs we meet and an assessment within a day.', cta: 'Refer a patient' },
    ],
    services: {
      title: 'Nursing care at Riverside',
      items: [
        { title: 'General nursing', body: 'Complex health needs, wound care, catheter and PEG care, managed by nurses.' },
        { title: 'Dementia nursing', body: 'Nursing and dementia care together, for people whose needs have grown.' },
        { title: 'End of life care', body: 'Calm, comfortable care, with family welcome at any hour.' },
        { title: 'Step down after hospital', body: 'Short stays to recover before going home.' },
      ],
    },
    feature: {
      title: 'How admission works',
      items: [
        { label: 'Step 1', title: 'Call or refer', body: 'Speak to the nurse in charge, or send the referral from the hospital.' },
        { label: 'Step 2', title: 'Assessment', body: 'A nurse assesses within a day, in hospital or at home.' },
        { label: 'Step 3', title: 'Funding', body: 'We explain FNC, CHC and self funding, and help with the forms.' },
        { label: 'Step 4', title: 'Moving in', body: 'The room is ready, the care plan is written, and family are welcome from day one.' },
      ],
    },
    tools: [
      { title: 'Nursing care funding', body: 'How NHS funded nursing care and CHC work, and who qualifies.' },
      { title: 'Care home or nursing home?', body: 'A short check that helps families understand which they need.' },
      { title: 'What will it cost?', body: 'Weekly fees, what they include and what the NHS contributes.' },
    ],
    posts: [
      { title: 'What is the difference between a care home and a nursing home?', date: '15 September 2026', tag: 'Choosing care' },
      { title: 'NHS Continuing Healthcare, explained simply', date: '2 September 2026', tag: 'Funding' },
      { title: 'Meet our clinical lead, Priya', date: '19 August 2026', tag: 'Our team' },
    ],
    finalCta: { title: 'Need a nursing bed quickly?', body: 'Call the nurse in charge. You will get a straight answer about beds and needs today.', primary: 'Call about admission' },
    prompts: {
      hero: `A registered nurse in navy scrubs kindly checking on an elderly man in a bright, modern nursing home room with a view of a river. ${LOOK}`,
      life: `A nurse and a care assistant reviewing a care plan on a tablet at a calm, modern nursing station. ${LOOK}`,
      posts: [
        `An adult daughter and her elderly mother talking with a nurse at a small table in a bright nursing home lounge. ${LOOK}`,
        `Hands of an older person holding a cup of tea while a nurse sits beside them, soft focus. ${LOOK}`,
        `A smiling South Asian female clinical lead nurse in a bright corridor of a modern nursing home. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a nurse checking on a resident in a bright room', life: 'An illustration of nurses reviewing a care plan together' },
  },
  {
    slug: 'modern-dementia-care',
    setting: 'dementia-care',
    name: 'The Orchards',
    style: 'Modern family. Plum and honey, calm spacing, written for families facing dementia for the first time.',
    highlights: ['Dementia care explained step by step', 'Memory support tools built in', 'Visits planned around routines'],
    palette: { primary: '#7a3b8f', soft: '#f5edf8', ink: '#1e1522', accent: '#e0a331' },
    provider: {
      name: 'The Orchards',
      strapline: 'Dementia care that starts with who someone is',
      town: 'Fernley',
      county: 'Kent',
      phone: '01622 000 000',
      intro:
        'The Orchards is a 30 bedroom home designed for people living with dementia: small households, familiar routines, safe gardens to walk in and a team trained to understand, not just to manage.',
      address: 'Orchard Way, Fernley',
    },
    nav: ['Dementia care', 'Our home', 'For families', 'Life here', 'Careers', 'Contact'],
    eyebrow: 'Specialist dementia care in Kent',
    ctas: ['Talk to our dementia lead', 'Is it time for more help?'],
    chips: ['Rated Good by CQC (example)', 'Small households of ten', 'Safe gardens to walk in'],
    floatCard: { label: 'Households', value: '3 of 10', note: 'Small, familiar groups rather than one big home' },
    audiences: [
      { label: 'For families', title: 'Worried about someone with dementia', body: 'We will talk through what is happening and what might help, even if it is not a move.', cta: 'Speak to our dementia lead' },
      { label: 'For carers', title: 'Work in dementia care', body: 'Full dementia training, small teams and time to know the people you support.', cta: 'See our care jobs' },
    ],
    services: {
      title: 'Dementia care at The Orchards',
      items: [
        { title: 'Long term dementia care', body: 'Care that follows each person’s own routines, history and preferences.' },
        { title: 'Respite for family carers', body: 'A planned break, with the same small team every time.' },
        { title: 'Later stage support', body: 'Comfort and dignity as needs increase, working with local nurses.' },
        { title: 'Family support', body: 'Monthly family sessions and a named contact for every family.' },
      ],
    },
    feature: {
      title: 'What makes it different',
      items: [
        { label: 'Life story', title: 'We start with who they are', body: 'A life story book for everyone, so staff know what matters and why.' },
        { label: 'Routine', title: 'Their day, not ours', body: 'Meals, rest and activity follow each person, not a rota.' },
        { label: 'Space', title: 'Freedom to walk', body: 'Circular corridors and secure gardens, so walking is safe and never discouraged.' },
        { label: 'Team', title: 'Trained in dementia', body: 'Every carer completes dementia training before working alone.' },
      ],
    },
    tools: [
      { title: 'Early signs checklist', body: 'A private checklist for families noticing changes in memory or mood.' },
      { title: 'Is it time for more help?', body: 'Questions that help families decide when care at home is no longer enough.' },
      { title: 'Paying for dementia care', body: 'What the council and the NHS may fund, and when.' },
    ],
    posts: [
      { title: 'Noticing changes in memory: what to do first', date: '16 September 2026', tag: 'Getting help' },
      { title: 'Why routine matters so much with dementia', date: '3 September 2026', tag: 'Understanding dementia' },
      { title: 'Music afternoons in the garden room', date: '22 August 2026', tag: 'Life here' },
    ],
    finalCta: { title: 'Start with a conversation', body: 'Talk to our dementia lead about what is happening. There is no obligation and no rush.', primary: 'Speak to our dementia lead' },
    prompts: {
      hero: `An elderly woman with dementia smiling while looking through a photo album with a gentle male care worker in a calm, modern lounge with soft colours. ${LOOK}`,
      life: `Two older residents walking arm in arm along a winding path in a secure sensory garden with fruit trees. ${LOOK}`,
      posts: [
        `A worried middle aged man sitting with his elderly father at a kitchen table, looking through papers together. ${LOOK}`,
        `A neat daily routine board with pictures on the wall of a bright dementia care home kitchen, no readable text. ${LOOK}`,
        `Older residents clapping along as a young woman plays acoustic guitar in a sunny garden room. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a resident looking at a photo album with a carer', life: 'An illustration of two residents walking in a garden' },
  },
  {
    slug: 'modern-home-care',
    setting: 'home-care',
    name: 'Kindred',
    style: 'Modern family. Fresh green and amber, two clear routes for clients and carers, visits front and centre.',
    highlights: ['Separate routes for families and carers', 'Care assessment request built in', 'Areas covered on a map'],
    palette: { primary: '#15803d', soft: '#eaf6ee', ink: '#13201a', accent: '#f59e0b' },
    provider: {
      name: 'Kindred Home Care',
      strapline: 'Help at home, from the same friendly faces',
      town: 'Westerby',
      county: 'Leicestershire',
      phone: '01455 000 000',
      intro:
        'Kindred provides home care and domiciliary support across south Leicestershire, from a morning call to several visits a day, planned around the person and delivered by a small, consistent team.',
      address: 'The Old Bakery, High Street, Westerby',
    },
    nav: ['Home care', 'Areas we cover', 'How it works', 'Careers', 'Blog', 'Contact'],
    eyebrow: 'Home care in Leicestershire',
    ctas: ['Book a care assessment', 'Plan a week of visits'],
    chips: ['Rated Good by CQC (example)', 'Visits from 30 minutes', 'Covering 18 villages'],
    floatCard: { label: 'This week', value: '12 hours', note: 'Morning, lunch and bedtime calls, seven days' },
    audiences: [
      { label: 'For families', title: 'Help at home for someone you love', body: 'We plan visits around their day, and care can often start within a week.', cta: 'Book a care assessment' },
      { label: 'For carers', title: 'Work with Kindred', body: 'Paid travel time and mileage, guaranteed hours and visits in one area.', cta: 'See our care jobs' },
    ],
    services: {
      title: 'Help at home',
      items: [
        { title: 'Personal care', body: 'Washing, dressing and getting up or to bed, with dignity and at your pace.' },
        { title: 'Medication support', body: 'Reminders or help with medication, recorded at every visit.' },
        { title: 'Meals and home help', body: 'A hot meal, shopping and keeping the house the way you like it.' },
        { title: 'Companionship', body: 'Time for a chat, a walk or an appointment, so no one feels alone.' },
      ],
    },
    feature: {
      title: 'A typical day of visits',
      items: [
        { label: 'About an hour', title: 'Morning call', body: 'Up, washed and dressed, medication and breakfast made the way you like it.' },
        { label: '30 minutes', title: 'Lunch call', body: 'A hot meal and a proper conversation.' },
        { label: '30 minutes', title: 'Tea call', body: 'An evening meal and a tidy round.' },
        { label: '30 minutes', title: 'Bedtime call', body: 'Help to settle safely for the night.' },
      ],
    },
    tools: [
      { title: 'How much care do we need?', body: 'Plan a week of visits and see the hours before you call anyone.' },
      { title: 'Attendance Allowance checker', body: 'A benefit many people receiving care at home never claim.' },
      { title: 'What does home care cost?', body: 'Hourly rates explained, and what the council may pay.' },
    ],
    posts: [
      { title: 'What happens at a home care assessment', date: '17 September 2026', tag: 'Getting started' },
      { title: 'Five signs a parent could use help at home', date: '5 September 2026', tag: 'Getting help' },
      { title: 'Meet Sam, one of our carers in Westerby', date: '20 August 2026', tag: 'Our team' },
    ],
    finalCta: { title: 'Care can start this week', body: 'A care assessment is free, takes about an hour and there is no obligation at all.', primary: 'Book a care assessment' },
    prompts: {
      hero: `A friendly young female home carer in a green uniform tunic helping an elderly man with his coat at the front door of his terraced house. ${LOOK}`,
      life: `An elderly woman and her home carer preparing vegetables together in a cosy, bright home kitchen. ${LOOK}`,
      posts: [
        `A care coordinator with a notebook chatting with an elderly couple on their living room sofa. ${LOOK}`,
        `An adult son on the phone looking thoughtfully out of a window, concerned but calm. ${LOOK}`,
        `A smiling young male home carer standing beside a small car on a village street. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a home carer helping a man with his coat', life: 'An illustration of a carer and a client cooking together' },
  },
  {
    slug: 'modern-live-in-care',
    setting: 'live-in-care',
    name: 'Hearthside',
    style: 'Modern family. Terracotta and teal, reassuring and personal, built around matching the right carer.',
    highlights: ['Carer matching explained', 'Live-in versus care home compared', 'Fast start after hospital'],
    palette: { primary: '#c2410c', soft: '#fdf0e7', ink: '#231812', accent: '#0f766e' },
    provider: {
      name: 'Hearthside Live-in Care',
      strapline: 'Stay at home, with a carer who lives with you',
      town: 'Haslemoor',
      county: 'Surrey',
      phone: '01483 000 000',
      intro:
        'Hearthside matches one or two dedicated carers to live in your home, so you can stay where you are happiest, with your routines, your garden and your pets, and support around the clock.',
      address: 'Station Yard, Haslemoor',
    },
    nav: ['Live-in care', 'How matching works', 'Costs', 'Careers', 'Blog', 'Contact'],
    eyebrow: 'Live-in care across Surrey and Sussex',
    ctas: ['Talk to a care adviser', 'Live-in care or a care home?'],
    chips: ['Rated Good by CQC (example)', 'Carers matched to you', 'Can start within days'],
    floatCard: { label: 'Your carer', value: 'Matched', note: 'Chosen for personality, skills and interests' },
    audiences: [
      { label: 'For families', title: 'Keeping someone at home', body: 'Talk to an adviser about whether live-in care is right, and what it involves.', cta: 'Talk to an adviser' },
      { label: 'For carers', title: 'Become a live-in carer', body: 'Rotas that suit you, full training and one client at a time.', cta: 'Apply to be a live-in carer' },
    ],
    services: {
      title: 'Live-in care with Hearthside',
      items: [
        { title: 'Full time live-in care', body: 'A carer at home day and night, with regular breaks covered.' },
        { title: 'Dementia live-in care', body: 'Familiar surroundings and one person who knows every routine.' },
        { title: 'Couples care', body: 'Two people cared for together, in their own home.' },
        { title: 'After hospital', body: 'A carer in place within days, so discharge can happen sooner.' },
      ],
    },
    feature: {
      title: 'How we match your carer',
      items: [
        { label: 'Step 1', title: 'We get to know you', body: 'A visit to understand needs, routines, interests and home life.' },
        { label: 'Step 2', title: 'We suggest carers', body: 'Profiles of carers chosen for skills and personality, not just availability.' },
        { label: 'Step 3', title: 'You choose', body: 'Meet or call your carer before they start. You always have the final say.' },
        { label: 'Step 4', title: 'We stay close', body: 'Regular visits from a care manager, and a line you can call any time.' },
      ],
    },
    tools: [
      { title: 'Live-in or care home?', body: 'Compare the cost and the day to day of each, side by side.' },
      { title: 'Is the home ready?', body: 'A short check of what live-in care needs: a spare room and a few basics.' },
      { title: 'Funding live-in care', body: 'What the council may contribute, and how families usually pay.' },
    ],
    posts: [
      { title: 'Live-in care or a care home? How families decide', date: '14 September 2026', tag: 'Choosing care' },
      { title: 'What a live-in carer does, day to day', date: '1 September 2026', tag: 'Live-in care' },
      { title: 'Meet Grace, a live-in carer for six years', date: '18 August 2026', tag: 'Our team' },
    ],
    finalCta: { title: 'Find out if live-in care is right', body: 'A care adviser will talk it through with you, with no pressure and no obligation.', primary: 'Talk to a care adviser' },
    prompts: {
      hero: `A warm female live-in carer and an elderly woman having breakfast together at a sunny kitchen table in a cottage, with a dog at their feet. ${LOOK}`,
      life: `An elderly man in his garden with his live-in carer tending tomato plants in a greenhouse. ${LOOK}`,
      posts: [
        `An elderly couple sitting on the sofa in their own living room, relaxed, with a carer bringing tea. ${LOOK}`,
        `A live-in carer reading a newspaper aloud to an elderly man in an armchair by a window. ${LOOK}`,
        `A smiling Black female live-in carer in her fifties standing in a bright hallway of a family home. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a live-in carer and a woman having breakfast at home', life: 'An illustration of a man and his carer in a greenhouse' },
  },
  {
    slug: 'modern-supported-living',
    setting: 'supported-living',
    name: 'Brookfield',
    style: 'Modern family. Sky blue and sunshine, easy read throughout, with a clear route for professionals.',
    highlights: ['Easy read language on every page', 'Vacancies shown clearly', 'A referral route for professionals'],
    palette: { primary: '#0369a1', soft: '#e6f4fb', ink: '#0c1d27', accent: '#eab308' },
    provider: {
      name: 'Brookfield Supported Living',
      strapline: 'Your own home, your own way, with support you choose',
      town: 'Harlow Vale',
      county: 'Hertfordshire',
      phone: '01992 000 000',
      intro:
        'Brookfield supports adults with a learning disability, autism or mental health needs to live in their own homes. You have your own tenancy, and we support you as much or as little as you want.',
      address: 'Brook Street, Harlow Vale',
    },
    nav: ['About us', 'Our homes', 'Easy read', 'Referrals', 'Jobs', 'Contact'],
    eyebrow: 'Supported living in Hertfordshire',
    ctas: ['Find out about a home', 'Make a referral'],
    chips: ['Rated Good by CQC (example)', 'Your own tenancy', 'Support you choose'],
    floatCard: { label: 'Vacancies', value: '1 flat', note: 'A one bedroom flat in Harlow Vale' },
    audiences: [
      { label: 'For you and your family', title: 'Living more independently', body: 'Come and see a home, meet the team and ask anything. You decide.', cta: 'Arrange a visit' },
      { label: 'For professionals', title: 'Social workers and commissioners', body: 'Current vacancies, the needs we support and how to refer.', cta: 'Make a referral' },
    ],
    services: {
      title: 'Support at Brookfield',
      items: [
        { title: 'Everyday living', body: 'Cooking, cleaning, money and shopping, at your pace.' },
        { title: 'Health and wellbeing', body: 'Appointments, medication and feeling well, with someone alongside you.' },
        { title: 'Work and learning', body: 'Help to find a course, a volunteering role or a job.' },
        { title: 'Friends and community', body: 'Clubs, hobbies and seeing the people who matter to you.' },
      ],
    },
    feature: {
      title: 'How it works, in easy steps',
      items: [
        { label: 'Step 1', title: 'We meet', body: 'You tell us what you want from your life and your home.' },
        { label: 'Step 2', title: 'You visit', body: 'You see the home and meet the people who would support you.' },
        { label: 'Step 3', title: 'We plan', body: 'We write your support plan with you, in words you understand.' },
        { label: 'Step 4', title: 'You move in', body: 'You have your own keys and your own tenancy.' },
      ],
    },
    tools: [
      { title: 'Easy read guide', body: 'What supported living is, in easy words and pictures.' },
      { title: 'Is it right for me?', body: 'A few simple questions to help you and your family think it through.' },
      { title: 'For professionals', body: 'Our service specification and referral form, in one place.' },
    ],
    posts: [
      { title: 'What is supported living? An easy read guide', date: '15 September 2026', tag: 'Easy read' },
      { title: 'Ellie’s first year in her own flat', date: '2 September 2026', tag: 'Stories' },
      { title: 'Our new allotment is growing', date: '20 August 2026', tag: 'Community' },
    ],
    finalCta: { title: 'Want to find out more?', body: 'Call us or ask for a visit. We will explain everything and answer every question.', primary: 'Arrange a visit' },
    prompts: {
      hero: `A young adult man with Down syndrome smiling while cooking pasta in his own bright modern flat kitchen, with a support worker beside him. ${LOOK}`,
      life: `A group of young adults with learning disabilities and support workers laughing together at a community allotment. ${LOOK}`,
      posts: [
        `A support worker and a young woman looking at a simple picture guide together on a sofa in a bright flat. ${LOOK}`,
        `A young woman holding up a set of house keys proudly at the door of her own flat. ${LOOK}`,
        `Young adults watering vegetables at a community allotment on a sunny day. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a young man cooking in his own flat with a support worker', life: 'An illustration of people laughing together at an allotment' },
  },
  {
    slug: 'modern-retirement-living',
    setting: 'retirement-living',
    name: 'Linden Quarter',
    style: 'Modern family. Deep teal and gold, lifestyle first, with apartments and events to explore.',
    highlights: ['Apartment availability and floor plans', 'Events and open days built in', 'Care on hand, in the background'],
    palette: { primary: '#0f5e5a', soft: '#e8f3f1', ink: '#10201f', accent: '#c9973f' },
    provider: {
      name: 'Linden Quarter',
      strapline: 'Retirement living, right in the middle of things',
      town: 'Cheltwood',
      county: 'Gloucestershire',
      phone: '01242 000 000',
      intro:
        'Linden Quarter is 56 one and two bedroom apartments for people over 60, a short walk from the town centre, with a bistro, a gym, a guest suite and care on hand if it is ever needed.',
      address: 'Linden Walk, Cheltwood',
    },
    nav: ['Apartments', 'Living here', 'Events', 'Care on hand', 'Buying', 'Contact'],
    eyebrow: 'Retirement living in Gloucestershire',
    ctas: ['Book a show apartment visit', 'Request a brochure'],
    chips: ['Apartments to buy or rent', 'Bistro, gym and gardens', 'Care on hand if needed'],
    floatCard: { label: 'Available now', value: '4 apartments', note: 'One and two bedrooms, from the first floor up' },
    audiences: [
      { label: 'Thinking of moving?', title: 'Come and see for yourself', body: 'Tour the show apartment, have lunch in the bistro and meet a few neighbours.', cta: 'Book a visit' },
      { label: 'Helping a parent?', title: 'Questions families ask', body: 'Costs, care, what happens if needs change, and how buying works.', cta: 'Read the family guide' },
    ],
    services: {
      title: 'Life at Linden Quarter',
      items: [
        { title: 'Your own apartment', body: 'Your own front door, fully accessible and yours to furnish.' },
        { title: 'The bistro', body: 'Lunch or dinner with friends, or cook at home. Your choice every day.' },
        { title: 'Wellbeing', body: 'A gym, classes and a hair salon, all under one roof.' },
        { title: 'Care on hand', body: 'Support from an on site team, if and when you ever need it.' },
      ],
    },
    feature: {
      title: 'What is on this month',
      items: [
        { label: 'Mondays', title: 'Walking group', body: 'A gentle loop of the park, then coffee in the bistro.' },
        { label: 'Wednesdays', title: 'Book club', body: 'This month: a new crime novel and a lot of opinions.' },
        { label: 'Fridays', title: 'Supper club', body: 'Three courses, a glass of wine and good company.' },
        { label: 'Weekends', title: 'Open days', body: 'Show apartments open 10 until 4, no appointment needed.' },
      ],
    },
    tools: [
      { title: 'Find your apartment', body: 'Filter by size, floor and view, with floor plans for each.' },
      { title: 'Buying or renting?', body: 'How each works, what the service charge covers and what is included.' },
      { title: 'Downsizing checklist', body: 'A calm, step by step plan for moving from a family home.' },
    ],
    posts: [
      { title: 'Downsizing without losing what matters', date: '18 September 2026', tag: 'Moving' },
      { title: 'What does a service charge actually pay for?', date: '5 September 2026', tag: 'Buying' },
      { title: 'Supper club turns one', date: '22 August 2026', tag: 'Community' },
    ],
    finalCta: { title: 'Come and see the show apartment', body: 'Open every weekend, or book a time that suits you. Lunch in the bistro is on us.', primary: 'Book a visit' },
    prompts: {
      hero: `A stylish active couple in their late sixties laughing on the balcony of a modern retirement apartment with plants and town views. ${LOOK}`,
      life: `Older friends having lunch together in a bright, contemporary bistro inside a retirement village. ${LOOK}`,
      posts: [
        `A woman in her seventies unpacking a box of books in a light, airy modern apartment living room. ${LOOK}`,
        `A retired man reading a document at a kitchen island in a modern apartment, relaxed. ${LOOK}`,
        `Older residents raising glasses at a candlelit supper club table in a modern dining room. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a couple laughing on an apartment balcony', life: 'An illustration of friends having lunch in a bistro' },
  },
  {
    slug: 'modern-care-group',
    setting: 'care-groups',
    name: 'Northway',
    style: 'Modern family. Indigo and orange, organised and confident, built for a group with several homes.',
    highlights: ['Find a home by town and care type', 'One group careers section', 'Every home with its own page'],
    palette: { primary: '#4338ca', soft: '#eef0fd', ink: '#16163a', accent: '#f97316' },
    provider: {
      name: 'Northway Care Group',
      strapline: 'Five homes across Yorkshire, one way of caring',
      town: 'York',
      county: 'North Yorkshire',
      phone: '01904 000 000',
      intro:
        'Northway runs five care homes across Yorkshire, offering residential, nursing and dementia care, with the same standards, the same training and the same welcome in every one.',
      address: 'Clifton Court, York',
    },
    nav: ['Our homes', 'Care', 'Find a home', 'Careers', 'News', 'Contact'],
    eyebrow: 'A family of care homes in Yorkshire',
    ctas: ['Find a home near you', 'Careers across the group'],
    chips: ['Five homes', 'Residential, nursing and dementia', 'Every home rated Good (example)'],
    floatCard: { label: 'Rooms available', value: 'Across 3 homes', note: 'Updated by each home every week' },
    audiences: [
      { label: 'For families', title: 'Find the right home', body: 'Search by town and care type, compare homes and book a visit at any of them.', cta: 'Find a home' },
      { label: 'For your career', title: 'Grow with Northway', body: 'One group, five homes and a clear path from carer to manager.', cta: 'See all jobs' },
    ],
    services: {
      title: 'Our homes',
      items: [
        { title: 'Aldwick House, York', body: 'Residential and dementia care for 40 people.' },
        { title: 'Thistlewood, Harrogate', body: 'Nursing and residential care for 48 people.' },
        { title: 'Pennock House, Malton', body: 'Residential and respite care for 32 people.' },
        { title: 'Harebell Lodge, Ripon', body: 'Dementia nursing for 36 people.' },
      ],
    },
    feature: {
      title: 'One standard in every home',
      items: [
        { label: 'Training', title: 'The Northway academy', body: 'Every carer trained the same way, with a clear path to progress.' },
        { label: 'Food', title: 'Cooked in every home', body: 'Fresh menus planned with residents, in every kitchen.' },
        { label: 'Quality', title: 'Checked every month', body: 'A group quality team visits every home, every month.' },
        { label: 'Families', title: 'Always welcome', body: 'Open visiting in every home, and a named contact for every family.' },
      ],
    },
    tools: [
      { title: 'Find a home', body: 'Search the group by town, care type and availability.' },
      { title: 'Compare our homes', body: 'Care types, rooms and facilities side by side.' },
      { title: 'Who pays for care?', body: 'Council funding, NHS nursing care and self funding explained.' },
    ],
    posts: [
      { title: 'Thistlewood rated Good at its latest inspection', date: '16 September 2026', tag: 'News' },
      { title: 'How the Northway academy trains new carers', date: '4 September 2026', tag: 'Careers' },
      { title: 'Summer across the group, in pictures', date: '21 August 2026', tag: 'Life in our homes' },
    ],
    finalCta: { title: 'Find the right Northway home', body: 'Tell us where and what kind of care, and we will point you to the right home today.', primary: 'Find a home' },
    prompts: {
      hero: `Exterior of a modern, welcoming two storey care home with stone details and landscaped gardens in Yorkshire, golden hour. ${LOOK}`,
      life: `A diverse group of care home managers and carers in smart uniforms talking together in a bright training room. ${LOOK}`,
      posts: [
        `A proud care home manager and staff smiling in the reception area of a modern care home. ${LOOK}`,
        `A trainer showing new care workers a moving and handling technique in a training room. ${LOOK}`,
        `Care home residents enjoying an ice cream van visit in a sunny garden with staff. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of the outside of a modern care home in its gardens', life: 'An illustration of managers and carers talking in a training room' },
  },
]
