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
