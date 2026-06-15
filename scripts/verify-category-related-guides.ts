import {getCliClient} from 'sanity/cli'

const API_VERSION = '2025-03-01'

async function verifyCategoryRelatedGuides() {
  const client = getCliClient({apiVersion: API_VERSION})

  const rows = await client.fetch<
    Array<{slug: string; name: string; guideCount: number; guideHrefs: string[]}>
  >(`*[_type == "category" && defined(slug.current)] | order(name asc){
    "slug": slug.current,
    name,
    "guideCount": count(relatedGuides),
    "guideHrefs": relatedGuides[].href
  }`)

  for (const row of rows) {
    console.log(`${row.slug}: ${row.guideCount} guides`)
    for (const href of row.guideHrefs || []) {
      console.log(`  - ${href}`)
    }
  }
}

verifyCategoryRelatedGuides().catch((error) => {
  console.error('Failed to verify category.relatedGuides')
  console.error(error)
  process.exitCode = 1
})
