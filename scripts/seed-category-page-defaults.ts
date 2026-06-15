import {getCliClient} from 'sanity/cli'

type CategoryDoc = {
  _id: string
  _type: 'category'
  name?: string
  slug?: {current?: string}
  categoryFaqItems?: Array<{_ref?: string}>
  [key: string]: unknown
}

type FaqDoc = {
  _id: string
  _type: 'faqItem'
  question: string
  answer: Array<{
    _type: 'block'
    style: 'normal'
    markDefs: unknown[]
    children: Array<{_type: 'span'; text: string; marks: string[]}>
  }>
  category: 'THCA'
  productCategories: Array<{_type: 'reference'; _ref: string}>
  ctaLabel?: string
  ctaHref?: string
  order: number
  isActive: true
}

function isEmptyString(value: unknown) {
  return typeof value !== 'string' || value.trim().length === 0
}

function renderTemplate(template: string, categoryName: string) {
  return template.replaceAll('{categoryName}', categoryName)
}

function toPortableText(paragraphs: string[]) {
  return paragraphs.map((paragraph) => ({
    _type: 'block' as const,
    style: 'normal' as const,
    markDefs: [],
    children: [{_type: 'span' as const, text: paragraph, marks: []}],
  }))
}

function buildThcaFaqDocs(categoryRef: string): FaqDoc[] {
  return [
    {
      _id: 'faq-thca-shipping-legality',
      _type: 'faqItem',
      question: 'Is shipping for bulk THCA vapes legal in all states?',
      answer: toPortableText([
        'While federally compliant under hemp rules, some states restrict total THC and hemp-derived isomers. Review destination rules before ordering. We provide compliance paperwork with each shipment.',
      ]),
      category: 'THCA',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'View Compliance Map',
      ctaHref: '/compliance',
      order: 10,
      isActive: true,
    },
    {
      _id: 'faq-thca-vs-delta8',
      _type: 'faqItem',
      question: 'What is the difference between THCA and Delta-8 vapes?',
      answer: toPortableText([
        'THCA converts to Delta-9 THC through decarboxylation when heated. Delta-8 is a different cannabinoid profile with different potency. THCA is often preferred when customers want a closer Delta-9 style experience.',
      ]),
      category: 'THCA',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Compare Cannabinoid Potency',
      ctaHref: '/blog',
      order: 20,
      isActive: true,
    },
    {
      _id: 'faq-thca-additives',
      _type: 'faqItem',
      question: 'Do your THCA vapes contain additives like Vitamin E?',
      answer: toPortableText([
        'No. THCA inventory is formulated without Vitamin E acetate, PG, VG, or MCT fillers. We use purified concentrate and terpene profiles appropriate for inhalable hardware.',
      ]),
      category: 'THCA',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'See Ingredient Purity',
      ctaHref: '/compliance',
      order: 30,
      isActive: true,
    },
    {
      _id: 'faq-thca-wholesale-start',
      _type: 'faqItem',
      question: 'How do I start a wholesale order for THCA vapes?',
      answer: toPortableText([
        'Create a wholesale account, complete verification, and request the THCA tier list. Once approved, you can place tracked bulk orders with account-level pricing.',
      ]),
      category: 'THCA',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Register for Wholesale',
      ctaHref: '/wholesale-request',
      order: 40,
      isActive: true,
    },
  ]
}

function buildThcFaqDocs(categoryRef: string): FaqDoc[] {
  return [
    {
      _id: 'faq-thc-shipping-logistics',
      _type: 'faqItem',
      question: 'How do you handle the shipping of bulk THC vapes?',
      answer: toPortableText([
        'Bulk THC vapes are packed with reinforced logistics controls including sealed inner packaging, unbranded outer cartons, and tracked delivery routing appropriate for wholesale operations.',
      ]),
      category: 'THC',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Shipping & Logistics',
      ctaHref: '/shipping',
      order: 10,
      isActive: true,
    },
    {
      _id: 'faq-thc-live-resin-vs-distillate',
      _type: 'faqItem',
      question: 'What is the difference between Live Resin and Distillate vapes?',
      answer: toPortableText([
        'Distillate prioritizes cannabinoid concentration and cost efficiency, while live resin preserves broader terpene character from fresh-frozen inputs. Many retailers stock both for tiered customer preferences.',
      ]),
      category: 'THC',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Compare Extract Types',
      ctaHref: '/blog',
      order: 20,
      isActive: true,
    },
    {
      _id: 'faq-thc-lab-testing',
      _type: 'faqItem',
      question: 'Are your THC vapes for sale lab-tested?',
      answer: toPortableText([
        'Yes. THC batches are verified with full-panel COA documentation for potency and contaminant screening before wholesale release.',
      ]),
      category: 'THC',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Verify Lab Results',
      ctaHref: '/compliance',
      order: 30,
      isActive: true,
    },
    {
      _id: 'faq-thc-order-online',
      _type: 'faqItem',
      question: 'Can I order THC vapes online for my dispensary?',
      answer: toPortableText([
        'Verified partners can request pricing and place THC wholesale orders through the portal after account review and business credential verification.',
      ]),
      category: 'THC',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Register as a Partner',
      ctaHref: '/wholesale-request',
      order: 40,
      isActive: true,
    },
  ]
}

function buildCbdFaqDocs(categoryRef: string): FaqDoc[] {
  return [
    {
      _id: 'faq-cbd-discreet-shipping',
      _type: 'faqItem',
      question: 'Is shipping for bulk CBD vapes discreet?',
      answer: toPortableText([
        'Yes. Bulk CBD orders ship in plain, unbranded cartons with documentation aligned to legal hemp handling and transit requirements.',
      ]),
      category: 'CBD',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Shipping Information',
      ctaHref: '/shipping',
      order: 10,
      isActive: true,
    },
    {
      _id: 'faq-cbd-vs-thca',
      _type: 'faqItem',
      question: 'What is the difference between CBD and THCA vapes?',
      answer: toPortableText([
        'CBD products are non-psychoactive and typically positioned for wellness use cases. THCA products can convert during heating and are positioned for different consumer intent and compliance considerations.',
      ]),
      category: 'CBD',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Compare Hemp Variations',
      ctaHref: '/blog',
      order: 20,
      isActive: true,
    },
    {
      _id: 'faq-cbd-coa-verification',
      _type: 'faqItem',
      question: 'How do I verify the lab results for your vapes for sale?',
      answer: toPortableText([
        'Each batch is tied to COA documentation so buyers can validate cannabinoid profile and contaminant screening before retail placement.',
      ]),
      category: 'CBD',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Access COA Database',
      ctaHref: '/compliance',
      order: 30,
      isActive: true,
    },
    {
      _id: 'faq-cbd-large-volume-orders',
      _type: 'faqItem',
      question: 'Can I order CBD vapes online in large volumes?',
      answer: toPortableText([
        'Yes. Verified wholesale accounts can place CBD orders by tier. For enterprise-volume custom runs, request a tailored logistics quote.',
      ]),
      category: 'CBD',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Place Wholesale Order',
      ctaHref: '/wholesale-request',
      order: 40,
      isActive: true,
    },
  ]
}

function buildNicotineFaqDocs(categoryRef: string): FaqDoc[] {
  return [
    {
      _id: 'faq-nicotine-legality-2026',
      _type: 'faqItem',
      question: 'How do you ensure the legality of bulk nicotine vapes in 2026?',
      answer: toPortableText([
        'Inventory is reviewed against current market requirements and compliance updates. For UK/EU pathways, refillable and hybrid systems are prioritized; for US pathways, products are aligned to active regulatory status expectations.',
      ]),
      category: 'Nicotine',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Check Compliance Details',
      ctaHref: '/compliance',
      order: 10,
      isActive: true,
    },
    {
      _id: 'faq-nicotine-salts-vs-freebase',
      _type: 'faqItem',
      question: 'What is the difference between Nic Salts and Freebase Nicotine?',
      answer: toPortableText([
        'Nicotine salts are commonly used for smoother inhalation at higher strengths, while freebase nicotine is typically used at lower strengths for higher vapor output and different device profiles.',
      ]),
      category: 'Nicotine',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Shop Nic Salt Range',
      ctaHref: '/products',
      order: 20,
      isActive: true,
    },
    {
      _id: 'faq-nicotine-flavor-selection',
      _type: 'faqItem',
      question: 'Do you offer flavor-specific bulk vapes for sale?',
      answer: toPortableText([
        'Yes. Flavor selection is maintained according to jurisdictional allowances and compliance guardrails, including core profiles and region-appropriate options.',
      ]),
      category: 'Nicotine',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Explore Flavor Profiles',
      ctaHref: '/products',
      order: 30,
      isActive: true,
    },
    {
      _id: 'faq-nicotine-order-online',
      _type: 'faqItem',
      question: 'How do I order nicotine vapes online for my business?',
      answer: toPortableText([
        'Create a wholesale account, complete business verification requirements, and place volume-based orders through the portal. Most orders move into fulfillment quickly after approval.',
      ]),
      category: 'Nicotine',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Create Business Account',
      ctaHref: '/wholesale-request',
      order: 40,
      isActive: true,
    },
  ]
}

function buildThcCartsFaqDocs(categoryRef: string): FaqDoc[] {
  return [
    {
      _id: 'faq-thc-carts-battery-compatibility',
      _type: 'faqItem',
      question: 'Do your bulk THC carts fit any battery?',
      answer: toPortableText([
        'Yes. Cartridge inventory is aligned to universal 510-thread compatibility so it connects across standard pen-style and variable-voltage battery platforms.',
      ]),
      category: 'THC Carts',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Shop Compatible Batteries',
      ctaHref: '/products',
      order: 10,
      isActive: true,
    },
    {
      _id: 'faq-thc-carts-ceramic-vs-metal',
      _type: 'faqItem',
      question: 'What is the advantage of ceramic over metal coils?',
      answer: toPortableText([
        'Ceramic cores provide even heating and stable flavor expression for high-viscosity oils, which can reduce burnt taste risk and improve consistency over repeated draws.',
      ]),
      category: 'THC Carts',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Learn About Ceramic Tech',
      ctaHref: '/blog',
      order: 20,
      isActive: true,
    },
    {
      _id: 'faq-thc-carts-potency-verification',
      _type: 'faqItem',
      question: 'How do I verify the potency of the vapes for sale?',
      answer: toPortableText([
        'Each shipment includes batch-level testing references so buyers can review third-party potency and purity reports before retail distribution.',
      ]),
      category: 'THC Carts',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Access Testing Database',
      ctaHref: '/compliance',
      order: 30,
      isActive: true,
    },
    {
      _id: 'faq-thc-carts-order-online',
      _type: 'faqItem',
      question: 'Can I order THC carts online in bulk for my shop?',
      answer: toPortableText([
        'Yes. Verified wholesale accounts can place volume cartridge orders online, and large runs can be reviewed for custom packaging or white-label pathways.',
      ]),
      category: 'THC Carts',
      productCategories: [{_type: 'reference', _ref: categoryRef}],
      ctaLabel: 'Place Wholesale Order',
      ctaHref: '/wholesale-request',
      order: 40,
      isActive: true,
    },
  ]
}

async function main() {
  const client = getCliClient({apiVersion: '2024-02-01'})
  const publishedDocs = await client.fetch<CategoryDoc[]>(
    `*[_type == "category" && !(_id in path("drafts.**"))]{_id, _type, name, ...}`,
  )

  let updatedCount = 0

  for (const published of publishedDocs) {
    const draftId = `drafts.${published._id}`
    const draft = await client.getDocument<CategoryDoc>(draftId)
    const docsToPatch: CategoryDoc[] = draft ? [published, draft] : [published]

    for (const doc of docsToPatch) {
      const categoryName = typeof doc.name === 'string' && doc.name.trim().length > 0 ? doc.name : 'this category'
      const patch = client.patch(doc._id)
      let changed = false

      const setIfEmpty = (field: string, value: string) => {
        if (doc[field] === undefined || doc[field] === null || isEmptyString(doc[field])) {
          patch.set({[field]: value})
          changed = true
        }
      }

      setIfEmpty('categoryHeroEyebrow', 'Category Page')
      setIfEmpty('categoryHeroPrimaryCtaLabel', 'Shop This Category')
      setIfEmpty('categoryHeroSecondaryCtaLabel', 'Wholesale Inquiry')
      setIfEmpty(
        'categoryHeroFallbackDescription',
        renderTemplate(
          'Browse {categoryName} with wholesale-focused inventory, consistent supply, and category-level pricing options.',
          categoryName,
        ),
      )
      setIfEmpty('categoryFilterLabel', 'Filtered Category:')
      setIfEmpty('categoryFilterViewAllLabel', 'View all products')
      setIfEmpty(
        'categoryProductsHeadingTemplate',
        renderTemplate('Products in {categoryName}', categoryName),
      )
      setIfEmpty('categoryProductsEmptyMessage', 'No products found for this category yet.')
      setIfEmpty(
        'categoryAuthorityHeadingTemplate',
        renderTemplate('Why {categoryName} Performs in Wholesale', categoryName),
      )
      setIfEmpty('categorySupportingHeading', 'Related Guides')
      setIfEmpty(
        'categorySupportingDescription',
        'Explore supporting pages that cover pricing, compliance, and buying strategy for this category.',
      )
      setIfEmpty('categorySupportingEmptyMessage', 'No related guides configured for this category yet.')
      setIfEmpty('categoryTrustWallHeading', 'The Trust Wall')
      setIfEmpty('categoryFaqHeading', 'Frequently Asked Questions')
      setIfEmpty(
        'categoryFaqDescription',
        'Answers to compliance, product quality, and wholesale ordering questions for this category.',
      )
      setIfEmpty('categoryFaqEmptyMessage', 'No FAQ items are configured for this category yet.')
      setIfEmpty('categoryCrossLinksHeading', 'Explore Related Categories')
      setIfEmpty(
        'categoryCrossLinksDescription',
        'Compare nearby high-intent categories to plan your wholesale product mix.',
      )
      setIfEmpty('categoryCrossLinksEmptyMessage', 'No related categories configured for this category yet.')
      setIfEmpty('categoryBestsellersEyebrow', 'Top Moving Inventory')
      setIfEmpty('categoryBestsellersHeading', 'Bestsellers')
      setIfEmpty(
        'categoryBestsellersDescription',
        'Browse high-performing wholesale products trusted by smoke shops, distributors, and repeat retail buyers.',
      )
      setIfEmpty('categoryBestsellersViewAllLabel', 'View All Products')
      setIfEmpty('categoryBrowseAllLabel', 'Browse All Products')
      setIfEmpty('categoryBreadcrumbCategoriesLabel', 'Categories')
      setIfEmpty('categoryFilterLoadingMessage', 'Loading category controls...')

      if (changed) {
        await patch.commit()
        updatedCount += 1
      }
    }
  }

  const thcaCategory = publishedDocs.find(
    (doc) => doc.slug?.current === 'wholesale-thca' || doc.slug?.current === 'bulk-thca-vapes',
  )
  if (thcaCategory) {
    const thcaSeoContent = toPortableText([
      'Bulk THCA Vapes represent the 2026 standard for retailers who need high-potency demand with stronger compliance positioning. THCA remains non-psychoactive in raw form and converts during heating, creating a regulated pathway for hemp-derived inventory strategies.',
      'Our compliance protocol combines hemp-origin verification, full-panel contaminant screening, and conversion-aware hardware calibration. This helps wholesale buyers protect shelf quality, reduce legal uncertainty, and scale reliable reorders in THCA-heavy assortments.',
      'For store operators, THCA formats like disposables, liquid diamonds, and 510 carts create a flexible mix across customer segments. We support this with documentation-first fulfillment, tiered pricing for volume orders, and logistics designed for fast market turnover.',
    ])

    const thcaTestimonials = [
      {
        quote:
          "The THCA conversion is consistent and clean. Customers immediately notice potency and repeat buy rates improved in under a month.",
        source: 'Main Street Wellness',
      },
      {
        quote:
          'WholesaleVapesUSA gives us the most complete THCA paperwork stack we have seen. It made distributor-level compliance much easier.',
        source: 'Lone Star Distribution',
      },
      {
        quote:
          'THCA liquid diamonds became one of our fastest moving SKUs. Margin and reorder velocity both improved after launch.',
        source: 'Vapor Vault, FL',
      },
    ]

    const thcaShields = [
      'Farm Bill aligned hemp-derived THCA with less than 0.3% Delta-9 THC at production.',
      'Independent full-panel testing for solvents, heavy metals, pesticides, and residual contaminants.',
      'Batch documentation and compliance packet support for wholesale buyers.',
    ]

    await client
      .patch(thcaCategory._id)
      .set({
        seoTitle: 'Bulk THCA Vapes | WholesaleVapesUSA',
        seoDescription:
          'Bulk THCA vapes and live resin disposables. WholesaleVapesUSA offers high-purity THCA concentrates that convert to Delta-9 THC upon heating, providing a legal, potent wholesale solution.',
        categoryHeroEyebrow: 'Technical Innovation & Legal Precision',
        categoryHeroPrimaryCtaLabel: 'Explore THCA Catalog',
        categoryHeroSecondaryCtaLabel: 'View Wholesale THCA Tiers',
        categoryHeroFallbackDescription:
          'THCA-focused wholesale inventory engineered for compliance-first buyers who need high-potency conversion performance.',
        categoryAuthorityHeadingTemplate:
          'Bulk THCA Vapes: The Future of Federally Compliant High-Potency Hemp',
        seoContent: thcaSeoContent,
        categoryTrustWallHeading: 'The Trust Wall',
        categoryTrustWallTestimonials: thcaTestimonials,
        categoryTrustWallShields: thcaShields,
        categoryFaqHeading: 'Frequently Asked Questions',
        categoryFaqDescription:
          'Practical answers for wholesale buyers sourcing THCA carts, disposables, and live resin blends.',
      })
      .commit()

    const faqDocs = buildThcaFaqDocs(thcaCategory._id)
    for (const faqDoc of faqDocs) {
      await client.createOrReplace(faqDoc)
    }

    const faqRefs = faqDocs.map((faqDoc) => ({_type: 'reference', _ref: faqDoc._id}))
    await client.patch(thcaCategory._id).set({categoryFaqItems: faqRefs}).commit()
  }

  const thcCategory = publishedDocs.find(
    (doc) => doc.slug?.current === 'wholesale-thc-vapes' || doc.slug?.current === 'bulk-thc-vapes',
  )
  if (thcCategory) {
    const thcSeoContent = toPortableText([
      'Bulk THC Vapes continue to define high-performance cannabis retail in 2026 as buyers prioritize terpene fidelity, extraction cleanliness, and hardware reliability over simple potency claims.',
      'Our distribution protocol centers on extract verification, low-temperature fill standards, and cartridge safety checks built for thick oils and repeat customer expectations. This lets wholesale partners protect quality while scaling multi-tier inventory strategy.',
      'From value-focused distillates to live resin and solventless options, the catalog supports connoisseur and mainstream demand in one procurement flow. Tiered pricing, contract options, and discreet logistics are built to improve margin stability as markets expand.',
    ])

    const thcTestimonials = [
      {
        quote:
          'The live rosin carts are among the best-performing SKUs we have stocked this year. Flavor retention and hardware consistency are excellent.',
        source: 'High Desert Dispensary',
      },
      {
        quote:
          'WholesaleVapesUSA gives us dependable THC replenishment cycles across multiple locations without quality swings between batches.',
        source: 'Apex Distribution',
      },
      {
        quote:
          'The tiered THC pricing improved our category margin immediately while keeping premium options competitive in-store.',
        source: 'The Green Room, NJ',
      },
    ]

    const thcShields = [
      'State-aligned full-panel testing for potency, heavy metals, pesticides, and residual solvents.',
      'Batch-level traceability and anti-counterfeit controls for wholesale authenticity checks.',
      'Discreet logistics workflow designed for high-value inventory transit.',
    ]

    await client
      .patch(thcCategory._id)
      .set({
        seoTitle: 'Bulk THC Vapes | WholesaleVapesUSA',
        seoDescription:
          'Bulk THC vapes and live resin cartridges for legal adult-use markets. WholesaleVapesUSA offers high-potency, lab-certified THC concentrates with tiered wholesale pricing and discreet shipping.',
        categoryHeroEyebrow: 'Elite Performance & Connoisseur Standards',
        categoryHeroPrimaryCtaLabel: 'Browse THC Inventory',
        categoryHeroSecondaryCtaLabel: 'Open a Distribution Account',
        categoryHeroFallbackDescription:
          'THC-focused wholesale inventory engineered for terpene preservation, hardware safety, and scalable distribution performance.',
        categoryAuthorityHeadingTemplate:
          'Bulk THC Vapes: The Industry Gold Standard for Potency and Purity',
        seoContent: thcSeoContent,
        categoryTrustWallHeading: 'The Trust Wall',
        categoryTrustWallTestimonials: thcTestimonials,
        categoryTrustWallShields: thcShields,
        categoryFaqHeading: 'Frequently Asked Questions',
        categoryFaqDescription:
          'Answers for dispensaries and wholesale buyers sourcing THC distillate, live resin, and cartridge formats.',
      })
      .commit()

    const faqDocs = buildThcFaqDocs(thcCategory._id)
    for (const faqDoc of faqDocs) {
      await client.createOrReplace(faqDoc)
    }

    const faqRefs = faqDocs.map((faqDoc) => ({_type: 'reference', _ref: faqDoc._id}))
    await client.patch(thcCategory._id).set({categoryFaqItems: faqRefs}).commit()
  }

  const cbdCategory = publishedDocs.find(
    (doc) => doc.slug?.current === 'wholesale-cbd' || doc.slug?.current === 'bulk-cbd-vapes',
  )
  if (cbdCategory) {
    const cbdSeoContent = toPortableText([
      'Bulk CBD Vapes continue to expand in 2026 as wellness-focused buyers prioritize clean-label formulation, consistent potency, and transparent compliance documentation.',
      'Our CBD protocol emphasizes purity, non-psychoactive positioning, and batch-level verification. This includes contaminant screening, cannabinoid profile checks, and hardware standards suited for stable inhalable delivery.',
      'From isolate and broad-spectrum formats to terpene-forward blends, the catalog supports recovery and daily wellness segments with dependable wholesale pricing and operational consistency.',
    ])

    const cbdTestimonials = [
      {
        quote:
          'This is the only CBD supplier we trust for our wellness segment. Their blend quality and consistency are top tier.',
        source: 'Nurture Health Collective',
      },
      {
        quote:
          'Customers love the clean draw and instant COA access workflow. Transparency has become a major retention driver for us.',
        source: 'Green Scene Retail',
      },
      {
        quote:
          'Three consecutive bulk orders with stable potency and no hardware quality issues. Strong partner for CBD distribution.',
        source: 'Wellness Distribution Partners',
      },
    ]

    const cbdShields = [
      'Independent lab testing with cannabinoid profile and contaminant checks for each batch.',
      'Farm Bill aligned hemp-derived sourcing and THC-threshold validation controls.',
      'Anti-clog airflow and ceramic-core hardware optimized for CBD oil viscosity.',
    ]

    await client
      .patch(cbdCategory._id)
      .set({
        seoTitle: 'Bulk CBD Vapes | WholesaleVapesUSA',
        seoDescription:
          'Bulk CBD vapes for wellness and recovery. WholesaleVapesUSA offers premium, lab-tested CBD disposables and cartridges with guaranteed 0.2% THC compliance and wholesale pricing.',
        categoryHeroEyebrow: 'Clinical Wellness & Performance',
        categoryHeroPrimaryCtaLabel: 'Browse CBD Inventory',
        categoryHeroSecondaryCtaLabel: 'Download Latest Lab Results',
        categoryHeroFallbackDescription:
          'CBD-focused wholesale inventory designed for clean-label wellness buyers and batch-level transparency.',
        categoryAuthorityHeadingTemplate:
          'Bulk CBD Vapes: Premium Hemp-Derived Wellness Wholesale',
        seoContent: cbdSeoContent,
        categoryTrustWallHeading: 'The Trust Wall',
        categoryTrustWallTestimonials: cbdTestimonials,
        categoryTrustWallShields: cbdShields,
        categoryFaqHeading: 'Frequently Asked Questions',
        categoryFaqDescription:
          'Answers for buyers sourcing CBD disposables, cartridges, and wellness-focused hemp formats.',
      })
      .commit()

    const faqDocs = buildCbdFaqDocs(cbdCategory._id)
    for (const faqDoc of faqDocs) {
      await client.createOrReplace(faqDoc)
    }

    const faqRefs = faqDocs.map((faqDoc) => ({_type: 'reference', _ref: faqDoc._id}))
    await client.patch(cbdCategory._id).set({categoryFaqItems: faqRefs}).commit()
  }

  const nicotineCategory = publishedDocs.find(
    (doc) =>
      doc.slug?.current === 'wholesale-nicotine' || doc.slug?.current === 'bulk-nicotine-vapes',
  )
  if (nicotineCategory) {
    const nicotineSeoContent = toPortableText([
      'Bulk Nicotine Vapes remain a core revenue category in 2026 as retailers adapt to regulatory shifts, disposable-format constraints, and higher demand for compliant long-life systems.',
      'Our supply chain approach emphasizes compliance, sustainability-oriented formats, and unit-cost efficiency. This includes refillable or hybrid system coverage, documentation-ready fulfillment, and predictable replenishment cycles for high-frequency buyers.',
      'From pod kits and big-puff architectures to fixed-cartridge options, the portfolio is curated for stability and margin performance. Tiered pricing and master-case logistics help wholesale buyers reduce volatility and keep shelves in stock.',
    ])

    const nicotineTestimonials = [
      {
        quote:
          "The transition from disposable-heavy sales to refillable and hybrid systems was smooth because of their consistent nicotine stock planning.",
        source: 'Elite Vapes, London',
      },
      {
        quote:
          'Every nicotine shipment includes clear documentation and batch traceability. That reliability has been critical for our compliance workflow.',
        source: 'Vape Depot, NY',
      },
      {
        quote:
          'Our unit economics improved significantly after moving nicotine procurement here. Pricing tiers and replenishment speed are strong.',
        source: 'Retail Chain Owner',
      },
    ]

    const nicotineShields = [
      'Regulatory-focused catalog controls aligned to current market compliance expectations.',
      'Batch authenticity workflows with traceable hardware and verification support.',
      'Discreet reinforced logistics designed for high-volume nicotine inventory movement.',
    ]

    await client
      .patch(nicotineCategory._id)
      .set({
        seoTitle: 'Bulk Nicotine Vapes | WholesaleVapesUSA',
        seoDescription:
          'Bulk nicotine vapes and high-capacity pod systems for retail and distribution. WholesaleVapesUSA provides compliant, lab-tested nicotine solutions with tiered wholesale pricing.',
        categoryHeroEyebrow: 'Supply Chain Excellence',
        categoryHeroPrimaryCtaLabel: 'View Nicotine Inventory',
        categoryHeroSecondaryCtaLabel: 'Open a Wholesale Account',
        categoryHeroFallbackDescription:
          'Nicotine-focused wholesale systems built for compliance, refillable-format sustainability, and unit-cost efficiency.',
        categoryAuthorityHeadingTemplate:
          'Bulk Nicotine Vapes: High-Volume Nicotine Delivery Systems',
        seoContent: nicotineSeoContent,
        categoryTrustWallHeading: 'The Trust Wall',
        categoryTrustWallTestimonials: nicotineTestimonials,
        categoryTrustWallShields: nicotineShields,
        categoryFaqHeading: 'Frequently Asked Questions',
        categoryFaqDescription:
          'Answers for wholesale buyers sourcing nicotine pod systems, hybrid formats, and compliant high-volume inventory.',
      })
      .commit()

    const faqDocs = buildNicotineFaqDocs(nicotineCategory._id)
    for (const faqDoc of faqDocs) {
      await client.createOrReplace(faqDoc)
    }

    const faqRefs = faqDocs.map((faqDoc) => ({_type: 'reference', _ref: faqDoc._id}))
    await client.patch(nicotineCategory._id).set({categoryFaqItems: faqRefs}).commit()
  }

  const thcCartsCategory = publishedDocs.find(
    (doc) =>
      doc.slug?.current === 'wholesale-thc-carts-vapes' ||
      doc.slug?.current === 'bulk-thc-carts-and-cartridges',
  )
  if (thcCartsCategory) {
    const thcCartsSeoContent = toPortableText([
      'Bulk THC Carts remain a top-performing wholesale format in 2026 because they combine universal hardware compatibility, strong repeat purchase behavior, and lower per-unit logistics overhead versus all-in-one devices.',
      'Our cartridge protocol is designed for technical buyers who prioritize thread reliability, ceramic-core consistency, and extract-to-hardware viscosity matching. This reduces leakage, minimizes return rates, and protects shelf performance.',
      'From distillate to live resin and liquid-diamond profiles, the portfolio supports both value and connoisseur segments. Tiered pricing and compact master-case shipping improve gross margin control for high-volume retail operations.',
    ])

    const thcCartsTestimonials = [
      {
        quote:
          'The 510 thread tolerance is extremely consistent and return rates dropped after we moved to their ceramic cartridge lines.',
        source: 'High Sierra Dispensary',
      },
      {
        quote:
          'Liquid diamond carts are one of our fastest-turning SKUs. Inventory quality has stayed stable across reorders.',
        source: 'Metro Vapes Wholesale',
      },
      {
        quote:
          'Their COA transparency on cartridge inventory has made compliance checks much easier for our team.',
        source: 'Bay Area Distribution',
      },
    ]

    const thcCartsShields = [
      'Universal 510-thread compatibility controls for broad battery fit reliability.',
      'Heavy-metal and contaminant screening aligned with independent lab verification standards.',
      'Protective odor-controlled packaging for secure wholesale transit.',
    ]

    await client
      .patch(thcCartsCategory._id)
      .set({
        seoTitle: 'Bulk THC Carts | WholesaleVapesUSA',
        seoDescription:
          'Bulk THC carts with universal 510-thread compatibility. WholesaleVapesUSA provides high-potency ceramic cartridges, live resin options, and tiered wholesale pricing for retailers.',
        categoryHeroEyebrow: 'Technical Authority & Precision Engineering',
        categoryHeroPrimaryCtaLabel: 'Explore Cartridge Catalog',
        categoryHeroSecondaryCtaLabel: 'Inquire About Master-Case Rates',
        categoryHeroFallbackDescription:
          'THC cartridge wholesale inventory optimized for universal 510 compatibility, ceramic-core performance, and unit-cost efficiency.',
        categoryAuthorityHeadingTemplate:
          'Bulk THC Carts: Professional-Grade 510-Thread Wholesale Hardware',
        seoContent: thcCartsSeoContent,
        categoryTrustWallHeading: 'The Trust Wall',
        categoryTrustWallTestimonials: thcCartsTestimonials,
        categoryTrustWallShields: thcCartsShields,
        categoryFaqHeading: 'Frequently Asked Questions',
        categoryFaqDescription:
          'Answers for buyers sourcing universal 510 cartridges, ceramic-core hardware, and high-volume THC cart inventory.',
      })
      .commit()

    const faqDocs = buildThcCartsFaqDocs(thcCartsCategory._id)
    for (const faqDoc of faqDocs) {
      await client.createOrReplace(faqDoc)
    }

    const faqRefs = faqDocs.map((faqDoc) => ({_type: 'reference', _ref: faqDoc._id}))
    await client.patch(thcCartsCategory._id).set({categoryFaqItems: faqRefs}).commit()
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded category page defaults for ${updatedCount} category records (published + drafts).`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exitCode = 1
})
