/**
 * Patches the Bulk THCA Vapes category with Wholesale THCA marketing copy,
 * SEO authority blocks (lead → H2 → tail), and linked FAQ items.
 *
 * Run: `pnpm exec sanity exec ./scripts/seed-wholesale-thca-category.ts`
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

const CATEGORY_ID = 'e9dbb22a-3285-49e3-a953-43bfccca1e07'

const seoContent = [
  {
    _type: 'block' as const,
    _key: 'thca-authority-lead',
    style: 'normal' as const,
    markDefs: [],
    children: [
      {
        _type: 'span' as const,
        _key: 'thca-authority-lead-span',
        marks: [],
        text: `Wholesale THCA carts have emerged as the premier choice for consumers seeking high-potency, legal cannabinoid experiences in 2026. Our selection of wholesale THCA products features advanced extraction methods, including liquid diamonds and live rosin infusions. These products are designed for the "Connoisseur" who demands a full-spectrum terpene profile and immediate efficacy. By stocking THCA vapes wholesale from us, you are positioning your store at the forefront of the legal hemp revolution.`,
      },
    ],
  },
  {
    _type: 'block' as const,
    _key: 'thca-authority-tail',
    style: 'normal' as const,
    markDefs: [],
    children: [
      {
        _type: 'span' as const,
        _key: 'thca-authority-tail-span',
        marks: [],
        text: `Ordering wholesale THCA from WholesaleVapesUSA.com provides your business with the "Institutional Shield" of safety. Every THCA disposable and cart in our inventory is batch-tested to ensure it meets the highest standards of purity. We offer bulk THCA vapes at the best market prices, with a focus on high-capacity units (3g and 5g) that are currently trending. Buy THCA vapes wholesale now to capitalize on the most lucrative segment of the modern cannabinoid industry.`,
      },
    ],
  },
]

const faqThcaVsThc = {
  _id: 'faq-thca-wholesale-vs-thc',
  _type: 'faqItem' as const,
  question: 'What is the difference between THCA and THC vapes?',
  answer: [
    {
      _type: 'block' as const,
      style: 'normal' as const,
      markDefs: [],
      children: [
        {
          _type: 'span' as const,
          text: 'THCA is the acidic precursor to THC; it is federally legal under the Farm Bill while offering a premium experience.',
          marks: [],
        },
      ],
    },
  ],
  category: 'THCA' as const,
  productCategories: [{_type: 'reference' as const, _ref: CATEGORY_ID, _key: 'pc-thca-vs'}],
  order: 10,
  isActive: true,
}

const faqDiamondsBulk = {
  _id: 'faq-thca-wholesale-diamonds-bulk',
  _type: 'faqItem' as const,
  question: 'Do you offer THCA diamonds in bulk?',
  answer: [
    {
      _type: 'block' as const,
      style: 'normal' as const,
      markDefs: [],
      children: [
        {
          _type: 'span' as const,
          text: 'Yes, we provide diamond-infused liquids and pre-filled hardware for wholesale buyers.',
          marks: [],
        },
      ],
    },
  ],
  category: 'THCA' as const,
  productCategories: [{_type: 'reference' as const, _ref: CATEGORY_ID, _key: 'pc-thca-dia'}],
  order: 11,
  isActive: true,
}

async function main() {
  const client = getSanityWriteClient()

  await client.createOrReplace(faqThcaVsThc)
  await client.createOrReplace(faqDiamondsBulk)

  await client
    .patch(CATEGORY_ID)
    .set({
      seoTitle: 'Wholesale THCA Carts & Disposables | Bulk THCA Vapes USA',
      seoDescription:
        'Buy wholesale THCA carts and vapes. High-potency THCA diamonds and live resin disposables for sale. Best bulk prices and guaranteed 48h delivery.',
      shortDescription:
        'Bulk THCA diamonds and live resin cartridges for the premium connoisseur market.',
      categoryHeroEyebrow: 'Wholesale THCA',
      categoryHeroHeading: 'Wholesale THCA carts and high-capacity disposable vapes.',
      categoryAuthorityHeadingTemplate:
        'Wholesale THCA vapes for sale with institutional trust signals.',
      seoContent,
      categoryFaqHeading: 'Related FAQs',
      categoryFaqDescription:
        'How THCA compares to THC for wholesale buyers, and bulk diamond-infused inventory.',
      categoryFaqItems: [
        {_type: 'reference', _ref: faqThcaVsThc._id, _key: 'thca-faq-ref-vs'},
        {_type: 'reference', _ref: faqDiamondsBulk._id, _key: 'thca-faq-ref-dia'},
      ],
    })
    .commit()

  // eslint-disable-next-line no-console
  console.log(`Updated category ${CATEGORY_ID} and FAQ docs ${faqThcaVsThc._id}, ${faqDiamondsBulk._id}.`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  if (isInsufficientSanityPermission(err)) {
    printSanityWritePermissionHelp()
  }
  process.exitCode = 1
})
