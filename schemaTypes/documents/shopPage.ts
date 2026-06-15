import {defineArrayMember, defineField, defineType} from 'sanity'

export const shopPage = defineType({
  name: 'shopPage',
  title: 'Shop Page',
  type: 'document',
  fields: [
    defineField({
      name: 'brands',
      title: 'Filterable Brands',
      type: 'array',
      description: 'Select brands to show as filters (only active brands appear).',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'brand'}],
          options: { filter: 'isActive == true' },
        }),
      ],
      validation: (rule) => rule.max(20),
    }),
    defineField({
      name: 'categories',
      title: 'Filterable Categories',
      type: 'array',
      description: 'Select categories to show as filters (only active categories appear).',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'category'}],
          options: { filter: 'isActive == true' },
        }),
      ],
      validation: (rule) => rule.max(20),
    }),
    defineField({
      name: 'priceRange',
      title: 'Price Range',
      type: 'object',
      fields: [
        {name: 'min', title: 'Min Price', type: 'number', validation: (rule) => rule.min(0)},
        {name: 'max', title: 'Max Price', type: 'number', validation: (rule) => rule.min(0)},
      ],
      description: 'Set the allowed price range for filtering.',
    }),
    defineField({
      name: 'puffRange',
      title: 'Puff Count Range',
      type: 'object',
      fields: [
        {name: 'min', title: 'Min Puff Count', type: 'number', validation: (rule) => rule.min(0)},
        {name: 'max', title: 'Max Puff Count', type: 'number', validation: (rule) => rule.min(0)},
      ],
      description: 'Set the allowed puff count range for filtering.',
    }),
    defineField({
      name: 'types',
      title: 'Product Types',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              {title: 'Disposable', value: 'Disposable'},
              {title: 'Cartridge', value: 'Cartridge'},
              {title: 'Pod', value: 'Pod'},
            ],
            layout: 'checkbox',
          },
        },
      ],
      description: 'Select which product types to show as filters.',
      validation: (rule) => rule.unique().min(1).max(3),
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Shop Page',
      subtitle: 'Filter configuration',
    }),
  },
})
