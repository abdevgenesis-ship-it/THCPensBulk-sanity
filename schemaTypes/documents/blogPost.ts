import {defineArrayMember, defineField, defineType} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(8).max(140),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 120},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Used on blog cards and social snippets.',
      validation: (rule) => rule.required().min(40).max(220),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'blogAuthor'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Linked product category',
      type: 'reference',
      to: [{type: 'category'}],
      description:
        'Optional but recommended. Link the post to a storefront category for related products and category authority links.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related posts',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'blogPost'}]})],
      validation: (rule) => rule.max(3).unique(),
      description: 'Shown as suggested reading below the article.',
    }),
    defineField({
      name: 'estimatedReadMinutes',
      title: 'Estimated read time (minutes)',
      type: 'number',
      validation: (rule) => rule.integer().min(1).max(60),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Is active',
      type: 'boolean',
      initialValue: true,
      description: 'Inactive posts are hidden from blog hub queries.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured post',
      type: 'boolean',
      initialValue: false,
      description: 'Use for editorial curation if needed.',
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
    defineField({
      name: 'seoKeywords',
      title: 'SEO keywords',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.max(15),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.name',
      date: 'publishedAt',
      media: 'heroImage',
      active: 'isActive',
    },
    prepare({title, category, date, media, active}) {
      const dateText =
        typeof date === 'string' && date
          ? new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            }).format(new Date(date))
          : 'No publish date'

      const status = active === false ? 'Inactive' : 'Active'

      return {
        title: title || 'Blog Post',
        subtitle: [category, dateText, status].filter(Boolean).join(' • '),
        media,
      }
    },
  },
})
