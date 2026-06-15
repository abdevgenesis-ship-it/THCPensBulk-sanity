import {defineField, defineType} from 'sanity'

export const wholesaleFaq = defineType({
  name: 'wholesaleFaq',
  title: 'Wholesale FAQ',
  type: 'object',
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (rule) => rule.required().min(8).max(140)}),
    defineField({name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (rule) => rule.required().min(20).max(500)}),
  ],
  preview: {
    select: {title: 'question', subtitle: 'answer'},
  },
})