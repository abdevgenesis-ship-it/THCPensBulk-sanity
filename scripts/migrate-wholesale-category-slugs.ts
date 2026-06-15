/**
 * One-time migration: rename category `slug` + `name` from legacy `bulk-*` to `wholesale-*`
 * and fix `relatedGuides[].href` prefixes. Safe to re-run (idempotent for already-migrated data).
 *
 * From bulkvapesusa-sanity: `pnpm exec sanity exec ./scripts/migrate-wholesale-category-slugs.ts`
 *
 * Requires SANITY_AUTH_TOKEN (Editor) — see scripts/sanityWriteClient.ts
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

const MIGRATIONS: Array<{_id: string; prevSlug: string; nextSlug: string; nextName: string}> = [
  {
    _id: 'f565dcde-6f9c-480a-bcdc-f497dc560122',
    prevSlug: 'bulk-cbd-vapes',
    nextSlug: 'wholesale-cbd',
    nextName: 'Wholesale CBD',
  },
  {
    _id: '94731f01-8f0d-40df-a35f-6a9c8c6032d1',
    prevSlug: 'bulk-nicotine-vapes',
    nextSlug: 'wholesale-nicotine',
    nextName: 'Wholesale Nicotine',
  },
  {
    _id: 'e9dbb22a-3285-49e3-a953-43bfccca1e07',
    prevSlug: 'bulk-thca-vapes',
    nextSlug: 'wholesale-thca',
    nextName: 'Wholesale THCA',
  },
  {
    _id: 'e7f370f9-3a7f-46c5-b658-b5e0fce03c6f',
    prevSlug: 'bulk-thc-carts-and-cartridges',
    nextSlug: 'wholesale-thc-carts-vapes',
    nextName: 'Wholesale THC Carts & Vapes',
  },
  {
    _id: 'c98ef23a-5430-4a59-add6-1bbe9507f53c',
    prevSlug: 'bulk-thc-vapes',
    nextSlug: 'wholesale-thc-vapes',
    nextName: 'Wholesale THC Vapes',
  },
]

function patchGuideHrefs(
  href: string | undefined,
): {next: string | undefined; changed: boolean} {
  if (!href) {
    return {next: href, changed: false}
  }

  let next = href
  let changed = false

  for (const m of MIGRATIONS) {
    const from = `/category/${m.prevSlug}/`
    const to = `/category/${m.nextSlug}/`
    if (next.includes(from)) {
      next = next.split(from).join(to)
      changed = true
    }
  }

  return {next, changed}
}

async function main() {
  const client = getSanityWriteClient()

  for (const m of MIGRATIONS) {
    await client
      .patch(m._id)
      .set({
        name: m.nextName,
        slug: {_type: 'slug', current: m.nextSlug},
      })
      .commit()
    // eslint-disable-next-line no-console
    console.log(`Patched category ${m._id} → slug ${m.nextSlug}`)
  }

  const withGuides = await client.fetch<
    Array<{_id: string; relatedGuides?: Array<{_key?: string; href?: string; title?: string; [k: string]: unknown}>}>
  >(`*[_type == "category" && defined(relatedGuides)]{_id, relatedGuides}`)

  let guidePatchCount = 0

  for (const doc of withGuides) {
    if (!doc.relatedGuides?.length) continue

    let any = false
    const relatedGuides = doc.relatedGuides.map((g) => {
      const {next, changed} = patchGuideHrefs(typeof g.href === 'string' ? g.href : undefined)
      if (changed) any = true
      return {...g, href: next ?? g.href}
    })

    if (any) {
      await client.patch(doc._id).set({relatedGuides}).commit()
      guidePatchCount += 1
      // eslint-disable-next-line no-console
      console.log(`Updated relatedGuides on ${doc._id}`)
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Done. Patched ${MIGRATIONS.length} categories; ${guidePatchCount} relatedGuides documents.`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  if (isInsufficientSanityPermission(err)) {
    printSanityWritePermissionHelp()
  }
  process.exitCode = 1
})
