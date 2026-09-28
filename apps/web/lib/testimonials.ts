// Real, attributable client quotes, shown on the homepage Testimonials section and the
// /reviews page. Trust rule: no invented social proof, ever. Quotes are as the clients gave
// them, with only spelling slips corrected (confirmed with Len, 28 Sept 2026).
export type Testimonial = {
  quote: string
  name: string
  /** The client organisation, as they signed it. */
  org: string
  /** What we did for them, in a few words. */
  service: string
  /** A case study for this client, when there is one. */
  caseStudy?: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'TRG built our new website with more focussed content and a live room availability feature. Since its launch in early August, we have had 5-10 new enquiries weekly and as a result we are currently fully occupied with a waiting list.',
    name: 'Bryoni',
    org: 'Crossways Care Home',
    service: 'New website with live room availability',
    caseStudy: '/work/crossways-care-home',
  },
  {
    quote:
      'We have a new website developed and built by TRG and the process was seamless from start to finish. We incorporated all the nursing home tools TRG offered us and our traffic but importantly enquiries has increased dramatically.',
    name: 'A. Arbery',
    org: 'Ferndale Nursing Home',
    service: 'New website with the nursing home tools',
    caseStudy: '/work/ferndale-nursing-home',
  },
  {
    quote:
      'We’ve been using TRG SEO services for a while now, their understanding of the sector is vast and that has helped with increases in direct enquiries.',
    name: 'R. Mannick',
    org: 'F Healthcare Ltd',
    service: 'Care SEO',
  },
]
