import {defineArrayMember, defineField, defineType} from 'sanity'

export const programmaticPage = defineType({
  name: 'programmaticPage',
  title: 'Programmatic Page',
  type: 'document',
  fields: [
    defineField({
      name: 'locationName',
      title: 'Location name',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(120),
      description: 'City or state name, for example Miami, Florida.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'locationName',
        maxLength: 96,
        isUnique: async (slug, context) => {
          const document = context.document as {category?: {_ref?: string}; _id?: string} | undefined
          const slugValue = typeof slug === 'string' ? slug : slug?.current
          const categoryRef = document?.category?._ref

          if (!slugValue || !categoryRef) {
            return true
          }

          const currentId = document?._id?.replace(/^drafts\./, '')
          const exclusionIds = currentId ? [currentId, `drafts.${currentId}`] : []
          const query = `count(*[_type == "programmaticPage" && slug.current == ${JSON.stringify(slugValue)} && category._ref == ${JSON.stringify(categoryRef)} && !(_id in ${JSON.stringify(exclusionIds)})]) == 0`

          return context.getClient({apiVersion: '2025-04-01'}).fetch(query)
        },
      },
      validation: (rule) => rule.required(),
      description: 'URL slug for the programmatic page.',
    }),
    defineField({
      name: 'stateCode',
      title: 'State code',
      type: 'string',
      validation: (rule) => rule.required().length(2),
      description: 'Two-letter state code used for shipping estimate logic.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
      description: 'Target product category for this page.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description: 'Rich body copy for the programmatic page.',
    }),
    defineField({
      name: 'customIntro',
      title: 'Custom intro',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description: 'Optional custom intro paragraph for the page.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
      description: 'Hero banner image for the programmatic page.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(320),
      description: 'Optional meta description override.',
    }),
  ],
  preview: {
    select: {
      title: 'locationName',
      subtitle: 'stateCode',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Programmatic page',
        subtitle: subtitle ? `State: ${subtitle}` : 'No state selected',
      }
    },
  },
})