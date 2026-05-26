// All user-facing strings in the portal use "enquiry"/"enquiries".
// Code, DB, types, and internal logs continue to use "lead"/"leads".

export const COPY = {
  // Generic
  enquiry: 'enquiry',
  enquiries: 'enquiries',
  Enquiry: 'Enquiry',
  Enquiries: 'Enquiries',

  // Status labels — what the care home manager sees
  status: {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    tour_booked: 'Tour booked',
    tour_completed: 'Tour completed',
    assessed: 'Assessed',
    converted: 'Converted',
    moved_in: 'Moved in',
    lost: 'Not suitable',
  } as Record<string, string>,

  // Actions
  markContacted: 'Mark contacted',
  qualify: 'Qualify this enquiry',
  qualified: '✓ Qualified',
  notQualified: '✗ Not qualified',
  bookTour: 'Tour booked',
  completeTour: 'Tour completed',
  markAssessed: 'Mark assessed',
  moveIn: 'Moved in',
  markLost: 'Not suitable',
  addNote: 'Save note',

  // Disqualification reasons
  disqualifyReasons: [
    { value: 'out_of_area', label: 'Out of our area' },
    { value: 'wrong_care_type', label: 'Wrong care type' },
    { value: 'no_budget', label: 'Budget not suitable' },
    { value: 'uncontactable', label: 'Unable to reach' },
    { value: 'duplicate', label: 'Duplicate enquiry' },
    { value: 'other', label: 'Other reason' },
  ],

  // Campaign
  campaignOn: 'Campaign on — accepting enquiries',
  campaignOff: 'Campaign paused',
  turnOffConfirmTitle: 'Pause campaign?',
  turnOffConfirmBody:
    'Your landing page will be hidden and you will stop receiving new enquiries. You can turn it back on at any time.',
  turnOffConfirm: 'Yes, pause',
  turnOffCancel: 'Keep running',

  // Dashboard
  dashboardTitle: 'Dashboard',
  thisWeek: 'This week',
  newEnquiries: 'New enquiries',
  qualified_count: 'Qualified',
  toursBooked: 'Tours booked',
  moveIns: 'Move-ins',
  unreviewed: 'Unreviewed enquiries',
  unreviewedAlert: (n: number) =>
    `${n} enquer${n === 1 ? 'y' : 'ies'} waiting more than 24 hours`,

  // Inbox
  inboxTitle: 'Enquiries',
  needsAction: 'Needs action',
  allEnquiries: 'All enquiries',
  noEnquiries: 'No enquiries yet',
  noEnquiriesHint: 'Turn on the campaign to start receiving enquiries.',
  callLabel: 'Call',
  emailLabel: 'Email',
  receivedLabel: 'Received',

  // Detail
  enquiryFrom: (name: string) => `Enquiry from ${name}`,
  residentLabel: 'Resident',
  careTypeLabel: 'Care type',
  timingLabel: 'Timing',
  messageLabel: 'Message',
  notesLabel: 'Notes',
  notesPlaceholder: 'Add private notes about this enquiry…',
  activityLabel: 'Activity',

  // Account
  accountTitle: 'Account',
  profileLabel: 'Profile',
  notificationsLabel: 'Notifications',
  emailNewEnquiry: 'Email me when a new enquiry arrives',
  smsNewEnquiry: 'Text me when a new enquiry arrives',
  careHomeLabel: 'Your care home',
  signOut: 'Sign out',
  adminChangeNote: 'Need to update care home details? Contact your account manager.',
} as const
