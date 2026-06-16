import {defineArrayMember, defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      description: 'Browser tab title (keep unique and B2B-focused).',
      initialValue: 'About THCPensBulk — Licensed B2B Wholesale THC Vape Distributor',
      validation: (rule) => rule.required().min(20).max(120),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(40).max(320),
    }),
    defineField({
      name: 'pageHeading',
      title: 'Page H1',
      type: 'string',
      initialValue: 'About THCPensBulk',
      validation: (rule) => rule.required().min(3).max(120),
    }),
    defineField({
      name: 'introLead',
      title: 'Intro paragraph (below H1)',
      type: 'text',
      rows: 3,
      description: 'Short supporting line for the hero.',
    }),
    defineField({
      name: 'storyHeading',
      title: 'Our story — heading',
      type: 'string',
      initialValue: 'Our Story',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'storyBody',
      title: 'Our story — body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'storyImage',
      title: 'Our story — image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
      validation: (rule) => rule.required().error('Please add an image for the About story section.'),
    }),
    defineField({
      name: 'missionHeading',
      title: 'Mission — heading',
      type: 'string',
      initialValue: 'Our Mission',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'missionBody',
      title: 'Mission — body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'teamHeading',
      title: 'Team / operations — heading',
      type: 'string',
      initialValue: 'Operations & Support',
      description: 'Generic heading if you prefer not to name individuals.',
    }),
    defineField({
      name: 'teamBody',
      title: 'Team / operations — body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description: 'Optional. Leave empty to hide this section on the site.',
    }),
    defineField({
      name: 'stats',
      title: 'Stats row',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'value', subtitle: 'label'},
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: 'complianceHeading',
      title: 'Compliance — heading',
      type: 'string',
      initialValue: 'Compliance & Certifications',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'complianceIntro',
      title: 'Compliance — intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'compliancePoints',
      title: 'Compliance — points',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'description'},
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Primary CTA label',
      type: 'string',
      initialValue: 'Start Your Wholesale Order →',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ctaHref',
      title: 'Primary CTA URL',
      type: 'string',
      initialValue: '/wholesale-request',
      description: 'Internal path (e.g. /wholesale-request) or full URL.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({title: 'About Page'}),
  },
})
