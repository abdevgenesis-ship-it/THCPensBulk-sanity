/**
 * Sync website copy from docs/docx-pages.json (extracted from Melatonin gummies uk.docx)
 * into Sanity CMS documents with bold keyword spans preserved.
 *
 * Run from melatoningummiesuk-sanity:
 *   node scripts/sync-docx-content.mjs
 */
import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'

loadEnv({path: resolve(process.cwd(), '.env')})

const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN
if (!token) {
  throw new Error('Missing SANITY_AUTH_TOKEN / SANITY_API_TOKEN in .env')
}

const client = createClient({
  projectId: '8fp9giy6',
  dataset: 'production',
  apiVersion: '2024-02-01',
  token,
  useCdn: false,
})

const DOCX_JSON = resolve(process.cwd(), '../melatoningummiesuk-web/docs/docx-pages.json')
const pages = JSON.parse(readFileSync(DOCX_JSON, 'utf8'))

let keyCounter = 0
const key = () => `k${Date.now().toString(36)}${(keyCounter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`

const H2_MARKER = '\n\n[[H2]]\n\n'
const OUTRO_MARKER = '\n\n[[OUTRO]]\n\n'

function stripMd(s) {
  return s.replace(/\*\*([^*]+)\*\*/g, '$1')
}

function spansFromMarkdown(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  return parts.map((part) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return {_type: 'span', _key: key(), text: part.slice(2, -2), marks: ['strong']}
    }
    return {_type: 'span', _key: key(), text: part, marks: []}
  })
}

function p(text, style = 'normal') {
  return {_type: 'block', _key: key(), style, markDefs: [], children: spansFromMarkdown(text)}
}

function h2(text) {
  return p(text, 'h2')
}

function mergeLines(lines, start, stopRe) {
  const chunks = []
  let i = start
  while (i < lines.length) {
    const plain = stripMd(lines[i])
    if (stopRe.test(plain)) break
    chunks.push(lines[i])
    i++
  }
  return {text: chunks.join(' ').replace(/\s+/g, ' ').trim(), next: i}
}

function field(lines, label) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const plain = stripMd(line)
    if (plain.startsWith(label)) {
      let value = line
        .replace(new RegExp(`^\\*\\*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*\\*\\s*`), '')
        .replace(new RegExp(`^\\*\\*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), '')
        .replace(label, '')
        .replace(/^\*+\s*/, '')
        .replace(/\*+$/, '')
        .trim()
      if (value.startsWith(':')) value = value.slice(1).trim()
      if (label.startsWith('Meta Description') && i + 1 < lines.length) {
        const nextPlain = stripMd(lines[i + 1])
        if (!/^(H1:|Sub H1:|Section|URL:|Meta |Page |Keyword|Related FAQs|Q:)/.test(nextPlain)) {
          value = `${value} ${lines[i + 1]}`.trim()
        }
      }
      if (label.startsWith('H1:') && plain.endsWith('**') && i + 1 < lines.length) {
        const nextPlain = stripMd(lines[i + 1])
        if (!nextPlain.startsWith('Sub H1:')) {
          value = `${value} ${lines[i + 1]}`.trim()
        }
      }
      if (label.startsWith('H1:') && plain.includes('Contact Our Customer Care')) {
        if (i + 1 < lines.length && stripMd(lines[i + 1]).startsWith('B2B Support Teams')) {
          value = `${value} ${stripMd(lines[i + 1])}`.trim()
        }
      }
      return stripMd(value) ? value : plain.slice(label.length).trim()
    }
  }
  return ''
}

function faqsFromLines(lines) {
  const faqs = []
  for (let i = 0; i < lines.length; i++) {
    const plain = stripMd(lines[i])
    if (!plain.startsWith('Q:')) continue
    const question = plain.replace(/^Q:\s*/, '').trim()
    const answerParts = []
    for (let j = i + 1; j < lines.length; j++) {
      const nextPlain = stripMd(lines[j])
      if (nextPlain.startsWith('Q:') || nextPlain.startsWith('Keyword Integration') || nextPlain.startsWith('Next Steps')) break
      if (lines[j].startsWith('A:')) {
        answerParts.push(lines[j].replace(/^A:\s*/, ''))
      } else if (answerParts.length) {
        answerParts[answerParts.length - 1] = `${answerParts[answerParts.length - 1]} ${lines[j]}`
      }
    }
    const answer = answerParts.join(' ').replace(/\s+/g, ' ').trim()
    if (question && answer) faqs.push({question, answer})
  }
  return faqs
}

function sectionBlocks(lines, startLabel, stopLabels) {
  const stopRe = new RegExp(`^(${stopLabels.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`)
  const startIdx = lines.findIndex((line) => stripMd(line) === startLabel || stripMd(line).startsWith(startLabel))
  if (startIdx === -1) return []
  const merged = mergeLines(lines, startIdx + 1, stopRe)
  return merged.text ? [p(merged.text)] : []
}

function pageByTitle(match) {
  const page = pages.find((entry) => entry.title.includes(match))
  if (!page) throw new Error(`Missing page: ${match}`)
  return page.lines
}

async function syncHomepage(lines) {
  const lead = mergeLines(lines, lines.findIndex((l) => stripMd(l).startsWith('Section 1')) + 1, /^Section 2|^Melatonin Gummies for Sale/)
  const tail = mergeLines(
    lines,
    lines.findIndex((l) => stripMd(l).includes('Melatonin Gummies for Sale: Premium Retail')),
    /^Order the Best Melatonin Gummies UK/,
  )
  const beforeBullets = mergeLines(
    lines,
    lines.findIndex((l) => stripMd(l).startsWith('Order the Best Melatonin Gummies UK')),
    /^Daily Maintenance/,
  )
  const daily = lines.find((l) => stripMd(l).startsWith('Daily Maintenance')) || ''
  const moderate = lines.find((l) => stripMd(l).startsWith('Moderate Strengths')) || ''
  const high = lines.find((l) => stripMd(l).startsWith('High-Strength Options')) || ''
  const outro = mergeLines(
    lines,
    lines.findIndex((l) => stripMd(l).includes('Accelerate Your Nighttime Recovery')),
    /^Related FAQs/,
  )

  const authorityIntro = `${lead.text}${H2_MARKER}${[tail.text, beforeBullets.text].filter(Boolean).join('\n\n')}${OUTRO_MARKER}${outro.text}`

  await client
    .patch('ff42da08-7a52-4d28-9f62-016a68ca4167')
    .set({
      seoTitle: field(lines, 'Meta Title:'),
      seoDescription: `${field(lines, 'Meta Description:')}`.replace(/\s+/g, ' ').trim(),
      heroHeading: field(lines, 'H1:'),
      heroSubheading: field(lines, 'Sub H1:'),
      authorityHeading: 'Melatonin Gummies for Sale: Premium Retail and Bulk B2B Distribution',
      authorityIntro,
      authorityPoints: [
        {_type: 'homeAuthorityPoint', _key: key(), title: 'Daily Maintenance & Micro-Dosing', description: daily.replace(/^\*\*Daily Maintenance[^*]*\*\*\s*/, ''), iconKey: 'badgeCheck'},
        {_type: 'homeAuthorityPoint', _key: key(), title: 'Moderate Strengths', description: moderate.replace(/^\*\*Moderate Strengths[^*]*\*\*\s*/, ''), iconKey: 'walletCards'},
        {_type: 'homeAuthorityPoint', _key: key(), title: 'High-Strength Options', description: high.replace(/^\*\*High-Strength Options[^*]*\*\*\s*[^:]*:\s*/, ''), iconKey: 'shieldCheck'},
      ],
    })
    .commit()

  const faqs = faqsFromLines(lines)
  const faqDocs = [
    {id: 'faq-home-authentic', order: 1, ctaLabel: 'Shop now', ctaHref: '/products'},
    {id: 'faq-home-10mg', order: 2},
    {id: 'faq-home-wholesale', order: 3, ctaLabel: 'Wholesale account', ctaHref: '/wholesale'},
    {id: 'faq-home-speed', order: 4, ctaLabel: 'Shipping policy', ctaHref: '/shipping'},
  ]
  for (let i = 0; i < faqDocs.length; i++) {
    const meta = faqDocs[i]
    const faq = faqs[i]
    if (!faq) continue
    await client.createOrReplace({
      _id: meta.id,
      _type: 'faqItem',
      question: stripMd(faq.question),
      answer: [p(faq.answer)],
      category: 'General',
      order: meta.order,
      isActive: true,
      ...(meta.ctaLabel ? {ctaLabel: meta.ctaLabel, ctaHref: meta.ctaHref} : {}),
    })
  }
}

function categorySeoBlocks(lines) {
  const intro = mergeLines(lines, lines.findIndex((l) => stripMd(l).startsWith('Section 1')) + 1, /^Section 2/)
  const blocks = [p(intro.text)]
  let i = lines.findIndex((l) => stripMd(l).startsWith('Section 2'))
  while (i < lines.length) {
    const plain = stripMd(lines[i])
    if (plain.startsWith('Related FAQs') || plain.startsWith('Keyword Integration') || plain.startsWith('Next Steps')) break
    if (plain.startsWith('Section 2')) {
      i++
      continue
    }
    if (/^[A-Z0-9].*:$/.test(plain) && lines[i].includes('**') && plain.length < 120 && !plain.startsWith('A:')) {
      blocks.push(h2(plain.replace(/:$/, '')))
      i++
      continue
    }
    if (plain.startsWith('**') && plain.endsWith('**') && plain.length < 120) {
      blocks.push(h2(stripMd(lines[i])))
      i++
      continue
    }
    if (/^(Adult|Advanced|Safe|Alternative|Premium|Targeted|Metabolism|Beauty|Maximum|Daily|Gentle|Broad-Spectrum|Clinical|Branded|Established)/.test(plain)) {
      const bullet = mergeLines(lines, i, /^(Adult|Advanced|Safe|Alternative|Premium|Targeted|Metabolism|Beauty|Maximum|Daily|Gentle|Broad-Spectrum|Clinical|Branded|Established|Elevate|Investing|Every|When|For our|Finding|Order the|Secure a|Our digital)/)
      blocks.push(p(bullet.text))
      i = bullet.next
      continue
    }
    if (!plain.startsWith('Q:') && !plain.startsWith('A:')) {
      const para = mergeLines(lines, i, /^(Related FAQs|Keyword Integration|Next Steps|\*\*Q:)/)
      if (para.text) blocks.push(p(para.text))
      i = para.next
      continue
    }
    i++
  }
  return blocks
}

async function syncCategory(id, lines, heroField, authorityHeading) {
  const intro = mergeLines(lines, lines.findIndex((l) => stripMd(l).startsWith('Section 1')) + 1, /^Section 2/)
  await client
    .patch(id)
    .set({
      seoTitle: field(lines, 'Meta Title:'),
      seoDescription: `${field(lines, 'Meta Description:')}`.replace(/\s+/g, ' ').trim(),
      categoryHeroHeading: field(lines, 'H1:'),
      shortDescription: field(lines, 'Sub H1:'),
      description: [p(intro.text)],
      categoryAuthorityHeadingTemplate: authorityHeading,
      seoContent: categorySeoBlocks(lines),
    })
    .commit()

  const faqs = faqsFromLines(lines)
  const existing = await client.fetch(`*[_type=="faqItem" && references($id)]{_id, order}|order(order asc)`, {id})
  for (let i = 0; i < faqs.length; i++) {
    const faq = faqs[i]
    const docId = existing[i]?._id || `faq-${id}-${i + 1}`
    await client.createOrReplace({
      _id: docId,
      _type: 'faqItem',
      question: stripMd(faq.question),
      answer: [p(faq.answer)],
      category: 'Products',
      order: i + 1,
      isActive: true,
      productCategories: [{_type: 'reference', _ref: id, _key: key()}],
    })
  }
}

async function syncWholesale(lines) {
  const intro = mergeLines(lines, lines.findIndex((l) => stripMd(l).startsWith('Section 1')) + 1, /^Section 2/)
  await client
    .patch('wholesalePage')
    .set({
      seoTitle: field(lines, 'Meta Title:'),
      seoDescription: field(lines, 'Meta Description:'),
      heroHeading: field(lines, 'H1:'),
      heroSubhead: field(lines, 'Sub H1:'),
      whyHeading: 'Melatonin Gummy Wholesale: Maximize Retail Margins with Premium Brands',
      whyIntro: mergeLines(lines, lines.findIndex((l) => stripMd(l).includes('Melatonin Gummy Wholesale: Maximize')), /^Bulk B2B Ordering Options/).text,
      howHeading: 'Bulk B2B Ordering Options: High-Demand Tiers and Premium Stock',
      howIntro: mergeLines(lines, lines.findIndex((l) => stripMd(l).startsWith('Bulk B2B Ordering Options')), /^Clinical Strength Master Batches/).text,
      faqs: faqsFromLines(lines).map((faq) => ({
        _type: 'wholesaleFaq',
        _key: key(),
        question: stripMd(faq.question),
        answer: stripMd(faq.answer),
      })),
    })
    .commit()
}

async function syncAbout(lines) {
  const missionStart = lines.findIndex((l) => stripMd(l) === 'Our Foundational Mission')
  const mission = mergeLines(lines, missionStart + 1, /^What Sets Our Distribution Infrastructure Apart/)
  const infraIntro = mergeLines(lines, lines.findIndex((l) => stripMd(l) === 'What Sets Our Distribution Infrastructure Apart') + 1, /^Climate-Controlled Storage/)
  const bullets = []
  for (let i = lines.findIndex((l) => stripMd(l).startsWith('Climate-Controlled Storage')); i < lines.length; i++) {
    const plain = stripMd(lines[i])
    if (plain.startsWith('Our Core Commitments')) break
    if (/^(Climate-Controlled Storage|A Dual-Channel Fulfilment Engine|Immediate 48-Hour Despatch):/.test(plain)) {
      const [title, ...rest] = plain.split(':')
      bullets.push({title: title.trim(), description: rest.join(':').trim() || stripMd(lines[i + 1] || '')})
    }
  }
  const commitments = []
  for (let i = lines.findIndex((l) => stripMd(l).startsWith('Our Core Commitments')); i < lines.length; i++) {
    const plain = stripMd(lines[i])
    if (/^(Uncompromising Brand Authenticity|Absolute Price Transparency):/.test(plain)) {
      const [title, ...rest] = plain.split(':')
      commitments.push({title: title.trim(), description: (rest.join(':').trim() + ' ' + stripMd(lines[i + 1] || '')).trim()})
    }
  }

  await client
    .patch('aboutPage')
    .set({
      seoTitle: field(lines, 'Meta Title:'),
      seoDescription: field(lines, 'Meta Description:'),
      pageHeading: field(lines, 'H1:'),
      introLead: field(lines, 'Sub H1:'),
      storyHeading: 'Our Foundational Mission',
      storyBody: [p(mission.text)],
      complianceHeading: 'Our Core Commitments',
      complianceIntro: infraIntro.text,
      compliancePoints: commitments.map((point) => ({_key: key(), title: point.title, description: point.description})),
    })
    .commit()
}

async function syncContact(lines) {
  const reach = mergeLines(lines, lines.findIndex((l) => stripMd(l).startsWith('Reach Out via Our Main Communication Channels')) + 1, /^Submit a Direct Assistance Request Ticket/)
  const trade = mergeLines(lines, lines.findIndex((l) => stripMd(l).startsWith('Accelerated Enterprise Trade Registration')) + 1, /^$/)
  await client
    .patch('contactPage')
    .set({
      seoTitle: field(lines, 'Meta Title:'),
      seoDescription: field(lines, 'Meta Description:'),
      pageHeading: `${field(lines, 'H1:')}`.replace(/\s+/g, ' ').trim(),
      introLead: field(lines, 'Sub H1:'),
      formIntro: reach.text,
      businessHours:
        'Central Dispatch Intake: Logistics Unit 4, Gateway Industrial Estate, London, Greater London, E1 4NS\nCommercial Business Operating Hours: Monday through Friday, 08:30 to 17:30 GMT (Excluding recognized UK bank holidays).',
      paymentsNote: trade.text,
    })
    .commit()
}

async function syncCompliance(lines) {
  await client
    .patch('compliancePage')
    .set({
      title: field(lines, 'H1:'),
      description: field(lines, 'Meta Description:'),
      sections: [
        {
          _type: 'legalSection',
          _key: key(),
          title: 'Structural Overview of Our Compliance Operations',
          paragraphs: sectionBlocks(lines, 'Structural Overview of Our Compliance Operations', ['Comprehensive Regulatory Framework Breakdown']).map((b) => stripMd(b.children.map((c) => c.text).join(''))),
        },
        {
          _type: 'legalSection',
          _key: key(),
          title: '1. Food Standards Agency (FSA) & EFSA Compliance',
          paragraphs: [mergeLines(lines, lines.findIndex((l) => stripMd(l).startsWith('1. Food Standards Agency')), /^2\. Medicine Controls/).text],
        },
        {
          _type: 'legalSection',
          _key: key(),
          title: '2. Medicine Controls and Ingredient Classification',
          paragraphs: [
            mergeLines(lines, lines.findIndex((l) => stripMd(l).startsWith('2. Medicine Controls')), /^Important Cross-Border Legal Context:/).text,
            mergeLines(lines, lines.findIndex((l) => stripMd(l).startsWith('Important Cross-Border Legal Context:')), /^3\. Rigorous Batch Testing/).text,
          ].filter(Boolean),
        },
        {
          _type: 'legalSection',
          _key: key(),
          title: '3. Rigorous Batch Testing & Quality Assurance Protocols',
          bullets: [
            'Verification that factory tamper-evident security seals are 100% intact.',
            'Independent matching of manufacturer batch numbers against official Certificates of Analysis (CoA).',
            'Detailed shelf-life checks to guarantee a minimum expiration runway of 12 months prior to shipping.',
          ],
        },
      ],
    })
    .commit()
}

async function syncWarningNote(lines) {
  const sections = []
  const addSection = (title, startPattern, stopPattern) => {
    const start = lines.findIndex((l) => startPattern.test(stripMd(l)))
    if (start === -1) return
    const body = mergeLines(lines, start + (stripMd(lines[start]).endsWith(':') ? 1 : 0), stopPattern)
    sections.push({
      _type: 'legalSection',
      _key: key(),
      title: stripMd(lines[start]).replace(/:$/, ''),
      paragraphs: body.text ? [body.text] : undefined,
    })
  }

  addSection('Read Before Commencing Any Supplementation Regimen', /^Read Before Commencing Any Supplementation Regimen$/, /^Critical Health/)
  addSection('Medical Underpinnings & Professional Consultations', /^Medical Underpinnings & Professional Consultations$/, /^Comprehensive Contraindication Profile/)
  sections.push({
    _type: 'legalSection',
    _key: key(),
    title: 'Comprehensive Contraindication Profile',
    paragraphs: [
      'Do not consume high-potency sleep aids, melatonin blends, or adaptogenic gummies without a prior professional medical assessment if you have any of the following conditions:',
    ],
    bullets: lines
      .filter((l) => /^(Autoimmune Disorders|Cardiovascular Conditions|Neurological Concerns|Endocrine Challenges):/.test(stripMd(l)))
      .map((l) => stripMd(l)),
  })

  await client.createOrReplace({
    _id: 'legalContent',
    _type: 'legalContent',
    supportEmail: 'support@melatoningummiesuk.com',
    agePolicyTitle: field(lines, 'H1:'),
    agePolicyDescription: `${field(lines, 'Meta Description:')}`.replace(/\s+/g, ' ').trim(),
    agePolicySections: sections,
  })
}

async function main() {
  console.log('Syncing homepage...')
  await syncHomepage(pageByTitle('Page 1'))

  console.log('Syncing categories...')
  await syncCategory('category-sleep-gummies', pageByTitle('Page 2'), 'Sleep Gummies', 'Sleep Gummies UK: Premium Formulations for Restful Nights')
  await syncCategory('category-lemme-gummies', pageByTitle('Page 3'), 'Lemme Gummies', 'Lemme Gummies UK: Authentic Direct Imports for Retail and Business')
  await syncCategory('category-natrol-gummies', pageByTitle('Page 4'), 'Natrol Gummies', 'Natrol Melatonin Gummies: Sourcing Elite, Certified-Genuine Sleep Aids')

  console.log('Syncing wholesale...')
  await syncWholesale(pageByTitle('Page 5'))

  console.log('Syncing about/contact/compliance/warning note...')
  await syncAbout(pageByTitle('Page 6'))
  await syncContact(pageByTitle('Page 7'))
  await syncCompliance(pageByTitle('Page 8'))
  await syncWarningNote(pageByTitle('Page 9'))

  console.log('Done. Content synced from docx-pages.json')
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
