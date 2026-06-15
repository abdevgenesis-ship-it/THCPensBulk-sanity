import {getCliClient} from 'sanity/cli'

type CategoryDoc = {
  _id: string
  slug: string
  name?: string
}

type SupportingDoc = {
  parentId: string
  slug: string
  title?: string
}

const API_VERSION = '2025-03-01'
const GUIDES_PER_CATEGORY = 3

function toGuideHref(categorySlug: string, supportingSlug: string) {
  return `/category/${categorySlug}/${supportingSlug}`
}

function toKey(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

async function populateCategoryRelatedGuides() {
  const client = getCliClient({apiVersion: API_VERSION})

  const categories = await client.fetch<CategoryDoc[]>(
    `*[_type == "category" && defined(slug.current)]{
      _id,
      "slug": slug.current,
      name
    } | order(name asc)`,
  )

  const supportingPages = await client.fetch<SupportingDoc[]>(
    `*[_type == "supportingPage" && defined(slug.current) && parentPage->_type == "category"]{
      "parentId": parentPage->_id,
      "slug": slug.current,
      title
    } | order(title asc)`,
  )

  const supportingByParent = new Map<string, SupportingDoc[]>()

  for (const page of supportingPages) {
    if (!supportingByParent.has(page.parentId)) {
      supportingByParent.set(page.parentId, [])
    }
    supportingByParent.get(page.parentId)?.push(page)
  }

  let patchedCount = 0

  for (const category of categories) {
    const guides = (supportingByParent.get(category._id) || [])
      .slice(0, GUIDES_PER_CATEGORY)
      .map((guide, index) => ({
        _type: 'object',
        _key: `guide-${index + 1}-${toKey(guide.slug)}`,
        title: guide.title || 'Supporting guide',
        href: toGuideHref(category.slug, guide.slug),
      }))

    await client.patch(category._id).set({relatedGuides: guides}).commit({autoGenerateArrayKeys: false})

    patchedCount += 1

    // Keep output compact while still proving each category was patched.
    console.log(
      `${category.slug}: set ${guides.length} relatedGuides`,
    )
  }

  console.log(`Done. Patched ${patchedCount} category documents.`)
}

populateCategoryRelatedGuides().catch((error) => {
  console.error('Failed to populate category.relatedGuides')
  console.error(error)
  process.exitCode = 1
})
