import {defineArrayMember, defineField, defineType} from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(80),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(80),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (rule) => rule.max(80),
      description: 'Examples: Texas, Miami, FL, USA',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().min(20).max(260),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      initialValue: 5,
      validation: (rule) => rule.required().integer().min(1).max(5),
      description: 'Use 1 to 5 stars.',
    }),
    defineField({
      name: 'image',
      title: 'Avatar image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
      description: 'Optional customer avatar or company logo.',
    }),
    defineField({
      name: 'contextImage',
      title: 'Review context image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
      description:
        'Scene image that matches the testimonial context (shop floor, warehouse, inventory, shipping).',
    }),
    defineField({
      name: 'placements',
      title: 'Show on pages',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              {title: 'Homepage', value: 'homepage'},
              {title: 'Wholesale page', value: 'wholesale'},
            ],
          },
        }),
      ],
      initialValue: ['homepage', 'wholesale'],
      validation: (rule) => rule.required().unique().min(1),
      description: 'Choose where this testimonial can appear.',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      initialValue: 100,
      validation: (rule) => rule.integer().min(0),
      description: 'Lower numbers appear first.',
    }),
    defineField({
      name: 'isActive',
      title: 'Is active',
      type: 'boolean',
      initialValue: true,
      description: 'Inactive testimonials are hidden from storefront queries.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'contextImage',
      location: 'location',
      placements: 'placements',
    },
    prepare({title, subtitle, media, location, placements}) {
      const placementLabel = Array.isArray(placements) ? placements.join(', ') : 'Unassigned'

      return {
        title: title || 'Testimonial',
        subtitle: [subtitle, location, placementLabel].filter(Boolean).join(' • '),
        media,
      }
    },
  },
})