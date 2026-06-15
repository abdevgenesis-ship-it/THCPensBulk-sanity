import {defineArrayMember, defineField, defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    // ── Hero ────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroBadge',
      title: 'Hero — badge line',
      type: 'string',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero — main heading',
      type: 'string',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero — subheading',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroPrimaryCtaLabel',
      title: 'Hero — primary button label',
      type: 'string',
    }),
    defineField({
      name: 'heroPrimaryCtaHref',
      title: 'Hero — primary button link',
      type: 'string',
      description: 'Internal path, e.g. /products',
    }),
    defineField({
      name: 'heroSecondaryCtaLabel',
      title: 'Hero — secondary button label',
      type: 'string',
    }),
    defineField({
      name: 'heroSecondaryCtaHref',
      title: 'Hero — secondary button link',
      type: 'string',
      description: 'Internal path, e.g. /wholesale',
    }),

    // ── Trust strip ─────────────────────────────────────────────────────────
    defineField({
      name: 'trustStripItems',
      title: 'Trust strip — items',
      type: 'array',
      of: [defineArrayMember({type: 'homeTrustItem'})],
      description: 'Optional. When empty, the storefront uses its default trust strip copy.',
    }),

    // ── Categories ──────────────────────────────────────────────────────────
    defineField({
      name: 'featuredCategories',
      title: 'Featured categories (browse section)',
      type: 'array',
      description: 'Select up to 5 categories for the homepage browse section in display order.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'category'}],
          options: {
            filter: 'isActive == true',
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: 'categoriesEyebrow',
      title: 'Categories section — eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'categoriesHeading',
      title: 'Categories section — heading',
      type: 'string',
    }),
    defineField({
      name: 'categoriesDescription',
      title: 'Categories section — description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'categoriesEmptyMessage',
      title: 'Categories section — empty state message',
      type: 'string',
      description: 'Shown when no featured categories are available.',
    }),

    // ── Authority block ─────────────────────────────────────────────────────
    defineField({
      name: 'authorityEyebrow',
      title: 'Authority block — eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'authorityHeading',
      title: 'Authority block — heading',
      type: 'string',
    }),
    defineField({
      name: 'authorityIntro',
      title: 'Authority block — intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'authorityPoints',
      title: 'Authority block — points',
      type: 'array',
      of: [defineArrayMember({type: 'homeAuthorityPoint'})],
      description: 'Optional. When empty, default bullet copy is used.',
    }),
    defineField({
      name: 'authorityCtaLabel',
      title: 'Authority block — CTA label',
      type: 'string',
    }),
    defineField({
      name: 'authorityCtaHref',
      title: 'Authority block — CTA link',
      type: 'string',
    }),
    defineField({
      name: 'authorityImageAlt',
      title: 'Authority block — image alt text',
      type: 'string',
    }),

    // ── Crypto banner ───────────────────────────────────────────────────────
    defineField({
      name: 'cryptoEyebrow',
      title: 'Crypto banner — eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'cryptoHeading',
      title: 'Crypto banner — heading',
      type: 'string',
    }),
    defineField({
      name: 'cryptoDescription',
      title: 'Crypto banner — description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'cryptoCtaLabel',
      title: 'Crypto banner — CTA label',
      type: 'string',
    }),
    defineField({
      name: 'cryptoCtaHref',
      title: 'Crypto banner — CTA link',
      type: 'string',
    }),

    // ── Delivery banner ─────────────────────────────────────────────────────
    defineField({
      name: 'deliveryEyebrow',
      title: 'Delivery banner — eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'deliveryHeading',
      title: 'Delivery banner — heading',
      type: 'string',
    }),
    defineField({
      name: 'deliveryDescription',
      title: 'Delivery banner — description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'deliveryCtaLabel',
      title: 'Delivery banner — CTA label',
      type: 'string',
    }),
    defineField({
      name: 'deliveryCtaHref',
      title: 'Delivery banner — CTA link',
      type: 'string',
    }),

    // ── How to order ────────────────────────────────────────────────────────
    defineField({
      name: 'howToBadge',
      title: 'How to order — badge',
      type: 'string',
    }),
    defineField({
      name: 'howToHeading',
      title: 'How to order — heading',
      type: 'string',
    }),
    defineField({
      name: 'howToIntro',
      title: 'How to order — intro',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'howToSteps',
      title: 'How to order — steps',
      type: 'array',
      of: [defineArrayMember({type: 'homeHowToStep'})],
      description: 'Optional. When empty, default steps are used.',
    }),
    defineField({
      name: 'howToCtaLabel',
      title: 'How to order — CTA label',
      type: 'string',
    }),
    defineField({
      name: 'howToCtaHref',
      title: 'How to order — CTA link',
      type: 'string',
    }),

    // ── Wholesale CTA ───────────────────────────────────────────────────────
    defineField({
      name: 'wholesaleMidEyebrow',
      title: 'Wholesale CTA — eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'wholesaleMidHeading',
      title: 'Wholesale CTA — heading',
      type: 'string',
    }),
    defineField({
      name: 'wholesaleMidDescription',
      title: 'Wholesale CTA — description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'wholesaleMidCtaLabel',
      title: 'Wholesale CTA — button label',
      type: 'string',
    }),
    defineField({
      name: 'wholesaleMidCtaHref',
      title: 'Wholesale CTA — button link',
      type: 'string',
    }),

    // ── Brands ──────────────────────────────────────────────────────────────
    defineField({
      name: 'featuredBrands',
      title: 'Featured brands (brands we carry)',
      type: 'array',
      description: 'Select up to 5 brands for the homepage Brands We Carry section in display order.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'brand'}],
          options: {
            filter: 'isActive == true',
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: 'brandsEyebrow',
      title: 'Brands section — eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'brandsHeading',
      title: 'Brands section — heading',
      type: 'string',
    }),
    defineField({
      name: 'brandsEmptyMessage',
      title: 'Brands section — empty state message',
      type: 'string',
    }),

    // ── Testimonials ─────────────────────────────────────────────────────────
    defineField({
      name: 'testimonialsBadge',
      title: 'Testimonials — badge',
      type: 'string',
    }),
    defineField({
      name: 'testimonialsHeading',
      title: 'Testimonials — heading',
      type: 'string',
    }),
    defineField({
      name: 'testimonialsIntro',
      title: 'Testimonials — intro',
      type: 'text',
      rows: 2,
    }),

    // ── Blog preview ────────────────────────────────────────────────────────
    defineField({
      name: 'blogEyebrow',
      title: 'Blog preview — eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'blogHeading',
      title: 'Blog preview — heading',
      type: 'string',
    }),
    defineField({
      name: 'blogDescription',
      title: 'Blog preview — description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'blogEmptyMessage',
      title: 'Blog preview — empty state message',
      type: 'string',
    }),
    defineField({
      name: 'blogViewAllLabel',
      title: 'Blog preview — view all button label',
      type: 'string',
    }),

    // ── FAQ ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'faqEyebrow',
      title: 'FAQ — eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'faqHeading',
      title: 'FAQ — heading',
      type: 'string',
    }),
    defineField({
      name: 'faqDescription',
      title: 'FAQ — description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'faqViewAllLabel',
      title: 'FAQ — view full FAQ link label',
      type: 'string',
    }),

    // ── Compliance band ─────────────────────────────────────────────────────
    defineField({
      name: 'complianceShopCtaLabel',
      title: 'Compliance band — shop button label',
      type: 'string',
    }),
    defineField({
      name: 'complianceShopCtaHref',
      title: 'Compliance band — shop button link',
      type: 'string',
    }),
    defineField({
      name: 'complianceContactCtaLabel',
      title: 'Compliance band — contact button label',
      type: 'string',
    }),
    defineField({
      name: 'complianceContactCtaHref',
      title: 'Compliance band — contact button link',
      type: 'string',
    }),
    defineField({
      name: 'complianceDisclaimerPlain',
      title: 'Compliance band — disclaimer (plain text)',
      type: 'text',
      rows: 3,
      description:
        'Optional. When set, replaces the default disclaimer line (without inline legal links). Leave empty to keep the default linked disclaimer.',
    }),

    // ── SEO ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      description: 'Optional. Falls back to the built-in homepage title when empty.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      description: 'Optional. Falls back to the built-in homepage description when empty.',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO keywords',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Optional list of keywords for metadata.',
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Homepage',
      subtitle: 'Homepage content and featured categories/brands',
    }),
  },
})
