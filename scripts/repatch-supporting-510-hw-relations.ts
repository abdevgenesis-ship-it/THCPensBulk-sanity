/**
 * Fix supporting-510-hw-* pages: replace draft/broken category & product refs
 * with published documents only.
 *
 * Usage:
 *   pnpm exec sanity exec ./scripts/repatch-supporting-510-hw-relations.ts -- --dry-run
 *   pnpm exec sanity exec ./scripts/repatch-supporting-510-hw-relations.ts
 */
import {getSanityWriteClient, isInsufficientSanityPermission, printSanityWritePermissionHelp} from './sanityWriteClient'

const dryRun = process.argv.includes('--dry-run')

function hashSeed(seed: string): number {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number) {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function pickRandomItems<T>(items: T[], count: number, seed: string): T[] {
  if (items.length === 0) return []
  const take = Math.min(count, items.length)
  const rng = mulberry32(hashSeed(seed))
  const pool = [...items]

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, take)
}

function toReferences(ids: string[]) {
  return ids.map((_ref) => ({_type: 'reference' as const, _ref}))
}

async function main() {
  const client = getSanityWriteClient()

  const pools = await client.fetch<{categoryIds: string[]; productIds: string[]}>(`{
    "categoryIds": *[_type == "category" && defined(slug.current) && !(_id in path("drafts.**"))]._id,
    "productIds": *[_type == "product" && defined(slug.current) && !(_id in path("drafts.**"))]._id
  }`)

  if (pools.categoryIds.length < 4 || pools.productIds.length < 4) {
    throw new Error(
      `Need at least 4 published categories and products (got ${pools.categoryIds.length} categories, ${pools.productIds.length} products).`,
    )
  }

  const pages = await client.fetch<Array<{_id: string; slug?: string; title?: string}>>(
    `*[_type == "supportingPage" && _id match "supporting-510-hw-*" && !(_id in path("drafts.**"))]{
      _id,
      title,
      "slug": slug.current
    }`,
  )

  if (pages.length === 0) {
    console.log('No supporting-510-hw-* pages found.')
    return
  }

  for (const page of pages) {
    const seed = page.slug || page._id
    const categories = toReferences(pickRandomItems(pools.categoryIds, 4, `${seed}-categories`))
    const relatedProducts = toReferences(pickRandomItems(pools.productIds, 4, `${seed}-products`))

    console.log(`  ${page.slug ?? page._id}: ${page.title ?? '(untitled)'}`)

    if (dryRun) continue

    await client
      .patch(page._id)
      .set({
        categories,
        relatedProducts,
        categoriesHeading: 'Shop wholesale categories',
      })
      .commit()
  }

  console.log(
    dryRun
      ? `Dry run: would update ${pages.length} pages.`
      : `Updated ${pages.length} pages with published category/product refs.`,
  )
}

main().catch((error) => {
  if (isInsufficientSanityPermission(error)) {
    printSanityWritePermissionHelp()
  } else {
    console.error('Repatch failed:', error)
  }
  process.exitCode = 1
})
