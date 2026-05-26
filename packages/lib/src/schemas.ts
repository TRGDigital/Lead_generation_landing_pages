import { z } from 'zod'

export const EnquiryFormSchema = z.object({
  careHomeId: z.string().uuid(),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number').max(20),
  residentName: z.string().max(100).optional(),
  careType: z.string().max(50).optional(),
  moveInTimeframe: z.string().max(50).optional(),
  message: z.string().max(1000).optional(),
  companyWebsite: z.string().max(0, ''), // honeypot — must be empty
})

export type EnquiryFormValues = z.infer<typeof EnquiryFormSchema>

export const LeadSubmissionSchema = EnquiryFormSchema.extend({
  idempotencyKey: z.string().uuid().optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmContent: z.string().max(200).optional(),
  utmTerm: z.string().max(200).optional(),
  gclid: z.string().max(200).optional(),
})

export type LeadSubmissionValues = z.infer<typeof LeadSubmissionSchema>

// ── Admin schemas ─────────────────────────────────────────────────────────────

const LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'tour_booked',
  'tour_completed',
  'assessed',
  'converted',
  'moved_in',
  'lost',
] as const

export const LeadStatusUpdateSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(LEAD_STATUSES),
  note: z.string().max(1000).optional(),
  weeklyFeePennies: z.number().int().positive().optional(),
  disqualificationReason: z.string().max(500).optional(),
})

export type LeadStatusUpdateValues = z.infer<typeof LeadStatusUpdateSchema>

export const UserInviteSchema = z.object({
  careHomeId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['owner', 'manager', 'viewer']),
})

export type UserInviteValues = z.infer<typeof UserInviteSchema>

export const CareHomeFormSchema = z.object({
  // Basics
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  location: z.string().min(2).max(120),
  postcode: z.string().min(5).max(10),
  phone_display: z.string().min(7).max(30),
  cqc_rating: z.string().max(50).optional(),
  bed_target: z.number().int().min(1).max(500),
  weekly_bed_value_pennies: z.number().int().min(0).optional(),
  is_active: z.boolean(),
  hero_image_url: z.string().url().optional().or(z.literal('')),

  // Brand (flat — assembled to JSONB in action)
  brand_primary_color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex colour')
    .optional()
    .or(z.literal('')),
  brand_accent_color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex colour')
    .optional()
    .or(z.literal('')),
  brand_logo_url: z.string().url().optional().or(z.literal('')),

  // Content
  tagline: z.string().max(200),
  headline: z.string().max(200),
  subheadline: z.string().max(400),
  hero_points: z.array(z.object({ text: z.string().max(120) })),
  about_title: z.string().max(200),
  about_body: z.string().max(3000),
  about_image_url: z.string().url().optional().or(z.literal('')),
  trust_items: z.array(
    z.object({ icon: z.string().max(50), label: z.string().max(100) })
  ),
  how_it_works: z.array(
    z.object({ step: z.number().int(), title: z.string().max(100), body: z.string().max(300) })
  ),
  testimonials: z.array(
    z.object({
      quote: z.string().max(600),
      author: z.string().max(100),
      relation: z.string().max(100),
      rating: z.number().int().min(1).max(5).default(5),
    })
  ),
  faqs: z.array(
    z.object({ question: z.string().max(300), answer: z.string().max(1000) })
  ),
  final_cta_headline: z.string().max(200),
  final_cta_body: z.string().max(600),
  footer_text: z.string().max(600),
  privacy_url: z.string().url().optional().or(z.literal('')),
  terms_url: z.string().url().optional().or(z.literal('')),

  // Form config (flat — assembled in action)
  form_title: z.string().max(200),
  form_subtitle: z.string().max(400),
  form_cta_label: z.string().max(80),

  // Care types (newline-separated in UI — split in action)
  care_type_options_raw: z.string().max(500),
})

export type CareHomeFormValues = z.infer<typeof CareHomeFormSchema>
