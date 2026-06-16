import {defineArrayMember, defineField, defineType} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
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
      name: 'group',
      title: 'Group',
      type: 'string',
      options: {
        list: [
          {title: 'Disposable Vapes', value: 'Disposable Vapes'},
          {title: '510 Cartridges', value: '510 Cartridges'},
          {title: 'Hardware', value: 'Hardware'},
          {title: 'Accessories', value: 'Accessories'},
          {title: 'Wholesale Bundles', value: 'Wholesale Bundles'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().max(220),
      description: 'Used for category cards, navigation previews, and homepage browse section.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description: 'General category introduction for page content.',
    }),
    defineField({
      name: 'seoContent',
      title: 'SEO authority content',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description: 'Used in category authority block (300–400 words target).',
    }),
    defineField({
      name: 'image',
      title: 'Card image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
      description: 'Card/list image for homepage/category listings.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
      description: 'Banner image for /category/[slug].',
    }),
    defineField({
      name: 'isActive',
      title: 'Is active',
      type: 'boolean',
      initialValue: true,
      description: 'Inactive categories can be hidden from UI queries.',
    }),
    defineField({
      name: 'navOrder',
      title: 'Navigation order',
      type: 'number',
      initialValue: 100,
      validation: (rule) => rule.integer().min(0),
      description: 'Sort order for header dropdown and category index pages.',
    }),
    defineField({
      name: 'showInHeader',
      title: 'Show in header categories menu',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'categoryBreadcrumbCategoriesLabel',
      title: 'Category page — breadcrumb categories label',
      type: 'string',
      description: 'Default: Categories',
    }),
    defineField({
      name: 'categoryHeroEyebrow',
      title: 'Category page — hero eyebrow',
      type: 'string',
      description: 'Small label above hero heading. Default: Category Page',
    }),
    defineField({
      name: 'categoryHeroHeading',
      title: 'Category page — hero H1 override',
      type: 'string',
      description:
        'Optional. When set, replaces the default “Bulk {name} Wholesale” style H1 from the category name.',
    }),
    defineField({
      name: 'categoryHeroPrimaryCtaLabel',
      title: 'Category page — hero primary CTA label',
      type: 'string',
      description: 'Default: Shop This Category',
    }),
    defineField({
      name: 'categoryHeroSecondaryCtaLabel',
      title: 'Category page — hero secondary CTA label',
      type: 'string',
      description: 'Default: Wholesale Inquiry',
    }),
    defineField({
      name: 'categoryHeroFallbackDescription',
      title: 'Category page — hero fallback description template',
      type: 'text',
      rows: 2,
      description:
        'Used only when shortDescription is empty. You can use {categoryName}.',
    }),
    defineField({
      name: 'categoryFilterLabel',
      title: 'Category page — filter bar label',
      type: 'string',
      description: 'Default: Filtered Category:',
    }),
    defineField({
      name: 'categoryFilterViewAllLabel',
      title: 'Category page — filter bar view-all label',
      type: 'string',
      description: 'Default: View all products',
    }),
    defineField({
      name: 'categoryFilterLoadingMessage',
      title: 'Category page — filter loading message',
      type: 'string',
      description: 'Default: Loading category controls...',
    }),
    defineField({
      name: 'categoryProductsHeadingTemplate',
      title: 'Category page — products heading template',
      type: 'string',
      description: 'Use {categoryName}. Default: Products in {categoryName}',
    }),
    defineField({
      name: 'categoryProductsEmptyMessage',
      title: 'Category page — products empty message',
      type: 'string',
      description: 'Default: No products found for this category yet.',
    }),
    defineField({
      name: 'categoryBestsellersEyebrow',
      title: 'Category page — bestsellers eyebrow',
      type: 'string',
      description: 'Default: Top Moving Inventory',
    }),
    defineField({
      name: 'categoryBestsellersHeading',
      title: 'Category page — bestsellers heading',
      type: 'string',
      description: 'Default: Bestsellers',
    }),
    defineField({
      name: 'categoryBestsellersDescription',
      title: 'Category page — bestsellers description',
      type: 'text',
      rows: 2,
      description:
        'Default: Browse high-performing wholesale products trusted by smoke shops, distributors, and repeat retail buyers.',
    }),
    defineField({
      name: 'categoryBestsellersViewAllLabel',
      title: 'Category page — bestsellers view-all label',
      type: 'string',
      description: 'Default: View All Products',
    }),
    defineField({
      name: 'categoryAuthorityHeadingTemplate',
      title: 'Category page — authority heading template',
      type: 'string',
      description: 'Use {categoryName}. Default: Why {categoryName} Performs in Wholesale',
    }),
    defineField({
      name: 'categorySupportingHeading',
      title: 'Category page — supporting links heading',
      type: 'string',
      description: 'Default: Related Guides',
    }),
    defineField({
      name: 'categorySupportingDescription',
      title: 'Category page — supporting links description',
      type: 'text',
      rows: 2,
      description:
        'Default: Explore supporting pages that cover pricing, compliance, and buying strategy for this category.',
    }),
    defineField({
      name: 'categorySupportingEmptyMessage',
      title: 'Category page — supporting links empty message',
      type: 'string',
      description: 'Default: No related guides configured for this category yet.',
    }),
    defineField({
      name: 'relatedGuides',
      title: 'Related guides',
      type: 'array',
      description: 'Links shown in the Related Guides section on /category/[slug].',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Guide title',
              type: 'string',
              validation: (rule) => rule.required().min(3).max(120),
            }),
            defineField({
              name: 'href',
              title: 'Guide URL',
              type: 'string',
              description: 'Use a site-relative path like /guides/bulk-pricing.',
              validation: (rule) =>
                rule
                  .required()
                  .custom((value) =>
                    typeof value === 'string' && value.startsWith('/')
                      ? true
                      : 'Guide URL must start with /',
                  ),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'href',
            },
          },
        }),
      ],
      validation: (rule) =>
        rule
          .min(2)
          .max(3)
          .custom((items) => {
            if (!Array.isArray(items)) return true

            const hrefs = items
              .map((item) =>
                item && typeof item === 'object' && 'href' in item
                  ? (item.href as string | undefined)
                  : undefined,
              )
              .filter((href): href is string => typeof href === 'string')

            const uniqueHrefs = new Set(hrefs)
            return uniqueHrefs.size === hrefs.length
              ? true
              : 'Related guides must not contain duplicate URLs.'
          }),
    }),
    defineField({
      name: 'categoryTrustWallHeading',
      title: 'Category page — trust wall heading',
      type: 'string',
      description: 'Default: The Trust Wall',
    }),
    defineField({
      name: 'categoryTrustWallTestimonials',
      title: 'Category page — trust wall testimonials',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().min(20).max(320),
            }),
            defineField({
              name: 'source',
              title: 'Source',
              type: 'string',
              validation: (rule) => rule.required().min(2).max(100),
            }),
          ],
          preview: {
            select: {
              title: 'source',
              subtitle: 'quote',
            },
          },
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'categoryTrustWallShields',
      title: 'Category page — trust wall shields',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.max(8),
      description: 'Short compliance/trust bullets shown in trust wall.',
    }),
    defineField({
      name: 'categoryFaqHeading',
      title: 'Category page — FAQ heading',
      type: 'string',
      description: 'Default: Frequently Asked Questions',
    }),
    defineField({
      name: 'categoryFaqDescription',
      title: 'Category page — FAQ description',
      type: 'text',
      rows: 2,
      description: 'Optional intro copy shown above category FAQ items.',
    }),
    defineField({
      name: 'categoryFaqEmptyMessage',
      title: 'Category page — FAQ empty message',
      type: 'string',
      description: 'Default: No FAQ items are configured for this category yet.',
    }),
    defineField({
      name: 'categoryFaqItems',
      title: 'Category page — linked FAQ items',
      type: 'array',
      description:
        'Link FAQ items for this category page. Items can also be filtered by product category on each FAQ document.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'faqItem'}],
        }),
      ],
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: 'categoryCrossLinksHeading',
      title: 'Category page — cross-links heading',
      type: 'string',
      description: 'Default: Explore Related Categories',
    }),
    defineField({
      name: 'categoryCrossLinksDescription',
      title: 'Category page — cross-links description',
      type: 'text',
      rows: 2,
      description:
        'Default: Compare nearby high-intent categories to plan your wholesale product mix.',
    }),
    defineField({
      name: 'categoryCrossLinksEmptyMessage',
      title: 'Category page — cross-links empty message',
      type: 'string',
      description: 'Default: No related categories configured for this category yet.',
    }),
    defineField({
      name: 'relatedCategories',
      title: 'Related categories',
      type: 'array',
      description: 'Category links shown in Explore Related Categories.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'category'}],
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'categoryBrowseAllLabel',
      title: 'Category page — bottom browse-all label',
      type: 'string',
      description: 'Default: Browse All Products',
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
      subtitle: 'group',
      media: 'image',
      active: 'isActive',
    },
    prepare({title, subtitle, media, active}) {
      return {
        title: title || 'Category',
        subtitle: `${subtitle || 'Unassigned'}${active === false ? ' • Inactive' : ''}`,
        media,
      }
    },
  },
})
