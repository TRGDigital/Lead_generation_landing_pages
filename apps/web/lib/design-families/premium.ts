import type { ModernContent } from '@/lib/design-families/modern'

// The Premium design family: editorial, generous space, full bleed photography and a high
// contrast serif, rendered by components/designs/families/PremiumTemplate.tsx. Same content
// shape as Modern, plus an opening statement and a note from the director. Every provider is
// fictional with a 000 phone number, and every photo is an AI generated illustration.
// No em or en dashes: house style.

export type PremiumContent = ModernContent & {
  statement: string
  manager: { name: string; role: string; note: string }
}

const LOOK =
  'Luxury editorial photograph, magazine quality, soft natural light, refined and understated interiors or grounds, rich muted tones, calm and elegant, candid not posed, no text, no logos, no watermarks, respectful and dignified portrayal of older and disabled people.'

export const PREMIUM: PremiumContent[] = [
  {
    slug: 'premium-care-home',
    setting: 'care-homes',
    name: 'Aldermere',
    style: 'Premium family. Ivory, forest and gold, editorial and spacious, for a luxury residential home.',
    highlights: ['Full screen photography', 'Private viewing requests', 'Suites and dining shown beautifully'],
    palette: { primary: '#22332b', soft: '#f4f1ea', ink: '#151513', accent: '#b08d57' },
    provider: {
      name: 'Aldermere House',
      strapline: 'Exceptional care, in a house of rare beauty',
      town: 'Oakley St Giles',
      county: 'Rutland',
      phone: '01572 000 000',
      intro:
        'Aldermere House offers residential and respite care for 28 residents in private suites, with a resident chef, landscaped grounds and a team who know every guest by name.',
      address: 'Oakley St Giles',
    },
    nav: ['The house', 'Care', 'Suites', 'Dining', 'Journal', 'Enquire'],
    eyebrow: 'Residential care in Rutland',
    ctas: ['Request a private viewing', 'Explore the suites'],
    chips: ['28 private suites', 'Resident chef', 'Six acres of grounds'],
    floatCard: { label: 'Suites', value: 'One available', note: 'A garden suite with its own terrace' },
    audiences: [
      { label: 'Families', title: 'A private viewing', body: 'Tour the house and grounds at your own pace, followed by lunch with the manager.', cta: 'Request a viewing' },
      { label: 'Professionals', title: 'Placements', body: 'Current suites, the needs we meet and a direct line to the manager.', cta: 'Contact the manager' },
    ],
    services: {
      title: 'Care, beautifully considered',
      items: [
        { title: 'Residential care', body: 'Discreet, personal support, arranged entirely around each resident.' },
        { title: 'Respite stays', body: 'A restorative stay of a week or more, in a fully furnished suite.' },
        { title: 'Memory support', body: 'Gentle routines and a settled team for early memory loss.' },
        { title: 'Convalescence', body: 'Recovery after hospital, with physiotherapy arranged.' },
      ],
    },
    feature: {
      title: 'The Aldermere experience',
      items: [
        { label: 'Dining', title: 'A resident chef', body: 'Seasonal menus, served in the dining room or your suite.' },
        { label: 'Suites', title: 'Private and spacious', body: 'Every suite with its own bathroom, and many with terraces.' },
        { label: 'Grounds', title: 'Six acres', body: 'Walled gardens, a lake walk and a summer house.' },
        { label: 'Wellbeing', title: 'Therapies on site', body: 'A salon, massage and a weekly physiotherapy clinic.' },
      ],
    },
    tools: [
      { title: 'Suites and fees', body: 'Every suite, with its fee and what is included.' },
      { title: 'Planning a move', body: 'A calm guide for families, from first visit to moving in.' },
      { title: 'Funding care', body: 'Private funding and deferred payment options explained.' },
    ],
    posts: [
      { title: 'An autumn menu from our resident chef', date: '19 September 2026', tag: 'Dining' },
      { title: 'Choosing a suite: light, views and space', date: '6 September 2026', tag: 'The house' },
      { title: 'Summer on the lake walk', date: '23 August 2026', tag: 'Journal' },
    ],
    finalCta: { title: 'Visit Aldermere', body: 'A private viewing, at a time that suits you, followed by lunch in the dining room.', primary: 'Request a private viewing' },
    statement:
      'We believe care should feel like home at its very best: familiar, generous and unhurried, with every detail taken care of so that residents and their families are free to simply enjoy their time together.',
    manager: {
      name: 'Eleanor Whitfield',
      role: 'Director of Care',
      note: 'The measure of a home is how it feels at four o’clock on a Tuesday. We would love you to come and see for yourself.',
    },
    prompts: {
      hero: `An elegant country house care home drawing room with tall windows, fresh flowers and an elderly woman in a pearl necklace laughing with a smartly dressed carer over tea. ${LOOK}`,
      life: `A beautifully laid dining room in a luxury care home with white tablecloths and residents being served by a chef. ${LOOK}`,
      posts: [
        `A plated seasonal dish with autumn vegetables on fine china, overhead view, elegant table. ${LOOK}`,
        `A spacious luxury care home suite with a four poster bed, armchairs and French doors to a terrace, empty. ${LOOK}`,
        `An elderly couple walking beside a lake in landscaped grounds, early evening. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a resident and a carer taking tea in an elegant drawing room', life: 'An illustration of a chef serving residents in an elegant dining room' },
  },
  {
    slug: 'premium-nursing-home',
    setting: 'nursing-homes',
    name: 'Clevedale',
    style: 'Premium family. Midnight blue and champagne, calm and assured, for private nursing care.',
    highlights: ['Nursing care presented with calm', 'Private admissions line', 'Suites and clinical care together'],
    palette: { primary: '#1b2a41', soft: '#f3f1ec', ink: '#10151f', accent: '#b89b6a' },
    provider: {
      name: 'Clevedale Nursing Residence',
      strapline: 'Expert nursing, with the comforts of a fine home',
      town: 'Clevedale',
      county: 'Worcestershire',
      phone: '01905 000 000',
      intro:
        'Clevedale provides nursing and end of life care for 34 residents in private suites, led by a senior nursing team and supported by visiting consultants.',
      address: 'Clevedale Park',
    },
    nav: ['Nursing', 'Suites', 'Our team', 'Admissions', 'Journal', 'Enquire'],
    eyebrow: 'Private nursing care in Worcestershire',
    ctas: ['Speak to our admissions nurse', 'Our nursing care'],
    chips: ['Senior nurses on duty 24 hours', 'Private suites', 'Visiting consultants'],
    floatCard: { label: 'Admissions', value: 'Same day', note: 'An answer from a senior nurse' },
    audiences: [
      { label: 'Families', title: 'Arranging nursing care', body: 'A senior nurse will talk you through care, suites and timing, discreetly.', cta: 'Speak to admissions' },
      { label: 'Clinicians', title: 'Referrals', body: 'Complex nursing referrals assessed within a day.', cta: 'Refer a patient' },
    ],
    services: {
      title: 'Nursing care, quietly excellent',
      items: [
        { title: 'Complex nursing', body: 'Specialist nursing for long term and complex conditions.' },
        { title: 'Neurological care', body: 'Care after stroke and for progressive neurological conditions.' },
        { title: 'End of life care', body: 'Peaceful, expert care, with family suites for overnight stays.' },
        { title: 'Post operative recovery', body: 'Private convalescence after surgery, with physiotherapy.' },
      ],
    },
    feature: {
      title: 'The Clevedale standard',
      items: [
        { label: 'Nursing', title: 'Senior led', body: 'A senior nurse on duty on every shift.' },
        { label: 'Medicine', title: 'Consultant input', body: 'Visiting consultants and a weekly GP round.' },
        { label: 'Comfort', title: 'Private suites', body: 'Every suite en suite, with room for family to stay.' },
        { label: 'Dining', title: 'Nutrition led', body: 'Menus designed with our dietitian and chef.' },
      ],
    },
    tools: [
      { title: 'Nursing care funding', body: 'Private funding, FNC and CHC explained.' },
      { title: 'Suites and fees', body: 'Every suite, with its fee and what is included.' },
      { title: 'Admissions guide', body: 'What happens from first call to moving in.' },
    ],
    posts: [
      { title: 'Recovering well after surgery', date: '17 September 2026', tag: 'Nursing' },
      { title: 'Nutrition in nursing care', date: '4 September 2026', tag: 'Dining' },
      { title: 'Our new family suite', date: '21 August 2026', tag: 'Journal' },
    ],
    finalCta: { title: 'Speak to our admissions nurse', body: 'A senior nurse will answer your questions today, with complete discretion.', primary: 'Speak to admissions' },
    statement:
      'Nursing care should never mean giving up comfort, privacy or dignity. At Clevedale, clinical excellence and the warmth of a fine home belong together.',
    manager: {
      name: 'Dr Imogen Hale',
      role: 'Director of Nursing',
      note: 'Families come to us at some of the hardest moments of their lives. Clear answers, expert care and kindness are what we owe them.',
    },
    prompts: {
      hero: `A senior nurse in an elegant navy uniform sitting with an elderly gentleman in a refined private suite with soft lamps, fresh flowers and a view of parkland. ${LOOK}`,
      life: `A calm, elegant nursing residence corridor with art on the walls, soft lighting and a nurse walking with a resident. ${LOOK}`,
      posts: [
        `A physiotherapist helping an older woman with gentle exercises in a light, refined room. ${LOOK}`,
        `An elegantly plated light lunch on a tray with linen and flowers in a private suite. ${LOOK}`,
        `A refined family suite with a sofa bed, soft furnishings and a garden view, empty. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a senior nurse with a resident in a private suite', life: 'An illustration of a nurse walking with a resident along an elegant corridor' },
  },
  {
    slug: 'premium-dementia-care',
    setting: 'dementia-care',
    name: 'The Linnet',
    style: 'Premium family. Aubergine and warm gold, gentle and refined, for specialist dementia care.',
    highlights: ['A calm, beautiful presentation of dementia care', 'Family consultations', 'Design for dementia shown'],
    palette: { primary: '#3a2e3f', soft: '#f5f1ef', ink: '#1a1519', accent: '#c29a6b' },
    provider: {
      name: 'The Linnet',
      strapline: 'Dementia care, with grace and understanding',
      town: 'Hollingford',
      county: 'Cambridgeshire',
      phone: '01223 000 000',
      intro:
        'The Linnet is a small specialist home for 24 people living with dementia, designed with light, gardens and quiet spaces, and led by an admiral nurse.',
      address: 'Mill Road, Hollingford',
    },
    nav: ['Dementia care', 'The house', 'For families', 'Our team', 'Journal', 'Enquire'],
    eyebrow: 'Specialist dementia care in Cambridgeshire',
    ctas: ['Arrange a family consultation', 'Our approach'],
    chips: ['24 residents', 'Admiral nurse led', 'Sensory gardens'],
    floatCard: { label: 'Consultations', value: 'For families', note: 'An hour with our admiral nurse' },
    audiences: [
      { label: 'Families', title: 'A family consultation', body: 'An unhurried hour with our admiral nurse, whether or not a move is needed.', cta: 'Arrange a consultation' },
      { label: 'Carers', title: 'Join our team', body: 'Specialist training and a small team with time to care well.', cta: 'Careers' },
    ],
    services: {
      title: 'Dementia care, gently given',
      items: [
        { title: 'Long term care', body: 'A settled, beautiful home with care shaped around each person.' },
        { title: 'Respite', body: 'Restful stays that give family carers time to recover.' },
        { title: 'Advanced dementia', body: 'Comfort and dignity, with nursing input.' },
        { title: 'Family support', body: 'Consultations and a named nurse for every family.' },
      ],
    },
    feature: {
      title: 'Designed for dementia',
      items: [
        { label: 'Light', title: 'Daylight throughout', body: 'Large windows and lighting that follows the day.' },
        { label: 'Gardens', title: 'Sensory gardens', body: 'Scented planting and safe paths to wander.' },
        { label: 'Quiet', title: 'Calm spaces', body: 'A music room, a library and small sitting rooms.' },
        { label: 'People', title: 'An admiral nurse', body: 'Specialist support for residents and families alike.' },
      ],
    },
    tools: [
      { title: 'Early signs checklist', body: 'A private checklist for changes in memory.' },
      { title: 'Is it time?', body: 'Questions to help families judge the right moment.' },
      { title: 'Funding dementia care', body: 'Private and NHS funding explained.' },
    ],
    posts: [
      { title: 'Music and memory in the music room', date: '18 September 2026', tag: 'Journal' },
      { title: 'What an admiral nurse does for families', date: '5 September 2026', tag: 'For families' },
      { title: 'Planting the scented garden', date: '22 August 2026', tag: 'The house' },
    ],
    finalCta: { title: 'Arrange a family consultation', body: 'An unhurried conversation with our admiral nurse, with no obligation.', primary: 'Arrange a consultation' },
    statement:
      'Dementia changes much, but never who someone is. Every part of The Linnet, from the light to the gardens to the people, is designed to honour that.',
    manager: {
      name: 'Sophie Marsh',
      role: 'Admiral Nurse',
      note: 'The families I meet are often exhausted. Before anything else, I want them to leave feeling that someone has finally listened.',
    },
    prompts: {
      hero: `An elderly woman with dementia smiling as she listens to a carer play the piano in an elegant, sunlit music room with soft furnishings. ${LOOK}`,
      life: `A refined sensory garden with scented flowers, gravel paths and an elderly man walking with a carer, golden light. ${LOOK}`,
      posts: [
        `An elderly man with headphones listening to music with eyes closed, content, in an elegant armchair. ${LOOK}`,
        `A nurse sitting with an adult daughter in a refined sitting room, a gentle conversation. ${LOOK}`,
        `Close up of lavender and roses in a beautiful garden bed, soft light. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a resident listening to piano music in a sunlit room', life: 'An illustration of a man and a carer walking in a sensory garden' },
  },
  {
    slug: 'premium-home-care',
    setting: 'home-care',
    name: 'Belmont',
    style: 'Premium family. Racing green and brass, discreet and personal, for private home care.',
    highlights: ['A private client service', 'Care manager for every client', 'Discreet consultation request'],
    palette: { primary: '#243b33', soft: '#f3f2ed', ink: '#121815', accent: '#b5925a' },
    provider: {
      name: 'Belmont Home Care',
      strapline: 'Private home care, arranged with discretion',
      town: 'Richmond',
      county: 'London',
      phone: '020 0000 0000',
      intro:
        'Belmont provides private home care across south west London, from a few hours a week to full support, with a dedicated care manager and a small, consistent team for every client.',
      address: 'Hill Rise, Richmond',
    },
    nav: ['Home care', 'Our service', 'Care managers', 'Areas', 'Journal', 'Enquire'],
    eyebrow: 'Private home care in south west London',
    ctas: ['Arrange a consultation', 'Our service'],
    chips: ['A dedicated care manager', 'Visits of an hour or more', 'Care from a small team'],
    floatCard: { label: 'Visits', value: 'One hour minimum', note: 'Never rushed, never shortened' },
    audiences: [
      { label: 'Clients and families', title: 'A private consultation', body: 'A care manager visits to understand what matters, and plans care around it.', cta: 'Arrange a consultation' },
      { label: 'Carers', title: 'Work with Belmont', body: 'Longer visits, fewer clients and pay that reflects your skill.', cta: 'Careers' },
    ],
    services: {
      title: 'Care at home, as it should be',
      items: [
        { title: 'Personal care', body: 'Unhurried help with the day, given with warmth and discretion.' },
        { title: 'Companionship', body: 'Outings, appointments and good conversation.' },
        { title: 'Household support', body: 'Meals, errands and a well run home.' },
        { title: 'Complex care', body: 'Nurse led care for more complex needs at home.' },
      ],
    },
    feature: {
      title: 'The Belmont service',
      items: [
        { label: 'Management', title: 'Your care manager', body: 'One person who knows you and answers your call.' },
        { label: 'Continuity', title: 'A small team', body: 'The same two or three carers, week after week.' },
        { label: 'Time', title: 'Longer visits', body: 'A minimum of one hour, so nothing is rushed.' },
        { label: 'Reporting', title: 'Families informed', body: 'Secure updates for families after every visit.' },
      ],
    },
    tools: [
      { title: 'Planning care at home', body: 'A guide to what is possible, and what it costs.' },
      { title: 'Areas we serve', body: 'The boroughs and towns our teams cover.' },
      { title: 'Paying privately', body: 'How private home care is arranged and invoiced.' },
    ],
    posts: [
      { title: 'Why we never offer short visits', date: '16 September 2026', tag: 'Our service' },
      { title: 'Staying independent at home for longer', date: '3 September 2026', tag: 'Advice' },
      { title: 'A morning with one of our care managers', date: '20 August 2026', tag: 'Journal' },
    ],
    finalCta: { title: 'Arrange a private consultation', body: 'A care manager will visit at a time that suits you, with no obligation.', primary: 'Arrange a consultation' },
    statement:
      'Good care at home is personal, unhurried and discreet. We keep our client list small, so that every person we care for is known properly, by name and by nature.',
    manager: {
      name: 'Charles Evering',
      role: 'Managing Director',
      note: 'We would rather care well for fewer people than stretch ourselves thin. That is the promise behind every Belmont visit.',
    },
    prompts: {
      hero: `A smartly dressed carer and an elegant elderly woman sharing coffee at a table in a refined Georgian townhouse sitting room with tall windows. ${LOOK}`,
      life: `A carer and an elderly gentleman walking arm in arm along a leafy riverside path in autumn, refined and calm. ${LOOK}`,
      posts: [
        `A carer arranging fresh flowers on a table in an elegant townhouse kitchen, morning light. ${LOOK}`,
        `An elderly man reading a newspaper in a refined study, relaxed and independent. ${LOOK}`,
        `A care manager in smart clothes greeting a client at the door of a Georgian townhouse. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a carer and a woman having coffee in an elegant sitting room', life: 'An illustration of a carer walking with a gentleman along a riverside path' },
  },
  {
    slug: 'premium-live-in-care',
    setting: 'live-in-care',
    name: 'Sterling',
    style: 'Premium family. Slate navy and gold, refined and reassuring, for private live-in care.',
    highlights: ['Carer selection presented beautifully', 'Nurse led clinical oversight', 'Private consultation request'],
    palette: { primary: '#2b2d42', soft: '#f4f2ee', ink: '#14151f', accent: '#b3935c' },
    provider: {
      name: 'Sterling Live-in Care',
      strapline: 'Remain at home, with care of the highest standard',
      town: 'Ledwyn',
      county: 'Herefordshire',
      phone: '01432 000 000',
      intro:
        'Sterling places exceptional live-in carers with private clients across Herefordshire and the Welsh Marches, supported by a nurse led clinical team.',
      address: 'Broad Street, Ledwyn',
    },
    nav: ['Live-in care', 'Our carers', 'Clinical care', 'The process', 'Journal', 'Enquire'],
    eyebrow: 'Private live-in care in Herefordshire',
    ctas: ['Arrange a consultation', 'How we select carers'],
    chips: ['Carers selected, not simply placed', 'Nurse led oversight', 'A named client manager'],
    floatCard: { label: 'Selection', value: 'Few are chosen', note: 'Every carer interviewed in person' },
    audiences: [
      { label: 'Families', title: 'A private consultation', body: 'We visit, listen and propose a carer chosen for you.', cta: 'Arrange a consultation' },
      { label: 'Carers', title: 'Join Sterling', body: 'Exceptional placements, excellent pay and real support.', cta: 'Apply' },
    ],
    services: {
      title: 'Live-in care, perfected',
      items: [
        { title: 'Live-in care', body: 'A dedicated carer at home, day and night.' },
        { title: 'Dementia at home', body: 'Continuity and calm, with specialist support.' },
        { title: 'Complex care', body: 'Nurse led care for complex and palliative needs.' },
        { title: 'Care for couples', body: 'Both partners cared for together, at home.' },
      ],
    },
    feature: {
      title: 'The Sterling process',
      items: [
        { label: 'First', title: 'Consultation', body: 'A visit to understand the person and the home.' },
        { label: 'Second', title: 'Selection', body: 'A carer proposed for character as much as skill.' },
        { label: 'Third', title: 'Introduction', body: 'A meeting before care begins.' },
        { label: 'Always', title: 'Oversight', body: 'Regular visits from our nurse led team.' },
      ],
    },
    tools: [
      { title: 'Live-in or residential?', body: 'A thoughtful comparison of both.' },
      { title: 'Preparing the home', body: 'What a live-in carer needs, and nothing more.' },
      { title: 'Private funding', body: 'How live-in care is arranged and invoiced.' },
    ],
    posts: [
      { title: 'How we select every Sterling carer', date: '15 September 2026', tag: 'Our carers' },
      { title: 'Palliative care at home', date: '2 September 2026', tag: 'Clinical care' },
      { title: 'A summer in the Marches', date: '21 August 2026', tag: 'Journal' },
    ],
    finalCta: { title: 'Arrange a private consultation', body: 'We will visit, listen and propose the right carer, with no obligation.', primary: 'Arrange a consultation' },
    statement:
      'Staying at home should never mean compromising on care. Sterling carers are chosen for their character as much as their skill, and supported by a clinical team who never step back.',
    manager: {
      name: 'Victoria Lane',
      role: 'Client Director',
      note: 'The right carer changes everything. We take our time to find them, and we stay close long after care begins.',
    },
    prompts: {
      hero: `A refined elderly man in a tweed jacket and his live-in carer looking out over rolling Herefordshire countryside from the terrace of a stone country house. ${LOOK}`,
      life: `A live-in carer preparing a beautiful lunch in an elegant country kitchen with an elderly woman sitting at the table. ${LOOK}`,
      posts: [
        `A professional woman interviewing a carer across a desk in a refined office with bookshelves. ${LOOK}`,
        `A nurse in smart clothes checking on an elderly woman resting in a beautiful bedroom at home. ${LOOK}`,
        `A country garden with a stone wall and summer flowers, an elderly couple sitting on a bench. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a man and his carer on the terrace of a country house', life: 'An illustration of a carer preparing lunch in an elegant kitchen' },
  },
  {
    slug: 'premium-supported-living',
    setting: 'supported-living',
    name: 'Aurora',
    style: 'Premium family. Deep sea blue and gold, calm and beautiful, with easy read throughout.',
    highlights: ['Beautiful homes shown with pride', 'Easy read throughout', 'A route for professionals'],
    palette: { primary: '#1f3b4d', soft: '#f2f4f3', ink: '#0f1c24', accent: '#c9a15a' },
    provider: {
      name: 'Aurora Supported Living',
      strapline: 'Beautiful homes, and the life you want',
      town: 'Alnbridge',
      county: 'Northumberland',
      phone: '01665 000 000',
      intro:
        'Aurora offers supported living for adults with learning disabilities and autism in beautifully designed homes near the Northumberland coast, with support built around each person.',
      address: 'Harbour View, Alnbridge',
    },
    nav: ['Our homes', 'Support', 'Easy read', 'Referrals', 'Journal', 'Contact'],
    eyebrow: 'Supported living in Northumberland',
    ctas: ['See our homes', 'Make a referral'],
    chips: ['Designed homes', 'Your own tenancy', 'Easy read information'],
    floatCard: { label: 'Vacancies', value: '1 apartment', note: 'A sea view apartment in Alnbridge' },
    audiences: [
      { label: 'You and your family', title: 'Come and look around', body: 'See a home, meet the team and take your time. You decide.', cta: 'Arrange a visit' },
      { label: 'Professionals', title: 'Referrals', body: 'Vacancies, our support and how to refer.', cta: 'Make a referral' },
    ],
    services: {
      title: 'Support, your way',
      items: [
        { title: 'Your home', body: 'A beautiful home that is yours, with your own tenancy.' },
        { title: 'Your day', body: 'Cooking, money and plans, with support when you want it.' },
        { title: 'Your health', body: 'Appointments and medication, with someone alongside you.' },
        { title: 'Your life', body: 'Work, learning, friends and the things you love.' },
      ],
    },
    feature: {
      title: 'How it works',
      items: [
        { label: 'Step 1', title: 'We meet', body: 'You tell us about the life you want.' },
        { label: 'Step 2', title: 'You visit', body: 'You see a home and meet the team.' },
        { label: 'Step 3', title: 'We plan', body: 'We write your plan with you, in easy words.' },
        { label: 'Step 4', title: 'You move in', body: 'Your keys, your home, your life.' },
      ],
    },
    tools: [
      { title: 'Easy read guide', body: 'Supported living in easy words and pictures.' },
      { title: 'Is it right for me?', body: 'Simple questions to think it through.' },
      { title: 'For professionals', body: 'Our service information and referral form.' },
    ],
    posts: [
      { title: 'Supported living, in easy read', date: '16 September 2026', tag: 'Easy read' },
      { title: 'Designing homes that feel calm', date: '3 September 2026', tag: 'Our homes' },
      { title: 'A day at the beach with friends', date: '20 August 2026', tag: 'Journal' },
    ],
    finalCta: { title: 'Would you like to visit?', body: 'Call us or ask for a visit. We will explain everything, in words that make sense.', primary: 'Arrange a visit' },
    statement:
      'Everyone deserves a home they are proud of. Our homes are designed to be calm, beautiful and truly yours, with support that fits around your life.',
    manager: {
      name: 'Hannah Reid',
      role: 'Service Director',
      note: 'We build every home and every plan around one question: what does a good life look like for you?',
    },
    prompts: {
      hero: `A young woman with a learning disability smiling on the balcony of a beautifully designed modern apartment with a sea view, a support worker in casual clothes beside her. ${LOOK}`,
      life: `A calm, beautifully designed shared living room with natural wood and soft colours, two young adults and a support worker relaxing. ${LOOK}`,
      posts: [
        `A support worker in casual clothes and a young man reading a simple picture guide on a sofa in a stylish flat. ${LOOK}`,
        `A beautifully designed calm bedroom with soft colours and natural light, empty. ${LOOK}`,
        `A group of young adults and support workers in casual clothes walking on a wide sandy Northumberland beach. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a young woman on a sea view balcony with a support worker', life: 'An illustration of people relaxing in a calm living room' },
  },
  {
    slug: 'premium-retirement-living',
    setting: 'retirement-living',
    name: 'The Belvedere',
    style: 'Premium family. Midnight and gold, lifestyle led and elegant, for luxury retirement living.',
    highlights: ['Full screen lifestyle photography', 'Residences and amenities explored', 'Private appointment request'],
    palette: { primary: '#1d2b35', soft: '#f6f3ee', ink: '#12181d', accent: '#bf9b5f' },
    provider: {
      name: 'The Belvedere',
      strapline: 'Coastal retirement living, beautifully done',
      town: 'St Aldhelm',
      county: 'Cornwall',
      phone: '01326 000 000',
      intro:
        'The Belvedere is 42 luxury apartments above the harbour at St Aldhelm, with a restaurant, a spa and pool, a concierge and care available whenever it is wanted.',
      address: 'Cliff Road, St Aldhelm',
    },
    nav: ['Residences', 'Lifestyle', 'Spa', 'Dining', 'Care', 'Enquire'],
    eyebrow: 'Luxury retirement living in Cornwall',
    ctas: ['Book a private appointment', 'View the residences'],
    chips: ['42 residences', 'Spa and pool', 'Concierge'],
    floatCard: { label: 'Residences', value: 'Three available', note: 'Including one penthouse' },
    audiences: [
      { label: 'Considering a move', title: 'A private appointment', body: 'Tour the residences, lunch in the restaurant and see the harbour.', cta: 'Book an appointment' },
      { label: 'Families', title: 'What families ask', body: 'Costs, care and ownership, answered openly.', cta: 'Read the guide' },
    ],
    services: {
      title: 'A life of ease',
      items: [
        { title: 'Residences', body: 'Apartments and penthouses with harbour and sea views.' },
        { title: 'Spa and pool', body: 'A pool, treatment rooms and a gym.' },
        { title: 'The restaurant', body: 'Seasonal Cornish menus, with a harbour terrace.' },
        { title: 'Care on hand', body: 'Discreet care from our own team, if ever needed.' },
      ],
    },
    feature: {
      title: 'Living at The Belvedere',
      items: [
        { label: 'Mornings', title: 'Swim and coffee', body: 'The pool opens at seven, the café at eight.' },
        { label: 'Afternoons', title: 'The harbour', body: 'A short walk to the harbour, galleries and shops.' },
        { label: 'Evenings', title: 'Dinner with a view', body: 'Harbour terrace dining through the summer.' },
        { label: 'Always', title: 'The concierge', body: 'Bookings, errands and anything you need.' },
      ],
    },
    tools: [
      { title: 'The residences', body: 'Floor plans, views and specifications.' },
      { title: 'Ownership explained', body: 'How buying works and what the service charge covers.' },
      { title: 'Care options', body: 'The care available, and how it is arranged.' },
    ],
    posts: [
      { title: 'A summer menu from the harbour terrace', date: '18 September 2026', tag: 'Dining' },
      { title: 'Inside the penthouse', date: '5 September 2026', tag: 'Residences' },
      { title: 'Regatta week from the terrace', date: '22 August 2026', tag: 'Journal' },
    ],
    finalCta: { title: 'Book a private appointment', body: 'Tour the residences and have lunch on the terrace, at a time that suits you.', primary: 'Book an appointment' },
    statement:
      'Retirement should be the most rewarding chapter of all. The Belvedere pairs the finest coastal setting with everything you need to enjoy it, and nothing you do not.',
    manager: {
      name: 'James Tremayne',
      role: 'General Manager',
      note: 'Our residents chose The Belvedere to live well. Our job is to make every day here easy, and every visit from family a pleasure.',
    },
    prompts: {
      hero: `An elegant retired couple in their seventies on the terrace of a luxury clifftop apartment overlooking a Cornish harbour at sunset, glasses in hand. ${LOOK}`,
      life: `A luxury indoor pool and spa with large windows over the sea, an older woman swimming, calm. ${LOOK}`,
      posts: [
        `A beautifully plated seafood dish on a terrace table with the sea behind, summer. ${LOOK}`,
        `A luxury penthouse living room with floor to ceiling windows over the sea, empty. ${LOOK}`,
        `Sailing boats in a Cornish harbour during a regatta seen from a terrace, sunny day. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a couple on a clifftop terrace above a harbour', life: 'An illustration of a woman swimming in a spa pool overlooking the sea' },
  },
  {
    slug: 'premium-care-group',
    setting: 'care-groups',
    name: 'Aveling',
    style: 'Premium family. Espresso and gold, a collection of luxury homes presented as one brand.',
    highlights: ['A collection of homes, one brand', 'Private viewings at any home', 'Careers across the collection'],
    palette: { primary: '#2a2522', soft: '#f5f1eb', ink: '#161311', accent: '#a88657' },
    provider: {
      name: 'The Aveling Collection',
      strapline: 'Four exceptional homes, one standard of care',
      town: 'Henley',
      county: 'the Home Counties',
      phone: '01491 000 000',
      intro:
        'The Aveling Collection brings together four luxury care homes across the Home Counties, each with its own character, and all with the same exceptional standard of care.',
      address: 'Aveling House, Henley',
    },
    nav: ['The collection', 'Care', 'Private viewings', 'Careers', 'Journal', 'Enquire'],
    eyebrow: 'Luxury care homes in the Home Counties',
    ctas: ['Explore the collection', 'Request a private viewing'],
    chips: ['Four homes', 'Residential, nursing and dementia', 'One standard'],
    floatCard: { label: 'Suites available', value: 'In 3 homes', note: 'Updated by each home weekly' },
    audiences: [
      { label: 'Families', title: 'Find your home', body: 'Explore each home and request a private viewing at any of them.', cta: 'Explore the collection' },
      { label: 'Careers', title: 'Join the collection', body: 'Exceptional homes, exceptional training and real progression.', cta: 'Careers' },
    ],
    services: {
      title: 'The collection',
      items: [
        { title: 'Quillmead, Henley', body: 'Residential and dementia care beside the river.' },
        { title: 'Ashbrand House, Beaconsfield', body: 'Nursing care in a restored manor house.' },
        { title: 'Wrenhollow, Guildford', body: 'Residential and respite care in parkland.' },
        { title: 'Evernden Lodge, Sevenoaks', body: 'Specialist dementia care with sensory gardens.' },
      ],
    },
    feature: {
      title: 'One standard, four homes',
      items: [
        { label: 'Care', title: 'Senior led', body: 'Experienced managers and clinical leads in every home.' },
        { label: 'Dining', title: 'Resident chefs', body: 'Every home with its own chef and seasonal menus.' },
        { label: 'Suites', title: 'Private suites', body: 'En suite rooms, many with terraces or gardens.' },
        { label: 'People', title: 'The Aveling academy', body: 'One training programme across the collection.' },
      ],
    },
    tools: [
      { title: 'Compare the homes', body: 'Care, suites and settings side by side.' },
      { title: 'Suites and fees', body: 'Every suite in every home, with its fee.' },
      { title: 'Funding care', body: 'Private funding and deferred payments explained.' },
    ],
    posts: [
      { title: 'Ashbrand House completes its restoration', date: '17 September 2026', tag: 'The collection' },
      { title: 'Inside the Aveling academy', date: '4 September 2026', tag: 'Careers' },
      { title: 'Summer garden parties across the collection', date: '20 August 2026', tag: 'Journal' },
    ],
    finalCta: { title: 'Find your Aveling home', body: 'Tell us what matters, and we will introduce the right home in the collection.', primary: 'Explore the collection' },
    statement:
      'Each Aveling home has its own character, its own setting and its own story. What they share is a belief that exceptional care begins with exceptional people.',
    manager: {
      name: 'Alexander Aveling',
      role: 'Chairman',
      note: 'We only ever add a home to the collection if we would be proud to care for our own parents there.',
    },
    prompts: {
      hero: `A restored red brick manor house care home with a sweeping lawn and a river in the background, residents taking tea on the terrace, summer evening. ${LOOK}`,
      life: `A refined training session with care staff in smart uniforms in an elegant panelled room. ${LOOK}`,
      posts: [
        `A restored manor house entrance hall with a sweeping staircase and fresh flowers, empty. ${LOOK}`,
        `A mentor showing a young carer how to arrange a resident's room in an elegant suite. ${LOOK}`,
        `A summer garden party on a manor house lawn with residents, families and bunting. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of residents taking tea on the terrace of a manor house', life: 'An illustration of care staff at a training session' },
  },
]
