import {execSync} from 'node:child_process'

import {jsonrepair} from 'jsonrepair'

export type PortableTextBlock = {
  _type?: string
  style?: string
  markDefs?: unknown[]
  children?: Array<{_type?: string; text?: string; marks?: string[]}>
}

export type RawSupportingPage = {
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

export function extractTextFromDocx(filePath: string): string {
  const xml = execSync(`unzip -p ${JSON.stringify(filePath)} word/document.xml`, {
    encoding: 'utf8',
    maxBuffer: 30 * 1024 * 1024,
  })

  return xml
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Fix unescaped double quotes inside JSON string values (common in docx AI exports). */
export function sanitizeDocxJsonChunk(chunk: string): string {
  let result = ''
  let inString = false
  let escape = false

  for (let i = 0; i < chunk.length; i += 1) {
    const char = chunk[i]

    if (!inString) {
      result += char
      if (char === '"') {
        inString = true
        escape = false
      }
      continue
    }

    if (escape) {
      result += char
      escape = false
      continue
    }

    if (char === '\\') {
      result += char
      escape = true
      continue
    }

    if (char === '"') {
      const rest = chunk.slice(i + 1)
      if (/^\s*[:,}\]]/.test(rest)) {
        inString = false
        result += char
      } else {
        result += "'"
      }
      continue
    }

    result += char
  }

  return result
}

function extractByDepth(text: string): string[] {
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

function extractByTitleSplit(text: string): string[] {
  const parts = text.split(/\}\s*(?=\{\s*"title"\s*:)/)

  return parts
    .map((part) => {
      let chunk = part.trim()
      if (!chunk.startsWith('{')) chunk = `{${chunk}`
      if (!chunk.endsWith('}')) chunk = `${chunk}}`
      return chunk
    })
    .filter((chunk) => chunk.includes('"slug"'))
}

function chunkLooksMerged(chunk: string): boolean {
  return /\}\s*\{/.test(chunk) || (chunk.match(/"title"\s*:/g) ?? []).length > 1
}

export function extractObjectStrings(text: string): string[] {
  const sanitized = sanitizeDocxJsonChunk(text)
  const titleChunks = extractByTitleSplit(sanitized)

  if (titleChunks.length > 0) {
    return titleChunks
  }

  return extractByDepth(sanitized)
}

function stripTrailingDocxGarbage(chunk: string): string {
  return chunk
    .replace(/,\s*"_type"\s*:\s*"supportingPage"\s*\}$/i, '}')
    .replace(/,\s*"_type"\s*:\s*"supportingPage"\s*,\s*$/i, '')
}

/** Drop markdown or prose appended after the closing brace of a JSON object. */
export function truncateToRootJsonObject(chunk: string): string {
  const start = chunk.indexOf('{')
  if (start === -1) return chunk

  let depth = 0
  let inStr = false
  let esc = false

  for (let i = start; i < chunk.length; i += 1) {
    const char = chunk[i]
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
      if (depth === 0) return chunk.slice(start, i + 1)
    }
  }

  return chunk
}

function pageRichness(page: RawSupportingPage): number {
  const bodyLen = JSON.stringify(page.body ?? '').length
  const h2Len = JSON.stringify(page.h2Paragraphs ?? '').length
  return bodyLen + h2Len + (page.whyChooseUsPoints?.length ?? 0) * 50
}

function dedupePagesBySlug(pages: RawSupportingPage[]): RawSupportingPage[] {
  const bySlug = new Map<string, RawSupportingPage>()

  for (const page of pages) {
    const slug = page.slug?.current?.trim()
    if (!slug) continue

    const existing = bySlug.get(slug)
    if (!existing || pageRichness(page) > pageRichness(existing)) {
      bySlug.set(slug, page)
    }
  }

  const removed = pages.length - bySlug.size
  if (removed > 0) {
    console.warn(`Deduped ${removed} duplicate slug(s); kept richest content per slug.`)
  }

  return [...bySlug.values()]
}

export function parseJsonChunk(chunk: string, index: number): RawSupportingPage {
  const sanitized = sanitizeDocxJsonChunk(chunk)
  const truncated = truncateToRootJsonObject(sanitized)

  const attempts = [
    chunk,
    sanitized,
    truncated,
    stripTrailingDocxGarbage(chunk),
    stripTrailingDocxGarbage(sanitized),
    stripTrailingDocxGarbage(truncated),
  ]

  for (const candidate of attempts) {
    try {
      return JSON.parse(jsonrepair(candidate)) as RawSupportingPage
    } catch {
      // try next strategy
    }
  }

  throw new Error(`Failed to parse page ${index + 1} from docx`)
}

export function parsePagesFromDocx(filePath: string): RawSupportingPage[] {
  const text = extractTextFromDocx(filePath)
  const chunks = extractObjectStrings(text)
  const pages: RawSupportingPage[] = []

  for (const [index, chunk] of chunks.entries()) {
    try {
      pages.push(parseJsonChunk(chunk, index))
    } catch (error) {
      const slug = chunk.match(/"current": "([^"]+)"/)?.[1]
      const message = error instanceof Error ? error.message : String(error)
      console.warn(`Skipping page ${index + 1}${slug ? ` (${slug})` : ''}: ${message}`)
    }
  }

  return dedupePagesBySlug(pages)
}

export function normalizeBlocks(blocks: PortableTextBlock[] | undefined, keyPrefix: string): PortableTextBlock[] {
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

export function pickRandomItems<T>(items: T[], count: number, seed: string): T[] {
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

export function toReferences(ids: string[]) {
  return ids.map((_ref) => ({_type: 'reference' as const, _ref}))
}

export function hasReferences(values: Array<{_ref?: string}> | undefined): boolean {
  return Array.isArray(values) && values.some((value) => Boolean(value?._ref))
}

export function toSanityDocument(
  raw: RawSupportingPage,
  pools: {categoryIds: string[]; productIds: string[]},
  idPrefix: string,
) {
  const slug = raw.slug?.current?.trim()
  if (!slug) {
    throw new Error(`Missing slug for page "${raw.title ?? 'unknown'}"`)
  }

  const doc: Record<string, unknown> = {
    _id: `${idPrefix}${slug}`,
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
