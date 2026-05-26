insert into care_homes (
  slug, name, location, postcode, phone_display, phone_tracking,
  cqc_rating, care_types, hero_image_url, brand, content, is_active,
  bed_target, weekly_bed_value_pennies
) values (
  'oakwood-manor',
  'Oakwood Manor Care Home',
  'Guildford, Surrey',
  'GU1 1AA',
  '01483 000 000',
  '{"number": "01483000000", "ga4_event": "phone_click", "gads_label": "AbCdEfGh"}'::jsonb,
  'Good',
  ARRAY['Residential Care', 'Dementia Care', 'Respite Care'],
  null,
  '{"primary_color": "#6b4423"}'::jsonb,
  '{
    "tagline": "Trusted residential care in the heart of Surrey",
    "headline": "Find the *perfect* care home for your loved one",
    "subheadline": "Oakwood Manor offers compassionate, person-centred residential care. Enquire today for a free, no-obligation tour.",
    "hero_points": [
      "Free, no-obligation assessment",
      "Immediate availability in most cases",
      "Speak to our care team within 2 hours"
    ],
    "trust_items": [
      {"icon": "cqc", "label": "CQC Rated Good"},
      {"icon": "years", "label": "25 Years Experience"},
      {"icon": "staff", "label": "24/7 Qualified Staff"},
      {"icon": "meals", "label": "Chef-prepared Meals"}
    ],
    "how_it_works": [
      {"step": 1, "title": "Submit your enquiry", "body": "Tell us a little about your loved one and their care needs using our simple form."},
      {"step": 2, "title": "Speak with our team", "body": "One of our experienced care advisors will call you within 2 hours to discuss your options."},
      {"step": 3, "title": "Visit & decide", "body": "Arrange a free tour of our home and meet the team before making any decisions."}
    ],
    "about_title": "About Oakwood Manor",
    "about_body": "Oakwood Manor is a welcoming residential care home nestled in the heart of Guildford, Surrey. We provide compassionate, person-centred care for older people, including specialist support for those living with dementia.\n\nOur dedicated team of qualified care professionals are available 24 hours a day, 7 days a week, ensuring your loved one receives the attention and support they need. We pride ourselves on creating a homely environment where residents feel safe, valued, and part of our family.",
    "testimonials": [
      {
        "quote": "From the moment we contacted Oakwood Manor, the team made us feel at ease. Mum has settled in beautifully and the care she receives is exceptional.",
        "name": "Sarah T.",
        "relation": "Daughter of resident",
        "rating": 5
      }
    ],
    "faqs": [
      {
        "q": "How quickly can my loved one move in?",
        "a": "In many cases we can accommodate new residents within 48 hours, subject to a care needs assessment. Contact us today to discuss availability."
      },
      {
        "q": "What does the weekly care fee include?",
        "a": "Our weekly fee covers accommodation, all meals and snacks, personal care, activities and entertainment, and 24-hour staff support."
      },
      {
        "q": "Can we visit before making a decision?",
        "a": "Absolutely. We encourage families to visit and meet the team before making any decisions. Tours are completely free and there is no obligation to proceed."
      },
      {
        "q": "Does Oakwood Manor specialise in dementia care?",
        "a": "Yes, we have a dedicated dementia care unit with specially trained staff and a secure environment designed to support those living with dementia."
      }
    ],
    "final_cta_headline": "Ready to find out more?",
    "final_cta_body": "Our friendly team is ready to answer your questions and help you find the right care for your loved one.",
    "form": {
      "title": "Get in touch today",
      "subtitle": "Free, no-obligation enquiry",
      "cta_label": "Send my enquiry",
      "care_type_options": ["Residential Care", "Dementia Care", "Respite Care", "Nursing Care"],
      "timeframe_options": ["As soon as possible", "Within 1 month", "1-3 months", "3-6 months", "Just researching"]
    }
  }'::jsonb,
  true,
  40,
  120000
);
