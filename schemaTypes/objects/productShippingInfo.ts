import {defineField, defineType} from 'sanity'

export const productShippingInfo = defineType({
  name: 'productShippingInfo',
  title: 'Product Shipping Info',
  type: 'object',
  fields: [
    defineField({
      name: 'timeline',
      title: 'Shipping timeline',
      type: 'string',
      description: 'Example: Ships in 24-48 hours, delivery in 3-5 business days.',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'pactCompliance',
      title: 'PACT compliance note',
      type: 'text',
      rows: 2,
      description: 'Product-level PACT compliance message shown on the product page.',
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: 'statesCovered',
      title: 'States covered',
      type: 'string',
      description: 'Example: Available in most US states except restricted regions.',
      validation: (rule) => rule.max(200),
    }),
  ],
  preview: {
    select: {
      timeline: 'timeline',
      statesCovered: 'statesCovered',
    },
    prepare({timeline, statesCovered}) {
      const parts = [timeline, statesCovered].filter(Boolean)
      return {
        title: 'Product Shipping Info',
        subtitle: parts.join(' • '),
      }
    },
  },
})
