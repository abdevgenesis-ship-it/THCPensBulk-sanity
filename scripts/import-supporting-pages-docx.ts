/**
 * Import supporting pages from a docx file (concatenated JSON objects) into Sanity.
 *
 * Usage:
 *   pnpm exec sanity exec ./scripts/import-supporting-pages-docx.ts -- \
 *     --doc "docs/2. Nicotine & General Vapes.docx" \
 *     --id-prefix supporting-nicotine- \
 *     --dry-run
 *
 *   pnpm exec sanity exec ./scripts/import-supporting-pages-docx.ts -- \
 *     --doc "docs/1. 510 Hardware & Cartridges.docx" \
 *     --id-prefix supporting-510-hw-
 */
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import * as dotenv from 'dotenv'

import {
  hasReferences,
  parsePagesFromDocx,
  toSanityDocument,
} from './lib/importSupportingPagesFromDocx'
import {getSanityWriteClient, isInsufficientSanityPermission, printSanityWritePermissionHelp} from './sanityWriteClient'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dryRun = process.argv.includes('--dry-run')

function getArg(name: string): string | undefined {
  const index = process.argv.indexOf(name)
  if (index === -1) return undefined
  return process.argv[index + 1]
}

const docArg = getArg('--doc')
const idPrefixArg = getArg('--id-prefix')

if (!docArg || !idPrefixArg) {
  console.error('Usage: --doc <path-to-docx> --id-prefix <sanity-id-prefix> [--dry-run]')
  process.exit(1)
}

const docxPath = path.resolve(__dirname, '..', docArg)
const idPrefix = idPrefixArg.endsWith('-') ? idPrefixArg : `${idPrefixArg}-`

async function main() {
  const client = getSanityWriteClient()
  const pages = parsePagesFromDocx(docxPath)

  const pools = await client.fetch<{categoryIds: string[]; productIds: string[]}>(`{
    "categoryIds": *[_type == "category" && defined(slug.current) && !(_id in path("drafts.**"))]._id,
    "productIds": *[_type == "product" && defined(slug.current) && !(_id in path("drafts.**"))]._id
  }`)

  if (pools.categoryIds.length === 0 || pools.productIds.length === 0) {
    throw new Error('Need at least one published category and product in Sanity to fill empty relations.')
  }

  console.log(`Parsed ${pages.length} supporting pages from ${docArg}.`)

  for (const raw of pages) {
    const doc = toSanityDocument(raw, pools, idPrefix)
    const slug = raw.slug?.current
    const parent = raw.parentPage?._ref ? `parent=${raw.parentPage._ref}` : 'root'
    const randomCategories = hasReferences(raw.categories) ? 'doc' : 'random'
    const randomProducts = hasReferences(raw.relatedProducts) ? 'doc' : 'random'

    console.log(`  /${slug} (${parent}, categories=${randomCategories}, products=${randomProducts})`)

    if (dryRun) continue

    await client.createOrReplace(doc)

    if (!raw.parentPage?._ref) {
      await client.patch(doc._id as string).unset(['parentPage']).commit()
    }
  }

  console.log(dryRun ? 'Dry run complete (no writes).' : `Imported ${pages.length} supporting pages.`)
}

main().catch((error) => {
  if (isInsufficientSanityPermission(error)) {
    printSanityWritePermissionHelp()
  } else {
    console.error('Import failed:', error)
  }
  process.exitCode = 1
})
