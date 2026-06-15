import {defineArrayMember, defineField, defineType} from 'sanity'

import {slugifyKeyword, startsWithKeyword} from '../../lib/supportingPageGenerator/slugify'

export const supportingPage = defineType({
  name: 'supportingPage',
  title: 'Supporting Page',
  type: 'document',
  initialValue: {
    primaryCtaLabel: 'Visit shop',
    primaryCtaHref: '/shop',
    secondaryCtaLabel: 'Contact us',
    secondaryCtaHref: '/contact',
    categoriesHeading: 'Categories',
    whyChooseUsHeading: 'Why choose us',
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(3).max(120),
      description: 'Studio list preview. Generator sets this from sub H1.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'exactKeyword', slugify: (input) => slugifyKeyword(String(input)), maxLength: 96},
      validation: (rule) =>
        rule.required().custom((slug, context) => {
          const keyword = (context.document?.exactKeyword as string | undefined)?.trim()
          const current = (slug as {current?: string} | undefined)?.current?.trim()
          if (!keyword || !current) return true
          const expected = slugifyKeyword(keyword)
          if (current !== expected) {
            return `Slug must exactly match keyword (${expected})`
          }
          return true
        }),
      description: 'Must exactly match slugified exact keyword.',
    }),
    defineField({
      name: 'parentPage',
      title: 'Parent page',
      type: 'reference',
      to: [{type: 'homePage'}, {type: 'wholesalePage'}, {type: 'category'}],
      description:
        'Leave empty for root supporting pages (URL: /your-slug). Set for /homepage/, /wholesale/, or /category/ routes.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'exactKeyword',
      title: 'Exact keyword',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(120),
      description: 'Primary keyword. Starts H1, meta fields, slug, and intro.',
    }),
    defineField({
      name: 'subH1',
      title: 'Sub H1',
      type: 'string',
      validation: (rule) =>
        rule.max(180).custom((subH1, context) => {
          if (!subH1?.trim()) return true
          const keyword = (context.document?.exactKeyword as string | undefined)?.trim()
          if (!keyword) return true
          if (!startsWithKeyword(subH1, keyword)) {
            return 'Sub H1 must start with the exact keyword'
          }
          return true
        }),
      description: 'Sub H1 in hero. Must start with the exact keyword when set.',
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      validation: (rule) =>
        rule.max(160).custom((metaTitle, context) => {
          if (!metaTitle?.trim()) return true
          const keyword = (context.document?.exactKeyword as string | undefined)?.trim()
          if (!keyword) return true
          if (!startsWithKeyword(metaTitle, keyword)) {
            return 'Meta title must start with the exact keyword'
          }
          return true
        }),
      description: 'SEO title. Must start with the exact keyword.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.max(320).custom((metaDescription, context) => {
          if (!metaDescription?.trim()) return true
          const keyword = (context.document?.exactKeyword as string | undefined)?.trim()
          if (!keyword) return true
          if (!startsWithKeyword(metaDescription, keyword)) {
            return 'Meta description must start with the exact keyword'
          }
          return true
        }),
      description: 'SEO description. Must start with the exact keyword.',
    }),
    defineField({
      name: 'introParagraphs',
      title: 'Intro paragraphs (above fold §1)',
      type: 'array',
      of: [defineArrayMember({type: 'text', rows: 4})],
      validation: (rule) =>
        rule.max(2).custom((paragraphs, context) => {
          const items = (paragraphs as string[] | undefined) ?? []
          if (items.length === 0) return true
          const keyword = (context.document?.exactKeyword as string | undefined)?.trim()
          const first = items[0]?.trim()
          if (keyword && first && !startsWithKeyword(first, keyword)) {
            return 'First intro paragraph must start with the exact keyword'
          }
          return true
        }),
      description: 'Max 2 paragraphs. First must start with the exact keyword.',
    }),
    defineField({
      name: 'aboveFoldDeepContent',
      title: 'Above fold deep content (§2)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
          ],
        }),
      ],
      description: 'Broad/deeper above-the-fold content. Use H2 and H3 headings.',
    }),
    defineField({
      name: 'keywordVariations',
      title: 'Keyword variations',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) =>
        rule.custom((variations) => {
          const items = (variations as string[] | undefined) ?? []
          if (items.length === 0) return true
          if (items.length !== 10) return 'Must contain exactly 10 keyword variations when set'
          return true
        }),
      description: '10 main keyword variations used across page content (generator).',
    }),
    defineField({
      name: 'pageFaqs',
      title: 'Page FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'question', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'answer', type: 'text', rows: 4, validation: (r) => r.required()}),
          ],
          preview: {
            select: {title: 'question'},
          },
        }),
      ],
      validation: (rule) =>
        rule.custom((faqs) => {
          const items = (faqs as unknown[] | undefined) ?? []
          if (items.length === 0) return true
          if (items.length !== 3) return 'Must contain exactly 3 FAQs when set'
          return true
        }),
      description: 'Exactly 3 keyword-related FAQs.',
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary CTA label',
      type: 'string',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'primaryCtaHref',
      title: 'Primary CTA href',
      type: 'string',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary CTA label',
      type: 'string',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'secondaryCtaHref',
      title: 'Secondary CTA href',
      type: 'string',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related products',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
      validation: (rule) => rule.max(4),
      description: 'Up to 4 products. Generator assigns randomly from catalog.',
    }),
    defineField({
      name: 'categoriesHeading',
      title: 'Categories heading',
      type: 'string',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'category'}]})],
      validation: (rule) => rule.max(4),
      description: 'Up to 4 categories. Generator assigns randomly from catalog.',
    }),
    defineField({
      name: 'whyChooseUsHeading',
      title: 'Why choose us heading',
      type: 'string',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'whyChooseUsPoints',
      title: 'Why choose us points',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'supportingTerm',
      title: 'Supporting term (legacy)',
      type: 'string',
      validation: (rule) => rule.max(120),
      hidden: ({document}) => Boolean(document?.subH1),
      description: 'Legacy H1 suffix. Use sub H1 for new pages.',
    }),
    defineField({
      name: 'heroParagraph',
      title: 'Hero paragraph (legacy)',
      type: 'text',
      rows: 4,
      hidden: ({document}) => Boolean((document?.introParagraphs as string[] | undefined)?.length),
      description: 'Legacy intro. Use intro paragraphs for new pages.',
    }),
    defineField({
      name: 'h2Heading',
      title: 'H2 heading (legacy)',
      type: 'string',
      validation: (rule) => rule.max(180),
      hidden: ({document}) => Boolean((document?.aboveFoldDeepContent as unknown[] | undefined)?.length),
    }),
    defineField({
      name: 'h2Paragraphs',
      title: 'H2 short paragraphs (legacy)',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      hidden: ({document}) => Boolean((document?.aboveFoldDeepContent as unknown[] | undefined)?.length),
    }),
    defineField({
      name: 'body',
      title: 'Body (legacy)',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      hidden: ({document}) => Boolean((document?.aboveFoldDeepContent as unknown[] | undefined)?.length),
      description: 'Legacy deep content. Use above fold deep content for new pages.',
    }),
    defineField({
      name: 'otherCategoriesHeading',
      title: 'Other categories heading (legacy)',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description (legacy)',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(320),
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      keyword: 'exactKeyword',
      parentTitle: 'parentPage.title',
    },
    prepare({title, keyword, parentTitle}) {
      return {
        title: title || keyword || 'Supporting page',
        subtitle: parentTitle ? `Parent: ${parentTitle}` : 'Root',
      }
    },
  },
})
