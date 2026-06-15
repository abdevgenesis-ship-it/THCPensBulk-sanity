/**
 * Import supporting pages from docs/1. 510 Hardware & Cartridges.docx into Sanity.
 *
 * Usage:
 *   pnpm exec tsx scripts/import-supporting-510-hardware-docx.ts --dry-run
 *   pnpm exec tsx scripts/import-supporting-510-hardware-docx.ts
 */
import {execSync} from 'node:child_process'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {jsonrepair} from 'jsonrepair'
import * as dotenv from 'dotenv'

import {getSanityWriteClient, isInsufficientSanityPermission, printSanityWritePermissionHelp} from './sanityWriteClient'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docxPath = path.resolve(__dirname, '../docs/1. 510 Hardware & Cartridges.docx')
const dryRun = process.argv.includes('--dry-run')

type PortableTextBlock = {
  _type?: string
  style?: string
  markDefs?: unknown[]
  children?: Array<{_type?: string; text?: string; marks?: string[]}>
}

type RawSupportingPage = {
  title?: string
  slug?: {_type?: string; current?: string}
  exactKeyword?: string
  supportingTerm?: string
  metaTitle?: string
  metaDescription?: string
  seoDescription?: string
  heroParagraph?: string
  primaryCtaLabel?: string
  primaryCtaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  h2Heading?: string
  h2Paragraphs?: PortableTextBlock[]
  whyChooseUsHeading?: string
  whyChooseUsPoints?: string[]
  body?: PortableTextBlock[]
  categoriesHeading?: string
  categories?: Array<{_type?: string; _ref?: string}>
  relatedProducts?: Array<{_type?: string; _ref?: string}>
  parentPage?: {_type?: string; _ref?: string} | null
}

function extractTextFromDocx(filePath: string): string {
  const xml = execSync(`unzip -p ${JSON.stringify(filePath)} word/document.xml`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  })

  return xml
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractObjectStrings(text: string): string[] {
  const chunks: string[] = []
  let i = 0

  while (i < text.length) {
    if (text[i] !== '{') {
      i += 1
      continue
    }

    let depth = 0
    const start = i
    let inStr = false
    let esc = false
    let closed = false

    for (let j = i; j < text.length; j += 1) {
      const char = text[j]
      if (inStr) {
        if (esc) esc = false
        else if (char === '\\') esc = true
        else if (char === '"') inStr = false
        continue
      }

      if (char === '"') inStr = true
      else if (char === '{') depth += 1
      else if (char === '}') {
        depth -= 1
        if (depth === 0) {
          chunks.push(text.slice(start, j + 1))
          i = j + 1
          closed = true
          break
        }
      }
    }

    if (!closed) break
  }

  return chunks
}

function parsePagesFromDocx(filePath: string): RawSupportingPage[] {
  const text = extractTextFromDocx(filePath)
  const chunks = extractObjectStrings(text)

  return chunks.map((chunk, index) => {
    try {
      return JSON.parse(jsonrepair(chunk)) as RawSupportingPage
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to parse page ${index + 1} from docx: ${message}`)
    }
  })
}

function normalizeBlocks(blocks: PortableTextBlock[] | undefined, keyPrefix: string): PortableTextBlock[] {
  if (!Array.isArray(blocks)) return []

  return blocks.map((block, index) => ({
    ...block,
    _key: `${keyPrefix}-${index}`,
    _type: block._type ?? 'block',
    style: block.style ?? 'normal',
    markDefs: block.markDefs ?? [],
    children: Array.isArray(block.children)
      ? block.children.map((child, childIndex) => ({
          ...child,
          _key: `${keyPrefix}-${index}-span-${childIndex}`,
          _type: child._type ?? 'span',
          marks: child.marks ?? [],
        }))
      : [],
  }))
}

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

function hasReferences(values: Array<{_ref?: string}> | undefined): boolean {
  return Array.isArray(values) && values.some((value) => Boolean(value?._ref))
}

function buildDocumentId(slug: string): string {
  return `supporting-510-hw-${slug}`
}

function toSanityDocument(raw: RawSupportingPage, pools: {categoryIds: string[]; productIds: string[]}) {
  const slug = raw.slug?.current?.trim()
  if (!slug) {
    throw new Error(`Missing slug for page "${raw.title ?? 'unknown'}"`)
  }

  const doc: Record<string, unknown> = {
    _id: buildDocumentId(slug),
    _type: 'supportingPage',
    title: raw.title,
    slug: raw.slug,
    exactKeyword: raw.exactKeyword,
    supportingTerm: raw.supportingTerm,
    metaTitle: raw.metaTitle,
    metaDescription: raw.metaDescription,
    seoDescription: raw.seoDescription,
    heroParagraph: raw.heroParagraph,
    primaryCtaLabel: raw.primaryCtaLabel ?? 'Visit shop',
    primaryCtaHref: raw.primaryCtaHref ?? '/shop',
    secondaryCtaLabel: raw.secondaryCtaLabel ?? 'Contact us',
    secondaryCtaHref: raw.secondaryCtaHref ?? '/contact',
    h2Heading: raw.h2Heading,
    h2Paragraphs: normalizeBlocks(raw.h2Paragraphs, `${slug}-h2`),
    whyChooseUsHeading: raw.whyChooseUsHeading ?? 'Why choose us',
    whyChooseUsPoints: raw.whyChooseUsPoints ?? [],
    body: normalizeBlocks(raw.body, `${slug}-body`),
    categoriesHeading: raw.categoriesHeading ?? 'Shop wholesale categories',
  }

  if (raw.parentPage && typeof raw.parentPage === 'object' && raw.parentPage._ref) {
    doc.parentPage = {
      _type: 'reference',
      _ref: raw.parentPage._ref,
    }
  }

  if (hasReferences(raw.categories)) {
    doc.categories = raw.categories
  } else {
    doc.categories = toReferences(pickRandomItems(pools.categoryIds, 4, `${slug}-categories`))
  }

  if (hasReferences(raw.relatedProducts)) {
    doc.relatedProducts = raw.relatedProducts
  } else {
    doc.relatedProducts = toReferences(pickRandomItems(pools.productIds, 4, `${slug}-products`))
  }

  return doc
}

async function main() {
  const client = getSanityWriteClient()
  const pages = parsePagesFromDocx(docxPath)

  const pools = await client.fetch<{categoryIds: string[]; productIds: string[]}>(`{
    "categoryIds": *[_type == "category" && defined(slug.current) && !(_id in path("drafts.**"))]._id,
    "productIds": *[_type == "product" && defined(slug.current) && !(_id in path("drafts.**"))]._id
  }`)

  if (pools.categoryIds.length === 0 || pools.productIds.length === 0) {
    throw new Error('Need at least one category and one product in Sanity to fill empty relations.')
  }

  console.log(`Parsed ${pages.length} supporting pages from docx.`)

  for (const raw of pages) {
    const doc = toSanityDocument(raw, pools)
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
