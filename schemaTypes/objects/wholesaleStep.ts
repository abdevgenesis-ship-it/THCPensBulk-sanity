import {defineField, defineType} from 'sanity'

const iconKeys = [
  'badgePercent',
  'boxes',
  'fileText',
  'headphones',
  'package',
  'search',
  'send',
  'shieldCheck',
  'truck',
  'wallet',
  'zap',
]

export const wholesaleStep = defineType({
  name: 'wholesaleStep',
  title: 'Wholesale Step',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required().max(80)}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.required().max(220)}),
    defineField({
      name: 'iconKey',
      title: 'Icon key',
      type: 'string',
      options: {
        list: iconKeys.map((value) => ({title: value, value})),
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})