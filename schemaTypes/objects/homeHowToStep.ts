import {defineField, defineType} from 'sanity'

const iconKeys = [
  {title: 'Search', value: 'search'},
  {title: 'Send', value: 'send'},
  {title: 'Mail', value: 'mail'},
  {title: 'Package check', value: 'packageCheck'},
]

export const homeHowToStep = defineType({
  name: 'homeHowToStep',
  title: 'Home how-to step',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'iconKey',
      title: 'Icon',
      type: 'string',
      options: {list: iconKeys},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
