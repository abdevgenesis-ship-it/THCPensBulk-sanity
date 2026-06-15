import {defineField, defineType} from 'sanity'

export const productVariant = defineType({
  name: 'productVariant',
  title: 'Product variant',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Variant name',
      type: 'string',
      description: 'Internal variant label (e.g. Blue Razz • 10 Pack).',
      validation: (rule) => rule.required().min(2).max(140),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      validation: (rule) => rule.required().min(3).max(80),
    }),
    defineField({
      name: 'flavor',
      title: 'Flavor',
      type: 'string',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'packSize',
      title: 'Pack size',
      type: 'string',
      description: 'Examples: 5 Pack, 10 Pack, 20 Pack.',
      validation: (rule) => rule.max(50),
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare at price (USD)',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'puffCount',
      title: 'Puff count',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'nicotinePercent',
      title: 'Nicotine %',
      type: 'number',
      description: 'Example: 5 for 5%.',
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: 'stockQty',
      title: 'Stock quantity',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'isDefault',
      title: 'Default variant',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isActive',
      title: 'Is active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      sku: 'sku',
      price: 'price',
      active: 'isActive',
      isDefault: 'isDefault',
    },
    prepare({title, sku, price, active, isDefault}) {
      const parts = [
        sku ? `SKU: ${sku}` : undefined,
        typeof price === 'number' ? `$${price.toFixed(2)}` : undefined,
        active === false ? 'Inactive' : undefined,
        isDefault ? 'Default' : undefined,
      ].filter(Boolean)

      return {
        title: title || 'Variant',
        subtitle: parts.join(' • '),
      }
    },
  },
})
