import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {execSync} from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const base = 'https://www.wholesalevapesusa.com'

const raw = execSync(
  'pnpm exec sanity documents query \'*[_type == "supportingPage" && defined(slug.current)]{ _id, "slug": slug.current }\'',
  {cwd: path.join(__dirname, '..'), encoding: 'utf8', maxBuffer: 20 * 1024 * 1024},
)

const pages = JSON.parse(raw.replace(/^[^[]*/, '').trim())

const IMPORT_PREFIXES = [
  'supporting-brand-bulk-',
  'supporting-nicotine-bulk-',
  'supporting-hw-510-bulk-',
  'supporting-thc-bulk-',
  'supporting-cbd-bulk-',
  'supporting-cbd-hemp-',
  'supporting-thca-thc-',
  'supporting-510-hw-',
  'supporting-nicotine-',
  'supporting-brand-',
]

function isImport(id) {
  if (id.startsWith('supporting-nicotine-vapes-')) return false
  return IMPORT_PREFIXES.some((prefix) => id.startsWith(prefix))
}

const filtered = pages.filter((page) => isImport(page._id)).sort((a, b) => a.slug.localeCompare(b.slug))

const outPath = path.join(__dirname, 'recent-import-supporting-pages-urls.txt')
const lines = [
  `Count: ${filtered.length}`,
  ...filtered.map((page) => `${base}/${page.slug}`),
]
fs.writeFileSync(outPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${filtered.length} URLs to ${outPath}`)
