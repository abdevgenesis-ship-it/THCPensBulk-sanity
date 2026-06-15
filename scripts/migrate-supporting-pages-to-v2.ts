/**
 * One-time migration: legacy supportingPage fields → v2 generator fields.
 *
 * Usage:
 *   pnpm exec tsx scripts/migrate-supporting-pages-to-v2.ts
 *   pnpm exec tsx scripts/migrate-supporting-pages-to-v2.ts --dry-run
 */
import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config()

const dryRun = process.argv.includes('--dry-run')

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '8fp9giy6',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2025-03-01',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
})

type LegacySupportingPage = {
  _id: string
  exactKeyword?: string
  supportingTerm?: string
  subH1?: string
  heroParagraph?: string
  introParagraphs?: string[]
  h2Heading?: string
  h2Paragraphs?: unknown[]
  aboveFoldDeepContent?: unknown[]
}

function blocksToStrings(blocks: unknown[] | undefined): string[] {
  if (!Array.isArray(blocks)) return []
  return blocks
    .map((block) => {
      if (!block || typeof block !== 'object') return ''
      const children = (block as {children?: unknown}).children
      if (!Array.isArray(children)) return ''
      return children
        .map((child) => {
          if (!child || typeof child !== 'object') return ''
          const text = (child as {text?: unknown}).text
          return typeof text === 'string' ? text : ''
        })
        .join('')
        .trim()
    })
    .filter(Boolean)
}

function buildDeepContent(page: LegacySupportingPage) {
  if (Array.isArray(page.aboveFoldDeepContent) && page.aboveFoldDeepContent.length > 0) {
    return page.aboveFoldDeepContent
  }

  const sections: Array<{_type: 'block'; _key: string; style: string; markDefs: unknown[]; children: unknown[]}> =
    []

  if (page.h2Heading?.trim()) {
    sections.push({
      _type: 'block',
      _key: `m-h2-${page._id}`,
      style: 'h2',
      markDefs: [],
      children: [{_type: 'span', _key: `m-h2-span-${page._id}`, text: page.h2Heading.trim(), marks: []}],
    })
  }

  for (const [index, paragraph] of blocksToStrings(page.h2Paragraphs).entries()) {
    sections.push({
      _type: 'block',
      _key: `m-p-${page._id}-${index}`,
      style: 'normal',
      markDefs: [],
      children: [{_type: 'span', _key: `m-p-span-${page._id}-${index}`, text: paragraph, marks: []}],
    })
  }

  return sections
}

async function main() {
  if (!client.config().token) {
    throw new Error('Missing SANITY_API_TOKEN or SANITY_AUTH_TOKEN')
  }

  const pages = await client.fetch<LegacySupportingPage[]>(`
    *[_type == "supportingPage"]{
      _id,
      exactKeyword,
      supportingTerm,
      subH1,
      heroParagraph,
      introParagraphs,
      h2Heading,
      h2Paragraphs,
      aboveFoldDeepContent
    }
  `)

  let migrated = 0

  for (const page of pages) {
    const keyword = page.exactKeyword?.trim() || ''
    const introParagraphs =
      page.introParagraphs?.length
        ? page.introParagraphs
        : page.heroParagraph?.trim()
          ? [page.heroParagraph.trim()]
          : undefined

    const subH1 = page.subH1?.trim() || page.supportingTerm?.trim() || undefined
    const aboveFoldDeepContent = buildDeepContent(page)

    const patch: Record<string, unknown> = {}

    if (introParagraphs?.length && !page.introParagraphs?.length) {
      patch.introParagraphs = introParagraphs.slice(0, 2)
    }

    if (subH1 && !page.subH1) {
      patch.subH1 = keyword && !subH1.toLowerCase().startsWith(keyword.toLowerCase()) ? `${keyword} ${subH1}` : subH1
    }

    if (aboveFoldDeepContent.length && !page.aboveFoldDeepContent?.length) {
      patch.aboveFoldDeepContent = aboveFoldDeepContent
    }

    if (Object.keys(patch).length === 0) continue

    migrated += 1
    // eslint-disable-next-line no-console
    console.log(`${dryRun ? '[dry-run] ' : ''}Migrate ${page._id}`, Object.keys(patch))

    if (!dryRun) {
      await client.patch(page._id).set(patch).commit()
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Done. ${migrated} page(s) ${dryRun ? 'would be ' : ''}updated.`)
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
})
