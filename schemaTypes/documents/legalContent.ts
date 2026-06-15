import {defineField, defineType} from 'sanity'

export const legalContent = defineType({
  name: 'legalContent',
  title: 'Legal Content',
  type: 'document',
  fields: [
    defineField({
      name: 'supportEmail',
      title: 'Support Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'pactActNotice',
      title: 'PACT Act Notice',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'nicotineWarning',
      title: 'Nicotine Warning',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'thcWarning',
      title: 'THC Warning',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fdaDisclaimer',
      title: 'FDA Disclaimer',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'privacyTitle',
      title: 'Privacy Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'privacyDescription',
      title: 'Privacy Meta Description',
      type: 'string',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'privacyLastUpdated',
      title: 'Privacy Last Updated',
      type: 'date',
    }),
    defineField({
      name: 'privacySections',
      title: 'Privacy Sections',
      type: 'array',
      of: [{type: 'legalSection'}],
      validation: (rule) => rule.required().min(1),
    }),

    defineField({
      name: 'termsTitle',
      title: 'Terms Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'termsDescription',
      title: 'Terms Meta Description',
      type: 'string',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'termsLastUpdated',
      title: 'Terms Last Updated',
      type: 'date',
    }),
    defineField({
      name: 'termsSections',
      title: 'Terms Sections',
      type: 'array',
      of: [{type: 'legalSection'}],
      validation: (rule) => rule.required().min(1),
    }),

    defineField({
      name: 'refundsTitle',
      title: 'Refunds Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'refundsDescription',
      title: 'Refunds Meta Description',
      type: 'string',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'refundsLastUpdated',
      title: 'Refunds Last Updated',
      type: 'date',
    }),
    defineField({
      name: 'refundsSections',
      title: 'Refunds Sections',
      type: 'array',
      of: [{type: 'legalSection'}],
      validation: (rule) => rule.required().min(1),
    }),

    defineField({
      name: 'agePolicyTitle',
      title: 'Age Policy Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'agePolicyDescription',
      title: 'Age Policy Meta Description',
      type: 'string',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'agePolicyLastUpdated',
      title: 'Age Policy Last Updated',
      type: 'date',
    }),
    defineField({
      name: 'agePolicySections',
      title: 'Age Policy Sections',
      type: 'array',
      of: [{type: 'legalSection'}],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Legal Content'}),
  },
})
