import {defineField, defineType} from 'sanity'

const iconKeys = [
  {title: 'Badge check', value: 'badgeCheck'},
  {title: 'Shield check', value: 'shieldCheck'},
  {title: 'Calendar check', value: 'calendarCheck2'},
  {title: 'Truck', value: 'truck'},
  {title: 'Headset', value: 'headset'},
]

export const homeTrustItem = defineType({
  name: 'homeTrustItem',
  title: 'Home trust strip item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'accent',
      title: 'Accent',
      type: 'string',
      initialValue: 'cyan',
      options: {
        list: [
          {title: 'Cyan', value: 'cyan'},
          {title: 'Purple', value: 'purple'},
        ],
      },
      validation: (rule) => rule.required(),
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
    select: {title: 'title', accent: 'accent', iconKey: 'iconKey'},
    prepare({title, accent, iconKey}) {
      return {
        title: title || 'Trust item',
        subtitle: [accent, iconKey].filter(Boolean).join(' · '),
      }
    },
  },
})
