import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar Text',
      type: 'string',
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: 'announcementHref',
      title: 'Announcement Link',
      type: 'string',
      initialValue: '/how-to-buy',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'footerWarningText',
      title: 'Footer Warning Text',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'footerComplianceText',
      title: 'Footer Compliance Text',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'homepageBadge',
      title: 'Homepage Badge',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'homepageHeading',
      title: 'Homepage Heading',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'homepageSubheading',
      title: 'Homepage Subheading',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'homepageNextStepTitle',
      title: 'Homepage Next Step Title',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'homepageNextStepDescription',
      title: 'Homepage Next Step Description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site Settings'}),
  },
})
