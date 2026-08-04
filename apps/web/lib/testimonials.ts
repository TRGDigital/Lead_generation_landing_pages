// Real, attributable client quotes — shown on the homepage Testimonials section
// and the /go/ ad landing pages. INTENTIONALLY EMPTY until real quotes exist
// (trust rule: no invented social proof, ever). Add entries here and both
// surfaces light up automatically.
export type Testimonial = {
  quote: string
  name: string
  role: string // e.g. "Manager, Crossways Residential Care Home"
}

export const TESTIMONIALS: Testimonial[] = []
