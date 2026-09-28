import type { ModernContent } from '@/lib/design-families/modern'

// The Clinical design family: crisp, trust first and fact led, rendered by
// components/designs/families/ClinicalTemplate.tsx. Same content shape as Modern, plus four
// key figures and three short questions. Every provider is fictional with a 000 phone number,
// every figure is an example, and every photo is an AI generated illustration. No em or en
// dashes: house style.

export type ClinicalContent = ModernContent & {
  facts: { value: string; label: string }[]
  faqs: [question: string, answer: string][]
}

const LOOK =
  'Photorealistic editorial photograph, clean bright daylight, crisp and calm, modern healthcare setting that still feels warm and human, white, blue and soft teal tones, candid not posed, no text, no logos, no watermarks, respectful and dignified portrayal of older and disabled people.'

export const CLINICAL: ClinicalContent[] = [
  {
    slug: 'clinical-care-home',
    setting: 'care-homes',
    name: 'Parkview',
    style: 'Clinical family. Petrol blue and teal, fact led, built for families who want the detail first.',
    highlights: ['Key facts at a glance', 'Care and fees set out like a table', 'Questions answered on the homepage'],
    palette: { primary: '#0b5c7a', soft: '#eef6f9', ink: '#0d1b22', accent: '#15a39a' },
    provider: {
      name: 'Parkview House',
      strapline: 'Residential care, clearly explained',
      town: 'Kenley Cross',
      county: 'Warwickshire',
      phone: '01926 000 000',
      intro:
        'Parkview House is a purpose built home for 44 people needing residential or respite care, with every room en suite, a senior carer on each floor and a clear plan for every resident.',
      address: 'Station Road, Kenley Cross',
    },
    nav: ['Care', 'Rooms', 'Fees', 'Our team', 'Careers', 'Contact'],
    eyebrow: 'Residential care in Warwickshire',
    ctas: ['Book a visit', 'Download the fee guide'],
    chips: ['Every room en suite', 'Senior carer on every floor', 'Care plans reviewed monthly'],
    floatCard: { label: 'Availability', value: '3 rooms', note: 'Updated every Monday' },
    audiences: [
      { label: 'For families', title: 'Choosing residential care', body: 'Fees, what they include and what happens next, set out before you visit.', cta: 'Book a visit' },
      { label: 'For professionals', title: 'Placements and referrals', body: 'Vacancies, the needs we meet and a same day response.', cta: 'Make a referral' },
    ],
    services: {
      title: 'Care at Parkview',
      items: [
        { title: 'Residential care', body: 'Personal care, medication and daily support, in an en suite room.' },
        { title: 'Respite care', body: 'Stays from one week, including after a hospital admission.' },
        { title: 'Early stage dementia', body: 'A calm floor with consistent staff and clear routines.' },
        { title: 'Day care', body: 'Lunch and activities on weekdays, 10 until 4.' },
      ],
    },
    feature: {
      title: 'From enquiry to moving in',
      items: [
        { label: '1', title: 'Enquiry', body: 'Call or send the form. We reply the same day.' },
        { label: '2', title: 'Visit', body: 'See the home, the room and the team.' },
        { label: '3', title: 'Assessment', body: 'A senior carer assesses needs, usually within three days.' },
        { label: '4', title: 'Moving in', body: 'A written care plan ready on the first day.' },
      ],
    },
    tools: [
      { title: 'Fee calculator', body: 'Weekly fees for each room type, and what they include.' },
      { title: 'Funding checker', body: 'Whether the council may contribute, in five questions.' },
      { title: 'Visit checklist', body: 'What to ask on any care home visit.' },
    ],
    posts: [
      { title: 'What our weekly fee includes, line by line', date: '18 September 2026', tag: 'Fees' },
      { title: 'How we write and review a care plan', date: '5 September 2026', tag: 'Our care' },
      { title: 'New sensory garden opens', date: '22 August 2026', tag: 'News' },
    ],
    finalCta: { title: 'Speak to the home today', body: 'Questions about rooms, fees or care? Call and speak to a senior carer.', primary: 'Book a visit' },
    facts: [
      { value: '44', label: 'en suite rooms' },
      { value: 'Good', label: 'CQC rating (example)' },
      { value: '3 days', label: 'typical time to assess' },
      { value: '1 : 5', label: 'daytime carers to residents' },
    ],
    faqs: [
      ['What does the weekly fee include?', 'Room, meals, laundry, activities and all personal care. Hairdressing and chiropody are extra.'],
      ['Can we visit at any time?', 'Yes. There are no set visiting hours, and families can join for meals.'],
      ['What happens if needs increase?', 'We review the care plan and explain the options, including nursing care if it is needed.'],
    ],
    prompts: {
      hero: `A senior care assistant in a crisp white and blue uniform helping an elderly woman with a tablet in a bright, modern, spotless care home lounge. ${LOOK}`,
      life: `A bright modern en suite care home bedroom with a large window, armchair and personal photos, empty. ${LOOK}`,
      posts: [
        `A care home manager explaining a document to an adult son at a desk in a bright office. ${LOOK}`,
        `A senior carer and an elderly man reviewing a care plan together on a tablet. ${LOOK}`,
        `A modern sensory garden at a care home with raised beds and a paved accessible path. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a care assistant helping a resident with a tablet', life: 'An illustration of a bright en suite bedroom' },
  },
  {
    slug: 'clinical-nursing-home',
    setting: 'nursing-homes',
    name: 'Northgate',
    style: 'Clinical family. Navy with a red admissions line, fact led, built for urgent placements.',
    highlights: ['A 24 hour admissions line up front', 'Clinical capabilities listed clearly', 'Hospital discharge route'],
    palette: { primary: '#123e7c', soft: '#eef3fb', ink: '#0b1629', accent: '#d9463a' },
    provider: {
      name: 'Northgate Nursing Centre',
      strapline: 'Nursing care, admissions within 24 hours',
      town: 'Hollins Park',
      county: 'Tyne and Wear',
      phone: '0191 000 0000',
      intro:
        'Northgate Nursing Centre cares for 60 people with complex nursing needs, including dementia nursing, end of life care and step down beds for local hospitals, with nurses on every floor day and night.',
      address: 'Northgate Road, Hollins Park',
    },
    nav: ['Nursing care', 'Admissions', 'Clinical team', 'For hospitals', 'Careers', 'Contact'],
    eyebrow: 'Nursing care in Tyne and Wear',
    ctas: ['Call admissions', 'Refer a patient'],
    chips: ['Nurses on every floor', 'Step down beds', 'Assessment within 24 hours'],
    floatCard: { label: 'Admissions line', value: 'Open 24 hours', note: 'Answered by the nurse in charge' },
    audiences: [
      { label: 'For families', title: 'A relative needs nursing care', body: 'Plain answers on beds, clinical care and NHS funding, today.', cta: 'Call admissions' },
      { label: 'For hospital teams', title: 'Discharge referrals', body: 'Send the referral. We assess within 24 hours, often the same day.', cta: 'Refer a patient' },
    ],
    services: {
      title: 'Clinical capabilities',
      items: [
        { title: 'Complex nursing', body: 'PEG feeding, catheter care, wound care and diabetes management.' },
        { title: 'Dementia nursing', body: 'A dedicated floor for dementia with nursing needs.' },
        { title: 'End of life', body: 'Syringe driver management and family rooms for overnight stays.' },
        { title: 'Step down', body: 'Short term beds with physiotherapy input after hospital.' },
      ],
    },
    feature: {
      title: 'Admission in four steps',
      items: [
        { label: '1', title: 'Referral', body: 'By phone, email or the online referral form.' },
        { label: '2', title: 'Assessment', body: 'A nurse assesses within 24 hours.' },
        { label: '3', title: 'Funding', body: 'FNC, CHC or self funding, confirmed with you.' },
        { label: '4', title: 'Admission', body: 'Often within 48 hours of referral.' },
      ],
    },
    tools: [
      { title: 'CHC and FNC explained', body: 'Who pays for nursing care, and how to apply.' },
      { title: 'Referral form', body: 'For hospital and community teams.' },
      { title: 'Weekly fees', body: 'Fees for each type of care, and the NHS contribution.' },
    ],
    posts: [
      { title: 'How step down care speeds up hospital discharge', date: '17 September 2026', tag: 'For hospitals' },
      { title: 'NHS funded nursing care: a plain guide', date: '4 September 2026', tag: 'Funding' },
      { title: 'Meet our clinical nurse manager', date: '21 August 2026', tag: 'Our team' },
    ],
    finalCta: { title: 'Need a nursing bed?', body: 'The admissions line is answered by the nurse in charge, day and night.', primary: 'Call admissions' },
    facts: [
      { value: '60', label: 'nursing beds' },
      { value: '24 hrs', label: 'to assessment' },
      { value: '48 hrs', label: 'typical referral to admission' },
      { value: '4', label: 'step down beds' },
    ],
    faqs: [
      ['Do you accept CHC funded residents?', 'Yes, and we work with the local integrated care board on assessments.'],
      ['How quickly can someone be admitted?', 'Often within 48 hours of the referral, once funding is confirmed.'],
      ['Can families stay overnight?', 'Yes. We have two family rooms for end of life care.'],
    ],
    prompts: {
      hero: `A registered nurse in a navy uniform checking an elderly patient's blood pressure in a bright, modern nursing home room, reassuring expression. ${LOOK}`,
      life: `Two nurses in navy uniforms talking at a clean, modern nurses station with good light. ${LOOK}`,
      posts: [
        `A physiotherapist helping an elderly man walk with a frame along a bright corridor. ${LOOK}`,
        `A nurse explaining paperwork to an adult daughter in a quiet family room. ${LOOK}`,
        `A confident male clinical nurse manager in a navy uniform in a bright corridor. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a nurse checking a patient', life: 'An illustration of two nurses at a nurses station' },
  },
  {
    slug: 'clinical-dementia-care',
    setting: 'dementia-care',
    name: 'Clearview',
    style: 'Clinical family. Teal and amber, calm and structured, built to explain dementia care clearly.',
    highlights: ['Stages of dementia care explained', 'Specialist training set out', 'Family questions answered'],
    palette: { primary: '#2c5d63', soft: '#edf5f5', ink: '#10211f', accent: '#d98e2b' },
    provider: {
      name: 'Clearview Memory Care',
      strapline: 'Specialist dementia care, clearly planned',
      town: 'Brampton Heath',
      county: 'Essex',
      phone: '01245 000 000',
      intro:
        'Clearview is a specialist dementia home for 36 people, designed around dementia friendly principles and staffed by a team trained to a recognised dementia standard.',
      address: 'Heath Lane, Brampton Heath',
    },
    nav: ['Dementia care', 'Our approach', 'For families', 'Our team', 'Careers', 'Contact'],
    eyebrow: 'Specialist dementia care in Essex',
    ctas: ['Speak to our dementia nurse', 'Our approach'],
    chips: ['Dementia friendly design', 'Specialist trained team', 'Family support sessions'],
    floatCard: { label: 'Dementia nurse', value: 'On site daily', note: 'Leads every care plan' },
    audiences: [
      { label: 'For families', title: 'Understanding the options', body: 'A clear explanation of dementia care and whether it is the right time.', cta: 'Speak to our dementia nurse' },
      { label: 'For carers', title: 'Specialise in dementia', body: 'Accredited training and a career path in dementia care.', cta: 'See our care jobs' },
    ],
    services: {
      title: 'Dementia care at Clearview',
      items: [
        { title: 'Early and middle stages', body: 'Structured days, meaningful activity and independence kept.' },
        { title: 'Later stages', body: 'Comfort, nutrition and skin care, with nursing input.' },
        { title: 'Respite', body: 'Planned stays that give family carers a proper break.' },
        { title: 'Family support', body: 'Monthly sessions and a named key worker.' },
      ],
    },
    feature: {
      title: 'How we plan care',
      items: [
        { label: '1', title: 'Life history', body: 'Background, habits and preferences recorded.' },
        { label: '2', title: 'Assessment', body: 'Cognition, mobility and wellbeing assessed.' },
        { label: '3', title: 'Care plan', body: 'Written with the family, reviewed monthly.' },
        { label: '4', title: 'Review', body: 'Changes shared with families as they happen.' },
      ],
    },
    tools: [
      { title: 'Early signs checklist', body: 'A private checklist for changes in memory.' },
      { title: 'Stages of dementia', body: 'What changes, and what support helps at each stage.' },
      { title: 'Funding dementia care', body: 'Council, NHS and private funding explained.' },
    ],
    posts: [
      { title: 'The stages of dementia, explained simply', date: '16 September 2026', tag: 'Understanding dementia' },
      { title: 'Why dementia friendly design matters', date: '3 September 2026', tag: 'Our approach' },
      { title: 'Our team completes advanced dementia training', date: '20 August 2026', tag: 'News' },
    ],
    finalCta: { title: 'Talk to our dementia nurse', body: 'A clear conversation about what is happening and what could help, with no obligation.', primary: 'Speak to our dementia nurse' },
    facts: [
      { value: '36', label: 'residents' },
      { value: '100%', label: 'staff dementia trained' },
      { value: 'Monthly', label: 'care plan reviews' },
      { value: '1', label: 'named key worker each' },
    ],
    faqs: [
      ['When is the right time for dementia care?', 'Usually when safety at home or a carer’s health becomes a concern. We can help you judge it.'],
      ['Can residents walk freely?', 'Yes. Corridors loop and gardens are secure, so walking is safe.'],
      ['How do you keep families informed?', 'A named key worker updates you after every review, and whenever something changes.'],
    ],
    prompts: {
      hero: `A dementia nurse in a teal uniform sitting with an elderly woman doing a colourful memory puzzle at a table in a calm, bright, modern lounge. ${LOOK}`,
      life: `A bright looping corridor in a modern dementia care home with clear signage colours and handrails, calm and empty. ${LOOK}`,
      posts: [
        `An elderly man looking out of a large window in a calm modern room, thoughtful, with a carer nearby. ${LOOK}`,
        `A modern dementia friendly dining room with contrasting coloured plates and good lighting, empty. ${LOOK}`,
        `A group of care staff in teal uniforms in a bright training room with a trainer. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a nurse and a resident doing a memory puzzle', life: 'An illustration of a bright dementia friendly corridor' },
  },
  {
    slug: 'clinical-home-care',
    setting: 'home-care',
    name: 'Carewell',
    style: 'Clinical family. Green and blue, organised and precise, with visit times and coverage up front.',
    highlights: ['Coverage checked by postcode', 'Visit times and tasks explained', 'Clear pricing information'],
    palette: { primary: '#0f6b52', soft: '#ebf6f1', ink: '#0d1f19', accent: '#2563eb' },
    provider: {
      name: 'Carewell Home Care',
      strapline: 'Home care, planned properly',
      town: 'Hurstmead',
      county: 'Berkshire',
      phone: '0118 000 0000',
      intro:
        'Carewell provides planned home care across west Berkshire, with digital care records, electronic call monitoring and a care coordinator for every client.',
      address: 'Hurstmead Business Park, Hurstmead',
    },
    nav: ['Home care', 'Coverage', 'How it works', 'Pricing', 'Careers', 'Contact'],
    eyebrow: 'Home care in Berkshire',
    ctas: ['Check your postcode', 'Book an assessment'],
    chips: ['Digital care records', 'Call monitoring', 'A coordinator for every client'],
    floatCard: { label: 'Visits on time', value: 'Monitored', note: 'Every call logged electronically' },
    audiences: [
      { label: 'For families', title: 'Arranging care at home', body: 'Check coverage, see how visits work and book an assessment.', cta: 'Book an assessment' },
      { label: 'For carers', title: 'Work with Carewell', body: 'Guaranteed hours, paid travel and rounds planned by postcode.', cta: 'See our vacancies' },
    ],
    services: {
      title: 'Services',
      items: [
        { title: 'Personal care', body: 'Washing, dressing, continence and mobility support.' },
        { title: 'Medication', body: 'Prompting or administering, recorded digitally.' },
        { title: 'Meals and home', body: 'Meal preparation, shopping and household tasks.' },
        { title: 'Reablement', body: 'Short term support to regain independence after hospital.' },
      ],
    },
    feature: {
      title: 'How care is set up',
      items: [
        { label: '1', title: 'Postcode check', body: 'Confirm we cover your area.' },
        { label: '2', title: 'Assessment', body: 'A coordinator visits within three days.' },
        { label: '3', title: 'Care plan', body: 'Visit times and tasks agreed in writing.' },
        { label: '4', title: 'First visit', body: 'Often within a week of the assessment.' },
      ],
    },
    tools: [
      { title: 'Postcode checker', body: 'See if we cover your area.' },
      { title: 'Care hours planner', body: 'Plan a week of visits and the hours needed.' },
      { title: 'Pricing guide', body: 'Hourly rates, and what the council may fund.' },
    ],
    posts: [
      { title: 'How electronic call monitoring keeps visits on time', date: '15 September 2026', tag: 'Our care' },
      { title: 'Reablement after hospital: what to expect', date: '2 September 2026', tag: 'Advice' },
      { title: 'Carewell now covers Hurstmead South', date: '19 August 2026', tag: 'News' },
    ],
    finalCta: { title: 'Check your postcode', body: 'See in seconds whether we cover your area, then book a free assessment.', primary: 'Check your postcode' },
    facts: [
      { value: '98%', label: 'visits on time (example)' },
      { value: '3 days', label: 'to assessment' },
      { value: '30 min', label: 'minimum visit length' },
      { value: '1', label: 'coordinator per client' },
    ],
    faqs: [
      ['What is the shortest visit you offer?', 'Thirty minutes. We do not offer 15 minute personal care visits.'],
      ['Can we see the care records?', 'Yes. Families can be given secure access to the digital care notes.'],
      ['Do you cover weekends?', 'Yes, seven days a week, including bank holidays.'],
    ],
    prompts: {
      hero: `A home carer in a green uniform using a tablet to record a visit while an elderly woman smiles in her bright, tidy living room. ${LOOK}`,
      life: `A care coordinator in a bright modern office planning visit rounds on a large screen map, no readable text. ${LOOK}`,
      posts: [
        `A home carer checking her phone app at the front door of a modern house before a visit. ${LOOK}`,
        `An elderly man doing gentle exercises with a reablement carer in his kitchen. ${LOOK}`,
        `A small car parked outside a row of modern houses on a suburban street, morning. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a home carer recording a visit on a tablet', life: 'An illustration of a coordinator planning visit rounds' },
  },
  {
    slug: 'clinical-live-in-care',
    setting: 'live-in-care',
    name: 'Constant',
    style: 'Clinical family. Slate and amber, reassuring and exact, with costs and standards set out plainly.',
    highlights: ['Costs compared with care homes', 'Carer vetting explained', 'Clinical oversight described'],
    palette: { primary: '#334e68', soft: '#f0f4f8', ink: '#102a43', accent: '#e3a008' },
    provider: {
      name: 'Constant Live-in Care',
      strapline: 'Live-in care, with clinical oversight',
      town: 'Amersden',
      county: 'Buckinghamshire',
      phone: '01494 000 000',
      intro:
        'Constant provides fully managed live-in care across Buckinghamshire, with carers vetted, trained and supervised by a clinical team, including a registered nurse who oversees every care plan.',
      address: 'The Courtyard, Amersden',
    },
    nav: ['Live-in care', 'Our standards', 'Costs', 'For carers', 'Advice', 'Contact'],
    eyebrow: 'Live-in care in Buckinghamshire',
    ctas: ['Get a live-in care quote', 'Our standards'],
    chips: ['Nurse led care plans', 'Fully managed service', 'Carers vetted and trained'],
    floatCard: { label: 'Clinical oversight', value: 'Nurse led', note: 'A registered nurse reviews every plan' },
    audiences: [
      { label: 'For families', title: 'Considering live-in care', body: 'Costs, standards and how it compares with a care home, set out plainly.', cta: 'Get a quote' },
      { label: 'For carers', title: 'Live-in roles', body: 'Supervised placements, clinical training and fair rotas.', cta: 'Apply' },
    ],
    services: {
      title: 'What is included',
      items: [
        { title: 'A matched live-in carer', body: 'Chosen for skills, experience and personality.' },
        { title: 'Nurse led care plan', body: 'Written and reviewed by a registered nurse.' },
        { title: 'Break cover', body: 'Relief carers arranged for breaks and holidays.' },
        { title: 'Care management', body: 'A named care manager and a 24 hour support line.' },
      ],
    },
    feature: {
      title: 'How live-in care starts',
      items: [
        { label: '1', title: 'Consultation', body: 'A call to understand needs and the home.' },
        { label: '2', title: 'Assessment', body: 'A nurse visits and writes the care plan.' },
        { label: '3', title: 'Matching', body: 'Carer profiles shared for you to choose.' },
        { label: '4', title: 'Start', body: 'Care can begin within a few days.' },
      ],
    },
    tools: [
      { title: 'Live-in or care home?', body: 'The costs and daily life compared side by side.' },
      { title: 'Live-in care quote', body: 'An indicative weekly cost in a few questions.' },
      { title: 'Our standards', body: 'How carers are vetted, trained and supervised.' },
    ],
    posts: [
      { title: 'Live-in care versus a care home: the real costs', date: '14 September 2026', tag: 'Costs' },
      { title: 'How we vet and train every live-in carer', date: '1 September 2026', tag: 'Our standards' },
      { title: 'Why nurse led care plans matter', date: '18 August 2026', tag: 'Our care' },
    ],
    finalCta: { title: 'Get a live-in care quote', body: 'A few questions and a call from a care adviser. No obligation.', primary: 'Get a quote' },
    facts: [
      { value: '24/7', label: 'support line' },
      { value: 'Nurse', label: 'led care plans' },
      { value: '3 days', label: 'typical time to start' },
      { value: '2', label: 'carers matched per client' },
    ],
    faqs: [
      ['Is live-in care more expensive than a care home?', 'For one person it can be similar. For couples it is often less. We will show you the figures.'],
      ['What checks do carers have?', 'Enhanced DBS, references, right to work and our own training before any placement.'],
      ['Who covers the carer’s breaks?', 'We arrange relief carers for daily breaks, days off and holidays.'],
    ],
    prompts: {
      hero: `A professional live-in carer in a smart slate blue uniform helping an elderly man stand from an armchair in his bright, modern home, careful and kind. ${LOOK}`,
      life: `A registered nurse in a smart uniform reviewing a care plan with a live-in carer at a kitchen table in a bright modern home. ${LOOK}`,
      posts: [
        `An elderly couple sitting together in their bright modern living room, relaxed and content. ${LOOK}`,
        `A trainer demonstrating a hoist transfer to live-in carers in a bright training room. ${LOOK}`,
        `A nurse writing notes on a tablet in a calm, bright home setting. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a live-in carer helping a man stand from his chair', life: 'An illustration of a nurse and a carer reviewing a care plan' },
  },
  {
    slug: 'clinical-supported-living',
    setting: 'supported-living',
    name: 'Pathway',
    style: 'Clinical family. Blue and yellow, clear and structured, with an easy read route and a professional route.',
    highlights: ['Easy read route for individuals', 'Specification route for commissioners', 'Outcomes shown clearly'],
    palette: { primary: '#1e5aa8', soft: '#edf3fc', ink: '#0f1f33', accent: '#e5a800' },
    provider: {
      name: 'Pathway Supported Living',
      strapline: 'Supported living, with clear outcomes',
      town: 'Stourley',
      county: 'West Midlands',
      phone: '0121 000 0000',
      intro:
        'Pathway supports adults with learning disabilities, autism and complex needs in their own homes across the West Midlands, with positive behaviour support and outcomes agreed with each person.',
      address: 'Canal Street, Stourley',
    },
    nav: ['Our support', 'Easy read', 'For commissioners', 'Vacancies', 'Jobs', 'Contact'],
    eyebrow: 'Supported living in the West Midlands',
    ctas: ['Easy read information', 'Commissioner information'],
    chips: ['Positive behaviour support', 'Complex needs welcome', 'Outcomes agreed with you'],
    floatCard: { label: 'Vacancies', value: '2 homes', note: 'Single person flats in Stourley' },
    audiences: [
      { label: 'For you', title: 'Your own home', body: 'Easy read information about living in your own home with support.', cta: 'Read easy read' },
      { label: 'For commissioners', title: 'Service information', body: 'Specifications, outcomes framework and current vacancies.', cta: 'Commissioner information' },
    ],
    services: {
      title: 'Support we provide',
      items: [
        { title: 'Everyday living', body: 'Cooking, money, shopping and keeping your home.' },
        { title: 'Positive behaviour support', body: 'Plans written with the person and their circle of support.' },
        { title: 'Health', body: 'Annual health checks, medication and appointments.' },
        { title: 'Community', body: 'Work, learning, clubs and relationships.' },
      ],
    },
    feature: {
      title: 'Referral to moving in',
      items: [
        { label: '1', title: 'Referral', body: 'From a social worker, family or the person.' },
        { label: '2', title: 'Getting to know you', body: 'Meetings at your pace, in easy words.' },
        { label: '3', title: 'Support plan', body: 'Outcomes agreed and written with you.' },
        { label: '4', title: 'Moving in', body: 'A transition plan so moving feels safe.' },
      ],
    },
    tools: [
      { title: 'Easy read guide', body: 'What supported living means, with pictures.' },
      { title: 'Referral form', body: 'For social workers and commissioners.' },
      { title: 'Outcomes framework', body: 'How we measure progress with each person.' },
    ],
    posts: [
      { title: 'Supported living, in easy read', date: '15 September 2026', tag: 'Easy read' },
      { title: 'Positive behaviour support: our approach', date: '2 September 2026', tag: 'Our support' },
      { title: 'Jordan starts his first paid job', date: '19 August 2026', tag: 'Stories' },
    ],
    finalCta: { title: 'Talk to us about support', body: 'Individuals, families and professionals can all call us directly.', primary: 'Contact us' },
    facts: [
      { value: '40', label: 'people supported' },
      { value: '12', label: 'homes' },
      { value: 'PBS', label: 'trained team' },
      { value: '6 weekly', label: 'outcome reviews' },
    ],
    faqs: [
      ['Do I get my own tenancy?', 'Yes. You hold your own tenancy, and support is separate from housing.'],
      ['Can you support complex needs?', 'Yes, including autism and behaviour that challenges, with PBS trained staff.'],
      ['How do commissioners get information?', 'Our service specification and outcomes framework are on the commissioner page.'],
    ],
    prompts: {
      hero: `A young autistic man with headphones around his neck smiling while working on a laptop at a desk in his own bright flat, a support worker in casual everyday clothes (not a uniform or scrubs) beside him. ${LOOK}`,
      life: `A support worker and a young woman shopping for groceries together in a bright supermarket aisle. ${LOOK}`,
      posts: [
        `A support worker showing a simple picture schedule to a young man at a table in a bright flat. ${LOOK}`,
        `A support worker and a young woman sitting and talking calmly on a sofa in a modern flat. ${LOOK}`,
        `A young man with a learning disability in a work uniform smiling at a cafe counter. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a young man working at a laptop in his own flat', life: 'An illustration of a support worker and a woman shopping together' },
  },
  {
    slug: 'clinical-retirement-living',
    setting: 'retirement-living',
    name: 'Seacombe Quay',
    style: 'Clinical family. Deep sea blue and sand, clear and factual, with costs and care options set out.',
    highlights: ['Service charges set out line by line', 'Care packages explained', 'Apartment finder'],
    palette: { primary: '#134e5e', soft: '#eaf4f6', ink: '#0c1f25', accent: '#c7923e' },
    provider: {
      name: 'Seacombe Quay',
      strapline: 'Retirement apartments on the harbour, with care available',
      town: 'Seacombe',
      county: 'Devon',
      phone: '01803 000 000',
      intro:
        'Seacombe Quay has 48 one and two bedroom apartments on the harbourside for people over 60, with a 24 hour on site team, a restaurant and optional care packages if needs change.',
      address: 'The Quay, Seacombe',
    },
    nav: ['Apartments', 'Costs', 'Care options', 'Living here', 'Events', 'Contact'],
    eyebrow: 'Retirement living in Devon',
    ctas: ['Find an apartment', 'Understand the costs'],
    chips: ['24 hour on site team', 'Optional care packages', 'Harbourside location'],
    floatCard: { label: 'Available', value: '5 apartments', note: 'Sea view and garden view' },
    audiences: [
      { label: 'Moving yourself?', title: 'Find the right apartment', body: 'Filter by size, view and floor, and book a viewing.', cta: 'Find an apartment' },
      { label: 'Helping a parent?', title: 'Costs and care, explained', body: 'Service charges, care options and what happens if needs change.', cta: 'Read the guide' },
    ],
    services: {
      title: 'What is included',
      items: [
        { title: 'Your apartment', body: 'Fully accessible, with a kitchen, shower room and balcony.' },
        { title: '24 hour team', body: 'On site day and night, with a personal alarm in every apartment.' },
        { title: 'Restaurant', body: 'Lunch and dinner every day, charged as you use it.' },
        { title: 'Care packages', body: 'From a weekly check in to daily personal care.' },
      ],
    },
    feature: {
      title: 'Buying at Seacombe Quay',
      items: [
        { label: '1', title: 'Viewing', body: 'See the show apartment and the harbour.' },
        { label: '2', title: 'Reservation', body: 'Hold an apartment while you plan.' },
        { label: '3', title: 'Completion', body: 'Legal work and a moving plan.' },
        { label: '4', title: 'Moving in', body: 'Help with the move and a welcome from neighbours.' },
      ],
    },
    tools: [
      { title: 'Apartment finder', body: 'Search by size, view and floor.' },
      { title: 'Service charge breakdown', body: 'Every line of the charge, explained.' },
      { title: 'Care package guide', body: 'What each level of care includes.' },
    ],
    posts: [
      { title: 'Our service charge, explained line by line', date: '18 September 2026', tag: 'Costs' },
      { title: 'How care packages work if needs change', date: '5 September 2026', tag: 'Care options' },
      { title: 'Harbour festival from the balcony', date: '22 August 2026', tag: 'Living here' },
    ],
    finalCta: { title: 'Book a viewing', body: 'See the show apartment, the harbour and the restaurant, at a time that suits you.', primary: 'Book a viewing' },
    facts: [
      { value: '48', label: 'apartments' },
      { value: '60+', label: 'minimum age' },
      { value: '24 hrs', label: 'on site team' },
      { value: '3', label: 'care package levels' },
    ],
    faqs: [
      ['What does the service charge cover?', 'The on site team, alarms, building insurance, communal areas, heating and gardens.'],
      ['What if I need care later?', 'You can add a care package at any time, delivered by our registered care team.'],
      ['Can I rent instead of buy?', 'A small number of apartments are available to rent.'],
    ],
    prompts: {
      hero: `An active retired woman in her seventies on a balcony of a modern harbourside apartment overlooking boats and the sea, bright morning. ${LOOK}`,
      life: `Retired residents having lunch in a bright modern restaurant with large windows over a harbour. ${LOOK}`,
      posts: [
        `A retired couple reading documents at a table in a bright modern apartment with sea views. ${LOOK}`,
        `A friendly on site team member chatting with an older man at the reception of a modern retirement building. ${LOOK}`,
        `A harbour with colourful boats and bunting seen from a modern apartment balcony, summer. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of a woman on a harbourside apartment balcony', life: 'An illustration of residents having lunch overlooking a harbour' },
  },
  {
    slug: 'clinical-care-group',
    setting: 'care-groups',
    name: 'Meridian',
    style: 'Clinical family. Blue and green, data led, built for a group that compares its homes openly.',
    highlights: ['Homes compared side by side', 'Quality data published', 'Group admissions line'],
    palette: { primary: '#0e4f8b', soft: '#eef4fa', ink: '#0b1a2b', accent: '#10a37f' },
    provider: {
      name: 'Meridian Care Group',
      strapline: 'Four homes, one standard, published openly',
      town: 'Manchester',
      county: 'Greater Manchester',
      phone: '0161 000 0000',
      intro:
        'Meridian runs four care homes across Greater Manchester, offering residential, nursing and dementia care, and publishes the same quality measures for every home.',
      address: 'Meridian House, Manchester',
    },
    nav: ['Our homes', 'Compare homes', 'Quality', 'Admissions', 'Careers', 'Contact'],
    eyebrow: 'A care group in Greater Manchester',
    ctas: ['Compare our homes', 'Call group admissions'],
    chips: ['Four homes', 'Quality data published', 'One admissions line'],
    floatCard: { label: 'Group admissions', value: 'One number', note: 'For every home in the group' },
    audiences: [
      { label: 'For families', title: 'Find and compare homes', body: 'Care types, availability and quality measures for every home.', cta: 'Compare our homes' },
      { label: 'For your career', title: 'Careers across the group', body: 'Training, progression and roles in four homes.', cta: 'See all jobs' },
    ],
    services: {
      title: 'Our homes',
      items: [
        { title: 'Calderbrook House, Bolton', body: 'Residential and dementia care, 42 rooms.' },
        { title: 'Heatonmere, Stockport', body: 'Nursing and residential care, 56 rooms.' },
        { title: 'Tollbar Lodge, Bury', body: 'Residential and respite care, 34 rooms.' },
        { title: 'Brackenlea, Oldham', body: 'Dementia nursing, 40 rooms.' },
      ],
    },
    feature: {
      title: 'What we publish for every home',
      items: [
        { label: '1', title: 'Ratings', body: 'The latest inspection rating for each home.' },
        { label: '2', title: 'Staffing', body: 'Staff turnover and training completion.' },
        { label: '3', title: 'Feedback', body: 'Resident and family survey results.' },
        { label: '4', title: 'Availability', body: 'Rooms available, updated weekly.' },
      ],
    },
    tools: [
      { title: 'Compare our homes', body: 'Care types, rooms and quality measures side by side.' },
      { title: 'Room availability', body: 'Live availability across all four homes.' },
      { title: 'Funding guide', body: 'Council, NHS and private funding explained.' },
    ],
    posts: [
      { title: 'Our quality report for the last quarter', date: '16 September 2026', tag: 'Quality' },
      { title: 'How we train carers across the group', date: '3 September 2026', tag: 'Careers' },
      { title: 'Heatonmere opens its new nursing unit', date: '20 August 2026', tag: 'News' },
    ],
    finalCta: { title: 'Find the right Meridian home', body: 'One call to group admissions covers all four homes.', primary: 'Call group admissions' },
    facts: [
      { value: '4', label: 'homes' },
      { value: '172', label: 'rooms across the group' },
      { value: 'Quarterly', label: 'quality reports' },
      { value: '1', label: 'admissions line' },
    ],
    faqs: [
      ['How do I choose between your homes?', 'Compare them side by side, or call group admissions for advice.'],
      ['Are all homes run the same way?', 'Yes. The same policies, training and quality measures apply in every home.'],
      ['Where can I see your quality data?', 'Our quarterly quality report is published on the quality page.'],
    ],
    prompts: {
      hero: `Exterior of a modern, well designed three storey care home with large windows and landscaped gardens in a Manchester suburb, bright day. ${LOOK}`,
      life: `A group quality manager presenting charts on a screen to care home managers around a table in a bright meeting room, no readable text. ${LOOK}`,
      posts: [
        `A professional woman reviewing a printed report at a bright office desk, no readable text. ${LOOK}`,
        `A group of new care workers in blue uniforms at an induction session in a bright training room. ${LOOK}`,
        `A newly opened modern nursing unit corridor with bright lighting and handrails, empty. ${LOOK}`,
      ],
    },
    alts: { hero: 'An illustration of the outside of a modern care home', life: 'An illustration of a quality meeting with care home managers' },
  },
]
