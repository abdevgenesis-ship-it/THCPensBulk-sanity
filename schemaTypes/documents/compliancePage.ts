import {defineField, defineType} from 'sanity'

export const compliancePage = defineType({
  name: 'compliancePage',
  title: 'Compliance Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Compliance & Legal',
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
      name: 'lastUpdated',
      title: 'Last updated',
      type: 'date',
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
