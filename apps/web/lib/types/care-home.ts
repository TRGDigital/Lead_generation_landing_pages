export interface TrustItem {
  icon: string
  label: string
}

export interface HowItWorksStep {
  step: number
  title: string
  body: string
}

export interface Testimonial {
  quote: string
  name: string
  relation: string
  rating: number
}

export interface FAQ {
  q: string
  a: string
}

export interface FormConfig {
  title: string
  subtitle: string
  cta_label: string
  care_type_options: string[]
  timeframe_options: string[]
}

export interface CareHomeContent {
  tagline: string
  headline: string
  subheadline: string
  hero_points: string[]
  trust_items: TrustItem[]
  how_it_works: HowItWorksStep[]
  about_title: string
  about_body: string
  about_image_url?: string
  testimonials: Testimonial[]
  faqs: FAQ[]
  final_cta_headline: string
  final_cta_body: string
  footer_text?: string
  privacy_url?: string
  terms_url?: string
  form: FormConfig
}

export interface CareHomeBrand {
  primary_color?: string
  accent_color?: string
  logo_url?: string
}

export interface PhoneTracking {
  number: string
  ga4_event?: string
  gads_label?: string
}
