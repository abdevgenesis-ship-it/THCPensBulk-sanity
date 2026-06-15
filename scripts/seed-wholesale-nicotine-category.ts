/**
 * Patches the Bulk Nicotine Vapes category with Wholesale Nicotine marketing copy,
 * SEO authority blocks (lead → H2 → tail), and linked FAQ items.
 *
 * Run: `pnpm exec sanity exec ./scripts/seed-wholesale-nicotine-category.ts`
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

const CATEGORY_ID = '94731f01-8f0d-40df-a35f-6a9c8c6032d1'

const seoContent = [
  {
    _type: 'block' as const,
    _key: 'nic-authority-lead',
    style: 'normal' as const,
    markDefs: [],
    children: [
      {
        _type: 'span' as const,
        _key: 'nic-authority-lead-span',
        marks: [],
        text: `Wholesale nicotine vapes currently dominate the global retail landscape, driven by the massive shift toward "Bar Salts" and high-performance disposables. At WholesaleVapesUSA.com, we stock the brands that drive foot traffic: Elfliq, Bar Juice 5000, and Nasty Liq. Our wholesale nicotine catalog covers the entire spectrum of consumer needs, including traditional freebase e-liquids, high-strength nicotine salts, and the increasingly popular zero-nicotine alternative vapes.`,
      },
    ],
  },
  {
    _type: 'block' as const,
    _key: 'nic-authority-tail',
    style: 'normal' as const,
    markDefs: [],
    children: [
      {
        _type: 'span' as const,
        _key: 'nic-authority-tail-span',
        marks: [],
        text: `Buy wholesale nicotine products from a supplier that understands shelf-velocity. Our 2026 inventory includes double-concentrated salts that mimic the intensity of disposable devices, satisfying the "Connoisseur" vaper while providing the high margins retailers need. With our 48h delivery guarantee, you can order nicotine vapes wholesale today and have them on your shelves by the weekend, ensuring you never miss a sale due to stockouts.`,
      },
    ],
  },
]

const faqZeroNic = {
  _id: 'faq-nicotine-wholesale-zero-nic',
  _type: 'faqItem' as const,
  question: 'Do you offer wholesale zero-nicotine vapes?',
  answer: [
    {
      _type: 'block' as const,
      style: 'normal' as const,
      markDefs: [],
      children: [
        {
          _type: 'span' as const,
          text: 'Yes, we carry a wide range of nicotine-free disposables and e-liquids for the wellness market.',
          marks: [],
        },
      ],
    },
  ],
  category: 'Nicotine' as const,
  productCategories: [{_type: 'reference' as const, _ref: CATEGORY_ID, _key: 'pc-nic-zero'}],
  order: 10,
  isActive: true,
}

const faqLicense = {
  _id: 'faq-nicotine-wholesale-license-pact',
  _type: 'faqItem' as const,
  question: 'Is there a license required to buy nicotine wholesale?',
  answer: [
    {
      _type: 'block' as const,
      style: 'normal' as const,
      markDefs: [],
      children: [
        {
          _type: 'span' as const,
          text: 'We adhere to all state and federal PACT Act requirements for nicotine distribution.',
          marks: [],
        },
      ],
    },
  ],
  category: 'Nicotine' as const,
  productCategories: [{_type: 'reference' as const, _ref: CATEGORY_ID, _key: 'pc-nic-pact'}],
  order: 11,
  isActive: true,
}

async function main() {
  const client = getSanityWriteClient()

  await client.createOrReplace(faqZeroNic)
  await client.createOrReplace(faqLicense)

  await client
    .patch(CATEGORY_ID)
    .set({
      seoTitle: 'Wholesale Nicotine Vapes & Salt E-Liquids | Bulk Disposable Vapes',
      seoDescription:
        'Shop wholesale nicotine vapes and bar salts. Bulk nicotine-free and salt nicotine vapes for sale from top brands like Elfliq and Nasty Liq. 48h Delivery.',
      shortDescription:
        'Premium nicotine salt wholesale for retailers seeking the most popular disposable-style flavors in bulk.',
      categoryHeroEyebrow: 'Wholesale Nicotine',
      categoryHeroHeading: 'Wholesale nicotine vapes and high-concentrate bar salt liquids.',
      categoryAuthorityHeadingTemplate:
        'Wholesale nicotine vapes for sale at unbeatable bulk rates.',
      seoContent,
      categoryFaqHeading: 'Related FAQs',
      categoryFaqDescription:
        'Zero-nicotine wholesale options and how we align with PACT Act nicotine distribution rules.',
      categoryFaqItems: [
        {_type: 'reference', _ref: faqZeroNic._id, _key: 'nic-faq-ref-zero'},
        {_type: 'reference', _ref: faqLicense._id, _key: 'nic-faq-ref-pact'},
      ],
    })
    .commit()

  // eslint-disable-next-line no-console
  console.log(`Updated category ${CATEGORY_ID} and FAQ docs ${faqZeroNic._id}, ${faqLicense._id}.`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  if (isInsufficientSanityPermission(err)) {
    printSanityWritePermissionHelp()
  }
  process.exitCode = 1
})
