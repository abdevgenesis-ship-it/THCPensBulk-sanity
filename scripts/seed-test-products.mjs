/**
 * Seeds 2 test products for B2C checkout testing.
 * Requires categories from seed-melatonin-site.mjs (category-sleep-gummies, category-natrol-gummies).
 *
 * Run from melatoningummiesuk-sanity:  node scripts/seed-test-products.mjs
 */
import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import {resolve} from 'node:path'
import {readFileSync} from 'node:fs'

loadEnv({path: resolve(process.cwd(), '.env')})

const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN
if (!token) {
  throw new Error('Missing SANITY_AUTH_TOKEN / SANITY_API_TOKEN in .env')
}

const client = createClient({
  projectId: '8fp9giy6',
  dataset: 'production',
  apiVersion: '2024-02-01',
  token,
  useCdn: false,
})

const PUB = resolve(process.cwd(), '../melatoningummiesuk-web/public/images/categories')

let keyCounter = 0
const key = () => `k${Date.now().toString(36)}${(keyCounter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`

const p = (text) => ({_type: 'block', _key: key(), style: 'normal', markDefs: [], children: [{_type: 'span', _key: key(), text, marks: []}]})

async function uploadImage(filename, alt) {
  try {
    const filePath = resolve(PUB, filename)
    const buffer = readFileSync(filePath)
    const asset = await client.assets.upload('image', buffer, {filename})
    return {_type: 'image', alt, asset: {_type: 'reference', _ref: asset._id}}
  } catch (err) {
    console.warn(`  Could not upload ${filename}:`, err?.message || err)
    return null
  }
}

function variant({name, sku, flavor, packSize, price, compareAtPrice, isDefault = false}) {
  return {
    _key: key(),
    _type: 'productVariant',
    name,
    sku,
    flavor,
    packSize,
    price,
    compareAtPrice,
    stockQty: 200,
    isDefault,
    isActive: true,
  }
}

async function main() {
  console.log('Seeding brands and test products...')

  await client.createOrReplace({
    _id: 'brand-natrol',
    _type: 'brand',
    name: 'Natrol',
    slug: {_type: 'slug', current: 'natrol'},
    shortDescription: "America's #1 melatonin brand — clinical-strength sleep gummies.",
    isActive: true,
    sortOrder: 10,
  })

  await client.createOrReplace({
    _id: 'brand-sleep-well',
    _type: 'brand',
    name: 'Sleep Well',
    slug: {_type: 'slug', current: 'sleep-well'},
    shortDescription: 'Premium UK-formulated sleep and melatonin gummies.',
    isActive: true,
    sortOrder: 20,
  })

  const natrolImg = await uploadImage('natrol_gummies.png', 'Natrol melatonin gummies 10mg berry flavour')
  const sleepImg = await uploadImage('sleep_gummies.png', 'Sleep Well melatonin gummies berry flavour')

  const natrolProduct = {
    _id: 'product-natrol-melatonin-10mg',
    _type: 'product',
    name: 'Natrol Melatonin Gummies 10mg',
    slug: {_type: 'slug', current: 'natrol-melatonin-gummies-10mg'},
    brand: {_type: 'reference', _ref: 'brand-natrol'},
    category: {_type: 'reference', _ref: 'category-natrol-gummies'},
    productType: 'Disposable',
    shortDescription: 'Drug-free, non-GMO berry melatonin gummies — 10mg per serving, 60 count jar.',
    description: [
      p('Natrol Melatonin Gummies help you fall asleep faster and stay asleep longer. Each serving delivers 10mg of melatonin in a delicious berry flavour.'),
    ],
    variants: [
      variant({
        name: 'Berry • 60 Count',
        sku: 'NAT-10-60',
        flavor: 'Berry',
        packSize: '60 Count',
        price: 14.99,
        compareAtPrice: 18.99,
        isDefault: true,
      }),
    ],
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    publishedAt: new Date().toISOString(),
    seoTitle: 'Natrol Melatonin Gummies 10mg — Buy Online UK',
    seoDescription: 'Order authentic Natrol 10mg melatonin gummies with fast UK delivery. 60-count berry jar.',
  }
  if (natrolImg) natrolProduct.images = [natrolImg]

  const sleepProduct = {
    _id: 'product-sleep-well-melatonin-5mg',
    _type: 'product',
    name: 'Sleep Well Melatonin Gummies 5mg',
    slug: {_type: 'slug', current: 'sleep-well-melatonin-gummies-5mg'},
    brand: {_type: 'reference', _ref: 'brand-sleep-well'},
    category: {_type: 'reference', _ref: 'category-sleep-gummies'},
    productType: 'Disposable',
    shortDescription: 'Gentle 5mg melatonin gummies with chamomile — ideal for everyday sleep support, 30 count.',
    description: [
      p('Sleep Well Melatonin Gummies combine 5mg melatonin with chamomile extract for a calm bedtime routine. Soft, fruity gummies suitable for regular use.'),
    ],
    variants: [
      variant({
        name: 'Mixed Berry • 30 Count',
        sku: 'SW-5-30',
        flavor: 'Mixed Berry',
        packSize: '30 Count',
        price: 9.99,
        compareAtPrice: 12.99,
        isDefault: true,
      }),
    ],
    isActive: true,
    isFeatured: true,
    isBestSeller: false,
    publishedAt: new Date().toISOString(),
    seoTitle: 'Sleep Well Melatonin Gummies 5mg — Buy Online UK',
    seoDescription: 'Buy Sleep Well 5mg melatonin gummies with chamomile. 30-count mixed berry jar, fast UK delivery.',
  }
  if (sleepImg) sleepProduct.images = [sleepImg]

  await client.createOrReplace(natrolProduct)
  await client.createOrReplace(sleepProduct)

  console.log('\nTest products seeded:')
  console.log('  - Natrol Melatonin Gummies 10mg  →  /product/natrol-melatonin-gummies-10mg')
  console.log('  - Sleep Well Melatonin Gummies 5mg  →  /product/sleep-well-melatonin-gummies-5mg')
}

main().catch((err) => {
  console.error('Seed failed:', err?.message || err)
  if (err?.response?.body) console.error(JSON.stringify(err.response.body, null, 2))
  process.exitCode = 1
})
