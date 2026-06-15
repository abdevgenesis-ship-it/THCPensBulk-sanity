/**
 * Patches Bulk THC Carts & Cartridges with Wholesale THC carts/vapes marketing copy,
 * authority blocks (lead → H2 → tail), and linked FAQ items.
 *
 * Run: `pnpm exec sanity exec ./scripts/seed-wholesale-thc-carts-category.ts`
 *
 * Requires SANITY_AUTH_TOKEN (Editor) in bulkvapesusa-sanity/.env — see scripts/sanityWriteClient.ts
 */
import {config as loadEnv} from 'dotenv'
import {resolve} from 'node:path'

import {
  getSanityWriteClient,
  isInsufficientSanityPermission,
  printSanityWritePermissionHelp,
} from './sanityWriteClient'

loadEnv({path: resolve(process.cwd(), '.env')})
loadEnv({path: resolve(process.cwd(), '.env.local')})

const CATEGORY_ID = 'e7f370f9-3a7f-46c5-b658-b5e0fce03c6f'

const seoContent = [
  {
    _type: 'block' as const,
    _key: 'thc-carts-authority-lead',
    style: 'normal' as const,
    markDefs: [],
    children: [
      {
        _type: 'span' as const,
        _key: 'thc-carts-authority-lead-span',
        marks: [],
        text: `Wholesale THC carts are the standard for high-volume cannabinoid sales, and our inventory reflects the absolute best in 2026 hardware and oil quality. We provide wholesale THC vapes that utilize CCELL ceramic technology and AVEO postless designs to ensure zero failure rates and maximum flavor. For retailers looking to buy THC vapes wholesale, we offer a diverse catalog that includes Delta-8, Delta-10, and advanced HHC/THC-P blends designed for consistent retail performance.`,
      },
    ],
  },
  {
    _type: 'block' as const,
    _key: 'thc-carts-authority-tail',
    style: 'normal' as const,
    markDefs: [],
    children: [
      {
        _type: 'span' as const,
        _key: 'thc-carts-authority-tail-span',
        marks: [],
        text: `Buy THC carts wholesale from a partner that prioritizes your bottom line. We understand that in the competitive THC market, price and delivery speed are everything. That is why we guarantee 48h shipping on all wholesale THC vape orders. Our bulk THC cartridges are available in various sizes, from 0.5ml testers to 5ml heavy-hitters, all for sale at the most competitive rates in the USA.`,
      },
    ],
  },
]

const faq510 = {
  _id: 'faq-thc-carts-wholesale-510-batteries',
  _type: 'faqItem' as const,
  question: 'Are these wholesale THC carts compatible with standard batteries?',
  answer: [
    {
      _type: 'block' as const,
      style: 'normal' as const,
      markDefs: [],
      children: [
        {
          _type: 'span' as const,
          text: 'Yes, all our carts use universal 510-thread connections.',
          marks: [],
        },
      ],
    },
  ],
  category: 'THC Carts' as const,
  productCategories: [{_type: 'reference' as const, _ref: CATEGORY_ID, _key: 'pc-thc-510'}],
  order: 10,
  isActive: true,
}

const faqMoq = {
  _id: 'faq-thc-carts-wholesale-minimum-order',
  _type: 'faqItem' as const,
  question: 'What is the minimum order for wholesale THC vapes?',
  answer: [
    {
      _type: 'block' as const,
      style: 'normal' as const,
      markDefs: [],
      children: [
        {
          _type: 'span' as const,
          text: 'We offer tiered entry points to support both small shops and large distributors.',
          marks: [],
        },
      ],
    },
  ],
  category: 'THC Carts' as const,
  productCategories: [{_type: 'reference' as const, _ref: CATEGORY_ID, _key: 'pc-thc-moq'}],
  order: 11,
  isActive: true,
}

async function main() {
  const client = getSanityWriteClient()

  await client.createOrReplace(faq510)
  await client.createOrReplace(faqMoq)

  await client
    .patch(CATEGORY_ID)
    .set({
      seoTitle: 'Wholesale THC Carts & Vapes | Bulk 510 THC Cartridges',
      seoDescription:
        'Shop wholesale THC carts and 510 vape cartridges. Best bulk prices on THC-A, THC-P, and Delta-8 vapes for sale. Licensed wholesale distributor.',
      shortDescription:
        'Bulk THC vape cartridges and high-performance hardware for professional retailers.',
      categoryHeroEyebrow: 'Wholesale THC Carts',
      categoryHeroHeading: 'Wholesale THC carts and premium 510-threaded vape hardware.',
      categoryAuthorityHeadingTemplate:
        'Wholesale THC carts for sale at professional distributor pricing.',
      seoContent,
      categoryFaqHeading: 'Related FAQs',
      categoryFaqDescription:
        '510 compatibility, MOQ tiers, and how we support THC cart wholesale buyers.',
      categoryFaqItems: [
        {_type: 'reference', _ref: faq510._id, _key: 'thc-carts-faq-ref-510'},
        {_type: 'reference', _ref: faqMoq._id, _key: 'thc-carts-faq-ref-moq'},
      ],
    })
    .commit()

  // eslint-disable-next-line no-console
  console.log(`Updated category ${CATEGORY_ID} and FAQ docs ${faq510._id}, ${faqMoq._id}.`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  if (isInsufficientSanityPermission(err)) {
    printSanityWritePermissionHelp()
  }
  process.exitCode = 1
})
