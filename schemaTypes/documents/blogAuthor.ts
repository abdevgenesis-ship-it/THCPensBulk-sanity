import {defineField, defineType} from 'sanity'

export const blogAuthor = defineType({
  name: 'blogAuthor',
  title: 'Blog Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (rule) => rule.max(120),
      description: 'Shown in author bio blocks on blog posts.',
    }),
    defineField({
      name: 'bio',
      title: 'Short bio',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().min(20).max(420),
    }),
    defineField({
      name: 'image',
      title: 'Profile image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'xUrl',
      title: 'X (Twitter) URL',
      type: 'url',
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
      subtitle: 'role',
      media: 'image',
    },
  },
})
