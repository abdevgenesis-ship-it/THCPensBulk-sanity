import {config as loadEnv} from 'dotenv'
import {resolve} from 'node:path'

import {homePageSingletonId} from '../schemaTypes/singletons'
import {
  getSanityWriteClient,
  isInsufficientSanityPermission,
  printSanityWritePermissionHelp,
} from './sanityWriteClient'

loadEnv({path: resolve(process.cwd(), '.env')})
loadEnv({path: resolve(process.cwd(), '.env.local')})

/** Same marker as `HOME_AUTHORITY_INTRO_H2_MARKER` in the Next app — splits intro into lead → H2 → tail. */
const AUTHORITY_INTRO_H2_MARKER = '\n\n[[H2]]\n\n'

type HomeDoc = Record<string, unknown> & {_id: string; _type: string}
type HomeFaqDoc = {
  _id: string
  _type: 'faqItem'
  question: string
  answer: Array<{
    _type: 'block'
    style: 'normal'
    markDefs: unknown[]
    children: Array<{_type: 'span'; text: string; marks: string[]}>
  }>
  category: 'General'
  ctaLabel?: string
  ctaHref?: string
  order: number
  isActive: true
}

function makeKey(prefix: string, index: number) {
  return `${prefix}-${index}-${Math.random().toString(16).slice(2, 10)}`
}

function isEmptyString(value: unknown) {
  return typeof value !== 'string' || value.trim().length === 0
}

function isEmptyArray(value: unknown) {
  return !Array.isArray(value) || value.length === 0
}

function toPortableText(paragraphs: string[]) {
  return paragraphs.map((paragraph) => ({
    _type: 'block' as const,
    style: 'normal' as const,
    markDefs: [],
    children: [{_type: 'span' as const, text: paragraph, marks: []}],
  }))
}

function buildHomepageFaqDocs(): HomeFaqDoc[] {
  return [
    {
      _id: 'faq-wvusa-international-shipping',
      _type: 'faqItem',
      question: 'Do you ship wholesale vapes internationally?',
      answer: toPortableText([
        'Yes, we manage all international customs documentation to ensure compliant delivery to your region.',
      ]),
      category: 'General',
      ctaLabel: 'Shipping & regions',
      ctaHref: '/shipping',
      order: 1,
      isActive: true,
    },
    {
      _id: 'faq-wvusa-bulk-pricing',
      _type: 'faqItem',
      question: 'How do I access bulk pricing?',
      answer: toPortableText([
        'Simply register for a wholesale account on WholesaleVapesUSA.com to view our tiered pricing levels.',
      ]),
      category: 'General',
      ctaLabel: 'Wholesale account',
      ctaHref: '/wholesale',
      order: 2,
      isActive: true,
    },
    {
      _id: 'faq-wvusa-shipping-guarantee',
      _type: 'faqItem',
      question: 'What is your shipping guarantee?',
      answer: toPortableText([
        'We guarantee that all wholesale orders are processed and delivered within 48 hours within the continental USA.',
      ]),
      category: 'General',
      ctaLabel: 'Shipping policy',
      ctaHref: '/shipping',
      order: 3,
      isActive: true,
    },
  ]
}

async function main() {
  const client = getSanityWriteClient()

  const publishedId = homePageSingletonId
  const draftId = `drafts.${homePageSingletonId}`

  const publishedDoc = await client.getDocument<HomeDoc>(publishedId)
  if (!publishedDoc) {
    throw new Error(
      `Home page singleton not found (id=${publishedId}). Create/restore the singleton document first.`,
    )
  }

  const draftDoc = await client.getDocument<HomeDoc>(draftId)

  const applyDefaults = (docId: string, doc: HomeDoc) => {
    const patch = client.patch(docId)

    const setIfEmpty = (field: string, value: unknown) => {
      const current = (doc as Record<string, unknown>)[field]
      const shouldSet =
        current === undefined ||
        current === null ||
        (typeof value === 'string' ? isEmptyString(current) : false) ||
        (Array.isArray(value) ? isEmptyArray(current) : false)

      if (shouldSet) {
        patch.set({[field]: value})
      }
    }

  // SEO
  patch.set({
    seoTitle: 'Vape Wholesale USA | Bulk 510 Carts, THCA, CBD & Nicotine Suppliers',
    seoDescription:
      "Vape wholesale from the USA's premier supplier. Shop bulk 510 carts, THCA, THC vapes, and nicotine salts at market-leading prices with guaranteed 48h shipping.",
    seoKeywords: [
      'vape wholesale USA',
      'bulk 510 carts',
      'THCA wholesale',
      'THC vapes wholesale',
      'nicotine salts wholesale',
      'wholesale vape supplier',
      '48 hour vape shipping',
    ],
  })

  // Hero
  patch.set({
    heroBadge: 'WholesaleVapesUSA.com',
    heroHeading: 'Vape Wholesale: The Premier US Source for Premium Bulk Inventory',
    heroSubheading:
      'Your institutional partner for certified 510 cartridges, cannabinoids, and top nicotine brands at unbeatable wholesale prices.',
    heroPrimaryCtaLabel: 'Shop Products',
    heroPrimaryCtaHref: '/products',
    heroSecondaryCtaLabel: 'Wholesale Inquiry',
    heroSecondaryCtaHref: '/wholesale',
  })

  // Trust strip
  patch.set({
    trustStripItems: [
      {_type: 'homeTrustItem', _key: makeKey('trust', 0), title: '48h Shipping Guarantee', accent: 'cyan', iconKey: 'truck'},
      {_type: 'homeTrustItem', _key: makeKey('trust', 1), title: 'Lab-Verified Inventory', accent: 'purple', iconKey: 'badgeCheck'},
      {_type: 'homeTrustItem', _key: makeKey('trust', 2), title: '21+ Compliant', accent: 'cyan', iconKey: 'shieldCheck'},
      {_type: 'homeTrustItem', _key: makeKey('trust', 3), title: 'PACT-Aware Fulfillment', accent: 'purple', iconKey: 'calendarCheck2'},
      {_type: 'homeTrustItem', _key: makeKey('trust', 4), title: 'Wholesale Support', accent: 'cyan', iconKey: 'headset'},
    ],
  })

  // Categories section copy
  setIfEmpty('categoriesEyebrow', 'Built For Retail Velocity')
  setIfEmpty('categoriesHeading', 'Shop by Category')
  setIfEmpty(
    'categoriesDescription',
    'Explore our top wholesale product categories built for B2B buyers and high-volume retail demand.',
  )
  setIfEmpty('categoriesEmptyMessage', 'No homepage categories configured yet.')

  // Authority block (intro uses [[H2]] split: lead → H2 uses authorityHeading → tail)
  patch.set({
    authorityEyebrow: 'Total Control wholesale supply',
    authorityHeading: 'Vape wholesale for sale with a 48-hour delivery guarantee.',
    authorityIntro: [
      `Vape wholesale services at WholesaleVapesUSA.com provide the inventory reliability you need to scale your retail operation. In a 2026 market defined by rapid innovation and strict compliance, our "Total Control" supply chain ensures you have access to the latest THCA disposables, 510-thread hardware, and premium nicotine salts. We don't just sell products; we provide a competitive edge through institutional-grade lab verification and a logistical framework that guarantees your order is dispatched and delivered within 48 hours.`,
      `Buying vape wholesale inventory should be a seamless, high-velocity experience. Our catalog is curated for connoisseurs and professional retailers who demand excellence. From CCELL's latest 510 hardware to high-potency THCA diamonds, every item is available for bulk order with significant volume discounts. We bridge the gap between global manufacturing and local retail, ensuring that when you search for "vape wholesale for sale," you find a partner committed to your growth.`,
    ].join(AUTHORITY_INTRO_H2_MARKER),
    authorityPoints: [
      {
        _type: 'homeAuthorityPoint',
        _key: makeKey('authority', 0),
        title: 'Institutional lab verification',
        description:
          'Batch-level documentation and verification workflows so you can stock with confidence.',
        iconKey: 'badgeCheck',
      },
      {
        _type: 'homeAuthorityPoint',
        _key: makeKey('authority', 1),
        title: '48-hour fulfillment framework',
        description:
          'Orders are dispatched on a cadence designed to hit our 48-hour delivery commitment across the continental USA.',
        iconKey: 'truck',
      },
      {
        _type: 'homeAuthorityPoint',
        _key: makeKey('authority', 2),
        title: 'Tiered wholesale economics',
        description:
          'Volume-ready pricing on 510 hardware, cannabinoid lines, and nicotine salts as your retail footprint scales.',
        iconKey: 'walletCards',
      },
      {
        _type: 'homeAuthorityPoint',
        _key: makeKey('authority', 3),
        title: 'Compliance-forward operations',
        description:
          '21+ safeguards and PACT-aware processes aligned with how regulated vape and hemp-adjacent inventory moves in 2026.',
        iconKey: 'shieldCheck',
      },
    ],
    authorityCtaLabel: 'Open wholesale catalog',
    authorityCtaHref: '/products',
    authorityImageAlt: 'Wholesale vape inventory, 510 hardware, and fulfillment logistics',
  })

  // Crypto banner
  setIfEmpty('cryptoEyebrow', 'Payment Incentives')
  setIfEmpty('cryptoHeading', 'Pay with Crypto - Get 10% Off Instantly')
  setIfEmpty(
    'cryptoDescription',
    'We accept BTC, ETH, and USDT for a 10% discount on qualified orders. Prefer Revolut? Receive 5% off with fast invoice turnaround.',
  )
  setIfEmpty('cryptoCtaLabel', 'How It Works')
  setIfEmpty('cryptoCtaHref', '/how-to-buy')

  // How to order
  patch.set({
    howToBadge: 'How to Order from WholesaleVapesUSA',
    howToHeading: 'Institutional Ordering Workflow',
    howToIntro:
      'Bulk ordering is built for speed, security, and predictable fulfillment across high-volume retail and distribution use cases.',
    howToSteps: [
      {_type: 'homeHowToStep', _key: makeKey('howto', 0), title: 'Browse Categories', description: 'Select from Nicotine, THC, CBD, and THCA inventory.', iconKey: 'search'},
      {_type: 'homeHowToStep', _key: makeKey('howto', 1), title: 'Select Volume', description: 'Choose quantity tiers for wholesale discount progression.', iconKey: 'send'},
      {_type: 'homeHowToStep', _key: makeKey('howto', 2), title: 'Secure Checkout', description: 'Complete encrypted checkout with your preferred payment path.', iconKey: 'mail'},
      {_type: 'homeHowToStep', _key: makeKey('howto', 3), title: 'Discreet Delivery', description: 'Receive tracked shipments in neutral packaging.', iconKey: 'packageCheck'},
    ],
    howToCtaLabel: 'Start Your Order Now',
    howToCtaHref: '/wholesale-request',
  })

  // Wholesale CTA
  setIfEmpty('wholesaleMidEyebrow', 'Wholesale Partners')
  setIfEmpty('wholesaleMidHeading', 'Built for Retailers Scaling Fast')
  setIfEmpty(
    'wholesaleMidDescription',
    'Join our wholesale program for dependable inventory, fast processing, and support built around high-volume ordering.',
  )
  setIfEmpty('wholesaleMidCtaLabel', 'Apply for Wholesale')
  setIfEmpty('wholesaleMidCtaHref', '/wholesale')

  // Brands section
  setIfEmpty('brandsEyebrow', 'Brand Partners')
  setIfEmpty('brandsHeading', 'Brands We Carry')
  setIfEmpty('brandsEmptyMessage', 'No homepage brands configured yet.')

  // Blog section
  setIfEmpty('blogEyebrow', 'Latest Insights')
  setIfEmpty('blogHeading', 'From the Blog')
  setIfEmpty('blogDescription', 'Fresh wholesale guidance for retailers, distributors, and high-volume buyers.')
  setIfEmpty('blogEmptyMessage', 'Blog posts will appear here once published in Sanity.')
  setIfEmpty('blogViewAllLabel', 'View All Posts')

  // Testimonials copy
  patch.set({
    testimonialsBadge: 'The Trust Wall',
    testimonialsHeading: 'Customer Testimonials',
    testimonialsIntro:
      'Feedback from verified retailers and distribution partners who source high-volume inventory through WholesaleVapesUSA.',
  })

  // FAQ copy
  patch.set({
    faqEyebrow: 'Related FAQs',
    faqHeading: 'International shipping, bulk pricing & delivery guarantees',
    faqDescription:
      'Straight answers on customs-ready international delivery, how to unlock tiered wholesale pricing, and our 48-hour shipping guarantee.',
    faqViewAllLabel: 'View full FAQ page',
  })

  // Compliance band
  setIfEmpty('complianceShopCtaLabel', 'Visit Shop')
  setIfEmpty('complianceShopCtaHref', '/products')
  setIfEmpty('complianceContactCtaLabel', 'Contact Sales Manager')
  setIfEmpty('complianceContactCtaHref', '/contact')

    return patch.commit({autoGenerateArrayKeys: true})
  }

  const results = await Promise.all([
    applyDefaults(publishedId, publishedDoc),
    draftDoc ? applyDefaults(draftId, draftDoc) : Promise.resolve(null),
  ])

  const homepageTestimonials = [
    {
      _id: 'testimonial-home-james-r',
      _type: 'testimonial',
      name: 'James R.',
      role: 'Verified Retailer',
      location: 'USA',
      quote:
        'The most reliable supplier we have found. THCA cart consistency and on-time delivery are exceptional for wholesale planning.',
      rating: 5,
      placements: ['homepage'],
      sortOrder: 1,
      isActive: true,
    },
    {
      _id: 'testimonial-home-sarah-l',
      _type: 'testimonial',
      name: 'Sarah L.',
      role: 'Distribution Manager',
      location: 'USA',
      quote:
        'WholesaleVapesUSA improved our margin profile this quarter. The nicotine assortment and replenishment cadence are strong.',
      rating: 5,
      placements: ['homepage'],
      sortOrder: 2,
      isActive: true,
    },
    {
      _id: 'testimonial-home-marcus-t',
      _type: 'testimonial',
      name: 'Marcus T.',
      role: 'Shop Owner',
      location: 'USA',
      quote:
        'Professional, discreet, and consistently transparent with documentation. They set a high bar for wholesale vape supply.',
      rating: 5,
      placements: ['homepage'],
      sortOrder: 3,
      isActive: true,
    },
  ]

  for (const testimonial of homepageTestimonials) {
    await client.createOrReplace(testimonial)
  }

  const homepageFaqs = buildHomepageFaqDocs()
  for (const faqDoc of homepageFaqs) {
    await client.createOrReplace(faqDoc)
  }

  const supersededHomepageFaqIds = [
    'faq-home-shipping-discretion',
    'faq-home-carts-vs-disposables',
    'faq-home-quality-assurance',
    'faq-home-thca-ordering',
  ]
  for (const faqId of supersededHomepageFaqIds) {
    try {
      await client.patch(faqId).set({isActive: false}).commit()
    } catch {
      // Document may not exist in this dataset; ignore.
    }
  }

  const updated = results.filter(Boolean) as Array<{_id: string}>
  // eslint-disable-next-line no-console
  console.log(`Homepage defaults seeded for ${updated.map((r) => r._id).join(', ')}.`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  if (isInsufficientSanityPermission(err)) {
    printSanityWritePermissionHelp()
  }
  process.exitCode = 1
})
