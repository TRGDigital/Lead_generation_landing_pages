import type { ModernContent } from '@/lib/design-families/modern'

// The Traditional design family: serif type, heritage colours and photography led, rendered by
// components/designs/families/TraditionalTemplate.tsx. Same content shape as Modern, plus a
// note from the (fictional) manager. Every provider is fictional with a 000 phone number, and
// every photo is an AI generated illustration. No em or en dashes: house style.

export type TraditionalContent = ModernContent & {
  manager: { name: string; role: string; note: string }
}

const LOOK =
  'Photorealistic editorial photograph, classic and timeless, soft warm natural window light, gentle film grain, muted heritage colours, traditional English interiors or gardens, candid not posed, no text, no logos, no watermarks, respectful and dignified portrayal of older and disabled people.'

export const TRADITIONAL: TraditionalContent[] = [
  {
    slug: 'traditional-care-home',
    setting: 'care-homes',
    name: 'Ashgrove',
    style: 'Traditional family. Bottle green and cream, serif type, a country house feel with visits at its heart.',
    highlights: ['A note from the manager up front', 'Visits and rooms on every page', 'Fees set out plainly'],
    palette: { primary: '#2f4a3a', soft: '#f6f1e7', ink: '#26221c', accent: '#a8803c' },
    provider: {
      name: 'Ashgrove Manor',
      strapline: 'A country house home, with care at its heart',
      town: 'Wickham St Mary',
      county: 'Norfolk',
      phone: '01362 000 000',
      intro:
        'Ashgrove Manor is a Georgian house in four acres of gardens, home to 34 people who receive residential and respite care from a team that has, in many cases, been here for over a decade.',
      address: 'The Street, Wickham St Mary',
    },
    nav: ['The house', 'Care', 'Rooms and fees', 'Life at Ashgrove', 'Careers', 'Contact'],
    eyebrow: 'Residential and respite care in Norfolk',
    ctas: ['Arrange a visit', 'Rooms and fees'],
    chips: ['Rated Good by CQC (example)', 'Four acres of gardens', 'Respite stays welcome'],
    floatCard: { label: 'Rooms', value: 'One available', note: 'A garden room on the ground floor' },
    audiences: [
      { label: 'For families', title: 'Choosing a home', body: 'Visit whenever suits you, stay for lunch and walk the gardens. There is no pressure to decide.', cta: 'Arrange a visit' },
      { label: 'For professionals', title: 'Referrals and vacancies', body: 'Current rooms, the needs we can meet and a direct line to the registered manager.', cta: 'Contact the manager' },
    ],
    services: {
      title: 'The care we offer',
      items: [
        { title: 'Residential care', body: 'Everyday support with personal care, medication and all that makes a good day.' },
        { title: 'Respite care', body: 'A restful stay of a week or more, often after hospital or to give a carer a break.' },
        { title: 'Early memory loss', body: 'Gentle routines and a settled team for people in the early stages of dementia.' },
        { title: 'Day guests', body: 'Lunch, the garden and good company, with transport home in the afternoon.' },
      ],
    },
    feature: {
      title: 'Life at Ashgrove',
      items: [
        { label: 'The gardens', title: 'Four acres to enjoy', body: 'Walled kitchen garden, orchard and a summerhouse, all accessible.' },
        { label: 'The table', title: 'Home cooked, every day', body: 'Seasonal menus, much of it from our own garden.' },
        { label: 'The week', title: 'Something for everyone', body: 'Music, crafts, visiting animals and trips to the coast.' },
        { label: 'The people', title: 'A settled team', body: 'Many of our carers have been with us for over ten years.' },
      ],
    },
    tools: [
      { title: 'What will care cost?', body: 'An honest estimate of weekly fees before you call.' },
      { title: 'Who pays for care?', body: 'Council funding and self funding, explained simply.' },
      { title: 'Visiting checklist', body: 'What to look for and what to ask when you visit a home.' },
    ],
    posts: [
      { title: 'A year in the walled garden', date: '19 September 2026', tag: 'Life at Ashgrove' },
      { title: 'How to talk to a parent about moving into care', date: '6 September 2026', tag: 'Advice' },
      { title: 'Afternoon tea for our summer open day', date: '23 August 2026', tag: 'News' },
    ],
    finalCta: { title: 'Come and visit Ashgrove', body: 'Walk the gardens, meet the team and stay for lunch. Visits are relaxed and there is no obligation.', primary: 'Arrange a visit' },
    manager: {
      name: 'Helen Carter',
      role: 'Registered Manager',
      note: 'Every family who visits asks the same thing in the end: would they be happy here? We will always answer that honestly, even if the answer is that another home would suit better.',
    },
    prompts: {
      hero: `The front of an elegant Georgian country house used as a care home, with an older woman and a carer walking arm in arm on the gravel path through a garden, autumn afternoon. ${LOOK}`,
      life: `An older man and a care assistant picking apples in a walled kitchen garden. ${LOOK}`,
      posts: [
        `A walled garden with vegetable beds and a wooden bench in soft morning light. ${LOOK}`,
        `A middle aged woman holding her elderly mother's hand at a kitchen table, talking gently. ${LOOK}`,
        `Afternoon tea with china cups and cake served to residents on a lawn with bunting. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a resident and a carer walking outside a country house', life: 'An illustration of a man and a carer picking apples in a walled garden' },
  },
  {
    slug: 'traditional-nursing-home',
    setting: 'nursing-homes',
    name: 'Hartwell Hall',
    style: 'Traditional family. Burgundy and stone, serif type, reassuring and clinical in equal measure.',
    highlights: ['Clinical services set out clearly', 'Admissions explained step by step', 'A note from the clinical lead'],
    palette: { primary: '#6d2a35', soft: '#f7f0ec', ink: '#241a1b', accent: '#9a7b45' },
    provider: {
      name: 'Hartwell Hall Nursing Home',
      strapline: 'Skilled nursing, in a house that feels like home',
      town: 'Hartwell',
      county: 'Derbyshire',
      phone: '01629 000 000',
      intro:
        'Hartwell Hall provides nursing, dementia nursing and end of life care for 46 people, in a Victorian hall extended with care, with registered nurses on duty day and night.',
      address: 'Hall Lane, Hartwell',
    },
    nav: ['Nursing care', 'Admissions', 'The hall', 'Our team', 'Careers', 'Contact'],
    eyebrow: 'Nursing care in the Derbyshire Dales',
    ctas: ['Enquire about admission', 'Our nursing care'],
    chips: ['Rated Good by CQC (example)', 'Nurses on duty 24 hours', 'End of life care'],
    floatCard: { label: 'Admissions', value: 'Beds this week', note: 'Speak to the nurse in charge today' },
    audiences: [
      { label: 'For families', title: 'When a parent needs nursing', body: 'We explain what nursing care involves and how it is funded, before you commit to anything.', cta: 'Talk to us' },
      { label: 'For hospital teams', title: 'Referrals and CHC', body: 'Assessment within a day and a clear answer on what we can safely meet.', cta: 'Refer a patient' },
    ],
    services: {
      title: 'Nursing care at the hall',
      items: [
        { title: 'General nursing', body: 'Complex health needs, wound care and long term conditions.' },
        { title: 'Dementia nursing', body: 'For people with dementia whose health needs have grown.' },
        { title: 'End of life care', body: 'Peaceful, dignified care, with family welcome day and night.' },
        { title: 'Short stays', body: 'Nursing after a hospital stay, until it is safe to go home.' },
      ],
    },
    feature: {
      title: 'Admission, step by step',
      items: [
        { label: 'First', title: 'A conversation', body: 'Call the nurse in charge, or send the hospital referral.' },
        { label: 'Second', title: 'An assessment', body: 'A nurse visits within a day, in hospital or at home.' },
        { label: 'Third', title: 'Funding', body: 'We explain FNC, CHC and self funding, and help with forms.' },
        { label: 'Finally', title: 'A room ready', body: 'The care plan written and family welcome from the first day.' },
      ],
    },
    tools: [
      { title: 'Nursing care funding', body: 'How NHS funded nursing care and CHC work.' },
      { title: 'Care home or nursing home?', body: 'Which one is needed, in a few questions.' },
      { title: 'Fees explained', body: 'What weekly fees include, and what the NHS pays.' },
    ],
    posts: [
      { title: 'What to expect in the first week of nursing care', date: '17 September 2026', tag: 'Advice' },
      { title: 'End of life care: how we support families', date: '4 September 2026', tag: 'Our care' },
      { title: 'Our garden room restored for its 150th year', date: '20 August 2026', tag: 'The hall' },
    ],
    finalCta: { title: 'Speak to the nurse in charge', body: 'For a bed this week or advice about what comes next, call us. You will always reach a nurse.', primary: 'Enquire about admission' },
    manager: {
      name: 'David Okafor',
      role: 'Clinical Lead',
      note: 'Families often arrive after a hard week in hospital. Our first job is to explain things clearly and calmly, so they can make a decision they feel sure about.',
    },
    prompts: {
      hero: `A kind registered nurse in a burgundy tunic sitting beside an elderly woman in a high backed armchair in a traditional drawing room with tall windows. ${LOOK}`,
      life: `A nurse and an elderly man playing chess by a large bay window in a Victorian hall. ${LOOK}`,
      posts: [
        `A nurse welcoming a family into a traditional, warm reception hall with wood panelling. ${LOOK}`,
        `A daughter holding her elderly father's hand beside a bed with soft light and flowers, peaceful. ${LOOK}`,
        `A restored Victorian orangery garden room with plants and armchairs. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a nurse with a resident in a traditional drawing room', life: 'An illustration of a nurse and a resident playing chess by a window' },
  },
  {
    slug: 'traditional-dementia-care',
    setting: 'dementia-care',
    name: 'Rosemary Court',
    style: 'Traditional family. Sage and terracotta, serif type, gentle and reassuring for families new to dementia.',
    highlights: ['Life story approach explained', 'Families supported, not just residents', 'Memory friendly design shown'],
    palette: { primary: '#4d6b57', soft: '#f1f4ee', ink: '#1f2620', accent: '#b36b4a' },
    provider: {
      name: 'Rosemary Court',
      strapline: 'Dementia care, rooted in a life well lived',
      town: 'Mapleton',
      county: 'Dorset',
      phone: '01305 000 000',
      intro:
        'Rosemary Court is a home for 28 people living with dementia, arranged around a courtyard garden, where care follows each person’s own history, habits and pleasures.',
      address: 'Courtyard Lane, Mapleton',
    },
    nav: ['Dementia care', 'The court', 'For families', 'Life here', 'Careers', 'Contact'],
    eyebrow: 'Dementia care in Dorset',
    ctas: ['Speak to our dementia lead', 'Is it time for more help?'],
    chips: ['Rated Good by CQC (example)', 'A courtyard garden', 'Family support sessions'],
    floatCard: { label: 'The court', value: '28 residents', note: 'Around one courtyard garden, easy to find your way' },
    audiences: [
      { label: 'For families', title: 'Caring for someone with dementia', body: 'A conversation about what is happening and what might help, with no pressure to move.', cta: 'Speak to our dementia lead' },
      { label: 'For carers', title: 'Work in dementia care', body: 'Full training, a settled team and the time to get to know people properly.', cta: 'See our care jobs' },
    ],
    services: {
      title: 'Our dementia care',
      items: [
        { title: 'Long term care', body: 'A settled home with care shaped around each person.' },
        { title: 'Respite stays', body: 'A planned rest for family carers, with a familiar team.' },
        { title: 'Advanced dementia', body: 'Comfort, dignity and gentle care as needs grow.' },
        { title: 'Family support', body: 'Monthly sessions and a named contact for every family.' },
      ],
    },
    feature: {
      title: 'Our approach',
      items: [
        { label: 'History', title: 'A life story for everyone', body: 'We learn the work, loves and routines that shaped each person.' },
        { label: 'Rhythm', title: 'The day at their pace', body: 'Meals and rest when each person wants them, not by the clock.' },
        { label: 'Garden', title: 'Always somewhere to go', body: 'A safe courtyard, open from breakfast until dusk.' },
        { label: 'Care', title: 'Trained to understand', body: 'Every carer is dementia trained before working alone.' },
      ],
    },
    tools: [
      { title: 'Early signs checklist', body: 'A private checklist for changes in memory or mood.' },
      { title: 'Is it time for more help?', body: 'Questions that help families decide what comes next.' },
      { title: 'Paying for dementia care', body: 'Council and NHS funding, in plain words.' },
    ],
    posts: [
      { title: 'Making a life story book together', date: '18 September 2026', tag: 'Understanding dementia' },
      { title: 'Visiting someone with dementia: a gentle guide', date: '5 September 2026', tag: 'For families' },
      { title: 'Baking afternoons in the courtyard kitchen', date: '22 August 2026', tag: 'Life here' },
    ],
    finalCta: { title: 'Start with a conversation', body: 'Our dementia lead will listen, explain and help you think it through. There is no obligation.', primary: 'Speak to our dementia lead' },
    manager: {
      name: 'Anna Price',
      role: 'Dementia Lead',
      note: 'We never start with the diagnosis. We start with the person: what they did, what they loved, and what still makes them smile.',
    },
    prompts: {
      hero: `An elderly man with dementia smiling as he looks at old family photographs with a young female carer in a cosy traditional sitting room with a fireplace. ${LOOK}`,
      life: `Two older women sitting on a bench in a sheltered courtyard garden with lavender and roses, a carer nearby. ${LOOK}`,
      posts: [
        `Hands turning the pages of a handmade scrapbook of old photographs on a wooden table. ${LOOK}`,
        `A daughter sitting with her elderly mother by a window, holding hands, calm. ${LOOK}`,
        `Older residents rolling pastry at a farmhouse kitchen table with a smiling carer. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a resident and a carer looking at family photographs', life: 'An illustration of two residents on a bench in a courtyard garden' },
  },
  {
    slug: 'traditional-home-care',
    setting: 'home-care',
    name: 'Heritage',
    style: 'Traditional family. Navy and brass, serif type, a trusted local service with a long history.',
    highlights: ['Local and long established', 'Care assessment request built in', 'Careers section for carers'],
    palette: { primary: '#273e5c', soft: '#f1f3f6', ink: '#1b2330', accent: '#a9803f' },
    provider: {
      name: 'Heritage Home Care',
      strapline: 'Trusted care at home, for over twenty years',
      town: 'Oakhurst',
      county: 'Shropshire',
      phone: '01743 000 000',
      intro:
        'Heritage has provided home care across mid Shropshire since 2004, with carers who live locally and visit the same people week after week.',
      address: 'Market Square, Oakhurst',
    },
    nav: ['Home care', 'Where we visit', 'Our carers', 'Careers', 'Advice', 'Contact'],
    eyebrow: 'Home care in Shropshire',
    ctas: ['Request a care assessment', 'Where we visit'],
    chips: ['Rated Good by CQC (example)', 'Local since 2004', 'The same carers each week'],
    floatCard: { label: 'Our carers', value: 'Local', note: 'Most live within ten miles of the people they visit' },
    audiences: [
      { label: 'For families', title: 'Care for someone at home', body: 'We visit, listen and plan care around their day. Care can often begin within the week.', cta: 'Request an assessment' },
      { label: 'For carers', title: 'Join a local team', body: 'Paid travel time and mileage, regular rounds and people you get to know.', cta: 'See our vacancies' },
    ],
    services: {
      title: 'Care at home',
      items: [
        { title: 'Personal care', body: 'Washing, dressing and help getting up or to bed.' },
        { title: 'Medication', body: 'Reminders or support, recorded at each visit.' },
        { title: 'Meals and household', body: 'Cooking, shopping and keeping the house in order.' },
        { title: 'Company', body: 'A chat, a walk or help getting to appointments.' },
      ],
    },
    feature: {
      title: 'How care begins',
      items: [
        { label: 'First', title: 'We visit you', body: 'A free assessment at home, at a time that suits.' },
        { label: 'Second', title: 'We plan together', body: 'Visit times and tasks agreed with you and your family.' },
        { label: 'Third', title: 'We introduce your carers', body: 'You meet the small team who will visit.' },
        { label: 'Always', title: 'We keep in touch', body: 'Regular reviews, and a local office you can call or visit.' },
      ],
    },
    tools: [
      { title: 'How much care is needed?', body: 'Plan a week of visits and see the hours.' },
      { title: 'Attendance Allowance', body: 'Check eligibility for a benefit many miss.' },
      { title: 'Home care costs', body: 'Hourly rates and council support explained.' },
    ],
    posts: [
      { title: 'Twenty years of care in Oakhurst', date: '16 September 2026', tag: 'News' },
      { title: 'Staying safe at home through the winter', date: '3 September 2026', tag: 'Advice' },
      { title: 'Meet Margaret, a Heritage carer since 2006', date: '19 August 2026', tag: 'Our carers' },
    ],
    finalCta: { title: 'Care at home, arranged properly', body: 'Our care assessment is free and there is no obligation. We will visit at a time that suits you.', primary: 'Request a care assessment' },
    manager: {
      name: 'Robert Hughes',
      role: 'Registered Manager',
      note: 'People let us into their homes and their lives. We have never taken that lightly, and after twenty years we still visit every new client ourselves first.',
    },
    prompts: {
      hero: `A mature female home carer in a navy tunic chatting with an elderly man in his traditional cottage living room with a fireplace and bookshelves. ${LOOK}`,
      life: `A home carer walking with an elderly woman along a country lane beside a hedgerow, autumn. ${LOOK}`,
      posts: [
        `A traditional English market square with a small care agency office front, no readable signage. ${LOOK}`,
        `An elderly woman in a cardigan by a window with a warm blanket and a cup of tea, winter. ${LOOK}`,
        `A smiling home carer in her sixties standing at the door of a stone cottage. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a home carer talking with a man in his cottage', life: 'An illustration of a carer walking with a woman along a country lane' },
  },
  {
    slug: 'traditional-live-in-care',
    setting: 'live-in-care',
    name: 'Willowmere',
    style: 'Traditional family. Deep teal and gold, serif type, a personal service for staying in a much loved home.',
    highlights: ['Carer matching explained', 'Compared honestly with care homes', 'A named care manager for every client'],
    palette: { primary: '#24514f', soft: '#eef4f2', ink: '#1a2524', accent: '#b8843a' },
    provider: {
      name: 'Willowmere Live-in Care',
      strapline: 'Remain at home, among everything you love',
      town: 'Ashleigh Vale',
      county: 'Hampshire',
      phone: '01962 000 000',
      intro:
        'Willowmere places carefully chosen live-in carers with people across Hampshire, so they can stay at home with their garden, their pets and their routines, and support whenever it is needed.',
      address: 'The Old School House, Ashleigh Vale',
    },
    nav: ['Live-in care', 'Our carers', 'Costs', 'Careers', 'Advice', 'Contact'],
    eyebrow: 'Live-in care in Hampshire',
    ctas: ['Speak to a care adviser', 'Live-in or a care home?'],
    chips: ['Rated Good by CQC (example)', 'Carers matched with care', 'A named care manager'],
    floatCard: { label: 'Your carer', value: 'Chosen with you', note: 'You meet them before care begins' },
    audiences: [
      { label: 'For families', title: 'Staying at home', body: 'An adviser will explain how live-in care works and whether it is the right choice.', cta: 'Speak to an adviser' },
      { label: 'For carers', title: 'Live-in care work', body: 'Placements that suit you, full training and a care manager behind you.', cta: 'Apply as a live-in carer' },
    ],
    services: {
      title: 'Live-in care',
      items: [
        { title: 'Full time care', body: 'Support day and night, with breaks and holidays covered.' },
        { title: 'Dementia at home', body: 'One familiar face and the comfort of home.' },
        { title: 'Care for couples', body: 'Two people supported together in their own home.' },
        { title: 'Home from hospital', body: 'A carer in place quickly, so discharge is not delayed.' },
      ],
    },
    feature: {
      title: 'How we choose your carer',
      items: [
        { label: 'First', title: 'We visit', body: 'We get to know the person, the home and the routine.' },
        { label: 'Second', title: 'We shortlist', body: 'Carers chosen for character and experience, not just availability.' },
        { label: 'Third', title: 'You meet', body: 'An introduction before care begins, and your say throughout.' },
        { label: 'Always', title: 'We support', body: 'A named care manager who visits regularly.' },
      ],
    },
    tools: [
      { title: 'Live-in or care home?', body: 'The cost and the daily life of each, compared.' },
      { title: 'Is the home ready?', body: 'What a live-in carer needs: a room and a few basics.' },
      { title: 'Funding live-in care', body: 'Council support and private funding explained.' },
    ],
    posts: [
      { title: 'Why so many families choose to stay at home', date: '15 September 2026', tag: 'Choosing care' },
      { title: 'Preparing a room for a live-in carer', date: '2 September 2026', tag: 'Advice' },
      { title: 'Meet Tom, one of our live-in carers', date: '21 August 2026', tag: 'Our carers' },
    ],
    finalCta: { title: 'Talk to a care adviser', body: 'We will explain everything, answer every question and never pressure you to decide.', primary: 'Speak to a care adviser' },
    manager: {
      name: 'Catherine Moss',
      role: 'Care Director',
      note: 'The right match matters more than anything. We would rather take an extra week to find the right carer than place the wrong one tomorrow.',
    },
    prompts: {
      hero: `An elderly woman and her live-in carer arranging flowers together at a kitchen table in a traditional farmhouse kitchen with an Aga. ${LOOK}`,
      life: `An elderly man with a walking stick and his live-in carer sitting on a garden bench with a spaniel, English cottage garden. ${LOOK}`,
      posts: [
        `An elderly couple reading in armchairs in their own traditional sitting room, peaceful afternoon. ${LOOK}`,
        `A neatly made guest bedroom with fresh flowers and a window over a garden, ready for a carer. ${LOOK}`,
        `A smiling young male live-in carer in a hallway of a traditional house. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a woman and her carer arranging flowers in a farmhouse kitchen', life: 'An illustration of a man and his carer on a garden bench with a dog' },
  },
  {
    slug: 'traditional-supported-living',
    setting: 'supported-living',
    name: 'Meadowbank',
    style: 'Traditional family. Heather and gold, serif headings with easy read text, warm and welcoming.',
    highlights: ['Easy read throughout', 'Homes and vacancies set out clearly', 'A referral route for professionals'],
    palette: { primary: '#5b4a7a', soft: '#f3f0f7', ink: '#221d2b', accent: '#b88a33' },
    provider: {
      name: 'Meadowbank Supported Living',
      strapline: 'A home of your own, with people who care',
      town: 'Kirkby Fell',
      county: 'Cumbria',
      phone: '01539 000 000',
      intro:
        'Meadowbank supports adults with a learning disability or autism to live in their own homes in and around Kirkby Fell, with support planned around the life each person wants.',
      address: 'Fell Road, Kirkby Fell',
    },
    nav: ['About us', 'Our homes', 'Easy read', 'Referrals', 'Jobs', 'Contact'],
    eyebrow: 'Supported living in Cumbria',
    ctas: ['Ask about a home', 'Make a referral'],
    chips: ['Rated Good by CQC (example)', 'Your own tenancy', 'Easy read information'],
    floatCard: { label: 'Vacancies', value: '1 room', note: 'In a shared house with two others' },
    audiences: [
      { label: 'For you and your family', title: 'Living in your own home', body: 'Come and see a home, meet the team and ask us anything.', cta: 'Arrange a visit' },
      { label: 'For professionals', title: 'Social workers and commissioners', body: 'Vacancies, the support we offer and how to refer.', cta: 'Make a referral' },
    ],
    services: {
      title: 'Support we give',
      items: [
        { title: 'Home and money', body: 'Cooking, cleaning, bills and shopping, at your pace.' },
        { title: 'Health', body: 'Appointments and medication, with support if you want it.' },
        { title: 'Days out and work', body: 'Courses, clubs, volunteering and jobs.' },
        { title: 'Family and friends', body: 'Keeping in touch with the people who matter.' },
      ],
    },
    feature: {
      title: 'How it works',
      items: [
        { label: 'Step 1', title: 'We meet', body: 'You tell us about the life you want.' },
        { label: 'Step 2', title: 'You visit', body: 'You see the home and meet the team.' },
        { label: 'Step 3', title: 'We plan', body: 'We write your support plan with you, in easy words.' },
        { label: 'Step 4', title: 'You move in', body: 'Your own keys and your own tenancy.' },
      ],
    },
    tools: [
      { title: 'Easy read guide', body: 'Supported living explained in easy words and pictures.' },
      { title: 'Is it right for me?', body: 'Simple questions to think it through.' },
      { title: 'For professionals', body: 'Our service information and referral form.' },
    ],
    posts: [
      { title: 'Supported living explained, in easy read', date: '16 September 2026', tag: 'Easy read' },
      { title: 'Callum’s walking group reaches the top', date: '3 September 2026', tag: 'Stories' },
      { title: 'Our summer barbecue by the lake', date: '21 August 2026', tag: 'Community' },
    ],
    finalCta: { title: 'Would you like to find out more?', body: 'Call us or ask for a visit. We will explain everything, in words that make sense.', primary: 'Arrange a visit' },
    manager: {
      name: 'Joanne Bell',
      role: 'Service Manager',
      note: 'Everyone we support has their own ideas about a good life. Our job is to help make them happen, not to decide for them.',
    },
    prompts: {
      hero: `A young woman with a learning disability smiling in the doorway of her own stone terraced house in a Cumbrian village, a support worker beside her. ${LOOK}`,
      life: `A small group of adults with learning disabilities and a support worker on a walk by a lake with fells behind. ${LOOK}`,
      posts: [
        `A support worker and a young man looking at a simple picture booklet together at a kitchen table. ${LOOK}`,
        `A group of young adults with walking poles celebrating at the top of a grassy hill. ${LOOK}`,
        `A relaxed summer barbecue by a lake with young adults and support workers. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a young woman at the door of her own home with a support worker', life: 'An illustration of a group walking by a lake' },
  },
  {
    slug: 'traditional-retirement-living',
    setting: 'retirement-living',
    name: 'The Chantry',
    style: 'Traditional family. Charcoal and antique gold, serif type, elegant and understated.',
    highlights: ['Apartments and cottages to explore', 'Brochure request built in', 'Care available, never imposed'],
    palette: { primary: '#2e2f33', soft: '#f5f2ec', ink: '#1e1e21', accent: '#a8894f' },
    provider: {
      name: 'The Chantry',
      strapline: 'Retirement living, with a sense of place',
      town: 'Ashbury Down',
      county: 'East Sussex',
      phone: '01273 000 000',
      intro:
        'The Chantry is 38 apartments and cottages around a restored Victorian chapel and gardens, for people over 60 who want independence, company and peace of mind.',
      address: 'Chapel Walk, Ashbury Down',
    },
    nav: ['Homes', 'Living here', 'The chapel', 'Care', 'Buying', 'Contact'],
    eyebrow: 'Retirement living in East Sussex',
    ctas: ['Book a private viewing', 'Request a brochure'],
    chips: ['Apartments and cottages', 'Restored chapel and gardens', 'Care available if needed'],
    floatCard: { label: 'Available', value: '2 cottages', note: 'Two bedrooms, with a private garden' },
    audiences: [
      { label: 'Considering a move?', title: 'See it for yourself', body: 'A private viewing, lunch in the chapel café and time in the gardens.', cta: 'Book a viewing' },
      { label: 'Helping a parent?', title: 'What families ask', body: 'Costs, care, service charges and what happens if needs change.', cta: 'Read the family guide' },
    ],
    services: {
      title: 'Living at The Chantry',
      items: [
        { title: 'Your own home', body: 'An apartment or cottage, yours to furnish as you wish.' },
        { title: 'The chapel', body: 'Concerts, talks and the café in a beautifully restored chapel.' },
        { title: 'The gardens', body: 'Two acres, with a croquet lawn and raised beds for residents.' },
        { title: 'Care if needed', body: 'An on site team, available when and if you need them.' },
      ],
    },
    feature: {
      title: 'At the chapel this month',
      items: [
        { label: 'Tuesdays', title: 'Lunchtime concerts', body: 'Local musicians, and coffee afterwards.' },
        { label: 'Thursdays', title: 'History society', body: 'This month: the story of the chapel itself.' },
        { label: 'Saturdays', title: 'Garden mornings', body: 'Pruning, planting and a well earned tea.' },
        { label: 'Sundays', title: 'Open viewings', body: 'Show homes open 11 until 3.' },
      ],
    },
    tools: [
      { title: 'Find your home', body: 'Apartments and cottages, with floor plans.' },
      { title: 'Buying or renting?', body: 'How each works and what the service charge covers.' },
      { title: 'Planning a move', body: 'A calm checklist for leaving a family home.' },
    ],
    posts: [
      { title: 'Choosing what to bring from a family home', date: '19 September 2026', tag: 'Moving' },
      { title: 'Understanding service charges', date: '6 September 2026', tag: 'Buying' },
      { title: 'The chapel restoration, one year on', date: '23 August 2026', tag: 'Community' },
    ],
    finalCta: { title: 'Visit The Chantry', body: 'Book a private viewing, or come to an open Sunday. Lunch in the chapel café is on us.', primary: 'Book a private viewing' },
    manager: {
      name: 'Julian Reeve',
      role: 'Estate Manager',
      note: 'People come here to live well, not to be looked after. Care is here if it is ever needed, but it is never the first thing you notice.',
    },
    prompts: {
      hero: `An elegant retired couple in their seventies walking through a formal garden beside a restored Victorian stone chapel converted to a community space. ${LOOK}`,
      life: `Older residents enjoying coffee after a small chamber concert inside a restored chapel with tall arched windows. ${LOOK}`,
      posts: [
        `A woman in her seventies wrapping china in paper beside moving boxes in a traditional living room. ${LOOK}`,
        `A retired man reading papers at a writing desk in a classic, elegant apartment. ${LOOK}`,
        `The restored interior of a small Victorian chapel with stone arches and warm light, empty. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a couple walking in the gardens beside a restored chapel', life: 'An illustration of residents having coffee inside the chapel' },
  },
  {
    slug: 'traditional-care-group',
    setting: 'care-groups',
    name: 'Fairhaven',
    style: 'Traditional family. Oxblood and green, serif type, a family owned group with a long history.',
    highlights: ['Every home with its own page', 'Find a home by town', 'Group careers and training'],
    palette: { primary: '#5a3b2e', soft: '#f6f0ea', ink: '#231b16', accent: '#3f6b5c' },
    provider: {
      name: 'Fairhaven Care Homes',
      strapline: 'A family owned group, four homes across Lincolnshire',
      town: 'Lincoln',
      county: 'Lincolnshire',
      phone: '01522 000 000',
      intro:
        'Fairhaven has been family owned since 1987. Our four homes across Lincolnshire offer residential, nursing and dementia care, each with its own character and the same family values.',
      address: 'Minster Yard, Lincoln',
    },
    nav: ['Our homes', 'Care', 'Find a home', 'Careers', 'News', 'Contact'],
    eyebrow: 'Family owned care homes in Lincolnshire',
    ctas: ['Find a Fairhaven home', 'Careers with Fairhaven'],
    chips: ['Family owned since 1987', 'Four homes', 'Residential, nursing and dementia'],
    floatCard: { label: 'Rooms available', value: 'In 2 homes', note: 'Updated by each home every week' },
    audiences: [
      { label: 'For families', title: 'Find the right home', body: 'Compare our homes, see which have rooms and arrange a visit.', cta: 'Find a home' },
      { label: 'For your career', title: 'Grow with a family business', body: 'Training, progression and a group that knows your name.', cta: 'See our vacancies' },
    ],
    services: {
      title: 'Our homes',
      items: [
        { title: 'Kestrel House, Lincoln', body: 'Residential and dementia care for 36 people.' },
        { title: 'Wrenfield, Sleaford', body: 'Nursing and residential care for 44 people.' },
        { title: 'Larkspur Lodge, Louth', body: 'Residential and respite care for 30 people.' },
        { title: 'Otterbrook, Grantham', body: 'Dementia nursing for 40 people.' },
      ],
    },
    feature: {
      title: 'Family values in every home',
      items: [
        { label: 'Ownership', title: 'Still family owned', body: 'The founding family still visits every home each month.' },
        { label: 'People', title: 'Trained together', body: 'One training programme, and a path from carer to manager.' },
        { label: 'Food', title: 'Cooked in each home', body: 'Menus planned with residents in every kitchen.' },
        { label: 'Welcome', title: 'Open visiting', body: 'Families welcome at any reasonable hour, in every home.' },
      ],
    },
    tools: [
      { title: 'Find a home', body: 'Search our homes by town and type of care.' },
      { title: 'Compare our homes', body: 'Care, rooms and facilities side by side.' },
      { title: 'Who pays for care?', body: 'Council, NHS and private funding explained.' },
    ],
    posts: [
      { title: 'Wrenfield welcomes its new manager', date: '17 September 2026', tag: 'News' },
      { title: 'From carer to manager: Sarah’s story', date: '4 September 2026', tag: 'Careers' },
      { title: 'Summer fetes across the group', date: '20 August 2026', tag: 'Life in our homes' },
    ],
    finalCta: { title: 'Find the right Fairhaven home', body: 'Tell us where and what kind of care, and we will point you to the right home today.', primary: 'Find a home' },
    manager: {
      name: 'Margaret Fairley',
      role: 'Managing Director',
      note: 'My parents opened our first home in 1987. We have grown, but we have never stopped being a family business, and families can always reach us directly.',
    },
    prompts: {
      hero: `A traditional red brick Victorian house converted into a care home, with a well kept front garden and a resident sitting on a bench with a carer, Lincolnshire, summer. ${LOOK}`,
      life: `A group of care home staff in smart uniforms smiling together in a traditional panelled training room. ${LOOK}`,
      posts: [
        `A smiling care home manager in a smart blouse standing in the entrance hall of a traditional care home. ${LOOK}`,
        `A young female care assistant being mentored by an older colleague in a care home corridor. ${LOOK}`,
        `A summer fete on the lawn of a traditional care home with bunting, cake stalls and residents. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a Victorian house care home with a resident and carer in the garden', life: 'An illustration of care home staff smiling together' },
  },
]
