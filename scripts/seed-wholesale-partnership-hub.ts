/**
 * Updates the wholesale page singleton ("Partnership Hub" copy).
 *
 * Run: `pnpm exec sanity exec ./scripts/seed-wholesale-partnership-hub.ts`
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

const WHOLESALE_PAGE_ID = 'wholesalePage'

function makeKey(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 10)}`
}

async function main() {
  const client = getSanityWriteClient()

  await client
    .patch(WHOLESALE_PAGE_ID)
    .set({
      seoTitle: 'Wholesale Vapes Partnership | B2B Programs | WholesaleVapesUSA.com',
      seoDescription:
        'Partner with WholesaleVapesUSA.com: wholesale vapes, 48h shipping, B2B portal access, 5,000+ SKUs, daily price monitoring, and dedicated account support.',
      heroBadge: 'Partnership Hub',
      heroHeading: 'Wholesale vapes and bulk distribution partnership programs.',
      heroSecondaryHeading: 'Wholesale vapes account registration for professional retailers.',
      heroSubhead: `At WholesaleVapesUSA.com, our wholesale program is built on the pillars of Consistency, Quality, and Speed. We provide a streamlined B2B portal where you can buy wholesale vapes, track your 48h shipping, and access high-resolution marketing assets for your own site.`,
      heroTrustLine1: 'Consistency · Quality · Speed',
      heroTrustLine2: '48h shipping · B2B portal',
      whyHeading: 'Why Partner With Us?',
      whyIntro:
        'Our wholesale partnership model is built for retailers and distributors who need depth, pricing discipline, and responsive logistics support.',
      benefits: [
        {
          _type: 'wholesaleBenefit',
          _key: makeKey('wb'),
          title: 'Inventory Depth',
          description:
            'Access to over 5,000+ SKUs across CBD, THC, and Nicotine.',
          iconKey: 'boxes',
        },
        {
          _type: 'wholesaleBenefit',
          _key: makeKey('wb'),
          title: 'Price Protection',
          description:
            'We monitor the market daily to ensure you have the best wholesale prices for sale.',
          iconKey: 'badgePercent',
        },
        {
          _type: 'wholesaleBenefit',
          _key: makeKey('wb'),
          title: 'Dedicated Account Managers',
          description:
            '"Clinical" support for all your logistical needs.',
          iconKey: 'headphones',
        },
      ],
    })
    .commit({autoGenerateArrayKeys: true})

  // eslint-disable-next-line no-console
  console.log(`Updated ${WHOLESALE_PAGE_ID} with Partnership Hub hero and Why Partner benefits.`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  if (isInsufficientSanityPermission(err)) {
    printSanityWritePermissionHelp()
  }
  process.exitCode = 1
})
