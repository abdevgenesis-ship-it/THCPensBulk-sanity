import fs from 'node:fs'
import path from 'node:path'

const outputPath = path.resolve('seed/programmaticPages.ndjson')

const categories = [
  {
    id: '94731f01-8f0d-40df-a35f-6a9c8c6032d1',
    name: 'Bulk Nicotine Vapes',
    slug: 'bulk-nicotine-vapes',
    group: 'Nicotine',
    keyword: 'bulk nicotine vapes',
  },
  {
    id: 'f565dcde-6f9c-480a-bcdc-f497dc560122',
    name: 'Bulk CBD Vapes',
    slug: 'bulk-cbd-vapes',
    group: 'CBD',
    keyword: 'bulk cbd vapes',
  },
  {
    id: 'c98ef23a-5430-4a59-add6-1bbe9507f53c',
    name: 'Bulk THC Vapes',
    slug: 'bulk-thc-vapes',
    group: 'THC',
    keyword: 'bulk thc vapes',
  },
  {
    id: 'e9dbb22a-3285-49e3-a953-43bfccca1e07',
    name: 'Bulk THCA Vapes',
    slug: 'bulk-thca-vapes',
    group: 'THCA',
    keyword: 'bulk thca vapes',
  },
  {
    id: 'e7f370f9-3a7f-46c5-b658-b5e0fce03c6f',
    name: 'Bulk THC Carts & Cartridges',
    slug: 'bulk-thc-carts-and-cartridges',
    group: 'THC',
    keyword: 'bulk thc carts and cartridges',
  },
]

const locations = [
  { id: '58d7444f-274c-43fd-b285-1c6fcd212616', locationName: 'Austin, Texas', slug: 'austin-texas', stateCode: 'TX' },
  { id: '6847682d-0c51-43b2-88ba-3eae99e72856', locationName: 'Miami, Florida', slug: 'miami-florida', stateCode: 'FL' },
  { id: '63300959-3904-44ab-956d-ff80ba4c0a64', locationName: 'Los Angeles, California', slug: 'los-angeles-california', stateCode: 'CA' },
  { id: 'ff43f508-75e4-4814-8837-bdc1158ad967', locationName: 'Phoenix, Arizona', slug: 'phoenix-arizona', stateCode: 'AZ' },
  { id: '89175ce9-01e7-4ad7-8a51-fcf53f8997e4', locationName: 'Denver, Colorado', slug: 'denver-colorado', stateCode: 'CO' },
  { id: 'programmatic-chicago-illinois', locationName: 'Chicago, Illinois', slug: 'chicago-illinois', stateCode: 'IL' },
  { id: 'programmatic-houston-texas', locationName: 'Houston, Texas', slug: 'houston-texas', stateCode: 'TX' },
  { id: 'programmatic-atlanta-georgia', locationName: 'Atlanta, Georgia', slug: 'atlanta-georgia', stateCode: 'GA' },
  { id: 'programmatic-seattle-washington', locationName: 'Seattle, Washington', slug: 'seattle-washington', stateCode: 'WA' },
  { id: 'programmatic-las-vegas-nevada', locationName: 'Las Vegas, Nevada', slug: 'las-vegas-nevada', stateCode: 'NV' },
]

const existingIds = new Map([
  ['bulk-nicotine-vapes|austin-texas', '58d7444f-274c-43fd-b285-1c6fcd212616'],
  ['bulk-cbd-vapes|miami-florida', '6847682d-0c51-43b2-88ba-3eae99e72856'],
  ['bulk-thc-vapes|los-angeles-california', '63300959-3904-44ab-956d-ff80ba4c0a64'],
  ['bulk-thca-vapes|phoenix-arizona', 'ff43f508-75e4-4814-8837-bdc1158ad967'],
  ['bulk-thc-carts-and-cartridges|denver-colorado', '89175ce9-01e7-4ad7-8a51-fcf53f8997e4'],
])

function blocks(texts) {
  return texts.map((text, index) => ({
    _key: `${Math.random().toString(36).slice(2, 10)}-${index}`,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _key: `${Math.random().toString(36).slice(2, 10)}-${index}-span`,
        _type: 'span',
        marks: [],
        text,
      },
    ],
  }))
}

function bodyBlocks(category, location) {
  return blocks([
    `Bulk ${category.name.replace(/^Bulk\s+/i, '')} in ${location.locationName} helps wholesale buyers quickly evaluate a category-focused assortment with location-aware shipping context.`,
    `This landing page keeps the ${category.name} silo intact while giving retailers a practical way to compare inventory, compliance expectations, and quote routing for ${location.stateCode}.`,
    `Use this page as the local entry point for wholesale buying: review the product grid, confirm the shipping estimate, and move to the category or wholesale page when the fit looks right.`,
  ])
}

const lines = []

for (const category of categories) {
  for (const location of locations) {
    const existingId = existingIds.get(`${category.slug}|${location.slug}`)
    lines.push(JSON.stringify({
      _id: existingId || `programmatic-${category.slug}-${location.slug}`,
      _type: 'programmaticPage',
      locationName: location.locationName,
      slug: { _type: 'slug', current: location.slug },
      stateCode: location.stateCode,
      category: { _type: 'reference', _ref: category.id },
      body: bodyBlocks(category, location),
      customIntro: blocks([
        `${location.locationName} buyers searching for ${category.keyword} can use this category-first landing page to review location-specific wholesale messaging.`,
        `This route keeps the ${category.name} silo intact while still making it easy to evaluate local shipping, compliance, and quote requests.`,
      ]),
      seoDescription: `Wholesale ${category.keyword} in ${location.locationName} with category-filtered product visibility and local quote routing.`,
    }))
  }
}

fs.writeFileSync(outputPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${lines.length} programmatic page documents to ${outputPath}`)