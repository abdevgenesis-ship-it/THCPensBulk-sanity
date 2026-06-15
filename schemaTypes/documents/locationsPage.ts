import {defineField, defineType} from 'sanity'

export const locationsPage = defineType({
  name: 'locationsPage',
  title: 'Locations Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Locations',
      validation: (rule) => rule.required().min(3).max(120),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(40).max(320),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
      validation: (rule) => rule.required().min(8).max(180),
    }),
    defineField({
      name: 'heroIntro',
      title: 'Hero intro',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(20).max(600),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last updated',
      type: 'date',
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Map Embed URL',
      type: 'url',
      validation: (rule) => rule.required().uri({allowRelative: false, scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'usStates',
      title: 'US States',
      type: 'array',
      of: [{type: 'string'}],
      validation: (rule) => rule.required().min(50),
    }),
    defineField({
      name: 'internationalCoverage',
      title: 'International Coverage',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required().min(2).max(80),
            }),
            defineField({
              name: 'details',
              title: 'Details',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().min(20).max(240),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'details',
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'complianceNotes',
      title: 'Compliance Notes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'region',
              title: 'Region',
              type: 'string',
              validation: (rule) => rule.required().min(2).max(80),
            }),
            defineField({
              name: 'note',
              title: 'Note',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().min(20).max(240),
            }),
          ],
          preview: {
            select: {
              title: 'region',
              subtitle: 'note',
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'sections',
      title: 'Content sections',
      type: 'array',
      of: [{type: 'legalSection'}],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
