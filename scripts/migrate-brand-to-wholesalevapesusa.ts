/**
 * Replaces legacy Bulk Vapes USA branding in Sanity documents (published + drafts).
 *
 * From bulkvapesusa-sanity:
 *   pnpm exec sanity exec ./scripts/migrate-brand-to-wholesalevapesusa.ts
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

const REPLACEMENTS: Array<[string, string]> = [
  ['Bulk Vapes USA', 'WholesaleVapesUSA'],
  ['BULK VAPES USA', 'WHOLESALE VAPES USA'],
  ['BULK VAPES', 'WHOLESALE VAPES'],
  ['bulkvapesusa.com', 'wholesalevapesusa.com'],
  ['support@bulkvapesusa.com', 'support@wholesalevapesusa.com'],
  ['wholesale@bulkvapesusa.com', 'wholesale@wholesalevapesusa.com'],
  ['sanity-support@bulkvapesusa.com', 'support@wholesalevapesusa.com'],
]

const NEEDLE = REPLACEMENTS.map(([from]) => from)

function needsReplacement(value: unknown): boolean {
  const raw = JSON.stringify(value)
  return NEEDLE.some((needle) => raw.includes(needle))
}

function replaceInValue<T>(value: T): T {
  if (typeof value === 'string') {
    let next = value
    for (const [from, to] of REPLACEMENTS) {
      if (next.includes(from)) {
        next = next.split(from).join(to)
      }
    }
    return next as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceInValue(item)) as T
  }

  if (value && typeof value === 'object') {
    const next: Record<string, unknown> = {}
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      next[key] = replaceInValue(nested)
    }
    return next as T
  }

  return value
}

async function migrateBrandToWholesaleVapesUsa() {
  const client = getSanityWriteClient()

  const ids = await client.fetch<string[]>(
    `*[!(_id in path("versions.**")) && !(_id in path("_.**"))]._id`,
  )

  let patched = 0

  for (const id of ids) {
    const full = await client.getDocument(id)
    if (!full || !needsReplacement(full)) continue

    const {_id, _rev, _createdAt, _updatedAt, _type, ...fields} = full as Record<string, unknown>
    const next = replaceInValue(fields)

    await client.patch(_id).set(next).commit()
    patched += 1
    // eslint-disable-next-line no-console
    console.log(`Patched ${_id}`)
  }

  // eslint-disable-next-line no-console
  console.log(`\nDone. Updated ${patched} document(s).`)
}

migrateBrandToWholesaleVapesUsa().catch((error: unknown) => {
  if (isInsufficientSanityPermission(error)) {
    printSanityWritePermissionHelp()
  }
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
})
