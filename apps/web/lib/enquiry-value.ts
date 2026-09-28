// Enquiry value engine for the Enquiry Value Calculator.
// Pure functions, no side effects. Puts a pound figure on a single enquiry, on one new
// resident or client, and on the enquiries lost at each stage of the funnel.
//
// Core idea:
//   lifetime value of one admission = weekly fee x weeks of stay
//   value of one enquiry            = lifetime value x (enquiry to viewing %) x (viewing to admission %)

export type EnquiryService = 'residential' | 'nursing' | 'homecare'

export interface EnquiryValueInputs {
  service: EnquiryService
  weeklyFee: number // £/week, care homes (residential / nursing)
  hourlyRate: number // £/hour, home care
  hoursPerWeek: number // hours per week, home care
  stayMonths: number // average length of stay, or average package duration for home care
  enquiriesPerMonth: number
  toViewingPct: number // % of enquiries that reach a viewing (care home) or assessment (home care)
  toAdmissionPct: number // % of viewings / assessments that become an admission / care start
  useMargin: boolean // show contribution (profit) figures alongside fee income
  marginPct: number // contribution margin % applied to fee income when useMargin is on
  upliftPct: number // what if: convert this % more of your enquiries (relative uplift)
  extraEnquiries: number // what if: this many extra enquiries a month
}

export interface StageLoss {
  count: number // people lost at this stage per year
  value: number // lifetime fee value those people represented, per year
}

export interface EnquiryValueResult {
  weeklyIncome: number // £/week from one resident / client
  stayWeeks: number
  lifetimeValue: number // fee income from one admission over the full stay
  conversionPct: number // overall enquiry to admission %
  enquiryValue: number // THE HEADLINE: lifetime value x overall conversion
  viewingValue: number // value of one viewing / assessment (lifetime value x viewing to admission)
  viewingsPerMonth: number
  admissionsPerMonth: number
  admissionsPerYear: number
  enquiriesPerYear: number
  annualNewBusiness: number // lifetime fee value of a year of admissions from current enquiries
  lostBeforeViewing: StageLoss // enquiries that never reached a viewing, valued at a viewing's worth
  lostAfterViewing: StageLoss // viewings that did not convert, valued at a full admission each
  totalLost: number
  upliftValue: number // extra lifetime value per year from converting upliftPct% more
  upliftAdmissions: number // extra admissions per year from the uplift
  extraEnquiryValue: number // extra lifetime value per year from extraEnquiries a month
  extraEnquiryAdmissions: number // extra admissions per year from the extra enquiries
  margin: number // 0 to 1 multiplier applied for contribution figures (1 when useMargin is off)
}

export const WEEKS_PER_MONTH = 52 / 12

type ServiceDefaults = Pick<
  EnquiryValueInputs,
  'weeklyFee' | 'hourlyRate' | 'hoursPerWeek' | 'stayMonths' | 'enquiriesPerMonth' | 'toViewingPct' | 'toAdmissionPct'
>

// Sensible UK starting points. Every one is editable in the tool.
export const SERVICE_DEFAULTS: Record<EnquiryService, ServiceDefaults> = {
  residential: {
    weeklyFee: 1300,
    hourlyRate: 30,
    hoursPerWeek: 10,
    stayMonths: 24,
    enquiriesPerMonth: 10,
    toViewingPct: 40,
    toAdmissionPct: 50,
  },
  nursing: {
    weeklyFee: 1550,
    hourlyRate: 30,
    hoursPerWeek: 10,
    stayMonths: 12,
    enquiriesPerMonth: 10,
    toViewingPct: 40,
    toAdmissionPct: 50,
  },
  homecare: {
    weeklyFee: 300,
    hourlyRate: 30,
    hoursPerWeek: 10,
    stayMonths: 12,
    enquiriesPerMonth: 10,
    toViewingPct: 50,
    toAdmissionPct: 60,
  },
}

export const BASE_DEFAULTS: EnquiryValueInputs = {
  service: 'residential',
  ...SERVICE_DEFAULTS.residential,
  useMargin: false,
  marginPct: 25,
  upliftPct: 20,
  extraEnquiries: 5,
}

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0)
const pct = (n: number) => Math.min(100, pos(n)) / 100

export function weeklyIncome(i: EnquiryValueInputs): number {
  return i.service === 'homecare' ? pos(i.hourlyRate) * pos(i.hoursPerWeek) : pos(i.weeklyFee)
}

export function computeEnquiryValue(i: EnquiryValueInputs): EnquiryValueResult {
  const weekly = weeklyIncome(i)
  const stayWeeks = pos(i.stayMonths) * WEEKS_PER_MONTH
  const lifetimeValue = weekly * stayWeeks

  const v = pct(i.toViewingPct)
  const a = pct(i.toAdmissionPct)
  const conversion = v * a

  const enquiries = pos(i.enquiriesPerMonth)
  const viewingsPerMonth = enquiries * v
  const admissionsPerMonth = viewingsPerMonth * a
  const admissionsPerYear = admissionsPerMonth * 12
  const enquiriesPerYear = enquiries * 12

  const enquiryValue = lifetimeValue * conversion
  const viewingValue = lifetimeValue * a

  // Losses, per year. An enquiry that never reaches a viewing is worth what a viewing is worth
  // (it would still have had to convert). A viewing that does not convert is a full admission lost.
  const lostBeforeCount = enquiriesPerYear * (1 - v)
  const lostAfterCount = enquiriesPerYear * v * (1 - a)
  const lostBeforeViewing = { count: lostBeforeCount, value: lostBeforeCount * viewingValue }
  const lostAfterViewing = { count: lostAfterCount, value: lostAfterCount * lifetimeValue }

  const upliftAdmissions = admissionsPerYear * (pos(i.upliftPct) / 100)
  const extraEnquiryAdmissions = pos(i.extraEnquiries) * 12 * conversion

  return {
    weeklyIncome: weekly,
    stayWeeks,
    lifetimeValue,
    conversionPct: conversion * 100,
    enquiryValue,
    viewingValue,
    viewingsPerMonth,
    admissionsPerMonth,
    admissionsPerYear,
    enquiriesPerYear,
    annualNewBusiness: admissionsPerYear * lifetimeValue,
    lostBeforeViewing,
    lostAfterViewing,
    totalLost: lostBeforeViewing.value + lostAfterViewing.value,
    upliftValue: upliftAdmissions * lifetimeValue,
    upliftAdmissions,
    extraEnquiryValue: extraEnquiryAdmissions * lifetimeValue,
    extraEnquiryAdmissions,
    margin: i.useMargin ? pct(i.marginPct) : 1,
  }
}

// Wording that switches with the service type, so a home care agency never reads "care home".
export function enquiryWords(service: EnquiryService) {
  if (service === 'homecare') {
    return {
      viewing: 'assessment',
      viewings: 'assessments',
      Viewing: 'Assessment',
      admission: 'new client',
      admissions: 'new clients',
      Admission: 'New client',
      person: 'client',
      stay: 'package length',
      Stay: 'Average package length',
      business: 'service',
    }
  }
  return {
    viewing: 'viewing',
    viewings: 'viewings',
    Viewing: 'Viewing',
    admission: 'admission',
    admissions: 'admissions',
    Admission: 'Admission',
    person: 'resident',
    stay: 'length of stay',
    Stay: 'Average length of stay',
    business: 'home',
  }
}
