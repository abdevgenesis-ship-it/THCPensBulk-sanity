import {defineField, defineType} from 'sanity'

export const legalSection = defineType({
  name: 'legalSection',
  title: 'Legal Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'bullets',
      title: 'Bullet Items',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'ordered',
      title: 'Ordered Items',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})
