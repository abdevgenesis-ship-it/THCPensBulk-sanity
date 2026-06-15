import {defineField, defineType} from 'sanity'

export const moqPage = defineType({
  name: 'moqPage',
  title: 'MOQ Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Wholesale MOQ',
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
      name: 'moqExamples',
      title: 'MOQ Examples',
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
              name: 'totalBadge',
              title: 'Total Badge',
              type: 'string',
              description: 'Example: $750, $1,250, $2,500+',
              validation: (rule) => rule.required().min(2).max(20),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().min(20).max(320),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'totalBadge',
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
