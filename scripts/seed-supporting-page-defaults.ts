import {getCliClient} from 'sanity/cli'

type SupportingDoc = {
  _id: string
  _type: 'supportingPage'
  title?: string
  slug?: {current?: string}
  exactKeyword?: string
  metaTitle?: string
  metaDescription?: string
  heroParagraph?: string
  h2Heading?: string
  primaryCtaLabel?: string
  primaryCtaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  whyChooseUsHeading?: string
  whyChooseUsPoints?: string[]
  categoriesHeading?: string
  otherCategoriesHeading?: string
  [key: string]: unknown
}

function isEmptyString(value: unknown) {
  return typeof value !== 'string' || value.trim().length === 0
}

function toKeyword(doc: SupportingDoc) {
  if (typeof doc.exactKeyword === 'string' && doc.exactKeyword.trim().length > 0) {
    return doc.exactKeyword.trim()
  }
  if (typeof doc.title === 'string' && doc.title.trim().length > 0) {
    return doc.title.trim()
  }
  if (typeof doc.slug?.current === 'string' && doc.slug.current.trim().length > 0) {
    return doc.slug.current.replaceAll('-', ' ').trim()
  }
  return 'bulk vapes'
}

function prefixed(keyword: string, value: string, separator = ' - ') {
  if (value.toLowerCase().startsWith(keyword.toLowerCase())) {
    return value
  }
  return `${keyword}${separator}${value}`
}

async function main() {
  const client = getCliClient({apiVersion: '2024-02-01'})
  const publishedDocs = await client.fetch<SupportingDoc[]>(
    `*[_type == "supportingPage" && !(_id in path("drafts.**"))]{_id, _type, title, slug, ...}`,
  )

  let updatedCount = 0

  for (const published of publishedDocs) {
    const draftId = `drafts.${published._id}`
    const draft = await client.getDocument<SupportingDoc>(draftId)
    const docsToPatch: SupportingDoc[] = draft ? [published, draft] : [published]

    for (const doc of docsToPatch) {
      const keyword = toKeyword(doc)
      const patch = client.patch(doc._id)
      let changed = false

      const setIfEmpty = (field: string, value: unknown) => {
        if (doc[field] === undefined || doc[field] === null || isEmptyString(doc[field])) {
          patch.set({[field]: value})
          changed = true
        }
      }

      const defaultMetaTitle = prefixed(keyword, `Wholesale guide for ${keyword}`)
      const defaultMetaDescription = prefixed(
        keyword,
        `wholesale buyers use this page to compare inventory, pricing guidance, and practical ordering next steps.`,
      )

      setIfEmpty('exactKeyword', keyword)
      setIfEmpty('metaTitle', defaultMetaTitle)
      setIfEmpty('metaDescription', defaultMetaDescription)
      setIfEmpty(
        'heroParagraph',
        prefixed(
          keyword,
          'wholesale buyers can use this page to review inventory options, plan product mix, and move faster to a confident purchase.',
        ),
      )
      setIfEmpty('primaryCtaLabel', 'Visit shop')
      setIfEmpty('primaryCtaHref', '/shop')
      setIfEmpty('secondaryCtaLabel', 'Contact us')
      setIfEmpty('secondaryCtaHref', '/contact')
      setIfEmpty('h2Heading', `Why we are the best for ${keyword}`)
      setIfEmpty('whyChooseUsHeading', 'Why choose us')
      setIfEmpty('categoriesHeading', 'Categories')
      setIfEmpty('otherCategoriesHeading', 'Categories')

      if (!Array.isArray(doc.whyChooseUsPoints) || doc.whyChooseUsPoints.length === 0) {
        patch.set({
          whyChooseUsPoints: [
            `We stock ${keyword} with wholesale-focused assortment planning and fast quote response.`,
            'We support repeat buyers with practical reorder guidance and category-level recommendations.',
            'We keep compliance-aware wholesale workflows to reduce friction from order to delivery.',
          ],
        })
        changed = true
      }

      if (changed) {
        await patch.commit()
        updatedCount += 1
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded supporting page defaults for ${updatedCount} records (published + drafts).`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exitCode = 1
})
