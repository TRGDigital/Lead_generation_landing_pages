import { describe, it, expect } from 'vitest'
import {
  EnquiryFormSchema,
  LeadSubmissionSchema,
  LeadStatusUpdateSchema,
  UserInviteSchema,
  CareHomeFormSchema,
} from './schemas'

describe('EnquiryFormSchema', () => {
  const valid = {
    careHomeId: '550e8400-e29b-41d4-a716-446655440000',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '07700900000',
    companyWebsite: '',
  }

  it('accepts valid submission', () => {
    expect(EnquiryFormSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects missing name', () => {
    expect(EnquiryFormSchema.safeParse({ ...valid, fullName: 'J' }).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(EnquiryFormSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false)
  })

  it('rejects non-empty honeypot', () => {
    expect(
      EnquiryFormSchema.safeParse({ ...valid, companyWebsite: 'spam.com' }).success
    ).toBe(false)
  })

  it('rejects short phone', () => {
    expect(EnquiryFormSchema.safeParse({ ...valid, phone: '123' }).success).toBe(false)
  })
})

describe('LeadSubmissionSchema', () => {
  const valid = {
    careHomeId: '550e8400-e29b-41d4-a716-446655440000',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '07700900000',
    companyWebsite: '',
    idempotencyKey: '550e8400-e29b-41d4-a716-446655440001',
    utmSource: 'google',
  }

  it('accepts valid submission with UTM params', () => {
    expect(LeadSubmissionSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects invalid idempotency key', () => {
    expect(
      LeadSubmissionSchema.safeParse({ ...valid, idempotencyKey: 'not-a-uuid' }).success
    ).toBe(false)
  })
})

describe('LeadStatusUpdateSchema', () => {
  it('accepts valid status update', () => {
    expect(
      LeadStatusUpdateSchema.safeParse({
        leadId: '550e8400-e29b-41d4-a716-446655440000',
        status: 'contacted',
      }).success
    ).toBe(true)
  })

  it('accepts moved_in with weekly fee', () => {
    expect(
      LeadStatusUpdateSchema.safeParse({
        leadId: '550e8400-e29b-41d4-a716-446655440000',
        status: 'moved_in',
        weeklyFeePennies: 120000,
      }).success
    ).toBe(true)
  })

  it('rejects unknown status', () => {
    expect(
      LeadStatusUpdateSchema.safeParse({
        leadId: '550e8400-e29b-41d4-a716-446655440000',
        status: 'unknown_status',
      }).success
    ).toBe(false)
  })
})

describe('UserInviteSchema', () => {
  it('accepts valid invite', () => {
    expect(
      UserInviteSchema.safeParse({
        careHomeId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'manager@care.com',
        role: 'manager',
      }).success
    ).toBe(true)
  })

  it('rejects invalid role', () => {
    expect(
      UserInviteSchema.safeParse({
        careHomeId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'manager@care.com',
        role: 'superadmin',
      }).success
    ).toBe(false)
  })
})

describe('CareHomeFormSchema', () => {
  it('rejects slug with spaces', () => {
    const result = CareHomeFormSchema.safeParse({
      name: 'Oakwood Manor',
      slug: 'oakwood manor',
      location: 'London',
      postcode: 'SW1A 1AA',
      phone_display: '020 7946 0000',
      bed_target: 30,
      is_active: true,
      tagline: 'test',
      headline: 'test',
      subheadline: 'test',
      hero_points: [],
      about_title: 'test',
      about_body: 'test',
      trust_items: [],
      how_it_works: [],
      testimonials: [],
      faqs: [],
      final_cta_headline: 'test',
      final_cta_body: 'test',
      footer_text: 'test',
      form_title: 'test',
      form_subtitle: 'test',
      form_cta_label: 'test',
      care_type_options_raw: 'Residential\nNursing',
    })
    expect(result.success).toBe(false)
  })
})
