import {config as loadEnv} from 'dotenv'
import {resolve} from 'node:path'

import type {SanityClient} from '@sanity/client'

import {
  getSanityWriteClient,
  isInsufficientSanityPermission,
  printSanityWritePermissionHelp,
} from './sanityWriteClient'

loadEnv({path: resolve(process.cwd(), '.env')})
loadEnv({path: resolve(process.cwd(), '.env.local')})

const ABOUT_ID = 'aboutPage'
const CONTACT_ID = 'contactPage'
const COMPLIANCE_ID = 'compliancePage'

function makeKey(prefix: string, index: number) {
  return `${prefix}-${index}-${Math.random().toString(16).slice(2, 10)}`
}

function portableBlock(text: string, blockKey: string) {
  return {
    _type: 'block' as const,
    _key: blockKey,
    style: 'normal' as const,
    markDefs: [] as const,
    children: [
      {
        _type: 'span' as const,
        _key: `${blockKey}-span`,
        text,
        marks: [] as const,
      },
    ],
  }
}

function buildAboutPatch() {
  return {
    seoTitle: 'About WholesaleVapesUSA.com — Institutional B2B Wholesale Partner',
    seoDescription:
      'WholesaleVapesUSA.com brings retail-grade service to wholesale buyers: e‑commerce and industry veterans, transparent sourcing, and lab‑verified brands for retailers worldwide.',
    pageHeading: 'About WholesaleVapesUSA.com',
    introLead:
      'We believe wholesale buyers deserve the same level of service and speed as retail customers — with an institutional standard of transparency on quality, verification, and fulfillment.',
    storyHeading: 'Institutional Authority',
    storyBody: [
      portableBlock(
        'WholesaleVapesUSA.com was founded by a team of e‑commerce entrepreneurs and industry veterans who saw a gap in the supply chain.',
        makeKey('story', 0),
      ),
      portableBlock(
        'We believe that wholesale buyers deserve the same level of service and speed as retail customers.',
        makeKey('story', 1),
      ),
    ],
    missionHeading: 'Our Mission',
    missionBody: [
      portableBlock(
        'Our mission is to provide an "Institutional" standard of transparency, offering only the highest quality, lab‑verified brands to retailers worldwide.',
        makeKey('mission', 0),
      ),
    ],
    teamBody: [],
    complianceHeading: 'Compliance & Certifications',
    complianceIntro:
      'Product eligibility, wholesale registration, and documentation expectations align with federal hemp rules, adult‑only commerce, and operational transparency.',
    compliancePoints: [
      {
        _key: makeKey('cp', 0),
        title: '2018 Farm Bill — hemp‑derived products',
        description:
          'Where applicable, products are derived from industrial hemp and formulated to remain under 0.3% Delta‑9 THC on a dry‑weight basis, consistent with the 2018 Farm Bill framework.',
      },
      {
        _key: makeKey('cp', 1),
        title: '21+ & wholesale verification',
        description:
          'You must be 21+ to purchase. Wholesale registrations use AgeChecker.net to support compliant B2B onboarding and age‑appropriate commerce.',
      },
      {
        _key: makeKey('cp', 2),
        title: 'Lab‑verified assortment',
        description:
          'We prioritize transparent, lab‑supported brands so retailers can stock with confidence alongside destination‑specific rule checks.',
      },
    ],
  }
}

function buildContactPatch() {
  return {
    seoTitle: 'Contact WholesaleVapesUSA.com — Wholesale Inquiries',
    seoDescription:
      'Reach WholesaleVapesUSA for wholesale sales and partnership questions. Wholesale inquiries: sales@wholesalevapesusa.com. All wholesale inquiries are addressed within 2 business hours.',
    pageHeading: 'Contact Us',
    introLead:
      'Wholesale inquiries: sales@wholesalevapesusa.com. Use the form below for routed requests, or email us directly for commercial and partnership questions.',
    formHeading: 'Send us a message',
    formIntro:
      'Share your company details and request. Please do not send payment card numbers or sensitive credentials in this form.',
    nameFieldLabel: 'Full name',
    emailFieldLabel: 'Email address',
    subjectFieldLabel: 'Subject',
    messageFieldLabel: 'Message',
    submitButtonLabel: 'Send message',
    subjectOptions: [
      {_key: makeKey('so', 0), value: 'general', label: 'General question'},
      {_key: makeKey('so', 1), value: 'order', label: 'Order & invoice'},
      {_key: makeKey('so', 2), value: 'wholesale', label: 'Wholesale program'},
      {_key: makeKey('so', 3), value: 'compliance', label: 'Compliance & shipping'},
    ],
    successTitle: 'Message received',
    successMessage:
      'Thanks for contacting WholesaleVapesUSA. A team member will follow up under our response guarantee. If your request is urgent, reply to your confirmation email.',
    detailsHeading: 'Wholesale & contact details',
    contactEmail: 'sales@wholesalevapesusa.com',
    contactPhone: '[Insert Business Phone]',
    businessHours:
      'USA distribution hub:\n[Insert USA Distribution Hub Address]\n\nMonday–Friday: 9:00 AM – 6:00 PM ET\nSaturday–Sunday: monitored for urgent wholesale issues',
    responsePromise: 'All wholesale inquiries are addressed within 2 business hours.',
    paymentsNote:
      'Wholesale invoices may be eligible for crypto (BTC, ETH, USDT) and Revolut where offered.',
  }
}

function buildCompliancePatch() {
  return {
    title: 'Legality, Compliance & Safety',
    description:
      'WholesaleVapesUSA legality and safety guidance: 2018 Farm Bill hemp limits, 21+ wholesale registration with AgeChecker.net, product warnings, and shipping timelines including international customs.',
    lastUpdated: '2026-05-02',
    sections: [
      {
        _type: 'legalSection' as const,
        _key: makeKey('sec', 0),
        title: 'Compliance — hemp‑derived products',
        paragraphs: [
          'All products on this site are derived from industrial hemp and contain less than 0.3% Delta‑9 THC in accordance with the 2018 Farm Bill. Regulations vary by jurisdiction; buyers remain responsible for confirming local rules before ordering.',
        ],
      },
      {
        _type: 'legalSection' as const,
        _key: makeKey('sec', 1),
        title: 'Age restriction',
        paragraphs: [
          'You must be 21 or older to purchase. We utilize AgeChecker.net for wholesale registrations to support compliant adult‑only B2B commerce.',
        ],
      },
      {
        _type: 'legalSection' as const,
        _key: makeKey('sec', 2),
        title: 'Warnings',
        paragraphs: [
          'Vaping products may contain nicotine, a highly addictive chemical. Cannabinoid products are intended for adult use only. Do not use if pregnant or nursing. Consult a physician before use.',
        ],
      },
      {
        _type: 'legalSection' as const,
        _key: makeKey('sec', 3),
        title: '48‑hour shipping',
        paragraphs: [
          'The delivery window begins once the order is processed. International delivery times may vary based on local customs, carrier service, and destination regulations.',
        ],
      },
    ],
  }
}

async function patchSingleton(client: SanityClient, sourceId: string, patchBody: Record<string, unknown>) {
  const draftId = `drafts.${sourceId}`

  const targets = [sourceId]
  const draft = await client.getDocument(draftId)
  if (draft) {
    targets.push(draftId)
  }

  for (const id of targets) {
    await client.patch(id).set(patchBody).commit({autoGenerateArrayKeys: true})
  }

  return targets
}

async function main() {
  const client = getSanityWriteClient()

  for (const sid of [ABOUT_ID, CONTACT_ID, COMPLIANCE_ID]) {
    const doc = await client.getDocument(sid)
    if (!doc) {
      throw new Error(`Missing singleton ${sid}. Create it in Sanity or import seed NDJSON first.`)
    }
  }

  const aboutTargets = await patchSingleton(client, ABOUT_ID, buildAboutPatch())
  const contactTargets = await patchSingleton(client, CONTACT_ID, buildContactPatch())
  const complianceTargets = await patchSingleton(client, COMPLIANCE_ID, buildCompliancePatch())

  // eslint-disable-next-line no-console
  console.log(
    [
      `About page updated: ${aboutTargets.join(', ')}`,
      `Contact page updated: ${contactTargets.join(', ')}`,
      `Compliance page updated: ${complianceTargets.join(', ')}`,
    ].join('\n'),
  )
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  if (isInsufficientSanityPermission(err)) {
    printSanityWritePermissionHelp()
  }
  process.exitCode = 1
})
