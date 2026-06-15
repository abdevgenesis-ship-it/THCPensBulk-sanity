import {defineArrayMember, defineField, defineType} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(140),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 120},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{type: 'brand'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'productType',
      title: 'Product type',
      type: 'string',
      options: {
        list: [
          {title: 'Disposable', value: 'Disposable'},
          {title: 'Cartridge', value: 'Cartridge'},
          {title: 'Pod', value: 'Pod'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(220),
      description: 'Used in product cards and listing snippets.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description: 'Long-form product detail content.',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
        }),
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'variants',
      title: 'Variants',
      type: 'array',
      of: [defineArrayMember({type: 'productVariant'})],
      validation: (rule) =>
        rule.required().min(1).custom((value) => {
          if (!Array.isArray(value)) {
            return true
          }

          const defaultCount = value.filter((variant) => variant?.isDefault).length
          if (defaultCount > 1) {
            return 'Only one variant can be marked as default.'
          }

          return true
        }),
      description: 'Each product can contain one or more purchasable variants.',
    }),
    defineField({
      name: 'specs',
      title: 'Product Specifications',
      type: 'productSpecs',
      description: 'Detailed technical specifications: battery, charging, dimensions, etc.',
    }),
    defineField({
      name: 'shippingInfo',
      title: 'Shipping Information',
      type: 'productShippingInfo',
      description: 'Product-specific shipping timeline, PACT compliance, and states coverage.',
    }),
    defineField({
      name: 'isActive',
      title: 'Is active',
      type: 'boolean',
      initialValue: true,
      description: 'Inactive products are hidden from storefront queries.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured product',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isBestSeller',
      title: 'Is best seller',
      type: 'boolean',
      initialValue: false,
      description: 'Mark this product to show in Bestsellers sections for its category.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(320),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      brand: 'brand.name',
      category: 'category.name',
      active: 'isActive',
    },
    prepare({title, media, brand, category, active}) {
      const subtitleParts = [brand, category, active === false ? 'Inactive' : undefined].filter(Boolean)

      return {
        title: title || 'Product',
        subtitle: subtitleParts.join(' • '),
        media,
      }
    },
  },
})
