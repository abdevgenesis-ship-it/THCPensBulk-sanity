import {defineArrayMember, defineField, defineType} from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (rule) => rule.required().min(8).max(180),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'General', value: 'General'},
          {title: 'Ordering', value: 'Ordering'},
          {title: 'Shipping', value: 'Shipping'},
          {title: 'Payment', value: 'Payment'},
          {title: 'Products', value: 'Products'},
          {title: 'Compliance', value: 'Compliance'},
          {title: 'Nicotine', value: 'Nicotine'},
          {title: 'CBD', value: 'CBD'},
          {title: 'THC', value: 'THC'},
          {title: 'THCA', value: 'THCA'},
          {title: 'THC Carts', value: 'THC Carts'},
        ],
      },
      initialValue: 'General',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'productCategories',
      title: 'Product categories',
      type: 'array',
      description:
        'Link FAQ items to product categories. Matching category pages can filter and show only relevant FAQs.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'category'}]})],
      validation: (rule) => rule.max(10),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Optional CTA label',
      type: 'string',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'ctaHref',
      title: 'Optional CTA URL',
      type: 'string',
      description: 'Use site-relative paths like /compliance-map',
      validation: (rule) =>
        rule.custom((value) =>
          !value || (typeof value === 'string' && value.startsWith('/'))
            ? true
            : 'CTA URL must start with /',
        ),
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      initialValue: 100,
      validation: (rule) => rule.integer().min(0),
      description: 'Lower numbers appear first within each category.',
    }),
    defineField({
      name: 'isActive',
      title: 'Is active',
      type: 'boolean',
      initialValue: true,
      description: 'Inactive FAQ items are hidden from storefront queries.',
    }),
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
      order: 'order',
      active: 'isActive',
    },
    prepare({title, category, order, active}) {
      const state = active === false ? 'Inactive' : 'Active'

      return {
        title: title || 'FAQ Item',
        subtitle: [category || 'Uncategorized', typeof order === 'number' ? `#${order}` : null, state]
          .filter(Boolean)
          .join(' • '),
      }
    },
  },
})
