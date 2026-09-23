// Topic hubs: a page per subject that gathers the posts about it and links out to the
// matching services. This gives the blog a shape Google can follow (hub -> posts -> hub)
// instead of 18 loose posts, and gives us pages that can rank for the broad terms.
//
// Membership is explicit rather than derived from categories, because categories are one
// per post and a post often belongs in more than one topic.

export type Topic = {
  slug: string
  name: string
  /** Page title and intro. */
  title: string
  intro: string
  /** Shown on each post that belongs to the topic. */
  shortLabel: string
  posts: string[]
  services: { href: string; label: string }[]
}

export const TOPICS: Topic[] = [
  {
    slug: 'filling-empty-beds',
    name: 'Filling empty beds',
    title: 'Filling empty care home beds',
    intro:
      'An empty bed is revenue you never get back, and the work that fills it starts long before a family calls. These articles cover what a vacancy really costs, where new residents come from, how discharge teams choose a home and how to turn enquiries into admissions.',
    shortLabel: 'filling empty beds',
    posts: [
      'fill-empty-care-home-beds-faster',
      'generate-new-care-home-enquiries',
      'how-to-increase-nursing-home-enquiries',
      'how-do-hospital-discharge-teams-find-care-homes-for-patients',
      'how-do-care-home-discharge-teams-find-homes-like-yours',
      'replying-to-care-home-enquiries',
      'nursing-home-weekly-funding-gap',
    ],
    services: [
      { href: '/marketing', label: 'Care sector marketing and enquiry generation' },
      { href: '/conversion-rate-optimisation', label: 'Turning more visitors into enquiries' },
      { href: '/nursing-homes', label: 'Marketing and websites for nursing homes' },
    ],
  },
  {
    slug: 'being-found-locally',
    name: 'Being found locally',
    title: 'Being found by families searching locally',
    intro:
      'Care is a local decision, and most of it is decided in the search results before anyone picks up the phone. These articles explain how local search works for care providers, what decides who Google shows first, and the pages you need for each town you serve.',
    shortLabel: 'being found locally',
    posts: [
      'local-seo-for-care-homes-nursing-homes',
      'care-homes-near-me-explained',
      'local-pages-every-care-home-should-have',
      'nursing-home-seo',
      'google-searches-into-care-enquiries',
      'families-asking-chatgpt-for-carehome-recommendations',
    ],
    services: [
      { href: '/local-seo', label: 'Local SEO for care providers' },
      { href: '/seo', label: 'SEO for care homes and nursing homes' },
      { href: '/google-business-profile', label: 'Google Business Profile and reviews' },
    ],
  },
  {
    slug: 'care-websites',
    name: 'Care websites',
    title: 'Websites that win care enquiries',
    intro:
      'A care website has to do more than look tidy: it has to answer the questions families ask, load quickly on a phone and make enquiring easy. These articles cover what loses enquiries, what a proper build includes and why cheap website builders cost more in the end.',
    shortLabel: 'care websites',
    posts: [
      'care-home-website-losing-enquiries',
      'new-care-home-website',
      'nursing-home-new-website',
      'introduction-to-careassura',
      'introduction-to-carestreamai',
    ],
    services: [
      { href: '/website-development', label: 'Care home website development' },
      { href: '/website-build', label: "What's included in a care website build" },
      { href: '/accessible-websites', label: 'Accessible websites for care providers' },
    ],
  },
]

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug)
}

/** The topics a post belongs to, for the "part of" line on the post itself. */
export function topicsForPost(slug: string): Topic[] {
  return TOPICS.filter((t) => t.posts.includes(slug))
}
