/**
 * POST to production Next.js /api/revalidate for all supporting-510-hw slugs.
 *
 * Usage:
 *   REVALIDATE_URL=https://www.wholesalevapesusa.com/api/revalidate \
 *   REVALIDATE_SECRET=your_secret \
 *   node scripts/revalidate-supporting-510-hw-paths.mjs
 */
import {execSync} from 'node:child_process'

const revalidateUrl = process.env.REVALIDATE_URL || 'https://www.wholesalevapesusa.com/api/revalidate'
const secret = process.env.REVALIDATE_SECRET || process.env.GENERATOR_ADMIN_SECRET

if (!secret) {
  console.error('Set REVALIDATE_SECRET or GENERATOR_ADMIN_SECRET')
  process.exit(1)
}

const slugsJson = execSync(
  'pnpm exec sanity documents query \'*[_type == "supportingPage" && _id match "supporting-510-hw-*"]{ "slug": slug.current }\'',
  {encoding: 'utf8', cwd: new URL('..', import.meta.url).pathname},
)

const pages = JSON.parse(slugsJson.replace(/^[\s\S]*?\[/, '[').replace(/\][\s\S]*$/, ']'))
const paths = pages.map((page) => `/${page.slug}`)

const response = await fetch(revalidateUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${secret}`,
  },
  body: JSON.stringify({tag: 'sanity', paths}),
})

const payload = await response.json()
console.log(response.status, payload)
if (!response.ok) process.exit(1)
console.log(`Revalidated tag + ${paths.length} paths`)
