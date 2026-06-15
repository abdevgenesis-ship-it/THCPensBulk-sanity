import {getCliClient} from 'sanity/cli'

const API_VERSION = '2025-03-01'

/** Wholesale categories relevant to 510 cart supporting pages. */
const CATEGORY_REFS = [
  'e7f370f9-3a7f-46c5-b658-b5e0fce03c6f', // Wholesale THC Carts & Vapes
  'e9dbb22a-3285-49e3-a953-43bfccca1e07', // Wholesale THCA
  'c98ef23a-5430-4a59-add6-1bbe9507f53c', // Wholesale THC Vapes
  '94731f01-8f0d-40df-a35f-6a9c8c6032d1', // Wholesale Nicotine
]

/** Cartridge / cart SKUs for the Products section (max 4). */
const PRODUCT_REFS = [
  '908bad4c-b9f1-47eb-a400-3b1b28301d3a', // KOI THC Cartridge 1G
  'e22f6f31-76c9-411f-ba21-9d30bde9997f', // KOI THC Cart Duo Pack
  '3d43f482-5527-44b9-aa84-8710589582a7', // Nexa THCA Prism Cart 2G
  '0d0d7c5e-2420-464b-ae56-a68d4ce63e7b', // STIIIZY THC Pod Max
]

function toReferences(ids: string[]) {
  return ids.map((id) => ({_type: 'reference' as const, _ref: id}))
}

async function main() {
  const client = getCliClient({apiVersion: API_VERSION})

  const pages = await client.fetch<Array<{_id: string; title?: string; slug?: string}>>(
    `*[_type == "supportingPage" && _id match "supporting-510-*" && !(_id in path("drafts.**"))]{
      _id,
      title,
      "slug": slug.current
    }`,
  )

  if (pages.length === 0) {
    console.log('No supporting-510-* pages found.')
    return
  }

  const relatedProducts = toReferences(PRODUCT_REFS)
  const categories = toReferences(CATEGORY_REFS)

  for (const page of pages) {
    const patch = client
      .patch(page._id)
      .set({
        relatedProducts,
        categories,
        categoriesHeading: 'Shop wholesale categories',
      })

    await patch.commit()
    console.log(`Patched ${page.slug ?? page._id}: ${page.title ?? '(untitled)'}`)
  }

  console.log(`Done. Updated ${pages.length} supporting pages with products and categories.`)
}

main().catch((error) => {
  console.error('Failed to populate supporting-510 relations')
  console.error(error)
  process.exitCode = 1
})
