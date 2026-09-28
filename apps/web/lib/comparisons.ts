// The /compare/[slug] pages: "a care specialist vs X", one entry per comparison.
//
// House rules for this content, because it names other people's products:
// - Say what the other option genuinely does well, and mean it.
// - No prices, statistics, client results or testimonials that are not in the repo.
// - Every page has a "when X is the right choice" section that a competitor could read
//   without wincing.
// - No em or en dashes anywhere in the copy.
//
// Links inside copy use [text](/path). Links to /blog/ posts only render as links when the
// post is published, so a draft never becomes a dead link (see renderCopy on the page).

export type ComparisonMark = 'yes' | 'some' | 'no'

export type ComparisonRow = {
  criterion: string
  trg: ComparisonMark
  them: ComparisonMark
  note: string
  /** When set, the row also appears on the hero scorecard under this shorter label. */
  short?: string
}

export type Comparison = {
  slug: string
  /** Used on the hub and in breadcrumbs. */
  title: string
  metaTitle: string
  metaDescription: string
  /** One or two sentences for the hub card. */
  hubSummary: string
  hero: {
    eyebrow: string
    before: string
    highlight: string
    intro: string[]
    points: string[]
  }
  /** Column headings. `us` is the first, highlighted column. */
  columns: {
    us: { table: string; phone: string; full: string }
    them: { table: string; phone: string; full: string }
  }
  scorecardTitle: string
  scorecardFooter: string
  tableHeading: string
  rows: ComparisonRow[]
  sections: { heading: string; paragraphs: string[]; sub?: { heading: string; body: string }[] }[]
  rightChoice: { heading: string; paragraphs: string[] }
  checklist: { heading: string; items: string[]; footer?: string }
  faqs: [string, string][]
  /** Blog slugs for further reading. Only published ones are shown. */
  related: { slug: string; title: string }[]
  cta: { title: string; body: string }
}

const WHO_OWNS = { slug: 'who-owns-your-care-home-website', title: 'Who owns your care home website?' }

export const COMPARISONS: Comparison[] = [
  {
    slug: 'wix-squarespace-for-care-homes',
    title: 'A care specialist vs Wix or Squarespace',
    metaTitle: 'Wix or Squarespace for a Care Home? An Honest Comparison',
    metaDescription:
      'Should a care provider build its own site on Wix or Squarespace, or use a care specialist? What the builders do well, where care sites get stuck, and when DIY is the right call.',
    hubSummary:
      'Website builders are quick, tidy and cheap to start. Where they fall short for care is everything the template does not know: CQC, older readers, local search and enquiries.',
    hero: {
      eyebrow: 'Compare: DIY website builders',
      before: 'Wix or Squarespace,',
      highlight: 'or a care specialist?',
      intro: [
        'Wix and Squarespace are good products. Plenty of care providers have a site on one of them, built by a manager on a quiet evening, and some of those sites work well enough.',
        'The question is not whether a builder can make a nice looking page. It is whether that page does the jobs a care website has to do. This page sets that out fairly, including when a builder is the sensible choice.',
      ],
      points: ['What builders do well', 'Where care sites get stuck', 'When DIY is right'],
    },
    columns: {
      us: { table: 'Care specialist', phone: 'Care', full: 'Specialist' },
      them: { table: 'Wix or Squarespace', phone: 'DIY', full: 'Wix / Sqsp' },
    },
    scorecardTitle: 'A care specialist vs a DIY builder',
    scorecardFooter: 'A dash means it can be done on a builder, if you know to do it and have the time.',
    tableHeading: 'Side by side',
    rows: [
      {
        criterion: 'Quickest to get something live',
        trg: 'some',
        them: 'yes',
        note: 'A builder can have pages up in an afternoon. A proper care site takes weeks.',
        short: 'Live quickly',
      },
      {
        criterion: 'Lowest cost in the first year',
        trg: 'no',
        them: 'yes',
        note: 'A builder plan costs far less upfront. Count your own hours as well as the subscription.',
        short: 'Lowest first year cost',
      },
      {
        criterion: 'CQC rating shown properly (Regulation 20A)',
        trg: 'yes',
        them: 'some',
        note: 'Both builders can usually hold the official CQC widget as an embed. Someone has to know to add it and where.',
        short: 'CQC rating shown',
      },
      {
        criterion: 'Easy to read for older visitors',
        trg: 'yes',
        them: 'some',
        note: 'Templates can be made accessible. Text size, contrast and plain wording depend on whoever edits.',
        short: 'Readable for older eyes',
      },
      {
        criterion: 'Ranks for "care homes in [town]"',
        trg: 'yes',
        them: 'some',
        note: 'The platforms handle the technical basics well. The local pages and content that win a busy town are down to you.',
        short: 'Ranks in your town',
      },
      {
        criterion: 'Care schema and structured data',
        trg: 'yes',
        them: 'some',
        note: 'Builders add general markup. Care service and FAQ markup usually needs custom code.',
      },
      {
        criterion: 'Enquiry forms that handle care data carefully',
        trg: 'yes',
        them: 'some',
        note: 'The forms work well. What you ask, where it goes and what the privacy notice says is on you.',
      },
      {
        criterion: 'Carer recruitment pages',
        trg: 'yes',
        them: 'some',
        note: 'Easy to add a jobs page. Harder to make one that ranks and brings applications.',
      },
    ],
    sections: [
      {
        heading: 'What Wix and Squarespace do well',
        paragraphs: [
          'Both are mature, well supported platforms. Hosting, security certificates and software updates are handled for you, so nothing breaks because someone forgot to patch a plugin. The editors are visual, which means a manager can change opening hours or add a photo without calling anyone.',
          'Squarespace is known for polished, consistent templates. Wix gives you a very flexible editor and a large marketplace of add ons. Either will give a new service a presentable home on the web quickly, and for a small cost compared with any agency.',
          'You can hold the account and the domain in your own name, which is more than some agencies offer. That matters, and it is worth checking in any contract, ours included. We have written more on this in [who owns your care home website](/blog/who-owns-your-care-home-website).',
        ],
      },
      {
        heading: 'Where care websites tend to get stuck',
        paragraphs: [
          'None of the gaps below are faults in the builders. They are things a template cannot know about care, so they fall to whoever builds the site.',
        ],
        sub: [
          {
            heading: 'Your CQC rating',
            body: 'Regulation 20A requires your current rating to be shown clearly on your website. The official CQC widget keeps it up to date automatically, but it has to be added, in the right places, and checked after each inspection. Our free [CQC rating display checker](/tools/cqc-rating-display-checker) will tell you whether your current site passes.',
          },
          {
            heading: 'Older visitors and worried families',
            body: 'Many of the people reading a care website are in their seventies or eighties, or are adult children reading on a phone late at night. Stylish templates often use light grey text, small type and thin fonts. They look lovely in the preview and are hard work for the people you most need to reach. See [how we build accessible websites](/accessible-websites).',
          },
          {
            heading: 'Being found in your town',
            body: 'Builders cover the technical basics of search well. What they cannot do is decide which towns, services and questions deserve their own pages, write them, and keep them improving. That is the work that gets a provider onto the first page for care in a competitive town. Our [competitor snapshot](/tools/care-competitor-snapshot) shows who you are up against.',
          },
          {
            heading: 'Enquiries and care data',
            body: 'A family enquiry often includes health details about a relative, which is special category data under UK GDPR. The form itself is easy. Deciding what to ask, who receives it, how quickly someone replies and what your privacy notice says takes care knowledge, not a template.',
          },
          {
            heading: 'Recruitment',
            body: 'Most providers need a steady flow of carers as much as they need residents or clients. A single jobs page rarely ranks. See what goes into [carer recruitment pages](/carer-recruitment) that do.',
          },
        ],
      },
      {
        heading: 'The real cost is usually your time',
        paragraphs: [
          'The subscription is the smallest part of a DIY site. The larger cost is the hours: building it, writing it, keeping the rating current, adding pages, and learning enough about search to know what to add. For a registered manager, those hours come from somewhere.',
          'The fairest way to compare is cost per enquiry over two or three years, not the price on day one. If a builder site brings the enquiries you need, it is the cheaper option. If it looks fine but the phone does not ring, it is not cheap at all. Our [enquiry value calculator](/tools/enquiry-value-calculator) helps put a number on what one enquiry is worth to you.',
        ],
      },
    ],
    rightChoice: {
      heading: 'When Wix or Squarespace is the right choice',
      paragraphs: [
        'If you are opening a new service and need something presentable online this month, a builder is a very sensible start. Get your CQC widget on it, a clear phone number, and a simple enquiry form.',
        'If your budget is small, a tidy builder site plus a well kept Google Business Profile will serve you better than stretching for an agency you cannot afford to keep.',
        'If you enjoy doing it yourself and have the time to keep learning, many providers run a perfectly good site this way. Use the checklist below and our free tools, and you will avoid most of the common mistakes.',
      ],
    },
    checklist: {
      heading: 'If you build it yourself, do these',
      items: [
        'Add the official CQC widget and check it after every inspection.',
        'Use large, dark text and test every page on a phone.',
        'Put your phone number at the top of every page.',
        'Give each service and each town you serve its own page.',
        'Write a privacy notice that covers what your enquiry form collects.',
        'Keep the domain and every login in the organisation’s name.',
      ],
      footer: 'Run your site through our free [website grader](/tools/website-grader) to see how it scores.',
    },
    faqs: [
      [
        'Is Wix or Squarespace bad for SEO?',
        'No. Both handle the technical basics of search properly. Ranking in a competitive town depends far more on the pages and content you add, and on your Google Business Profile, than on which builder you use.',
      ],
      [
        'Can I add the CQC rating widget to Wix or Squarespace?',
        'Usually, yes. Both let you add embed code, which is how the official CQC widget works. Check where it appears and that it shows your current rating after each inspection.',
      ],
      [
        'Can we move from Wix or Squarespace to a new site later?',
        'Yes, although the design itself does not move with you. Your words, images and domain can come across, and a careful move keeps the pages Google already knows about working.',
      ],
      [
        'Should we start on a builder and upgrade later?',
        'That is a reasonable plan for a new service. Keep the domain in your own name from day one, and keep a note of which pages bring enquiries, so the next site starts from what works.',
      ],
    ],
    related: [WHO_OWNS],
    cta: {
      title: 'See how your current site scores',
      body: 'A free audit shows what your site does well and what it is missing, whether you keep it on a builder or not.',
    },
  },

  {
    slug: 'wordpress-theme-or-freelancer',
    title: 'A care specialist vs a WordPress theme or freelancer',
    metaTitle: 'WordPress Theme or Freelancer vs a Care Specialist Website',
    metaDescription:
      'A fair comparison for care providers weighing a WordPress theme, a freelancer or a care specialist agency. Flexibility, cost, upkeep and the care details that often get missed.',
    hubSummary:
      'WordPress is flexible and open, and a good freelancer can be great value. The risks sit in upkeep, in who covers when one person is away, and in the care details nobody asked for.',
    hero: {
      eyebrow: 'Compare: WordPress and freelancers',
      before: 'A WordPress freelancer,',
      highlight: 'or a care specialist?',
      intro: [
        'A premium WordPress theme and a capable freelancer is how a great many small businesses get a good website, and plenty of care providers too.',
        'It can be excellent value. It can also leave you with a site nobody updates and one person who holds every login. Here is a fair look at both, and at when a freelancer is the better choice.',
      ],
      points: ['Where WordPress shines', 'What to check with a freelancer', 'When to choose one'],
    },
    columns: {
      us: { table: 'Care specialist', phone: 'Care', full: 'Specialist' },
      them: { table: 'WordPress theme or freelancer', phone: 'WP', full: 'WordPress' },
    },
    scorecardTitle: 'A care specialist vs WordPress',
    scorecardFooter: 'A dash means it depends on the freelancer you choose. Some are excellent.',
    tableHeading: 'Side by side',
    rows: [
      {
        criterion: 'Lowest upfront cost',
        trg: 'no',
        them: 'yes',
        note: 'A premium theme and a freelancer’s time is often the cheapest route to a custom looking site.',
        short: 'Lowest upfront cost',
      },
      {
        criterion: 'Flexibility and choice of add ons',
        trg: 'some',
        them: 'yes',
        note: 'WordPress has a plugin for almost everything. Every plugin is also something to keep updated.',
      },
      {
        criterion: 'Care knowledge from day one',
        trg: 'yes',
        them: 'some',
        note: 'A few freelancers know care well. Most are generalists, so ask what care sites they have built.',
        short: 'Knows care',
      },
      {
        criterion: 'CQC rating and registered details shown properly',
        trg: 'yes',
        them: 'some',
        note: 'Easy to add on WordPress. It gets missed when nobody on the project knows Regulation 20A.',
        short: 'CQC rating shown',
      },
      {
        criterion: 'Easy to read for older visitors',
        trg: 'yes',
        them: 'some',
        note: 'Themes vary widely. Some page builders add heavy code, small text and low contrast.',
        short: 'Readable for older eyes',
      },
      {
        criterion: 'Ranks for "care homes in [town]"',
        trg: 'yes',
        them: 'some',
        note: 'WordPress is good for search. The local pages and ongoing work are what rank, and they are rarely in a build quote.',
      },
      {
        criterion: 'Someone accountable for updates and security',
        trg: 'yes',
        them: 'some',
        note: 'With a freelancer it depends on a maintenance agreement. Ask anyone, including us, what theirs covers.',
        short: 'Kept up to date',
      },
      {
        criterion: 'Cover when one person is away',
        trg: 'some',
        them: 'some',
        note: 'A small team is still a small team. Ask who picks up the phone during holidays and illness.',
      },
    ],
    sections: [
      {
        heading: 'What WordPress and a good freelancer do well',
        paragraphs: [
          'WordPress is open source and runs a large share of the web. You are not tied to one company: the site can be moved to another host or another developer, and there is a huge pool of people who know how to work on it. That independence is a real strength.',
          'A good freelancer is often quicker to reach and cheaper per hour than an agency, and you speak to the person doing the work. If they have built care sites before, they may know the sector very well. Premium themes give a polished starting point at a small cost.',
        ],
      },
      {
        heading: 'Where it tends to go wrong for care providers',
        paragraphs: [
          'The problems we see on inherited WordPress care sites are rarely about WordPress itself. They are about what happens after launch, and about the care details nobody put in the brief.',
        ],
        sub: [
          {
            heading: 'Nobody owns the upkeep',
            body: 'WordPress, the theme and every plugin need regular updates. When the build is paid for and the maintenance is not, updates stop, and an outdated care site that collects family enquiries is a data protection worry as well as a technical one.',
          },
          {
            heading: 'One person holds the keys',
            body: 'If the freelancer registered the domain, set up the hosting and holds the admin login, you depend on them staying in business and in touch. Make sure every account is in your organisation’s name. Read more in [who owns your care home website](/blog/who-owns-your-care-home-website).',
          },
          {
            heading: 'The care details are missing',
            body: 'The CQC widget, registered manager and provider details, fees information families can find, a funding explainer, a clear route for professionals making a referral. None of it is hard on WordPress. It is just easy to leave out if you have never worked in care. Our [CQC rating display checker](/tools/cqc-rating-display-checker) is a quick first test.',
          },
          {
            heading: 'Heavy page builders',
            body: 'Some themes rely on page builders that add a lot of code. Pages load slowly on a phone signal, text ends up small, and older visitors give up. Speed and readability are worth checking before you choose a theme.',
          },
          {
            heading: 'Structured data for care',
            body: 'Search engines understand a site better with markup that describes the service, location and common questions. It is rarely included by default. Our free [care schema generator](/tools/care-schema-generator) shows what good markup looks like.',
          },
        ],
      },
      {
        heading: 'Comparing the cost fairly',
        paragraphs: [
          'A freelancer’s build quote is often lower than an agency’s. To compare like with like, add hosting, a maintenance agreement, the cost of new pages as you add services, and any search work you will need to rank in your town. Then compare what each option is likely to bring in enquiries over a few years.',
          'Sometimes the freelancer still wins, and that is fine. The mistake is comparing a build quote with an ongoing service as if they were the same thing.',
        ],
      },
    ],
    rightChoice: {
      heading: 'When a WordPress freelancer is the right choice',
      paragraphs: [
        'If you already know a freelancer who has built care websites, who answers the phone, and who offers a proper maintenance agreement, that can be an excellent arrangement. Keep it.',
        'If you have someone in house who is comfortable with WordPress and wants to run the site, a good theme and a freelancer for the tricky bits is a sensible, low cost set up.',
        'If your main need is a site that looks right and holds the basics, and you will handle search yourself, a freelancer may give you exactly that for less.',
      ],
    },
    checklist: {
      heading: 'Questions to ask any freelancer',
      items: [
        'Which care websites have you built, and can we speak to them?',
        'Will the domain, hosting and admin logins be in our name?',
        'Who updates WordPress, the theme and plugins, and how often?',
        'Who covers if you are ill or on holiday?',
        'How will the CQC rating widget be added and kept current?',
        'What will new pages cost after launch?',
      ],
      footer: 'Ask us the same questions. How we work is on [our commitment page](/our-commitment).',
    },
    faqs: [
      [
        'Is WordPress a good platform for a care website?',
        'Yes. It is flexible, well supported and good for search. Whether the site is good depends on how it is built and looked after, not on WordPress itself.',
      ],
      [
        'What happens if our freelancer disappears?',
        'If the domain, hosting and logins are in your name, another developer can pick the site up. If they are not, getting them back can be slow. Check this now rather than when something breaks.',
      ],
      [
        'Can a care specialist take over our existing WordPress site?',
        'Often, yes. Sometimes improving what you have is the better value. A free audit shows whether the site is worth keeping or whether a rebuild makes more sense.',
      ],
      [
        'Do premium WordPress themes work for older visitors?',
        'Some do. Test any theme on a phone, with the text size turned up, before you commit. Look for dark text, large type and simple menus.',
      ],
    ],
    related: [WHO_OWNS],
    cta: {
      title: 'Find out if your site is worth keeping',
      body: 'A free audit looks at speed, readability, CQC display and search, so you know whether to improve what you have or start again.',
    },
  },

  {
    slug: 'general-web-agency',
    title: 'A care specialist vs a general digital agency',
    metaTitle: 'Care Specialist Agency vs General Digital Agency',
    metaDescription:
      'A general web agency can build a beautiful site. What a care provider gains or gives up by choosing an agency that only works in care, and when a general agency is the better fit.',
    hubSummary:
      'Good general agencies build good websites. The difference is whether they already know how families choose care, what CQC expects, and which searches bring enquiries.',
    hero: {
      eyebrow: 'Compare: general digital agencies',
      before: 'A general agency,',
      highlight: 'or one that only works in care?',
      intro: [
        'Many care providers work with a local web agency that also builds sites for solicitors, garages and restaurants. Some of those sites are very good.',
        'A specialist is not automatically better. What changes is how much of the project is spent learning your sector, and who carries that cost. Here is an even handed look, including when a general agency is the better choice.',
      ],
      points: ['What generalists do well', 'The care knowledge gap', 'When to choose one'],
    },
    columns: {
      us: { table: 'Care specialist', phone: 'Care', full: 'Specialist' },
      them: { table: 'General agency', phone: 'Agency', full: 'Agency' },
    },
    scorecardTitle: 'A care specialist vs a general agency',
    scorecardFooter: 'A dash means it depends on the agency. Ask to see care work they have done.',
    tableHeading: 'Side by side',
    rows: [
      {
        criterion: 'Design and build quality',
        trg: 'yes',
        them: 'yes',
        note: 'Plenty of general agencies build beautiful, fast websites.',
      },
      {
        criterion: 'Understands how families choose care',
        trg: 'yes',
        them: 'some',
        note: 'Funding worries, guilt, the late night search on a phone. It shapes every page.',
        short: 'Knows how families choose',
      },
      {
        criterion: 'Knows CQC and what you must show',
        trg: 'yes',
        them: 'no',
        note: 'The rating widget, registered details, how to talk about a report. Rarely in a general brief unless you raise it.',
        short: 'Knows CQC',
      },
      {
        criterion: 'Tools families use, ready built',
        trg: 'yes',
        them: 'no',
        note: 'Funding calculators, availability, fee explainers. A general agency would build them from scratch.',
        short: 'Family tools',
      },
      {
        criterion: 'Ranks for care searches in your town',
        trg: 'yes',
        them: 'some',
        note: 'Good SEO agencies know local search. Care searches have their own patterns and competitors.',
      },
      {
        criterion: 'Carer recruitment pages',
        trg: 'yes',
        them: 'some',
        note: 'Recruitment in care is its own market, with its own searches and job boards.',
      },
      {
        criterion: 'Wider creative services',
        trg: 'some',
        them: 'yes',
        note: 'Large agencies may offer a wider range of creative work, such as video production, under one roof.',
      },
      {
        criterion: 'Experience across many sectors',
        trg: 'no',
        them: 'yes',
        note: 'We only work in care. If you run other businesses too, a generalist can serve them all.',
        short: 'Works across sectors',
      },
    ],
    sections: [
      {
        heading: 'What a good general agency does well',
        paragraphs: [
          'A capable general agency brings solid design, a proper build process and project management. Many are local, which makes meeting in person easy. Larger ones may offer branding, video, print and advertising under one roof, which is convenient if you want one supplier for everything.',
          'Their breadth can be a strength too. An agency that has worked in retail or hospitality may bring ideas that care websites have not tried. If they are willing to learn your sector properly, the result can be very good.',
        ],
      },
      {
        heading: 'Where the care knowledge gap shows',
        paragraphs: [
          'The gap is rarely about skill. It is about how much the agency has to learn before the site starts working, and whose budget pays for it.',
        ],
        sub: [
          {
            heading: 'How families actually choose care',
            body: 'A family looking for care is often under pressure, worried about money and reading on a phone. They want fees, funding, the CQC rating, photos of real rooms and a person to call. A general agency will usually find this out eventually. A specialist starts there.',
          },
          {
            heading: 'CQC and Regulation 20A',
            body: 'Your current rating must be shown clearly on your website. It is simple to do and easy to miss if nobody on the project has run a care service. Check any site with our free [CQC rating display checker](/tools/cqc-rating-display-checker).',
          },
          {
            heading: 'Accessibility for older visitors',
            body: 'Design trends favour light grey text and small type. Care websites need the opposite: large, high contrast text, simple menus and big buttons. See [how we approach accessible websites](/accessible-websites).',
          },
          {
            heading: 'Local search for care',
            body: 'Care searches in most towns are crowded with directories and large groups. Winning "care homes in [town]" takes local service pages, a strong Google Business Profile and content that answers family questions. It is a different job from ranking a shop. Our [competitor snapshot](/tools/care-competitor-snapshot) shows the local picture in a few minutes.',
          },
          {
            heading: 'Care data and GDPR',
            body: 'Family enquiries often include a relative’s health details, which is special category data under UK GDPR. A general agency will know GDPR, but may not have thought about what a care enquiry form should and should not ask.',
          },
        ],
      },
      {
        heading: 'What a specialist gives up',
        paragraphs: [
          'We only work in care, so we cannot also build the website for your other business.',
          'Our founder has more than 20 years in digital and years working inside care. That shapes how we build, but it is fair to judge us on the work rather than the claim. You can see [the sites we have built](/work) and test them with the same tools we use.',
        ],
      },
    ],
    rightChoice: {
      heading: 'When a general agency is the right choice',
      paragraphs: [
        'If you already have a good relationship with an agency that has built care sites before and can show you how they perform, there may be no reason to change.',
        'If care is one part of a wider group, with a hotel, a nursery or a retail business alongside it, one agency for everything may be simpler and cheaper to manage.',
      ],
    },
    checklist: {
      heading: 'Before you sign with any agency',
      items: [
        'Show us care websites you have built, and how they perform.',
        'Who will own the domain, hosting and every login?',
        'How will you protect our current Google rankings?',
        'What will you report each month: enquiries, or just visits?',
        'How will the CQC rating be shown and kept current?',
        'Who will we actually speak to week to week?',
      ],
      footer: 'Ask us the same questions, and hold us to the answers. See [our commitment page](/our-commitment).',
    },
    faqs: [
      [
        'Can a general agency build a good care website?',
        'Yes, a good one can, particularly if they have built for care before and you give them time to learn. Ask to see care work and how it performs, not just how it looks.',
      ],
      [
        'Is a care specialist always more expensive?',
        'Not necessarily. Specialist and general agency fees are often in a similar range. The difference is how much of the project is spent learning the sector.',
      ],
      [
        'We already have an agency. Should we switch?',
        'Only if the site is not bringing the enquiries you need. Start with a free audit of what you have. Often a few care specific fixes help more than a new supplier.',
      ],
      [
        'Can a specialist work alongside our existing agency?',
        'Yes. Some providers keep a general agency for branding or print and use a specialist for the website and search. It works well when the roles are clear.',
      ],
    ],
    related: [WHO_OWNS],
    cta: {
      title: 'See where your site stands first',
      body: 'A free audit shows what your current site does well and what it is missing, whoever you choose to fix it.',
    },
  },

  {
    slug: 'own-website-vs-directory-listing',
    title: 'Your own website vs directory listings',
    metaTitle: 'Your Own Care Website vs Relying on Directory Listings',
    metaDescription:
      'carehome.co.uk, Autumna and Lottie can bring enquiries and reviews. What a directory is good for, what only your own website can do, and how to run both without depending on either.',
    hubSummary:
      'Directories are live today and carry reviews families trust. Your own website is the channel you control. Most providers do best with both, in the right roles.',
    hero: {
      eyebrow: 'Compare: care directories',
      before: 'Your own website,',
      highlight: 'or just the directories?',
      intro: [
        'Directories such as carehome.co.uk, Autumna and Lottie are where many families start looking. A listing is quick to set up, and reviews on carehome.co.uk in particular carry real weight with families.',
        'This page is not about which directory to choose or what each one costs. It is about the role each channel should play, and what happens when a directory is the only one you have.',
      ],
      points: ['What directories do well', 'What only your site can do', 'How to run both'],
    },
    columns: {
      us: { table: 'Your own website', phone: 'Own site', full: 'Own site' },
      them: { table: 'Directories only', phone: 'Listing', full: 'Directory' },
    },
    scorecardTitle: 'Your own site vs directories only',
    scorecardFooter: 'Directories win on speed and reviews. Your own site wins on control.',
    tableHeading: 'Side by side',
    rows: [
      {
        criterion: 'Live today',
        trg: 'no',
        them: 'yes',
        note: 'A listing can be up this week. A good website takes weeks to build and months to rank.',
        short: 'Live today',
      },
      {
        criterion: 'Reviews families already trust',
        trg: 'some',
        them: 'yes',
        note: 'Directory reviews are a genuine strength. Your own site can point families to them.',
        short: 'Trusted reviews',
      },
      {
        criterion: 'Ranks for "care homes in [town]"',
        trg: 'some',
        them: 'yes',
        note: 'Big directories rank strongly for town searches. Your own site can rank too, with local pages and time.',
      },
      {
        criterion: 'You own the page and the enquiry',
        trg: 'yes',
        them: 'no',
        note: 'On a directory, the enquiry reaches you through someone else’s platform, on their terms.',
        short: 'You own the enquiry',
      },
      {
        criterion: 'Only you on the page',
        trg: 'yes',
        them: 'some',
        note: 'A directory page usually sits among other providers in your area. Your site is only about you.',
      },
      {
        criterion: 'Room to tell your full story',
        trg: 'yes',
        them: 'some',
        note: 'Fees, funding help, your CQC rating, real photos, your team, your approach to care. Directories give you a profile shape.',
      },
      {
        criterion: 'Brings carer applications',
        trg: 'yes',
        them: 'no',
        note: 'Care directories are built for families. Recruitment needs pages of your own.',
      },
      {
        criterion: 'Keeps working if you stop paying',
        trg: 'yes',
        them: 'some',
        note: 'A basic free listing usually stays. Upgraded placement stops when the payments do. Your pages keep ranking.',
        short: 'Keeps working',
      },
    ],
    sections: [
      {
        heading: 'What directories do well',
        paragraphs: [
          'Directories solve a real problem for families: they put many providers side by side, with reviews, in one place. The large ones rank strongly for care searches in most towns, so a listing gets you in front of families from the day it goes live.',
          'Reviews are the biggest strength. A family who reads a run of honest, recent reviews from other families is far more reassured than by anything you write about yourself. For a new service with no search history, a directory may be the only way to be found at all in the first few months.',
        ],
      },
      {
        heading: 'What only your own website can do',
        paragraphs: [
          'A directory profile has a fixed shape. It can hold the basics, but it cannot be the place a family goes to understand your fees, your funding options, your approach to dementia care, or who your manager is. Your own site can, and it is where most families go after they have found you anywhere else.',
        ],
        sub: [
          {
            heading: 'You control what they see',
            body: 'On a directory, your profile sits among neighbouring providers. On your own site, the family sees only you, your photos, your rating and your phone number.',
          },
          {
            heading: 'You own the enquiry',
            body: 'Enquiries from your own site come straight to you, with no third party deciding how they are passed on. That also makes UK GDPR simpler, because you know exactly where family data goes. See why this matters in [why your own website beats renting leads](/blog/own-your-care-home-enquiries).',
          },
          {
            heading: 'It builds value over time',
            body: 'Every useful page you publish keeps working. A guide to funding, a page for each town you serve, a clear fees page: they gather visits for years. Spend on a directory stops working when you stop spending.',
          },
          {
            heading: 'It recruits as well',
            body: 'Care directories are built for families, not carers. Your own [recruitment pages](/carer-recruitment) are where applications come from.',
          },
          {
            heading: 'It shows your CQC rating properly',
            body: 'Regulation 20A requires your rating on your own website. A directory listing does not replace that. Our [CQC rating display checker](/tools/cqc-rating-display-checker) will tell you whether yours is showing.',
          },
        ],
      },
      {
        heading: 'How to run both',
        paragraphs: [
          'For most providers, the answer is not one or the other. Keep your directory profiles complete and current, and keep asking families for reviews. Link your directory profiles to your website, and make sure the name, address and phone number match everywhere.',
          'Then build the channel you own alongside. Track where every enquiry comes from, including the phone calls. After six months you will know which directories earn their place and whether your own site is pulling its weight. Our guide to [what care directories actually cost per enquiry](/blog/what-care-directories-cost-per-enquiry) shows how to work it out, and [Autumna, Lottie and the paid directories compared](/blog/care-home-directories-compared) looks at the options one by one.',
          'If you only have the budget for one thing this month, a complete, well reviewed [Google Business Profile](/google-business-profile) is free and often does more than either.',
        ],
      },
    ],
    rightChoice: {
      heading: 'When relying on directories is the right choice',
      paragraphs: [
        'If you are opening a new service and need enquiries in the next few weeks, a directory listing is the fastest way to be found. Start there, and build your own site while it works.',
        'If you have very few vacancies and a waiting list, a well reviewed directory profile and a simple website may be all you need. There is no prize for over investing.',
        'If a particular directory brings you good enquiries at a cost per admission you are happy with, keep paying for it. The point is to measure, not to quit. We cover one directory in detail in [is carehome.co.uk worth it for a care home?](/blog/is-carehome-co-uk-worth-it)',
      ],
    },
    checklist: {
      heading: 'A quick check of your channels',
      items: [
        'Every directory profile is complete, with current photos.',
        'Every profile links to your own website.',
        'Name, address and phone number match everywhere.',
        'You ask every family for a review, on the platform they use.',
        'Each enquiry is logged with where it came from.',
        'Your CQC rating shows on your own website.',
      ],
      footer: 'See how you compare locally with our free [care competitor snapshot](/tools/care-competitor-snapshot).',
    },
    faqs: [
      [
        'Should we stop paying for directory listings?',
        'Not straight away. Directories bring reviews and some enquiries. Measure what each one costs per admission, build a channel you own alongside it, then decide with numbers.',
      ],
      [
        'Do we still need a website if we are on carehome.co.uk?',
        'Yes. Families usually check your own website before they call, and Regulation 20A requires your CQC rating to be shown on it. A directory profile does not replace either.',
      ],
      [
        'Can our own website outrank the directories?',
        'Sometimes, particularly for searches about your own services and your own town. Big directories rank strongly, so the aim is usually to appear alongside them, not to beat them everywhere.',
      ],
      [
        'Is this relevant for home care and supported living too?',
        'Yes. Directories cover many kinds of care provider, and the same balance applies: use them for reach and reviews, and use your own site for control, detail and recruitment.',
      ],
    ],
    related: [
      { slug: 'own-your-care-home-enquiries', title: 'Why your own website beats renting leads' },
      { slug: 'what-care-directories-cost-per-enquiry', title: 'What care directories actually cost per enquiry' },
      { slug: 'care-home-directories-compared', title: 'Autumna, Lottie and the paid care directories compared' },
      { slug: 'is-carehome-co-uk-worth-it', title: 'Is carehome.co.uk worth it for a care home?' },
    ],
    cta: {
      title: 'See how your own site performs',
      body: 'A free audit shows whether your website is ready to carry more of your enquiries, and what to fix first.',
    },
  },
]

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug)
}
