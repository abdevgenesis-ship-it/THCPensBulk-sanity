import {defineField, defineType} from 'sanity'

export const volumeTier = defineType({
  name: 'volumeTier',
  title: 'Volume Tier',
  type: 'object',
  fields: [
    defineField({name: 'tier', title: 'Tier', type: 'string', validation: (rule) => rule.required().max(60)}),
    defineField({name: 'note', title: 'Note', type: 'text', rows: 2, validation: (rule) => rule.required().max(120)}),
  ],
  preview: {
    select: {title: 'tier', subtitle: 'note'},
  },
})