import {defineField, defineType} from 'sanity'

const iconKeys = [
  {title: 'Badge check', value: 'badgeCheck'},
  {title: 'Shield check', value: 'shieldCheck'},
  {title: 'Wallet cards', value: 'walletCards'},
  {title: 'Truck', value: 'truck'},
]

export const homeAuthorityPoint = defineType({
  name: 'homeAuthorityPoint',
  title: 'Home authority point',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(320),
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
