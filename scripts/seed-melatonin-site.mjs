/**
 * One-shot seed for the Melatonin Gummies UK site (project 8fp9giy6).
 * Creates: site settings, homepage, 3 categories (sleep/lemme/natrol),
 * wholesale page, about page, contact page, compliance page, FAQ items, testimonials.
 *
 * Run:  node scripts/seed-melatonin-site.mjs
 */
import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import {resolve} from 'node:path'
import {readFileSync} from 'node:fs'

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

const PUB = resolve(process.cwd(), '../melatoningummiesuk-web/public/images/categories')

let keyCounter = 0
const key = () => `k${Date.now().toString(36)}${(keyCounter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`

const p = (text) => ({_type: 'block', _key: key(), style: 'normal', markDefs: [], children: [{_type: 'span', _key: key(), text, marks: []}]})
const h2 = (text) => ({_type: 'block', _key: key(), style: 'h2', markDefs: [], children: [{_type: 'span', _key: key(), text, marks: []}]})

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function uploadImage(filename, alt, attempts = 5) {
  const filePath = resolve(PUB, filename)
  const buffer = readFileSync(filePath)
  for (let i = 1; i <= attempts; i++) {
    try {
      const asset = await client.assets.upload('image', buffer, {filename})
      return {_type: 'image', alt, asset: {_type: 'reference', _ref: asset._id}}
    } catch (err) {
      const msg = err?.message || String(err)
      console.warn(`  upload ${filename} attempt ${i}/${attempts} failed: ${msg}`)
      if (i === attempts) {
        console.warn(`  giving up on ${filename}; seeding without this image`)
        return null
      }
      await sleep(2000 * i)
    }
  }
  return null
}

// Strip null image fields so createOrReplace never sends an invalid image object
const withImg = (doc) => {
  const out = {...doc}
  for (const k of Object.keys(out)) {
    if (out[k] === null || out[k] === undefined) delete out[k]
  }
  return out
}

async function main() {
  console.log('Uploading category images (sequential, with retries)...')
  const sleepImg = await uploadImage('sleep_gummies.png', 'Premium sleep and melatonin gummies on a calm bedside nightstand at night')
  const lemmeImg = await uploadImage('lemme_gummies.png', 'Authentic Lemme functional wellness gummies on a marble surface')
  const natrolImg = await uploadImage('natrol_gummies.png', 'Clinical-strength Natrol melatonin gummies in a clean studio setting')

  // ── Categories ──────────────────────────────────────────────────────────
  const categories = [
    {
      _id: 'category-sleep-gummies',
      _type: 'category',
      name: 'Sleep Gummies',
      slug: {_type: 'slug', current: 'sleep-gummies'},
      group: 'Sleep',
      isActive: true,
      navOrder: 10,
      showInHeader: true,
      image: sleepImg,
      heroImage: sleepImg,
      shortDescription:
        "The UK's best nighttime formulas — high-potency sleep aid gummies, magnesium for sleep, adult and pediatric options for retail and wholesale.",
      seoTitle: 'Sleep Gummies: Buy Top-Rated Nighttime Sleep Aids Online UK',
      seoDescription:
        'Order premium sleep gummies in the UK & Ireland. Buy high-potency sleep aid gummies, magnesium gummies for sleep, and children\u2019s options at the lowest market prices with 48h delivery. Shop now!',
      categoryHeroEyebrow: 'Sleep Gummies',
      categoryHeroHeading: "Sleep Gummies: Order the UK's Best Nighttime Formulas Online",
      categoryAuthorityHeadingTemplate: 'Sleep Gummies UK: Premium Formulations for Restful Nights',
      description: [
        p('Sleep gummies are revolutionizing nighttime wellness routines, and our curated collection offers the absolute finest selection of legal, non-prescription sleep formulas available for sale in the UK and Ireland. Whether your goal is to buy extra-strength adult blends to beat insomnia or order specialized nighttime support for your family, our store balances competitive consumer pricing with extensive B2B wholesale infrastructure.'),
        p('We stock everything from standard herbal adaptogens to advanced hormonal regulators, ensuring every customer finds their perfect match. Order today and take advantage of our ultra-reliable 48-hour tracked shipping networks, alongside priority same-day dispatch options designed to restore peaceful nights without delay.'),
      ],
      seoContent: [
        h2('Sleep Gummies UK: Premium Formulations for Restful Nights'),
        p('When shopping for high-performing sleep gummies uk buyers frequently face a choice between weak local alternatives or unverified international imports. At melatoningummiesuk.com, we remove that friction by collecting top-tier global brands under one roof, fully tested and optimized for rapid overnight assimilation.'),
        p('Every single product batch we host is kept in temperature-controlled domestic facilities right here in the UK, sidestepping international customs delays and guaranteeing a fixed, predictable supply chain for retail shoppers and B2B storefront clients.'),
        h2('Buy Specialized Nighttime Formulas: Magnesium, Adults & Pediatric Options'),
        p('Adult high-strength options: buy highly effective sleep gummies for adults or sleeping gummies for adults designed to combat persistent shifts in sleep schedules, travel jet lag, and high-stress sleeplessness.'),
        p('Advanced mineral blends: order premium magnesium gummies for sleep, a targeted magnesium gummy for sleep, or broad-spectrum magnesium sleep gummies that encourage deep neuromuscular relaxation without hormonal supplements.'),
        p('Safe pediatric selections: we offer a safe inventory of sleep gummies for kids, sleeping gummies for kids, and childrens sleep gummies that help manage bedtime hyperactivity naturally with ingredients like chamomile and L-theanine.'),
        p('Alternative cannabinoids: for those who qualify, you can securely browse and buy specialized thc gummies for sleep alternatives built for deep-tissue relaxation and anxiety relief.'),
        h2('Elevate Your Inventory and Personal Wellness with Premium Sleep Aid Gummies'),
        p('Our direct-to-consumer digital business model cuts out corporate middlemen, allowing us to offer the lowest market prices across the UK and the Republic of Ireland. For domestic businesses, independent pharmacies, and online health retailers, our dedicated wholesale sleep gummies channel supplies instant access to commercial-grade volume discounts with a firm 48-hour delivery guarantee.'),
      ],
      categoryTrustWallShields: ['Authentic, lab-verified stock', '48-hour tracked delivery', 'UK & Ireland coverage', 'Non-habit-forming pediatric options'],
    },
    {
      _id: 'category-lemme-gummies',
      _type: 'category',
      name: 'Lemme Gummies',
      slug: {_type: 'slug', current: 'lemme-gummies'},
      group: 'Lemme',
      isActive: true,
      navOrder: 20,
      showInHeader: true,
      image: lemmeImg,
      heroImage: lemmeImg,
      shortDescription:
        'The viral premium wellness collection — authentic Lemme Sleep, Lemme Purr, Lemme Debloat and more at the lowest prices with fast 48h shipping.',
      seoTitle: 'Lemme Gummies: Buy Kourtney Kardashian Wellness Gummies UK',
      seoDescription:
        'Order authentic Lemme gummies in the UK & Ireland. Buy Lemme Sleep, Lemme Debloat, Lemme Purr, and Lemme Chill at the best prices online with fast 48h shipping. Shop retail or wholesale!',
      categoryHeroEyebrow: 'Lemme Gummies',
      categoryHeroHeading: 'Lemme Gummies: Order the Viral Premium Wellness Collection Online',
      categoryAuthorityHeadingTemplate: 'Lemme Gummies UK: Authentic Direct Imports for Retail and Business',
      description: [
        p('Lemme gummies, created by Kourtney Kardashian Barker, have transformed the global beauty and wellness market with scientifically backed, clean functional ingredients and a highly aesthetic lifestyle appeal. At melatoningummiesuk.com, we are proud to act as the premier domestic gateway where you can buy the entire authentic line without expensive international shipping rates or long customs delays.'),
        p('Whether your goal is to order individual retail jars for your daily routine or secure high-margin commercial inventory via our bulk B2B channel, we make this in-demand collection available for immediate purchase, with best-in-market prices, secure checkout, and guaranteed 48-hour tracked shipping.'),
      ],
      seoContent: [
        h2('Order the Full Range: Sleep, Vaginal Health & Metabolism Blends'),
        p('Premium nighttime support: buy the legendary Lemme Sleep gummies, Lemme Sleep Tight, and Lemme melatonin gummies to naturally induce a peaceful night\u2019s rest.'),
        p('Targeted feminine care: order the incredibly popular Lemme Purr gummies and Lemme Purr vaginal probiotic gummies to support microflora and intimate health, alongside Lemme libido options.'),
        p('Metabolism, digestion & focus: buy Lemme Debloat to ease daily bloating, Lemme Burn and Lemme Curb for metabolic enhancement, or Lemme Focus for cognitive performance.'),
        p('Beauty & longevity: secure Lemme Glow, Lemme Hair, or Lemme Grow gummies to upgrade your skin and hair wellness routines from the inside out.'),
        h2('The Ultimate Destination for Authentic Kardashian Wellness Gummies'),
        p('Every jar of Lemme gummies features its original security seal, production batch codes, and clear expiration dating, ensuring 100% brand authenticity. Whether you buy a single bottle or order hundreds of units for your retail shelves, our 48-hour delivery timeline is a firm guarantee.'),
      ],
      categoryTrustWallShields: ['100% authentic, sealed jars', 'Direct UK import pipeline', 'Deep wholesale margins', '48-hour tracked delivery'],
    },
    {
      _id: 'category-natrol-gummies',
      _type: 'category',
      name: 'Natrol Gummies',
      slug: {_type: 'slug', current: 'natrol-gummies'},
      group: 'Natrol',
      isActive: true,
      navOrder: 30,
      showInHeader: true,
      image: natrolImg,
      heroImage: natrolImg,
      shortDescription:
        "America's #1 melatonin brand — authentic Natrol 10mg, 5mg, and Kids sleep formulas at the lowest market prices with fast 48h shipping.",
      seoTitle: 'Natrol Gummies: Buy Clinical-Strength Melatonin Online UK',
      seoDescription:
        'Order authentic Natrol melatonin gummies in the UK & Ireland. Buy high-potency Natrol 10mg, 5mg, and Kids sleep formulas at the lowest market prices with fast 48h shipping. Shop now!',
      categoryHeroEyebrow: 'Natrol Gummies',
      categoryHeroHeading: "Natrol Gummies: Order America's #1 Melatonin Brand Online",
      categoryAuthorityHeadingTemplate: 'Natrol Melatonin Gummies: Sourcing Elite, Certified-Genuine Sleep Aids',
      description: [
        p('Natrol gummies are globally recognized as the gold standard for clinical-strength sleep support, and our e-commerce platform makes it simpler than ever to buy this top-tier American brand straight from a domestic supply. As a dedicated distributor serving both B2C retail and B2B wholesale markets across the UK and Ireland, we keep a massive inventory of authentic Natrol formulations ready for immediate dispatch.'),
        p('Whether you need maximum-potency adult formulas or gentle, pediatrician-recommended blends for your family, we provide premium products at the lowest market prices. Skip weeks of international shipping delays and order today, backed by our guaranteed 48-hour tracked shipping network.'),
      ],
      seoContent: [
        h2('Order by Strength and Demographic: 10mg, 5mg & Child-Safe Blends'),
        p('Maximum strength adult sleep support: buy Natrol melatonin 10mg gummies to quickly correct severe jet lag or deep sleep disruptions.'),
        p('Daily maintenance & moderate strengths: order the classic Natrol melatonin 5mg gummies and 1mg options for balanced nightly support.'),
        p('Gentle, pediatric-approved blends: buy Natrol Kids melatonin gummies to safely handle children\u2019s evening routines.'),
        h2('The Most Reliable Source for Melatonin Gummies Natrol UK'),
        p('Natrol is America\u2019s #1 melatonin manufacturer, famous for drug-free, non-GMO, gelatin-free pectin formulas that dissolve and absorb fast. Every shipment features automated tracking updates, and our rapid 48-hour delivery timeline is an absolute certainty for consumers and pallet buyers alike.'),
      ],
      categoryTrustWallShields: ['Certified-genuine import batches', 'Drug-free, non-GMO formulas', 'Volume tier discounts', '48-hour tracked delivery'],
    },
  ]

  console.log('Seeding categories...')
  for (const cat of categories) await client.createOrReplace(withImg(cat))

  // ── Category FAQ items + links ──────────────────────────────────────────
  const faqAnswer = (text) => [p(text)]
  const categoryFaqs = [
    {_id: 'faq-sleep-1', q: 'What makes premium sleep gummies better than traditional sleeping tablets?', a: 'High-quality sleep gummies offer faster sublingual absorption than hard compressed pills, are easy to digest, chewable, taste great, and remove the need to swallow bulky capsules before bed.', cat: 'category-sleep-gummies', order: 1},
    {_id: 'faq-sleep-2', q: 'Are magnesium gummies for sleep a good alternative to melatonin?', a: 'Yes. Magnesium gummies for sleep target muscle relaxation and nervous-system calm by regulating neurotransmitters \u2014 an ideal non-hormonal pathway to falling asleep naturally.', cat: 'category-sleep-gummies', order: 2},
    {_id: 'faq-sleep-3', q: 'Can I order sleep gummies for kids safely on this platform?', a: 'Yes. We only source pediatric-approved, low-dosage brands focused on safe, non-habit-forming ingredients like chamomile, L-theanine, and low-dose botanical extracts.', cat: 'category-sleep-gummies', order: 3},
    {_id: 'faq-sleep-4', q: 'How can I place a bulk B2B business order for sleeping gummies uk?', a: 'Commercial entities can navigate straight to our integrated Wholesale page or select the business tier pricing options on our product listings. We provide immediate bulk price adjustments and prioritize all business orders with same-day priority dispatch.', cat: 'category-sleep-gummies', order: 4},
    {_id: 'faq-lemme-1', q: 'How do I know the Lemme gummies on your site are authentic?', a: 'We source from verified, authorized distributors and import in secure batches. Every jar features its original security seal, production batch codes, and clear expiration dating, ensuring 100% authenticity.', cat: 'category-lemme-gummies', order: 1},
    {_id: 'faq-lemme-2', q: 'Can I buy Lemme Sleep gummies in bulk for commercial resale?', a: 'Yes. We run a fully integrated B2B wholesale division supplying retail stores, beauty bars, and online storefronts across the UK and Ireland. Register your business to view tier-one bulk discounts.', cat: 'category-lemme-gummies', order: 2},
    {_id: 'faq-lemme-3', q: 'What makes the Lemme Purr formula so distinct?', a: 'Lemme Purr delivers a targeted clinical dose of Bacillus coagulans, scientifically tested to survive stomach acid and support a healthy vaginal pH balance and thriving microbiome.', cat: 'category-lemme-gummies', order: 3},
    {_id: 'faq-natrol-1', q: 'Why is Natrol considered the top brand for melatonin gummies?', a: 'Natrol is America\u2019s #1 melatonin manufacturer, known for drug-free, non-GMO, gelatin-free pectin formulas that dissolve beautifully and absorb fast, mimicking your body\u2019s own circadian sleep regulators.', cat: 'category-natrol-gummies', order: 1},
    {_id: 'faq-natrol-2', q: 'Can I place a bulk B2B order for Natrol melatonin gummies?', a: 'Absolutely. We are the premier commercial B2B supplier for international wellness brands in the UK and Ireland, offering top-tier bulk price cuts, tax-compliant invoicing, and priority same-day shipping.', cat: 'category-natrol-gummies', order: 2},
    {_id: 'faq-natrol-3', q: 'How fast will my order arrive if I live in Ireland or the UK?', a: 'Every retail and business order is handled with priority. Standard tracked delivery guarantees arrival within 48 hours, with premium same-day options for urgent corporate orders.', cat: 'category-natrol-gummies', order: 3},
  ]

  console.log('Seeding category FAQ items...')
  const faqsByCat = {}
  for (const f of categoryFaqs) {
    await client.createOrReplace({
      _id: f._id,
      _type: 'faqItem',
      question: f.q,
      answer: faqAnswer(f.a),
      category: 'Products',
      order: f.order,
      isActive: true,
      productCategories: [{_type: 'reference', _ref: f.cat, _key: key()}],
    })
    ;(faqsByCat[f.cat] ||= []).push(f._id)
  }
  for (const cat of categories) {
    const ids = faqsByCat[cat._id] || []
    await client
      .patch(cat._id)
      .set({categoryFaqItems: ids.map((id) => ({_type: 'reference', _ref: id, _key: key()}))})
      .commit()
  }
  // Cross-link related categories
  const catRefs = {
    'category-sleep-gummies': ['category-natrol-gummies', 'category-lemme-gummies'],
    'category-lemme-gummies': ['category-sleep-gummies', 'category-natrol-gummies'],
    'category-natrol-gummies': ['category-sleep-gummies', 'category-lemme-gummies'],
  }
  for (const [id, refs] of Object.entries(catRefs)) {
    await client
      .patch(id)
      .set({relatedCategories: refs.map((r) => ({_type: 'reference', _ref: r, _key: key()}))})
      .commit()
  }

  // ── Homepage ────────────────────────────────────────────────────────────
  console.log('Seeding homepage...')
  await client.createOrReplace({
    _id: 'ff42da08-7a52-4d28-9f62-016a68ca4167',
    _type: 'homePage',
    seoTitle: 'Melatonin Gummies UK: Buy Premium Sleep & Vitamin Gummies Online',
    seoDescription:
      'Order top-quality melatonin gummies in the UK and Ireland. Buy the best sleep, Lemme, and Natrol gummies at the lowest market prices with fast 48h shipping and priority same-day delivery. Shop retail or bulk wholesale now!',
    seoKeywords: ['melatonin gummies', 'melatonin gummies uk', 'sleep gummies', 'lemme gummies', 'natrol gummies', 'melatonin gummies wholesale'],
    heroBadge: 'melatoningummiesuk.com',
    heroHeading: 'Melatonin Gummies UK: Order Premium Sleep and Wellness Brands Online',
    heroSubheading:
      'Buy top-rated melatonin, Natrol, and Lemme vitamin gummies with guaranteed 48-hour priority delivery across the UK & Ireland.',
    heroPrimaryCtaLabel: 'Shop Products',
    heroPrimaryCtaHref: '/products',
    heroSecondaryCtaLabel: 'Wholesale Inquiry',
    heroSecondaryCtaHref: '/wholesale',
    trustStripItems: [
      {_type: 'homeTrustItem', _key: key(), title: '48h Tracked Delivery', accent: 'cyan', iconKey: 'truck'},
      {_type: 'homeTrustItem', _key: key(), title: 'Lab-Verified Authentic Stock', accent: 'purple', iconKey: 'badgeCheck'},
      {_type: 'homeTrustItem', _key: key(), title: 'UK & Ireland Fulfilment', accent: 'cyan', iconKey: 'shieldCheck'},
      {_type: 'homeTrustItem', _key: key(), title: 'Priority Same-Day Dispatch', accent: 'purple', iconKey: 'calendarCheck2'},
      {_type: 'homeTrustItem', _key: key(), title: 'Retail & Wholesale Support', accent: 'cyan', iconKey: 'headset'},
    ],
    featuredCategories: categories.map((c) => ({_type: 'reference', _ref: c._id, _key: key()})),
    categoriesEyebrow: 'Shop By Brand & Need',
    categoriesHeading: 'Shop by Category',
    categoriesDescription:
      'Explore our premium sleep, Lemme, and Natrol gummy collections built for both retail shoppers and B2B wholesale buyers.',
    categoriesEmptyMessage: 'No homepage categories configured yet.',
    authorityEyebrow: 'Premium Retail & Bulk B2B Distribution',
    authorityHeading: 'Melatonin gummies for sale with a 48-hour delivery guarantee.',
    authorityIntro:
      "Melatonin gummies are the UK's fastest-growing premium wellness trend, and at melatoningummiesuk.com we make it easier than ever to buy the absolute best sleep brands at unbeatably low prices. As the premier digital distributor for both B2C retail shoppers and B2B commercial wholesale buyers across the UK and Ireland, our storefront is fully stocked with the most popular vitamin brands, including elite selections from Lemme and Natrol.\n\n[[H2]]\n\nWhen searching for top-tier melatonin gummies for sale, sourcing authentic, certified inventory is critical for both individual health and commercial compliance. Our UK-based fulfilment infrastructure keeps thousands of authentic units ready for immediate dispatch, supporting local businesses, independent pharmacies, and wellness e-commerce stores with competitive pricing tiers that protect your margins.",
    authorityPoints: [
      {_type: 'homeAuthorityPoint', _key: key(), title: 'Authentic, lab-verified inventory', description: 'Every batch undergoes strict quality assurance so what is on the label matches what is inside the gummy.', iconKey: 'badgeCheck'},
      {_type: 'homeAuthorityPoint', _key: key(), title: '48-hour UK & Ireland delivery', description: 'A rapid fulfilment network serving England, Scotland, Wales, Northern Ireland, and the Republic of Ireland.', iconKey: 'truck'},
      {_type: 'homeAuthorityPoint', _key: key(), title: 'Tiered wholesale economics', description: 'Competitive bulk pricing on melatonin, sleep, Lemme, and Natrol lines that protect your retail margins.', iconKey: 'walletCards'},
      {_type: 'homeAuthorityPoint', _key: key(), title: 'Domestic, climate-controlled stock', description: 'Thousands of authentic units held in UK fulfilment hubs to sidestep international customs delays.', iconKey: 'shieldCheck'},
    ],
    authorityCtaLabel: 'Open wholesale catalog',
    authorityCtaHref: '/products',
    authorityImageAlt: 'Premium melatonin, sleep, Lemme, and Natrol gummies ready for UK & Ireland fulfilment',
    cryptoEyebrow: 'Payment Incentives',
    cryptoHeading: 'Pay with Crypto - Get 10% Off Instantly',
    cryptoDescription:
      'We accept BTC, ETH, and USDT for a 10% discount on qualified orders. Prefer Revolut? Receive 5% off with fast invoice turnaround.',
    cryptoCtaLabel: 'How It Works',
    cryptoCtaHref: '/how-to-buy',
    deliveryEyebrow: 'Rapid Fulfilment',
    deliveryHeading: '48-Hour Tracked Delivery Across the UK & Ireland',
    deliveryDescription:
      'Place your order before our daily cutoff and items are packaged and handed to our shipping partners within hours, with priority same-day dispatch available for commercial buyers.',
    deliveryCtaLabel: 'Shipping & Delivery',
    deliveryCtaHref: '/shipping',
    howToBadge: 'Simple Process',
    howToHeading: 'How to Order',
    howToIntro: 'Ordering is built for speed and predictable fulfilment across retail and B2B wholesale.',
    howToSteps: [
      {_type: 'homeHowToStep', _key: key(), title: 'Browse and Select', description: 'Explore melatonin, sleep, Lemme, and Natrol gummies by brand and strength.', iconKey: 'search'},
      {_type: 'homeHowToStep', _key: key(), title: 'Place Your Order', description: 'Order retail jars or request bulk B2B wholesale pricing via our form.', iconKey: 'send'},
      {_type: 'homeHowToStep', _key: key(), title: 'Fast Dispatch', description: 'Orders placed before the daily cutoff are packaged and handed to couriers within hours.', iconKey: 'mail'},
      {_type: 'homeHowToStep', _key: key(), title: '48h Tracked Delivery', description: 'Receive tracked shipments within 48 hours across the UK and Ireland.', iconKey: 'packageCheck'},
    ],
    howToCtaLabel: 'Start Your Order',
    howToCtaHref: '/wholesale-request',
    wholesaleMidEyebrow: 'Wholesale Partners',
    wholesaleMidHeading: 'Built for Retailers Scaling Fast',
    wholesaleMidDescription:
      'Join our B2B wholesale programme for authentic inventory, deep volume discounts, and priority same-day dispatch across the UK and Ireland.',
    wholesaleMidCtaLabel: 'Apply for Wholesale',
    wholesaleMidCtaHref: '/wholesale',
    brandsEyebrow: 'Brand Partners',
    brandsHeading: 'Brands We Carry',
    brandsEmptyMessage: 'No homepage brands configured yet.',
    testimonialsBadge: 'Trusted by Buyers',
    testimonialsHeading: 'Trusted by Thousands',
    testimonialsIntro:
      'Real feedback from retail shoppers and wholesale partners who order melatonin and wellness gummies from us.',
    blogEyebrow: 'Latest Insights',
    blogHeading: 'From the Blog',
    blogDescription: 'Sleep science, dosage guidance, and brand deep-dives for melatonin and wellness gummy shoppers.',
    blogEmptyMessage: 'Blog posts will appear here once published in Sanity.',
    blogViewAllLabel: 'View All Posts',
    faqEyebrow: 'Related FAQs',
    faqHeading: 'Authenticity, strengths, bulk pricing & delivery guarantees',
    faqDescription:
      'Straight answers on buying authentic melatonin gummies, available strengths, B2B wholesale ordering, and our 48-hour UK & Ireland shipping guarantee.',
    faqViewAllLabel: 'View full FAQ page',
    complianceShopCtaLabel: 'Visit Shop',
    complianceShopCtaHref: '/products',
    complianceContactCtaLabel: 'Contact Sales Manager',
    complianceContactCtaHref: '/contact',
  })

  // ── Site settings ───────────────────────────────────────────────────────
  console.log('Seeding site settings...')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    announcementBar: 'Fast 48-hour tracked delivery across the UK & Ireland — priority same-day dispatch available.',
    announcementHref: '/shipping',
    footerWarningText:
      'Food supplements should not be used as a substitute for a varied, balanced diet and healthy lifestyle. Keep out of reach of children. Not suitable for pregnant or breastfeeding women.',
    footerComplianceText:
      'Melatonin Gummies UK operates as a personal-import and B2B distribution agent. Melatonin is classified as a prescription-only medicine in the UK & Ireland; orders are handled within applicable import provisions.',
    homepageBadge: 'Melatonin Gummies UK',
    homepageHeading: 'Melatonin Gummies UK: Order Premium Sleep and Wellness Brands Online',
    homepageSubheading:
      'Buy top-rated melatonin, Natrol, and Lemme vitamin gummies with guaranteed 48-hour priority delivery across the UK & Ireland.',
    homepageNextStepTitle: 'Shop Premium Sleep Brands',
    homepageNextStepDescription:
      'Browse melatonin, sleep, Lemme, and Natrol gummies for retail and B2B wholesale buyers across the UK and Ireland.',
  })

  // ── Wholesale page ──────────────────────────────────────────────────────
  console.log('Seeding wholesale page...')
  await client.createOrReplace({
    _id: 'wholesalePage',
    _type: 'wholesalePage',
    seoTitle: 'Melatonin Gummies Wholesale: Bulk B2B Supplier UK & Ireland',
    seoDescription:
      'Order wholesale melatonin gummies and premium sleep brands in bulk. Buy Lemme, Natrol, and sleep aid gummies at lowest B2B market prices with priority same-day dispatch. Apply now!',
    heroBadge: 'Bulk B2B Supply',
    heroHeading: 'Melatonin Gummies Wholesale: Premium Bulk B2B Supply and Distribution',
    heroSecondaryHeading: 'Apply for a Trade Account in Under Five Minutes',
    heroSubhead:
      'Buy high-margin sleep, Lemme, and Natrol gummies in bulk volume tiers with guaranteed low prices and rapid priority shipping across the UK & Ireland.',
    heroTrustLine1: 'Authentic master cases, tamper-evident seals',
    heroTrustLine2: '48-hour delivery or priority same-day dispatch',
    whyHeading: 'Melatonin Gummy Wholesale: Maximize Retail Margins with Premium Brands',
    whyIntro:
      'We act as the premier domestic distribution partner for independent pharmacies, wellness e-commerce stores, beauty salons, and large-scale retail stockists across the UK and the Republic of Ireland — eliminating customs tariffs and administrative delays of importing premium lines like Lemme and Natrol.',
    benefits: [
      {_type: 'wholesaleBenefit', _key: key(), title: 'Lowest wholesale prices', description: 'We buy directly from primary manufacturer production lines and pass maximum cost savings to your budget.', iconKey: 'badgePercent'},
      {_type: 'wholesaleBenefit', _key: key(), title: 'Authentic master cases', description: 'Original manufacturer cases with factory tamper-evident seals and verifiable batch numbers.', iconKey: 'package'},
      {_type: 'wholesaleBenefit', _key: key(), title: 'Deep volume tiers', description: 'Bulk price cuts trigger automatically at 500+ units and full-pallet quantities.', iconKey: 'boxes'},
      {_type: 'wholesaleBenefit', _key: key(), title: 'Tax-compliant invoicing', description: 'Download tax-compliant invoices instantly through our merchant portal.', iconKey: 'wallet'},
      {_type: 'wholesaleBenefit', _key: key(), title: 'Priority same-day dispatch', description: 'Business orders are prioritized with same-day handling to keep shelves stocked.', iconKey: 'truck'},
      {_type: 'wholesaleBenefit', _key: key(), title: 'Dedicated B2B support', description: 'Commercial onboarding and account management for trade partners.', iconKey: 'headphones'},
    ],
    howHeading: 'Bulk B2B Ordering Options: High-Demand Tiers and Premium Stock',
    howIntro: 'Our commercial catalog spans all primary product verticals so your purchase orders align with what your customers are actively searching for online.',
    steps: [
      {_type: 'wholesaleStep', _key: key(), title: 'Apply for Trade Account', description: 'Submit your company registration and VAT details via our wholesale form.', iconKey: 'fileText'},
      {_type: 'wholesaleStep', _key: key(), title: 'Get Approved Fast', description: 'Our onboarding team reviews and activates your account within one business hour.', iconKey: 'search'},
      {_type: 'wholesaleStep', _key: key(), title: 'Select Volume Tiers', description: 'Choose bulk tiers across sleep, Lemme, and Natrol lines with automatic discounts.', iconKey: 'boxes'},
      {_type: 'wholesaleStep', _key: key(), title: 'Priority Dispatch', description: 'Orders ship within 48 hours, with same-day priority for urgent freight.', iconKey: 'truck'},
    ],
    discountHeading: 'Trade Pricing & Volume Discounts',
    discountIntro: 'Approved trade accounts unlock tier-based bulk pricing across the full catalog.',
    paymentCardTitle: 'Flexible Trade Terms',
    paymentCardDescription: 'Approved trade accounts gain access to tier pricing and tax-compliant invoicing for smooth procurement.',
    cryptoRowLabel: 'Standard starter cartons',
    cryptoDiscountLabel: '24 units',
    revolutRowLabel: 'Deep volume cuts from',
    revolutDiscountLabel: '500+ units',
    volumeCardTitle: 'Volume Tiers',
    volumeCardDescription: 'Pricing improves automatically as your order volume grows.',
    volumeTiers: [
      {_type: 'volumeTier', _key: key(), tier: 'Starter — 24 units', note: 'Low entry threshold per product line.'},
      {_type: 'volumeTier', _key: key(), tier: 'Growth — 100+ units', note: 'Improved per-unit pricing for scaling stores.'},
      {_type: 'volumeTier', _key: key(), tier: 'Volume — 500+ units', note: 'Deeper wholesale volume price cuts.'},
      {_type: 'volumeTier', _key: key(), tier: 'Pallet — full cases', note: 'Best pricing for multi-pallet contract freight.'},
    ],
    discountSeeAlso: 'Custom contract pricing available for major retail chains.',
    formHeading: 'Apply for a Trade Account',
    formIntro: 'Tell us about your business and we will activate your wholesale profile.',
    wholesaleRequestPage: {
      badge: 'Trade Account',
      heading: 'Apply for a Priority Wholesale Trade Account',
      intro: 'Independent pharmacies, beauty bars, and online health stockists can register in under five minutes to unlock bulk pricing and priority shipping.',
      thankYouHeading: 'Application received',
      thankYouIntro: 'Our commercial onboarding team will review and activate your wholesale buying profile shortly.',
      thankYouNextStepsTitle: 'What happens next',
      thankYouUrgentHelpTitle: 'Need urgent help?',
      thankYouUrgentHelpBody: 'For time-sensitive bulk orders, email our wholesale desk and we will prioritize your request.',
      supportEmail: 'wholesale@melatoningummiesuk.com',
    },
    testimonialsHeading: 'Trusted by Trade Partners',
    testimonialsIntro: 'Feedback from pharmacies, beauty bars, and online retailers who stock with us.',
    faqHeading: 'Wholesale FAQs',
    faqIntro: 'Answers on MOQs, authenticity, cross-border delivery, and trade account setup.',
    faqs: [
      {_type: 'wholesaleFaq', _key: key(), question: 'What are the minimum order quantities (MOQs)?', answer: 'We offer a low entry threshold with standard starter cartons beginning at just 24 units per product line. Deeper volume price cuts trigger automatically at 500+ units and full-pallet quantities.'},
      {_type: 'wholesaleFaq', _key: key(), question: 'How do you verify brand authenticity of bulk stock?', answer: 'Every commercial delivery ships in original manufacturer master cases with factory tamper-evident seals, verifiable production batch numbers, and full certificates of analysis available on request.'},
      {_type: 'wholesaleFaq', _key: key(), question: 'Do you ship B2B orders to the Republic of Ireland without customs delays?', answer: 'Yes. We operate a specialized cross-border logistics pathway for the entire island of Ireland, settling customs clearances and trade tariffs on our side before shipping.'},
      {_type: 'wholesaleFaq', _key: key(), question: 'How can our retail business apply for a priority trade account?', answer: 'Click Apply for Trade Account, fill out your company registration and VAT details, and our onboarding team will review and activate your profile within one business hour.'},
    ],
  })

  // ── About page ──────────────────────────────────────────────────────────
  console.log('Seeding about page...')
  await client.createOrReplace(withImg({
    _id: 'aboutPage',
    _type: 'aboutPage',
    seoTitle: 'About Us: Premium Melatonin & Wellness Gummy Importers UK',
    seoDescription:
      'Learn how Melatonin Gummies UK became the trusted domestic gateway for premium global wellness brands in the UK and Ireland, bridging US manufacturers and European buyers.',
    pageHeading: 'About Us: Redefining Premium Wellness Sourcing for Europe',
    introLead:
      'We eliminate import friction to supply the UK and Ireland with leading, globally sought-after functional supplement brands — backed by climate-controlled domestic stock and 48-hour delivery.',
    storyHeading: 'Our Foundational Mission',
    storyBody: [
      p("When major global brands launch groundbreaking or viral functional supplements \u2014 such as Kourtney Kardashian's premium Lemme collection or Natrol's clinical-strength sleep formulations \u2014 shoppers and retailers in the UK and Ireland have historically faced a frustrating logistical barrier of exorbitant transatlantic freight, surprise customs duties, and multi-week delays."),
      p('Melatonin Gummies UK was established to dismantle that hurdle permanently. We operate as a premier domestic import and distribution network, taking on the complex burdens of international sourcing, customs clearance, and regulatory compliance to bridge the gap between premium global wellness manufacturers and the European market.'),
    ],
    storyImage: sleepImg,
    missionHeading: 'Our Mission',
    missionBody: [
      p('Deliver a premium retail and B2B experience for sleep and wellness gummies: authentic global brands, climate-controlled domestic stock, transparent pricing, and 48-hour fulfilment that aligns with how regulated wellness inventory moves across the UK and Ireland.'),
    ],
    teamHeading: 'Team & Operations',
    teamBody: [
      p('Account coordination, compliance review, and logistics work together under one operations model. We keep roles process-driven so you get consistent answers, faster quotes, and predictable dispatch timelines.'),
    ],
    stats: [
      {_key: key(), value: '10K+', label: 'Customers'},
      {_key: key(), value: '48H', label: 'Delivery'},
      {_key: key(), value: 'UK & IE', label: 'Coverage'},
      {_key: key(), value: '24', label: 'MOQ Units'},
    ],
    complianceHeading: 'Our Core Commitments',
    complianceIntro:
      "We don't operate as a standard middleman broker or a drop-shipping portal. We maintain concrete, end-to-end control over our product pipeline to offer a completely unified supply solution.",
    compliancePoints: [
      {_key: key(), title: 'Uncompromising brand authenticity', description: 'Every container ships with its original factory tamper-evident security seal, accurate batch numbers, and verifiable laboratory data. Zero tolerance for grey-market alternatives.'},
      {_key: key(), title: 'Climate-controlled storage', description: 'Every batch of pectin-based functional gummies is housed in domestic fulfilment centres with advanced climate controls to preserve active ingredients.'},
      {_key: key(), title: 'Absolute price transparency', description: 'We leverage bulk-purchasing power at the manufacturer level to absorb shipping tariffs and pass maximum savings to consumers and B2B partners.'},
    ],
    ctaLabel: 'Start Your Wholesale Order →',
    ctaHref: '/wholesale-request',
  }))

  // ── Contact page ────────────────────────────────────────────────────────
  console.log('Seeding contact page...')
  await client.createOrReplace({
    _id: 'contactPage',
    _type: 'contactPage',
    seoTitle: 'Contact Us: Customer Care & B2B Wholesale Accounts UK',
    seoDescription:
      'Reach our support team for order inquiries or connect directly with our commercial account managers to establish your corporate wholesale profile across the UK and Ireland.',
    pageHeading: 'Contact Our Customer Care and Enterprise B2B Support Teams',
    introLead:
      'Whether you need general retail assistance or rapid onboarding for a tier-one bulk commercial trade profile, our team will route your request to the right specialist.',
    formHeading: 'Send us a message',
    formIntro: 'Complete the form below. For faster service, include your order receipt number or company registration index.',
    nameFieldLabel: 'Full name',
    emailFieldLabel: 'Email address',
    subjectFieldLabel: 'Subject',
    messageFieldLabel: 'Message',
    submitButtonLabel: 'Send message',
    subjectOptions: [
      {_key: key(), value: 'general', label: 'General question'},
      {_key: key(), value: 'order', label: 'Order & invoice'},
      {_key: key(), value: 'wholesale', label: 'Wholesale / B2B'},
      {_key: key(), value: 'logistics', label: 'Freight & logistics'},
    ],
    successTitle: 'Message received',
    successMessage:
      'Thanks for contacting Melatonin Gummies UK. A team member will follow up soon. If your request is urgent, reply to your confirmation email.',
    detailsHeading: 'Contact details',
    contactEmail: 'support@melatoningummiesuk.com',
    businessHours: 'Monday–Friday: 08:30 – 17:30 GMT (excluding UK bank holidays)\nWholesale onboarding reviewed within 1 business hour',
    responsePromise: 'We respond within 24 hours (retail) and within 1 business hour (wholesale)',
    paymentsNote: 'Approved trade accounts can access tier-based bulk pricing and tax-compliant invoicing.',
  })

  // ── Compliance page ─────────────────────────────────────────────────────
  console.log('Seeding compliance page...')
  await client.createOrReplace({
    _id: 'compliancePage',
    _type: 'compliancePage',
    title: 'Legality, Compliance, and Cross-Border Operational Policies',
    description:
      'Review the exact legislative framework, domestic import protocols, and compliance standards governing the distribution of wellness formulas in the UK & Ireland.',
    sections: [
      {
        _type: 'legalSection',
        _key: key(),
        title: 'Structural Overview of Our Compliance Operations',
        paragraphs: [
          'Operating a secure, transparent, and legally sound supply pipeline is the bedrock of our business. Because functional wellness formulations, vitamins, and specialized herbal complexes are subject to rigorous public health oversight, our internal compliance department continuously audits all inventory against the latest domestic legal standards.',
          'We take full ownership of the international trade declarations, chemical evaluations, and ingredient profiling required to ensure every product distributed from our hubs conforms to local market laws.',
        ],
      },
      {
        _type: 'legalSection',
        _key: key(),
        title: '1. Food Standards Agency (FSA) & EFSA Compliance',
        paragraphs: [
          'All active herbal extracts, adaptogens, and wellness elements (such as Ashwagandha, L-Theanine, and Bacillus coagulans cultures) are cross-referenced against the UK Food Standards Agency and European Food Safety Authority databases. We ensure every item qualifies as a safe food supplement under the Food Safety Act and matches required labeling, nutrient declarations, and purity standards.',
        ],
      },
      {
        _type: 'legalSection',
        _key: key(),
        title: '2. Medicine Controls and Ingredient Classification',
        paragraphs: [
          'We strictly respect the boundary between daily wellness supplements and prescription-controlled compounds. In Ireland, authorized melatonin-containing products are classified as prescription-only medicines under the HPRA and statutory instrument S.I. No. 540/2003. Similarly, the UK MHRA treats pure melatonin as a medicinal substance rather than an over-the-counter dietary supplement.',
          "Because of this, our platform operates within an explicit personal-use import and B2B distribution paradigm. When a consumer places an order, our platform acts as their authorized direct-to-consumer logistics agent, handling the personal import framework, customs clearance declarations, and local delivery on the buyer's behalf.",
        ],
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

  // ── Homepage FAQ items + testimonials ───────────────────────────────────
  console.log('Seeding homepage FAQ items + testimonials...')
  const homeFaqs = [
    {_id: 'faq-home-authentic', q: 'Where can I buy authentic melatonin gummies in the UK safely?', a: 'You can buy authentic, laboratory-verified melatonin gummies safely online directly through melatoningummiesuk.com. We source genuine top-tier brands like Natrol and Lemme with secure UK-compliant transactions and fast 48-hour shipping across the UK and Ireland.', ctaLabel: 'Shop now', ctaHref: '/products', order: 1},
    {_id: 'faq-home-10mg', q: 'Can I order high-potency 10mg melatonin gummies on this website?', a: 'Yes. We offer maximum-strength 10mg melatonin gummies and other variants from leading global manufacturers for both consumer retail and commercial B2B wholesale orders.', order: 2},
    {_id: 'faq-home-wholesale', q: 'Do you provide bulk wholesale options for corporate or retail buyers?', a: 'Absolutely. We are a premier B2B supplier within the UK and Ireland. Commercial buyers can access deep volume discounts on all sleep brands, backed by priority same-day shipping guarantees.', ctaLabel: 'Wholesale account', ctaHref: '/wholesale', order: 3},
    {_id: 'faq-home-speed', q: 'How fast will my order arrive once placed?', a: 'All standard consumer and business orders are dispatched via our rapid delivery network, guaranteeing arrival within 48 hours, with priority same-day handling available for urgent orders.', ctaLabel: 'Shipping policy', ctaHref: '/shipping', order: 4},
  ]
  for (const f of homeFaqs) {
    await client.createOrReplace({
      _id: f._id,
      _type: 'faqItem',
      question: f.q,
      answer: faqAnswer(f.a),
      category: 'General',
      order: f.order,
      isActive: true,
      ...(f.ctaLabel ? {ctaLabel: f.ctaLabel, ctaHref: f.ctaHref} : {}),
    })
  }

  const testimonials = [
    {_id: 'testimonial-amelia', name: 'Amelia R.', role: 'Verified Customer', location: 'London, UK', quote: 'Genuine Natrol gummies delivered in two days. The seals were intact and the whole order felt completely trustworthy.', sortOrder: 1},
    {_id: 'testimonial-sean', name: 'Sean O.', role: 'Pharmacy Owner', location: 'Dublin, Ireland', quote: 'Finally a domestic supplier for Lemme and Natrol with no customs headaches. The wholesale margins keep our shelves moving.', sortOrder: 2},
    {_id: 'testimonial-priya', name: 'Priya K.', role: 'Online Health Retailer', location: 'Manchester, UK', quote: 'Reliable 48-hour dispatch and authentic stock every time. Their B2B team activated our trade account within the hour.', sortOrder: 3},
  ]
  for (const t of testimonials) {
    await client.createOrReplace({
      _id: t._id,
      _type: 'testimonial',
      name: t.name,
      role: t.role,
      location: t.location,
      quote: t.quote,
      rating: 5,
      placements: ['homepage', 'wholesale'],
      sortOrder: t.sortOrder,
      isActive: true,
    })
  }

  // ── Wholesale form config ─────────────────────────────────────────────────
  console.log('Seeding wholesale form config...')
  await client.createOrReplace({
    _id: 'wholesaleFormConfig',
    _type: 'wholesaleFormConfig',
    productInterestCategories: categories.map((c) => ({_type: 'reference', _ref: c._id, _key: key()})),
    estimatedOrderValues: [
      {_key: key(), rangeLabel: '£500 - £1,500', rangeValue: 'range-500', sortOrder: 0},
      {_key: key(), rangeLabel: '£1,500 - £5,000', rangeValue: 'range-1500', sortOrder: 1},
      {_key: key(), rangeLabel: '£5,000 - £10,000', rangeValue: 'range-5000', sortOrder: 2},
      {_key: key(), rangeLabel: '£10,000+', rangeValue: 'range-10000', sortOrder: 3},
    ],
    paymentMethods: [
      {_key: key(), label: 'Bank Transfer (BACS)', methodValue: 'bank', helpText: 'Tax-compliant invoicing for trade accounts', sortOrder: 0},
      {_key: key(), label: 'Revolut Business', methodValue: 'revolut', helpText: 'Fast settlement for UK & Ireland buyers', sortOrder: 1},
      {_key: key(), label: 'Card / Invoice on Account', methodValue: 'invoice', helpText: 'Available for approved trade partners', sortOrder: 2},
    ],
    formLabels: {
      businessNameLabel: 'Business Name',
      businessNameHelp: 'Your company or business name',
      contactNameLabel: 'Contact Name',
      contactNameHelp: 'Primary contact person',
      emailLabel: 'Email Address',
      emailHelp: 'We\u2019ll send confirmation to this address',
      phoneLabel: 'Phone Number',
      phoneHelp: 'Your business or personal phone number',
      countryStateLabel: 'Country / Region',
      countryStateHelp: 'UK, Ireland, or other location',
      productInterestsLabel: 'Product Interests',
      productInterestsHelp: 'Select at least one category (Sleep, Lemme, Natrol)',
      orderValueLabel: 'Estimated Order Value',
      orderValueHelp: 'Your typical wholesale order range',
      paymentMethodLabel: 'Preferred Payment Method',
      paymentMethodHelp: 'How you\u2019d prefer to pay',
      notesLabel: 'Additional Notes (Optional)',
      notesHelp: 'SKU preferences, timeline, delivery windows, etc.',
      submitButtonText: 'Submit Wholesale Inquiry',
    },
  })

  // ── Shop page filters ─────────────────────────────────────────────────────
  console.log('Seeding shop page...')
  await client.createOrReplace({
    _id: '1e60b814-d8d6-41ff-93f8-79daffccc974',
    _type: 'shopPage',
    categories: categories.map((c) => ({_type: 'reference', _ref: c._id, _key: key()})),
    priceRange: {min: 5, max: 60},
    puffRange: {min: 0, max: 100},
    types: ['Disposable'],
  })

  // ── Test products (B2C checkout) ────────────────────────────────────────
  console.log('Seeding test products...')
  await client.createOrReplace({
    _id: 'brand-natrol',
    _type: 'brand',
    name: 'Natrol',
    slug: {_type: 'slug', current: 'natrol'},
    shortDescription: "America's #1 melatonin brand — clinical-strength sleep gummies.",
    isActive: true,
    sortOrder: 10,
  })
  await client.createOrReplace({
    _id: 'brand-sleep-well',
    _type: 'brand',
    name: 'Sleep Well',
    slug: {_type: 'slug', current: 'sleep-well'},
    shortDescription: 'Premium UK-formulated sleep and melatonin gummies.',
    isActive: true,
    sortOrder: 20,
  })

  const productVariant = ({name, sku, flavor, packSize, price, compareAtPrice, isDefault = false}) => ({
    _key: key(),
    _type: 'productVariant',
    name,
    sku,
    flavor,
    packSize,
    price,
    compareAtPrice,
    stockQty: 200,
    isDefault,
    isActive: true,
  })

  await client.createOrReplace(withImg({
    _id: 'product-natrol-melatonin-10mg',
    _type: 'product',
    name: 'Natrol Melatonin Gummies 10mg',
    slug: {_type: 'slug', current: 'natrol-melatonin-gummies-10mg'},
    brand: {_type: 'reference', _ref: 'brand-natrol'},
    category: {_type: 'reference', _ref: 'category-natrol-gummies'},
    productType: 'Disposable',
    shortDescription: 'Drug-free, non-GMO berry melatonin gummies — 10mg per serving, 60 count jar.',
    description: [p('Natrol Melatonin Gummies help you fall asleep faster and stay asleep longer. Each serving delivers 10mg of melatonin in a delicious berry flavour.')],
    variants: [productVariant({name: 'Berry • 60 Count', sku: 'NAT-10-60', flavor: 'Berry', packSize: '60 Count', price: 14.99, compareAtPrice: 18.99, isDefault: true})],
    images: natrolImg ? [natrolImg] : undefined,
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    publishedAt: new Date().toISOString(),
    seoTitle: 'Natrol Melatonin Gummies 10mg — Buy Online UK',
    seoDescription: 'Order authentic Natrol 10mg melatonin gummies with fast UK delivery. 60-count berry jar.',
  }))

  await client.createOrReplace(withImg({
    _id: 'product-sleep-well-melatonin-5mg',
    _type: 'product',
    name: 'Sleep Well Melatonin Gummies 5mg',
    slug: {_type: 'slug', current: 'sleep-well-melatonin-gummies-5mg'},
    brand: {_type: 'reference', _ref: 'brand-sleep-well'},
    category: {_type: 'reference', _ref: 'category-sleep-gummies'},
    productType: 'Disposable',
    shortDescription: 'Gentle 5mg melatonin gummies with chamomile — ideal for everyday sleep support, 30 count.',
    description: [p('Sleep Well Melatonin Gummies combine 5mg melatonin with chamomile extract for a calm bedtime routine.')],
    variants: [productVariant({name: 'Mixed Berry • 30 Count', sku: 'SW-5-30', flavor: 'Mixed Berry', packSize: '30 Count', price: 9.99, compareAtPrice: 12.99, isDefault: true})],
    images: sleepImg ? [sleepImg] : undefined,
    isActive: true,
    isFeatured: true,
    isBestSeller: false,
    publishedAt: new Date().toISOString(),
    seoTitle: 'Sleep Well Melatonin Gummies 5mg — Buy Online UK',
    seoDescription: 'Buy Sleep Well 5mg melatonin gummies with chamomile. 30-count mixed berry jar, fast UK delivery.',
  }))

  console.log('\nSeed complete. Documents created/updated for project 8fp9giy6.')
}

main().catch((err) => {
  console.error('Seed failed:', err?.message || err)
  if (err?.response?.body) console.error(JSON.stringify(err.response.body, null, 2))
  process.exitCode = 1
})
