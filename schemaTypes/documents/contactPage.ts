import {defineArrayMember, defineField, defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      validation: (rule) => rule.required().min(10).max(120),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(40).max(320),
    }),
    defineField({
      name: 'pageHeading',
      title: 'Page H1',
      type: 'string',
      validation: (rule) => rule.required().min(3).max(120),
    }),
    defineField({
      name: 'introLead',
      title: 'Intro (below H1)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'formHeading',
      title: 'Form card — heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'formIntro',
      title: 'Form card — intro',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'nameFieldLabel',
      title: 'Label — name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'emailFieldLabel',
      title: 'Label — email',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subjectFieldLabel',
      title: 'Label — subject',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'messageFieldLabel',
      title: 'Label — message',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'submitButtonLabel',
      title: 'Submit button label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subjectOptions',
      title: 'Subject dropdown options',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value (stable id, e.g. general)',
              type: 'string',
              validation: (rule) => rule.required().regex(/^[a-z0-9-]+$/),
            }),
            defineField({
              name: 'label',
              title: 'Label (shown to visitors)',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
      validation: (rule) => rule.required().min(1).max(12),
    }),
    defineField({
      name: 'successTitle',
      title: 'Success state — title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'successMessage',
      title: 'Success state — message',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'detailsHeading',
      title: 'Details column — heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Displayed contact email',
      type: 'string',
      description: 'Optional leading “X ” for CMS testing; the site strips it for mailto links.',
      validation: (rule) => rule.required().min(3).max(120),
    }),
    defineField({
      name: 'contactPhone',
      title: 'Displayed phone (optional)',
      type: 'string',
    }),
    defineField({
      name: 'businessHours',
      title: 'Business hours',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'responsePromise',
      title: 'Response time promise',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'paymentsNote',
      title: 'Payments — note above icons',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    prepare: () => ({title: 'Contact Page'}),
  },
})
