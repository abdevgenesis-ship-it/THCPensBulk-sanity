/**
 * Patches the Bulk CBD Vapes category (seed id) with Wholesale CBD marketing copy,
 * SEO authority blocks (lead → H2 → tail), and linked FAQ items.
 *
 * Run from bulkvapesusa-sanity: `pnpm exec sanity exec ./scripts/seed-wholesale-cbd-category.ts`
 *
 * Requires write access: set SANITY_AUTH_TOKEN (Editor) in bulkvapesusa-sanity/.env — see scripts/sanityWriteClient.ts
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

const CATEGORY_ID = 'f565dcde-6f9c-480a-bcdc-f497dc560122'

const seoContent = [
  {
    _type: 'block' as const,
    _key: 'cbd-authority-lead',
    style: 'normal' as const,
    markDefs: [],
    children: [
      {
        _type: 'span' as const,
        _key: 'cbd-authority-lead-span',
        marks: [],
        text: `Wholesale CBD vape oil is more than just a commodity; it is a wellness-focused product that requires strict purity standards. We offer an expansive selection of wholesale CBD products, ranging from full-spectrum distillates to 1-liter bulk isolates designed for high-end formulations. Our CBD vape juice wholesale options are curated for retailers who prioritize "Information Gain"—providing your customers with the technical data and lab results they need to trust your brand.`,
      },
    ],
  },
  {
    _type: 'block' as const,
    _key: 'cbd-authority-tail',
    style: 'normal' as const,
    markDefs: [],
    children: [
      {
        _type: 'span' as const,
        _key: 'cbd-authority-tail-span',
        marks: [],
        text: `Ordering wholesale CBD from us means securing the best price-per-milligram on the market. We stock pre-filled 510 cartridges and refillable pod-compatible liquids from industry leaders like Greeneo and JustCBD. Whether you are looking to buy CBD vape juice in bulk for a multi-location chain or a single boutique, our wholesale CBD infrastructure ensures your inventory is always fresh and compliant with 2026 federal guidelines.`,
      },
    ],
  },
]

const faqLiter = {
  _id: 'faq-cbd-wholesale-liter',
  _type: 'faqItem' as const,
  question: 'Can I get CBD vape juice in 1-liter quantities?',
  answer: [
    {
      _type: 'block' as const,
      style: 'normal' as const,
      markDefs: [],
      children: [
        {
          _type: 'span' as const,
          text: 'Yes, we specialize in high-volume bulk liters for manufacturers and large retailers.',
          marks: [],
        },
      ],
    },
  ],
  category: 'CBD' as const,
  productCategories: [{_type: 'reference' as const, _ref: CATEGORY_ID, _key: 'pc-cbd-liter'}],
  order: 10,
  isActive: true,
}

const faqFarmBill = {
  _id: 'faq-cbd-wholesale-farm-bill',
  _type: 'faqItem' as const,
  question: 'Is your CBD hemp oil vape wholesale compliant?',
  answer: [
    {
      _type: 'block' as const,
      style: 'normal' as const,
      markDefs: [],
      children: [
        {
          _type: 'span' as const,
          text: 'All products are 2018 Farm Bill compliant and contain less than 0.3% Delta-9 THC.',
          marks: [],
        },
      ],
    },
  ],
  category: 'CBD' as const,
  productCategories: [{_type: 'reference' as const, _ref: CATEGORY_ID, _key: 'pc-cbd-farm'}],
  order: 11,
  isActive: true,
}

async function main() {
  const client = getSanityWriteClient()

  await client.createOrReplace(faqLiter)
  await client.createOrReplace(faqFarmBill)

  await client
    .patch(CATEGORY_ID)
    .set({
      seoTitle: 'Wholesale CBD Vape Oil, Juice & Carts | Bulk CBD USA',
      seoDescription:
        'Buy wholesale CBD vape oil and pre-filled cartridges in bulk. High-potency CBD juice and isolates for sale at wholesale prices with 48h shipping.',
      shortDescription:
        'Bulk CBD vape juice, 510 cartridges, and 1-liter isolates for clinical-grade retail portfolios.',
      categoryHeroEyebrow: 'Wholesale CBD',
      categoryHeroHeading: 'Wholesale CBD vape oil and premium hemp extract supplies.',
      categoryAuthorityHeadingTemplate:
        'Wholesale CBD vape oil for sale with guaranteed 48h shipping.',
      seoContent,
      categoryFaqHeading: 'Related FAQs',
      categoryFaqDescription:
        'Volume liters, Farm Bill compliance, and how we support CBD vape wholesale buyers.',
      categoryFaqItems: [
        {_type: 'reference', _ref: faqLiter._id, _key: 'cbd-faq-ref-liter'},
        {_type: 'reference', _ref: faqFarmBill._id, _key: 'cbd-faq-ref-farm'},
      ],
    })
    .commit()

  // eslint-disable-next-line no-console
  console.log(`Updated category ${CATEGORY_ID} and FAQ docs ${faqLiter._id}, ${faqFarmBill._id}.`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  if (isInsufficientSanityPermission(err)) {
    printSanityWritePermissionHelp()
  }
  process.exitCode = 1
})
