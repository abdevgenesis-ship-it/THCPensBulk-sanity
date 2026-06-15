import {createClient, type SanityClient} from '@sanity/client'
import {getCliClient} from 'sanity/cli'

const PROJECT_ID = '8fp9giy6'
const DATASET = 'production'
const API_VERSION = '2024-02-01'

/**
 * Client for mutation scripts. Prefers an explicit API token with **Editor** (or Developer)
 * permissions; falls back to `getCliClient()` (e.g. `sanity login` session).
 */
export function getSanityWriteClient(): SanityClient {
  // Intentionally omit generic SANITY_API_TOKEN — the web app often uses a read-only
  // token there; scripts should use a dedicated Editor token.
  const token =
    process.env.SANITY_AUTH_TOKEN?.trim() || process.env.SANITY_API_WRITE_TOKEN?.trim()

  if (token) {
    return createClient({
      projectId: PROJECT_ID,
      dataset: DATASET,
      apiVersion: API_VERSION,
      token,
      useCdn: false,
    })
  }

  return getCliClient({apiVersion: API_VERSION})
}

export function printSanityWritePermissionHelp(): void {
  // eslint-disable-next-line no-console
  console.error(`
Sanity returned 403 — this token cannot create or update documents.

Fix:
1. Open https://sanity.io/manage/p/8fp9giy6/api
2. Create an API token with "Editor" or "Developer" access (not "Viewer").
3. In bulkvapesusa-sanity, add a .env file:
     SANITY_AUTH_TOKEN=sk…

   Use SANITY_AUTH_TOKEN for scripts only — never commit it.

4. Run again:
     pnpm exec sanity exec ./scripts/<script>.ts

Your Next.js app can keep using a read-only token under a different variable name in bulkvapesuse-web/.env.local.
`)
}

export function isInsufficientSanityPermission(err: unknown): boolean {
  if (!err || typeof err !== 'object') {
    return false
  }

  const status = 'statusCode' in err ? (err as {statusCode?: number}).statusCode : undefined
  const msg =
    'message' in err && typeof (err as {message?: string}).message === 'string'
      ? (err as {message: string}).message
      : ''

  return (
    status === 403 ||
    msg.includes('Insufficient permissions') ||
    msg.includes('permission')
  )
}
