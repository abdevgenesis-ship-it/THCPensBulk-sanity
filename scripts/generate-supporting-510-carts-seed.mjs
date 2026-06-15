/**
 * Parse docs/Document sans titre.docx (concatenated JSON objects) into
 * seed/supporting-510-carts.ndjson for root supporting pages (URLs: /:slug).
 */
import {execSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docxPath = path.resolve(__dirname, '../docs/Document sans titre.docx')
const outputPath = path.resolve(__dirname, '../seed/supporting-510-carts.ndjson')

const CATEGORY_REFS = [
  'e7f370f9-3a7f-46c5-b658-b5e0fce03c6f',
  'e9dbb22a-3285-49e3-a953-43bfccca1e07',
  'c98ef23a-5430-4a59-add6-1bbe9507f53c',
  '94731f01-8f0d-40df-a35f-6a9c8c6032d1',
]

const PRODUCT_REFS = [
  '908bad4c-b9f1-47eb-a400-3b1b28301d3a',
  'e22f6f31-76c9-411f-ba21-9d30bde9997f',
  '3d43f482-5527-44b9-aa84-8710589582a7',
  '0d0d7c5e-2420-464b-ae56-a68d4ce63e7b',
]

function toReferences(ids) {
  return ids.map((id) => ({_type: 'reference', _ref: id}))
}

function extractTextFromDocx(filePath) {
  const xml = execSync(`unzip -p ${JSON.stringify(filePath)} word/document.xml`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  })
  return xml
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseJsonObjects(text) {
  const objs = []
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
    for (let j = i; j < text.length; j += 1) {
      const c = text[j]
      if (inStr) {
        if (esc) esc = false
        else if (c === '\\') esc = true
        else if (c === '"') inStr = false
        continue
      }
      if (c === '"') inStr = true
      else if (c === '{') depth += 1
      else if (c === '}') {
        depth -= 1
        if (depth === 0) {
          objs.push(JSON.parse(text.slice(start, j + 1)))
          i = j + 1
          break
        }
      }
    }
    if (depth !== 0) break
  }
  return objs
}

function normalizeBlocks(blocks) {
  if (!Array.isArray(blocks)) return blocks
  return blocks.map((b) => {
    if (b._type !== 'block') return b
    return {
      ...b,
      style: b.style ?? 'normal',
      markDefs: b.markDefs ?? [],
    }
  })
}

function toSanityDoc(raw) {
  const slug = raw.slug?.current
  if (!slug) throw new Error(`Missing slug in ${raw.title ?? 'unknown'}`)

  return {
    _id: `supporting-510-${slug}`,
    _type: 'supportingPage',
    title: raw.title,
    slug: raw.slug,
    exactKeyword: raw.exactKeyword,
    supportingTerm: raw.supportingTerm,
    metaTitle: raw.metaTitle,
    metaDescription: raw.metaDescription,
    heroParagraph: raw.heroParagraph,
    primaryCtaLabel: raw.primaryCtaLabel,
    primaryCtaHref: raw.primaryCtaHref,
    secondaryCtaLabel: raw.secondaryCtaLabel, 
    secondaryCtaHref: raw.secondaryCtaHref,
    h2Heading: raw.h2Heading,
    h2Paragraphs: normalizeBlocks(raw.h2Paragraphs),
    whyChooseUsHeading: raw.whyChooseUsHeading,
    whyChooseUsPoints: raw.whyChooseUsPoints,
    body: normalizeBlocks(raw.body),
    categoriesHeading: 'Shop wholesale categories',
    relatedProducts: toReferences(PRODUCT_REFS),
    categories: toReferences(CATEGORY_REFS),
  }
}

function main() {
  const text = extractTextFromDocx(docxPath)
  const rawPages = parseJsonObjects(text)
  const ndjson = rawPages.map((p) => JSON.stringify(toSanityDoc(p))).join('\n') + '\n'
  fs.writeFileSync(outputPath, ndjson, 'utf8')
  // eslint-disable-next-line no-console
  console.log(`Wrote ${rawPages.length} supporting pages to ${outputPath}`)
  for (const p of rawPages) {
    // eslint-disable-next-line no-console
    console.log(`  /${p.slug.current}`)
  }
}

main()
