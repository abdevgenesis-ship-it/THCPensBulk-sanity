import 'dotenv/config'
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'as9s0n0w',
  dataset: 'production',
  apiVersion: '2025-03-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function rng() {
  return Math.random().toString(36).slice(2, 9)
}

function blocks(...texts: string[]) {
  return texts.map((text) => ({
    _type: 'block' as const,
    _key: `b${rng()}`,
    style: 'normal',
    markDefs: [] as never[],
    children: [{_type: 'span' as const, _key: `s${rng()}`, marks: [] as never[], text}],
  }))
}

async function upsert(doc: Record<string, unknown>) {
  const result = await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0])
  console.log(`  ✅ ${result._type} (${result._id})`)
  return result
}

async function seed() {
  console.log('🌱 Seeding THCPensBulk content into Sanity…\n')

  // ─── 1. Site Settings ────────────────────────────────────────────────────
  await upsert({
    _id: 'siteSettings',
    _type: 'siteSettings',
    announcementBar:
      'Fast 48-hour tracked delivery across the USA, UK & Worldwide — priority same-day dispatch available.',
    announcementHref: '/shipping',
    footerWarningText:
      'All products on THCPensBulk.com are intended strictly for distribution to licensed commercial business entities and adult consumers of legal age (21+). Not for sale to minors. Cannabinoids can affect blood pressure, heart rate, and intraocular pressure. Do not use if pregnant or nursing.',
    footerComplianceText:
      'THCPENSBULK operates as a B2B master distributor of hemp-derived vape hardware and legal cannabinoid products. All pre-filled products comply with the 2018 US Farm Bill (≤0.3% Delta-9 THC dry weight). Buyers are responsible for local compliance.',
    homepageBadge: 'THCPensBulk',
    homepageHeading: 'Bulk THC Vapes and Wholesale 510 Vape Carts for Global B2B Distribution',
    homepageSubheading:
      "Buy Premium THC Disposable Vape Pens and Hardware at the Market's Best Wholesale Prices with Guaranteed 48-Hour Priority Shipping.",
    homepageNextStepTitle: 'Shop Our Bulk Inventory',
    homepageNextStepDescription:
      'Browse bulk THC vapes, wholesale 510 carts, and hardware for B2B retailers and distributors across the USA, UK, and worldwide.',
  })

  // ─── 2. Home Page ────────────────────────────────────────────────────────
  await upsert({
    _id: 'ff42da08-7a52-4d28-9f62-016a68ca4167',
    _type: 'homePage',
    heroBadge: 'THCPensBulk.com',
    heroHeading: 'Bulk THC Vapes and Wholesale 510 Vape Carts for Global B2B Distribution',
    heroSubheading:
      "Buy Premium THC Disposable Vape Pens and Hardware at the Market's Best Wholesale Prices with Guaranteed 48-Hour Priority Shipping.",
    heroPrimaryCtaLabel: 'Shop Bulk THC Vapes',
    heroPrimaryCtaHref: '/category/bulk-thc-vapes',
    heroSecondaryCtaLabel: 'Apply for Wholesale',
    heroSecondaryCtaHref: '/wholesale',
    trustStripItems: [
      {_type: 'homeTrustItem', _key: 'trust-0', title: 'Guaranteed 48h Shipping', iconKey: 'truck', accent: 'cyan'},
      {_type: 'homeTrustItem', _key: 'trust-1', title: 'PACT Act Compliant', iconKey: 'shieldCheck', accent: 'purple'},
      {_type: 'homeTrustItem', _key: 'trust-2', title: 'Farm Bill Certified', iconKey: 'badgeCheck', accent: 'cyan'},
      {_type: 'homeTrustItem', _key: 'trust-3', title: 'Dedicated Account Managers', iconKey: 'headset', accent: 'purple'},
    ],
    categoriesEyebrow: 'Product Categories',
    categoriesHeading: 'Shop by Category',
    categoriesDescription: 'Browse our complete B2B bulk inventory by product type.',
    categoriesEmptyMessage: 'No categories available yet.',
    authorityEyebrow: 'Premium B2B Hardware Supply',
    authorityHeading: 'High-Margin Wholesale THC Vape Pens and Disposable Hardware',
    authorityIntro:
      'When it comes to sourcing a bulk THC vape or complete THC vape hardware wholesale arrays, consistency is the key differentiator for profitable operations. We supply major distributors with premium bulk THC pens and disposable THC vape pens wholesale units featuring state-of-the-art ceramic coil heating matrices and long-lasting rechargeable batteries.',
    authorityPoints: [
      {_type: 'homeAuthorityPoint', _key: 'ap-0', title: 'Zero-Leak Hardware', description: 'Medical-grade borosilicate glass and food-grade stainless steel construction with failure rates under 0.1%.', iconKey: 'badgeCheck'},
      {_type: 'homeAuthorityPoint', _key: 'ap-1', title: 'PACT Act Compliant Shipping', description: 'All US shipments fully documented with adult signature (21+) delivery via registered freight carriers.', iconKey: 'shieldCheck'},
      {_type: 'homeAuthorityPoint', _key: 'ap-2', title: 'Crypto Payment Savings', description: 'Pay with BTC, ETH, or USDT and save 10%. Revolut payments qualify for 5% off your invoice total.', iconKey: 'walletCards'},
      {_type: 'homeAuthorityPoint', _key: 'ap-3', title: 'Guaranteed 48-Hour Delivery', description: 'Every order ships within 48 hours. Same-day priority dispatch available for qualifying high-volume accounts.', iconKey: 'truck'},
    ],
    authorityCtaLabel: 'Browse All Products',
    authorityCtaHref: '/products',
    cryptoEyebrow: 'Payment Savings',
    cryptoHeading: 'Save With Crypto Payments',
    cryptoDescription:
      'Pay with cryptocurrency and save 10% on your wholesale order. Revolut payments qualify for 5% off. Savings stack with your quoted line.',
    cryptoCtaLabel: 'Apply for Wholesale',
    cryptoCtaHref: '/wholesale',
    deliveryEyebrow: 'Logistics',
    deliveryHeading: 'Guaranteed 48-Hour Priority Shipping',
    deliveryDescription:
      'Every order is packaged securely in heavy-duty commercial master boxes to eliminate damage during transit. Guaranteed 48-hour shipping with available same-day priority dispatch.',
    deliveryCtaLabel: 'View Shipping Policy',
    deliveryCtaHref: '/shipping',
    howToBadge: 'Simple B2B Ordering',
    howToHeading: 'How to Order in 4 Steps',
    howToIntro: 'From catalog browse to delivered inventory in four streamlined steps.',
    howToSteps: [
      {_type: 'homeHowToStep', _key: 'step-0', title: 'Browse', description: 'Explore our bulk THC vapes and 510 cart categories to find the right SKUs for your store or distribution channel.', iconKey: 'search'},
      {_type: 'homeHowToStep', _key: 'step-1', title: 'Submit', description: 'Send your business details, product interests, and estimated volume via our wholesale application form.', iconKey: 'send'},
      {_type: 'homeHowToStep', _key: 'step-2', title: 'Invoice', description: 'Receive a formal quote or invoice with payment options (crypto, Revolut, or other arrangements).', iconKey: 'packageCheck'},
      {_type: 'homeHowToStep', _key: 'step-3', title: 'Ship', description: 'Orders ship after confirmation with guaranteed 48-hour priority delivery and full tracking provided.', iconKey: 'packageCheck'},
    ],
    howToCtaLabel: 'Start Your Order',
    howToCtaHref: '/wholesale',
    wholesaleMidEyebrow: 'Master Case Supply',
    wholesaleMidHeading: 'Secure Master-Case Shipments and Box Quantities',
    wholesaleMidDescription:
      "For major operators scaling up their supply chains, we specialize in deep commercial distribution. Order THC oil cartridges wholesale or THC cartridges in bulk. Our platform provides clean, authentic product batches that safeguard your reputation and protect your margins.",
    wholesaleMidCtaLabel: 'Apply for Wholesale',
    wholesaleMidCtaHref: '/wholesale',
    brandsEyebrow: 'Top Brands',
    brandsHeading: 'Featured Brands',
    brandsEmptyMessage: 'No featured brands at this time.',
    testimonialsBadge: 'Verified Partners',
    testimonialsHeading: 'What Our B2B Partners Say',
    testimonialsIntro: 'Feedback from verified wholesale distributors and retailers.',
    blogEyebrow: 'Industry Insights',
    blogHeading: 'Latest from the Blog',
    blogDescription:
      'Stay updated with the latest in THC vape hardware, compliance news, and B2B distribution strategies.',
    blogEmptyMessage: 'No blog posts available yet.',
    blogViewAllLabel: 'View All Posts',
    faqEyebrow: 'Common Questions',
    faqHeading: 'Frequently Asked Questions',
    faqDescription: 'Quick answers on MOQ, international shipping, quality guarantees, and same-day delivery.',
    faqViewAllLabel: 'View All FAQs',
    complianceShopCtaLabel: 'Shop Products',
    complianceShopCtaHref: '/products',
    complianceContactCtaLabel: 'Contact Us',
    complianceContactCtaHref: '/contact',
    complianceDisclaimerPlain:
      'All products are intended for licensed B2B buyers and adult consumers (21+) only. Products comply with the 2018 US Farm Bill. Buyers are responsible for local compliance.',
    seoTitle: 'Bulk THC Vapes & Wholesale 510 Carts | THCPensBulk',
    seoDescription:
      'Bulk THC vapes, wholesale 510 carts, and disposable hardware for B2B distributors in the USA, UK, and worldwide. Enjoy best prices, premium brands, and guaranteed 48-hour priority shipping.',
  })

  // ─── 3. Wholesale Page ───────────────────────────────────────────────────
  await upsert({
    _id: 'wholesalePage',
    _type: 'wholesalePage',
    seoTitle: 'Wholesale THC Vapes & Bulk 510 Cartridges | THCPensBulk B2B',
    seoDescription:
      'Apply for our premium wholesale THC vapes and 510 cartridge program. Get master distributor pricing, tier discounts, and guaranteed 48-hour PACT-compliant shipping.',
    heroBadge: 'B2B Wholesale Program',
    heroHeading: 'Wholesale THC Vapes and Hardware Distribution Program for Verified Businesses',
    heroSecondaryHeading: 'Wholesale THC vapes account registration for professional retailers and distributors.',
    heroSubhead:
      "At THCPensBulk.com, our wholesale program is built on the pillars of Consistency, Quality, and Speed. We provide a streamlined B2B portal where you can buy wholesale THC vapes, 510 carts, and disposable hardware at manufacturer-direct pricing with guaranteed 48-hour priority shipping.",
    heroTrustLine1: 'PACT Act Compliant · Farm Bill Certified',
    heroTrustLine2: '48h Priority Shipping · Global Distribution',
    whyHeading: 'Why Partner With Us?',
    whyIntro:
      'Our wholesale partnership model is built for retailers and distributors who need depth, pricing discipline, and responsive logistics support.',
    benefits: [
      {_type: 'wholesaleBenefit', _key: 'ben-0', title: 'Manufacturer-Direct Pricing', description: 'We eliminate secondary broker fees, passing massive capital savings straight to your bottom line so you can offer competitive street pricing.', iconKey: 'badgePercent'},
      {_type: 'wholesaleBenefit', _key: 'ben-1', title: 'PACT Act Compliance', description: 'All shipments fully documented and compliant. Zero legal friction across all US states and international markets.', iconKey: 'shieldCheck'},
      {_type: 'wholesaleBenefit', _key: 'ben-2', title: 'Dedicated Account Managers', description: 'Every verified commercial client is assigned a dedicated B2B account manager to oversee orders from placement to final arrival.', iconKey: 'headphones'},
    ],
    howHeading: 'How It Works',
    howIntro: 'Four steps from catalog browse to delivered inventory.',
    steps: [
      {_type: 'wholesaleStep', _key: 'ws-0', title: 'Browse', description: 'Explore our bulk THC vape and 510 cart categories and SKUs that fit your store or distribution channel.', iconKey: 'search'},
      {_type: 'wholesaleStep', _key: 'ws-1', title: 'Submit', description: 'Send your business details, product interests, and estimated volume via the wholesale application form below.', iconKey: 'send'},
      {_type: 'wholesaleStep', _key: 'ws-2', title: 'Invoice', description: 'Receive a formal quote or invoice with payment options (crypto, Revolut, or other).', iconKey: 'fileText'},
      {_type: 'wholesaleStep', _key: 'ws-3', title: 'Ship', description: 'Orders ship after confirmation with guaranteed 48-hour priority delivery and full tracking for all shipments.', iconKey: 'truck'},
    ],
    discountHeading: 'Discount Structure',
    discountIntro: 'Savings stack with your quoted line — your invoice reflects the method you confirm at checkout.',
    paymentCardTitle: 'Payment Method Savings',
    paymentCardDescription: 'Applied to qualifying wholesale orders at invoice.',
    cryptoRowLabel: 'Cryptocurrency (BTC, ETH, USDT)',
    cryptoDiscountLabel: '10% off',
    revolutRowLabel: 'Revolut',
    revolutDiscountLabel: '5% off',
    volumeCardTitle: 'Optional Volume Tiers',
    volumeCardDescription: 'Illustrative brackets — exact pricing is quote-based.',
    volumeTiers: [
      {_type: 'volumeTier', _key: 'vt-0', tier: '$750 – $2K', note: 'Entry MOQ — full category mix'},
      {_type: 'volumeTier', _key: 'vt-1', tier: '$2K – $5K', note: 'Improved line-sheet pricing on select brands'},
      {_type: 'volumeTier', _key: 'vt-2', tier: '$5K – $10K', note: 'Priority allocation on high-demand SKUs'},
      {_type: 'volumeTier', _key: 'vt-3', tier: '$10K+', note: 'Custom brackets — ask your account manager'},
    ],
    formHeading: 'Apply for Wholesale Access',
    formIntro: 'Prefer a dedicated page? Use the',
    wholesaleRequestPage: {
      badge: 'Wholesale Application',
      heading: 'B2B Wholesale Application',
      intro: 'Complete the form and our team will follow up with pricing and onboarding steps.',
      thankYouHeading: 'Thanks, your inquiry is in.',
      thankYouIntro:
        'Our B2B team will review your request and typically reply within one business day with pricing and onboarding steps.',
      thankYouNextStepsTitle: 'Next Steps',
      thankYouUrgentHelpTitle: 'Need Urgent Help?',
      thankYouUrgentHelpBody: 'Email us and reference your business name.',
      supportEmail: 'sales@thcpensbulk.com',
    },
    testimonialsHeading: 'Wholesale Buyer Testimonials',
    testimonialsIntro: 'Feedback from verified wholesale partners.',
    faqHeading: 'Wholesale FAQ',
    faqIntro: 'Quick answers on MOQ, terms, payments, shipping, and compliance.',
    faqs: [
      {_type: 'wholesaleFaq', _key: 'wf-0', question: 'How do I open a commercial B2B account with THCPensBulk?', answer: 'To gain full access to our tiered wholesale pricing matrices and place orders, you must complete our digital B2B application form. Businesses must provide a valid state retail sales permit, tobacco/vape license, or international business identification number for compliance verification.'},
      {_type: 'wholesaleFaq', _key: 'wf-1', question: 'What are your wholesale tier minimum order thresholds?', answer: 'Our master distribution pricing tiers are divided into three distinct volume categories. Our introductory entry-level tier starts with a very low minimum threshold designed for independent storefronts, while our deep master-pallet tiers offer maximized price breaks for regional distribution brokers.'},
      {_type: 'wholesaleFaq', _key: 'wf-2', question: 'Are all your wholesale products fully PACT Act compliant for US shipping?', answer: 'Yes. We operate in strict compliance with all local and federal regulations, utilizing completely registered B2B freight networks that adhere to PACT Act shipping, tracking, and adult-signature delivery protocols. Your shipments travel fully documented and risk-free.'},
      {_type: 'wholesaleFaq', _key: 'wf-3', question: 'Can we arrange custom logistics for multi-state retail distribution?', answer: 'Absolutely. Our specialized commercial logistics team excels at managing complex, multi-destination split shipments for enterprise retail groups and regional chains. Speak directly with your dedicated account manager to establish a custom rolling delivery schedule.'},
    ],
  })

  // ─── 4. About Page ───────────────────────────────────────────────────────
  await upsert({
    _id: 'aboutPage',
    _type: 'aboutPage',
    seoTitle: 'About THCPensBulk | Master B2B Distributor of THC Vapes',
    seoDescription:
      'Learn how THCPensBulk became the leading master distributor of wholesale 510 carts and bulk THC vapes across the USA, UK, and international markets.',
    pageHeading: 'About THCPensBulk: Driving Global B2B Vape Hardware Distribution',
    introLead:
      'Empowering Retailers, Brands, and Regional Brokers with Manufacturer-Direct Pricing and Reliable 48-Hour Shipping Logistics.',
    storyHeading: 'Our Story',
    storyBody: blocks(
      "Founded by a dedicated network of legal hemp logistics experts and hardware engineers, THCPensBulk.com was built to solve the industry's biggest pain points: inconsistent product quality, hidden broker markups, and slow shipping times.",
      'Today, we stand as a premier global distribution hub, connecting licensed manufacturers directly with smoke shops, dispensaries, and master brokers throughout the USA, the UK, and international legal markets.',
    ),
    missionHeading: "Our Mission: Zero Friction, Maximum Profit Margins",
    missionBody: blocks(
      "Our business model is simple: we provide your brand with the market's highest-quality hardware at prices that allow your retail business to thrive. By maintaining direct equity stakes and exclusive partnerships with top-tier production facilities, we completely bypass traditional distribution middlemen.",
      'This allows us to pass deep, tier-one savings directly down to your supply chain, ensuring that whether you purchase a single box of THC pens or an entire pallet of bulk 510 vape cartridges, your cost per unit remains the lowest in the market.',
    ),
    teamHeading: 'Operations & Fulfillment',
    teamBody: blocks(
      'We operate fully optimized fulfillment hubs that guarantee 48-hour priority cargo shipping on all standard wholesale orders, alongside priority same-day dispatch and delivery routes for high-velocity operations.',
    ),
    stats: [
      {_key: 'stat-0', value: '48h', label: 'Guaranteed Shipping'},
      {_key: 'stat-1', value: '5,000+', label: 'SKUs Available'},
      {_key: 'stat-2', value: '<0.1%', label: 'Hardware Failure Rate'},
      {_key: 'stat-3', value: '3+', label: 'Global Markets'},
    ],
    complianceHeading: 'Built on Two Inflexible Core Guarantees',
    complianceIntro: 'Every product and shipment is backed by our uncompromising quality and fulfillment commitments.',
    compliancePoints: [
      {_key: 'cp-0', title: 'Uncompromised Hardware Quality', description: 'We strictly source hardware built with medical-grade borosilicate glass, food-grade stainless steel, and cutting-edge porous ceramic heating cores. Every batch is field-tested to ensure zero leakage, zero clogging, and failure rates well under 0.1%.'},
      {_key: 'cp-1', title: 'Fulfillment Speed', description: 'In the fast-moving B2B market, empty shelves mean lost revenue. We guarantee 48-hour priority cargo shipping on all standard wholesale orders, alongside priority same-day dispatch for high-velocity operations.'},
    ],
    ctaLabel: 'Apply for Wholesale',
    ctaHref: '/wholesale',
  })

  // ─── 5. Contact Page ─────────────────────────────────────────────────────
  await upsert({
    _id: 'contactPage',
    _type: 'contactPage',
    seoTitle: 'Contact Our B2B Sales & Support Team | THCPensBulk',
    seoDescription:
      'Get in touch with THCPensBulk. Connect with a dedicated B2B account manager for custom volume quotes, bulk pricing sheets, and global freight routing.',
    pageHeading: 'Contact the THCPensBulk Global B2B Distribution Desk',
    introLead:
      'Reach Out Directly to Open a Corporate Account, Secure Custom Volume Quotes, or Coordinate Priority Delivery Logistics.',
    formHeading: 'Send Us a Message',
    formIntro: 'Complete the form below and our team will respond within 2 business hours.',
    nameFieldLabel: 'Full Name',
    emailFieldLabel: 'Business Email',
    subjectFieldLabel: 'Subject',
    messageFieldLabel: 'Message',
    submitButtonLabel: 'Send Message',
    subjectOptions: [
      {_key: 'sub-0', value: 'wholesale-inquiry', label: 'Wholesale Inquiry'},
      {_key: 'sub-1', value: 'order-support', label: 'Order Support'},
      {_key: 'sub-2', value: 'custom-quote', label: 'Custom Volume Quote'},
      {_key: 'sub-3', value: 'compliance', label: 'Compliance & Documentation'},
      {_key: 'sub-4', value: 'general', label: 'General Question'},
    ],
    successTitle: 'Message Sent',
    successMessage:
      'Thank you for reaching out. A senior logistics coordinator will contact you within 2 business hours.',
    detailsHeading: 'Connect with Our Enterprise Sales Division',
    contactEmail: 'sales@thcpensbulk.com',
    contactPhone: '1-800-THC-BULK',
    businessHours: 'Mon–Fri, 9:00 AM – 6:00 PM EST',
    responsePromise: 'A senior logistics coordinator will call you back within 2 business hours.',
    paymentsNote:
      'For established corporate accounts and qualifying high-volume orders placed before 12:00 PM local warehouse time, same-day priority dispatch is available.',
  })

  // ─── 6. Compliance Page ──────────────────────────────────────────────────
  await upsert({
    _id: 'compliancePage',
    _type: 'compliancePage',
    title: 'Legality, Compliance, and Regulatory Frameworks',
    description:
      'Maintaining 100% PACT Act Compliance, Age Verification, and Farm Bill Adherence Across All Wholesale Channels.',
    sections: [
      {
        _type: 'legalSection',
        _key: 'cs-0',
        title: 'Overview',
        paragraphs: [
          'THCPensBulk.com operates in absolute alignment with all local, state, federal, and international laws governing the distribution of commercial vape hardware and hemp-derived cannabinoid extracts.',
          'We protect our commercial partners by implementing rigorous verification practices, ensuring that your inventory moves safely through customs, state borders, and domestic transit networks without legal friction.',
        ],
      },
      {
        _type: 'legalSection',
        _key: 'cs-1',
        title: 'Federal Adherence & The Farm Bill Framework',
        paragraphs: [
          'All pre-filled products, concentrates, and distillates distributed through our B2B catalog are fully derived from industrial hemp and contain a delta-9 THC concentration that does not exceed 0.3% on a dry-weight basis, in strict compliance with the Agricultural Improvement Act (2018 US Farm Bill).',
          'Every single batch is accompanied by an accessible, verifiable Certificate of Analysis (COA) from an independent, ISO-certified, third-party laboratory. These lab results confirm legal cannabinoid compliance, structural purity, and the total absence of harmful heavy metals, residual solvents, pesticides, or unauthorized cutting agents.',
        ],
      },
      {
        _type: 'legalSection',
        _key: 'cs-2',
        title: 'Mandatory B2B Buyer Prerequisites & Shipping Laws',
        bullets: [
          'Age Verification: We strictly enforce federal and regional age limits. We do not sell to consumers. All digital accounts must pass verification to prove they are a licensed commercial business entity selling to adults of legal age (21+).',
          'The PACT Act & Tobacco Compliance: For all domestic US shipments, we operate in full compliance with the Prevent All Cigarette Trafficking (PACT) Act. All wholesale shipments travel via registered, compliant commercial freight carriers, are fully reported to state tax authorities where required, and require an adult signature (21+) upon arrival.',
          'International Shipments (UK & Global): International buyers are responsible for knowing and adhering to their local customs regulations. We package all cross-border cargo in compliant, discreet master cases with accurate customs invoices to facilitate clean clearing pathways.',
        ],
      },
    ],
  })

  // ─── 7. Legal Content ────────────────────────────────────────────────────
  await upsert({
    _id: 'legalContent',
    _type: 'legalContent',
    supportEmail: 'support@thcpensbulk.com',
    pactActNotice:
      'THCPensBulk.com operates in full compliance with the Prevent All Cigarette Trafficking (PACT) Act. All wholesale shipments travel via registered, compliant commercial freight carriers, are fully reported to state tax authorities where required, and require an adult signature (21+) upon arrival.',
    nicotineWarning:
      'This product may contain nicotine. Nicotine is an addictive chemical. Not for sale to minors. 21+ age verification required.',
    thcWarning:
      'THC and cannabinoid alternative products are only available where legally permitted. All products comply with the 2018 US Farm Bill (≤0.3% Delta-9 THC dry weight). Customers are responsible for knowing and complying with local laws.',
    fdaDisclaimer:
      'These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.',
    privacyTitle: 'Privacy Policy',
    privacyDescription: 'THCPensBulk Privacy Policy — How we collect, use, and protect your personal information.',
    privacySections: [
      {_type: 'legalSection', _key: 'prv-0', title: '1. Introduction', paragraphs: ['THCPensBulk ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.']},
      {_type: 'legalSection', _key: 'prv-1', title: '2. Information We Collect', paragraphs: ['We collect information you provide directly to us, such as:'], bullets: ['Name and contact information (email, phone, address)', 'Business license and verification information', 'Payment and billing information', 'Order and shipping history', 'Communication preferences']},
      {_type: 'legalSection', _key: 'prv-2', title: '3. How We Use Your Information', paragraphs: ['We use collected information to:'], bullets: ['Process and fulfill your orders', 'Verify your age and business credentials', 'Send transactional emails (order confirmations, shipment updates)', 'Improve our website and services', 'Comply with PACT Act and applicable laws']},
      {_type: 'legalSection', _key: 'prv-3', title: '4. Data Security', paragraphs: ['We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.']},
      {_type: 'legalSection', _key: 'prv-4', title: '5. Contact Us', paragraphs: ['If you have questions about this Privacy Policy, please contact us at support@thcpensbulk.com.']},
    ],
    termsTitle: 'Terms of Service',
    termsDescription: 'THCPensBulk Terms of Service — Read our complete terms and conditions for purchasing and using our site.',
    termsSections: [
      {_type: 'legalSection', _key: 'trm-0', title: '1. Acceptance of Terms', paragraphs: ['By accessing and using this website, you accept and agree to be bound by these terms. This platform is for licensed B2B buyers only.']},
      {_type: 'legalSection', _key: 'trm-1', title: '2. Eligibility & Business Requirements', paragraphs: ['You must be a licensed commercial business entity and 21 years or older to purchase products from THCPensBulk. All accounts must pass business verification before orders are processed.']},
      {_type: 'legalSection', _key: 'trm-2', title: '3. Product Compliance', paragraphs: ['All pre-filled products comply with the 2018 US Farm Bill (≤0.3% Delta-9 THC dry weight). Buyers are solely responsible for compliance with local, state, and federal laws in their jurisdiction.']},
      {_type: 'legalSection', _key: 'trm-3', title: '4. Ordering & Payment', paragraphs: ['By placing an order, you warrant that you are a licensed business operator legally able to enter into binding contracts. We reserve the right to refuse or cancel any order at our sole discretion.']},
      {_type: 'legalSection', _key: 'trm-4', title: '5. Shipping & Delivery', paragraphs: ['Standard wholesale orders are dispatched with guaranteed 48-hour priority shipping. All domestic US shipments comply with PACT Act requirements including adult signature on delivery (21+).']},
      {_type: 'legalSection', _key: 'trm-5', title: '6. Contact & Disputes', paragraphs: ['For any questions or disputes regarding these terms, please contact us at support@thcpensbulk.com.']},
    ],
    refundsTitle: 'Refund Policy',
    refundsDescription: 'THCPensBulk Refund Policy — Learn about our return, exchange, and refund procedures for B2B orders.',
    refundsSections: [
      {_type: 'legalSection', _key: 'ref-0', title: 'Our Refund Policy', paragraphs: ['At THCPensBulk, we stand behind the quality of our products. Please read our refund and return policy carefully before making a purchase.']},
      {_type: 'legalSection', _key: 'ref-1', title: '1. Eligibility for Returns', paragraphs: ['Items may be returned within 30 days of delivery if:'], bullets: ['The item is unopened and in original, resellable condition', 'The original receipt or order confirmation is provided', 'The item is defective or damaged upon arrival', 'We made an error in your order']},
      {_type: 'legalSection', _key: 'ref-2', title: '2. Return Process', paragraphs: ['To initiate a return:'], ordered: ['Contact us at support@thcpensbulk.com with your order number', 'Obtain a return authorization number (RMA)', 'Ship the item back in original packaging', 'Refund will be processed within 7–10 business days of receipt']},
      {_type: 'legalSection', _key: 'ref-3', title: '3. Defective Items', paragraphs: ['If you receive a defective or damaged product, contact us within 7 days of delivery with photos or video evidence. We will replace the item at no cost or issue a full refund.']},
    ],
    agePolicyTitle: 'Age Verification & Mandatory Safety Warning',
    agePolicyDescription: 'Read our mandatory commercial safety disclaimer, age verification requirements, and product usage guidelines.',
    agePolicySections: [
      {_type: 'legalSection', _key: 'age-0', title: 'Mandatory Commercial Safety & Liability Disclaimer', paragraphs: ['All products available on THCPensBulk.com are intended strictly for distribution to licensed commercial business entities and adult consumers of legal age. They are not for sale to minors or individuals under the age of 21.']},
      {_type: 'legalSection', _key: 'age-1', title: 'Health & Safety Warnings', paragraphs: ['Cannabinoids can affect blood pressure, heart rate, and intraocular pressure. Consult a physician before use if you have a serious medical condition or use prescription medications. Do not use these products if you are pregnant or nursing. Products may cause drowsiness; do not operate heavy machinery or motor vehicles after consumption.']},
      {_type: 'legalSection', _key: 'age-2', title: 'Legal Compliance Responsibility', paragraphs: ['THCPensBulk does not sell pre-filled cannabis products containing over 0.3% Delta-9 THC to unauthorized regions. It is the sole responsibility of the wholesale buyer to ensure complete compliance with local county, state, or country regulations before placing a volume purchase order.']},
    ],
  })

  // ─── 8. Categories ───────────────────────────────────────────────────────
  await upsert({
    _id: 'category-bulk-thc-vapes',
    _type: 'category',
    name: 'Bulk THC Vapes',
    slug: {_type: 'slug', current: 'bulk-thc-vapes'},
    shortDescription:
      'Order High-Quality THC Disposable Wholesale Batches and Volume Master-Cases at the Absolute Lowest Market Prices.',
    description:
      'Bulk THC vapes are the fastest-growing sector in the legal hemp and cannabis markets, making them a crucial asset for profitable retail operations. At THCPensBulk.com, we stock an uncompromised collection of top-shelf disposable vape hardware, live resin systems, and high-potency distillates designed for high-volume B2B distributors in the USA, UK, and worldwide.',
    seoTitle: 'Bulk THC Vapes & Wholesale Disposable Vape Pens | THCPensBulk',
    seoDescription:
      'Buy bulk THC vapes and premium disposable vape pens at direct wholesale prices. Stock the top trending brands in the USA, UK, and globally. 48h priority shipping guaranteed.',
    categoryHeroEyebrow: 'Bulk THC Vapes',
    categoryHeroHeading: 'Bulk THC Vapes and Wholesale Disposable Pens for B2B Retailers',
    categoryHeroPrimaryCtaLabel: 'Apply for Wholesale',
    categoryHeroSecondaryCtaLabel: 'View All Products',
    categoryHeroFallbackDescription:
      'Buy bulk THC vapes and premium disposable vape pens at direct wholesale prices with guaranteed 48-hour priority shipping.',
    categoryFilterLabel: 'Filter Products',
    categoryFilterViewAllLabel: 'View All',
    categoryFilterLoadingMessage: 'Loading products…',
    categoryProductsHeadingTemplate: 'Bulk THC Vapes',
    categoryProductsEmptyMessage: 'No products available yet. Contact us for custom bulk orders.',
    categoryBestsellersEyebrow: 'Top Sellers',
    categoryBestsellersHeading: 'Best-Selling Bulk THC Vapes',
    categoryBestsellersDescription: 'Our most popular bulk THC vape products for B2B distributors.',
    categoryBestsellersViewAllLabel: 'View All',
    categoryFaqHeading: 'Frequently Asked Questions',
    categoryFaqDescription: 'Quick answers about bulk THC vape orders.',
    categoryFaqEmptyMessage: 'No FAQs available yet.',
    categoryCrossLinksHeading: 'Also Available',
    categoryCrossLinksDescription: 'Explore our other bulk product categories.',
    isActive: true,
    navOrder: 1,
    showInHeader: true,
  })

  await upsert({
    _id: 'category-bulk-510-carts',
    _type: 'category',
    name: 'Bulk 510 Carts',
    slug: {_type: 'slug', current: 'bulk-510-carts'},
    shortDescription:
      'Order Heavy-Volume 510 Cartridge Wholesale Packs and Premium Empty Glass and Ceramic Hardware at Unbeatable Commercial Prices.',
    description:
      "Bulk 510 carts remain the undisputed, universal standard for extract consumption, acting as an essential anchor for high-margin dispensary and smoke shop inventory. At THCPensBulk.com, we stock the market's most complete B2B collection of durable hardware, empty atomizers, and factory-sealed luxury cartridge options for high-volume distributors across the USA, UK, and international cannabis channels.",
    seoTitle: 'Bulk 510 Carts & Wholesale Vape Cartridges | THCPensBulk',
    seoDescription:
      'Buy bulk 510 carts, hardware, and premium empty or pre-filled vape cartridges at direct wholesale prices. Stock global b2b inventory. Guaranteed 48h priority shipping.',
    categoryHeroEyebrow: 'Bulk 510 Carts',
    categoryHeroHeading: 'Bulk 510 Carts and Wholesale Threaded Cartridges for Global B2B Supply',
    categoryHeroPrimaryCtaLabel: 'Apply for Wholesale',
    categoryHeroSecondaryCtaLabel: 'View All Products',
    categoryHeroFallbackDescription:
      'Buy bulk 510 carts and wholesale vape cartridges at direct manufacturer pricing with guaranteed 48-hour priority shipping.',
    categoryFilterLabel: 'Filter Products',
    categoryFilterViewAllLabel: 'View All',
    categoryFilterLoadingMessage: 'Loading products…',
    categoryProductsHeadingTemplate: 'Bulk 510 Carts',
    categoryProductsEmptyMessage: 'No products available yet. Contact us for custom bulk orders.',
    categoryBestsellersEyebrow: 'Top Sellers',
    categoryBestsellersHeading: 'Best-Selling Bulk 510 Carts',
    categoryBestsellersDescription: 'Our most popular bulk 510 cartridge products for B2B distributors.',
    categoryBestsellersViewAllLabel: 'View All',
    categoryFaqHeading: 'Frequently Asked Questions',
    categoryFaqDescription: 'Quick answers about bulk 510 cart orders.',
    categoryFaqEmptyMessage: 'No FAQs available yet.',
    categoryCrossLinksHeading: 'Also Available',
    categoryCrossLinksDescription: 'Explore our other bulk product categories.',
    isActive: true,
    navOrder: 2,
    showInHeader: true,
  })

  // ─── 9. FAQ Items ────────────────────────────────────────────────────────
  const faqs = [
    {
      _id: 'faq-moq',
      _type: 'faqItem',
      question: 'What is your minimum order quantity for bulk purchases?',
      answer: blocks(
        'To maintain our industry-low wholesale pricing structure and cover premium 48-hour shipping logistics, we enforce minimum order quantities on our master case selections. Please create a verified B2B account or contact our sales desk directly to review current low-tier minimums for specific bulk THC vapes and wholesale 510 carts.',
      ),
      category: 'Ordering',
      order: 10,
      isActive: true,
    },
    {
      _id: 'faq-intl-shipping',
      _type: 'faqItem',
      question: 'Do you offer international priority shipping to the UK?',
      answer: blocks(
        'Yes. We are global distribution experts specializing in safe, cross-border shipping across the USA, the UK, and international markets. All global shipments are packaged discreetly in heavy-duty commercial master boxes to ensure complete compliance and safe arrival.',
      ),
      category: 'Shipping',
      order: 20,
      isActive: true,
    },
    {
      _id: 'faq-quality-guarantee',
      _type: 'faqItem',
      question: 'How do you guarantee the quality of your THC vape hardware?',
      answer: blocks(
        'We offer only premier, tested brands that implement authentic medical-grade borosilicate glass, stainless steel elements, and advanced porous ceramic cores. This prevents burnt tastes, minimizes return rates, and provides a premium experience for the final retail consumer.',
      ),
      category: 'Products',
      order: 30,
      isActive: true,
    },
    {
      _id: 'faq-sameday',
      _type: 'faqItem',
      question: 'Can we secure same-day priority delivery for urgent restocks?',
      answer: blocks(
        'Absolutely. For established corporate accounts and qualifying high-volume orders placed before 12:00 PM local warehouse time, we can prioritize same-day dispatch and priority delivery. Standard wholesale orders are completely covered by our reliable 48-hour shipping guarantee.',
      ),
      category: 'Shipping',
      order: 40,
      isActive: true,
    },
    {
      _id: 'faq-thc-vapes-bulk',
      _type: 'faqItem',
      question: 'Why should I buy bulk THC vapes rather than smaller wholesale packs?',
      answer: blocks(
        'Buying in true bulk master-cases maximizes your profit margins by dropping your individual unit costs down to factory-direct levels. It also ensures you get the most out of your shipping costs and guarantees your top-selling strains and models stay consistently in stock.',
      ),
      category: 'THC',
      order: 50,
      isActive: true,
    },
    {
      _id: 'faq-510-ceramic',
      _type: 'faqItem',
      question: 'Why are full-ceramic 510 cartridges outperforming metal options?',
      answer: blocks(
        'Full-ceramic 510 cartridges eliminate metal contact paths, significantly reducing core oxidation while passing strict heavy-metals tests cleanly. The porous medical ceramic element also heats more uniformly, preserving organic terpene flavor profiles down to the last pull.',
      ),
      category: 'THC Carts',
      order: 60,
      isActive: true,
    },
    {
      _id: 'faq-pact-act',
      _type: 'faqItem',
      question: 'Are all your wholesale products fully PACT Act compliant for US shipping?',
      answer: blocks(
        'Yes. We operate in strict compliance with the Prevent All Cigarette Trafficking (PACT) Act. All wholesale shipments travel via registered, compliant commercial freight carriers, are fully reported to state tax authorities where required, and require an adult signature (21+) upon arrival.',
      ),
      category: 'Compliance',
      order: 70,
      isActive: true,
    },
    {
      _id: 'faq-farm-bill',
      _type: 'faqItem',
      question: 'Are your THC products compliant with the Farm Bill?',
      answer: blocks(
        'Yes. All pre-filled products distributed through our B2B catalog are fully derived from industrial hemp and contain a delta-9 THC concentration that does not exceed 0.3% on a dry-weight basis, in strict compliance with the 2018 Agricultural Improvement Act (US Farm Bill). Every batch includes a COA from an ISO-certified third-party laboratory.',
      ),
      category: 'Compliance',
      order: 80,
      isActive: true,
    },
  ]

  for (const faq of faqs) {
    await upsert(faq)
  }

  // ─── 10. Shipping Page ──────────────────────────────────────────────────
  await upsert({
    _id: 'shippingPage',
    _type: 'shippingPage',
    title: 'Shipping Policy',
    description: 'THCPensBulk shipping policy covering processing time, domestic and international delivery expectations, PACT Act compliance, and tracking guidance.',
    lastUpdated: '2026-06-01',
    sections: [
      {_type: 'legalSection', title: '1. Processing Time', paragraphs: ['Wholesale orders are typically reviewed, verified, and prepared within 24 to 48 hours on business days after payment confirmation.', 'During high-volume periods or compliance review checks, processing may take longer. Our team will notify you by email if timing changes.']},
      {_type: 'legalSection', title: '2. Domestic Shipping (USA)', paragraphs: ['We ship across eligible US regions using compliant carrier options that match destination requirements.', 'Estimated transit windows vary by region.'], bullets: ['Northeast and Southeast: commonly 2–4 business days after dispatch', 'Midwest and South Central: commonly 3–5 business days after dispatch', 'West Coast and remote regions: commonly 4–7 business days after dispatch']},
      {_type: 'legalSection', title: '3. International Shipping (UK & Worldwide)', paragraphs: ['International availability depends on destination regulations, carrier serviceability, and product restrictions.', 'Contact our team before ordering for country-specific guidance on permitted product categories and delivery windows.']},
      {_type: 'legalSection', title: '4. PACT Act Compliance', paragraphs: ['All applicable US shipments follow federal and state PACT Act requirements, including adult-signature (21+) delivery workflows and required reporting obligations where applicable.', 'Orders that do not satisfy compliance checks may be delayed, modified, or canceled.']},
      {_type: 'legalSection', title: '5. Restricted States and Products', paragraphs: ['Some product categories may be restricted in specific US states or local jurisdictions.', 'Buyers are responsible for confirming local rules before ordering. Orders that conflict with destination law cannot be fulfilled.'], bullets: ['THC-related products are limited to jurisdictions where sale and shipment are legally permitted', 'Adult signature and age verification remain mandatory for all restricted products', 'Destination restrictions are checked before fulfillment']},
      {_type: 'legalSection', title: '6. Tracking and Delivery Updates', paragraphs: ['Tracking details are sent once your order is dispatched. Use the provided carrier link to monitor shipment milestones.', 'If a package is delayed, returned, or undeliverable, contact support@thcpensbulk.com with your order details for assistance.']},
    ],
  })

  // ─── 11. MOQ Page ────────────────────────────────────────────────────────
  await upsert({
    _id: 'moqPage',
    _type: 'moqPage',
    title: 'Wholesale MOQ',
    description: 'Understand THCPensBulk minimum order requirements, mix-and-match rules, and practical examples for first and repeat wholesale orders.',
    heroTitle: 'What Is the Minimum Order Quantity for Wholesale THC Vapes?',
    heroIntro: 'Our minimum order quantity is 50 units per SKU. Volume price breaks apply from 200 units and 500+ units. Submit a wholesale inquiry to receive a proforma invoice within one business day.',
    lastUpdated: '2026-06-01',
    moqExamples: [
      {_type: 'object', title: 'Starter Order', totalBadge: '50 units', description: 'Minimum 50 units per SKU for first-time B2B buyers. Mix categories to test shelf velocity before scaling.'},
      {_type: 'object', title: 'Volume Tier', totalBadge: '200 units', description: 'Volume discount unlocks from 200 units per SKU. Reduced per-unit cost with fast 48-hour dispatch.'},
      {_type: 'object', title: 'Master Case', totalBadge: '500+ units', description: 'Best per-unit pricing on 500+ units. Preferred for high-volume dispensaries and smoke shop chains.'},
    ],
    sections: [
      {_type: 'legalSection', title: '1. Standard MOQ', paragraphs: ['THCPensBulk requires a minimum of 50 units per SKU for all B2B wholesale orders.', 'This minimum supports wholesale pricing integrity, stable fulfillment logistics, and dedicated account support for our B2B partners.']},
      {_type: 'legalSection', title: '2. Mix-and-Match Policy', paragraphs: ['You may combine eligible SKUs across our Bulk THC Vapes and Bulk 510 Carts categories to reach your order volume.', 'Final basket approval depends on destination compliance and product eligibility.'], bullets: ['Mix disposable vapes and 510 cartridges across compatible categories', 'Build trial assortments for first orders before scaling reorders', 'Contact our sales team for help balancing your initial inventory basket']},
      {_type: 'legalSection', title: '3. Volume Price Tiers', paragraphs: ['Starter tier: 50–199 units per SKU at standard wholesale pricing.', 'Volume tier: 200–499 units per SKU with reduced per-unit cost.', 'Master case tier: 500+ units per SKU at best available pricing.']},
      {_type: 'legalSection', title: '4. Payment and Invoice Timing', paragraphs: ['MOQ is validated before invoice finalization.', 'Eligible payment-method discounts (10% crypto, 5% Revolut) are applied during invoice confirmation.']},
    ],
  })

  // ─── 12. Locations Page ──────────────────────────────────────────────────
  await upsert({
    _id: 'locationsPage',
    _type: 'locationsPage',
    title: 'Locations & Coverage',
    description: 'See THCPensBulk wholesale coverage across the USA, UK, and approved international markets, with region-specific compliance notes.',
    heroTitle: 'Wholesale Shipping Locations and Coverage',
    heroIntro: 'We support B2B wholesale delivery across the USA, UK, and selected international destinations. Every order is reviewed against destination-specific compliance and product eligibility rules before dispatch.',
    lastUpdated: '2026-06-01',
    mapEmbedUrl: 'https://www.google.com/maps?q=United+States&output=embed',
    usStates: ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
    internationalCoverage: [
      {_type: 'object', title: 'United Kingdom', details: 'UK wholesale orders shipped via fully tracked, insured international freight. Compliance documentation provided.'},
      {_type: 'object', title: 'Europe', details: 'Case-by-case support for approved EU countries with documented import compliance and duty handling.'},
      {_type: 'object', title: 'Middle East & APAC', details: 'Distributor-led fulfillment available where customs and product rules allow. Contact us for eligibility.'},
    ],
    complianceNotes: [
      {_type: 'object', region: 'US Hemp/THC Orders', note: 'Availability varies by state. Buyers are responsible for local licensing, age-gating (21+), and shelf legality. PACT Act workflows applied where required.'},
      {_type: 'object', region: 'UK & International', note: 'Import approvals, duty structure, and SKU eligibility are validated before invoice confirmation. Buyers responsible for local import compliance.'},
    ],
    sections: [
      {_type: 'legalSection', title: '1. United States Coverage', paragraphs: ['THCPensBulk supports B2B wholesale shipping across all 50 US states for eligible product categories.', 'Transit times vary by carrier route, destination, and compliance workflow requirements.'], bullets: ['All shipments reviewed for destination eligibility before release', 'Adult-signature (21+) workflow applied where required', 'PACT Act compliant freight carriers used for all applicable orders']},
      {_type: 'legalSection', title: '2. UK & International Shipping', paragraphs: ['International orders ship via fully tracked and insured freight on approved lanes.', 'Customs, duty handling, and product-category legality must be confirmed before invoice finalization.'], bullets: ['UK wholesale shipments available with full compliance documentation', 'EU and APAC routing available for approved markets', 'Importer-of-record responsibilities remain with the buyer']},
      {_type: 'legalSection', title: '3. Regional Compliance Notes', paragraphs: ['State and local regulations can differ for THC-adjacent categories.', 'Buyers are responsible for confirming local rules, licensing requirements, and retail restrictions in their jurisdictions.']},
    ],
  })

  // ─── 13. Wholesale Form Config ───────────────────────────────────────────
  await upsert({
    _id: 'wholesaleFormConfig',
    _type: 'wholesaleFormConfig',
    estimatedOrderValues: [
      {_key: 'range-500', rangeLabel: '$500 – $1,500', rangeValue: 'range-500', sortOrder: 0},
      {_key: 'range-1500', rangeLabel: '$1,500 – $5,000', rangeValue: 'range-1500', sortOrder: 1},
      {_key: 'range-5000', rangeLabel: '$5,000 – $10,000', rangeValue: 'range-5000', sortOrder: 2},
      {_key: 'range-10000', rangeLabel: '$10,000+', rangeValue: 'range-10000', sortOrder: 3},
    ],
    paymentMethods: [
      {_key: 'crypto', label: 'Cryptocurrency (BTC, ETH, USDT)', methodValue: 'crypto', helpText: '10% discount available', sortOrder: 0},
      {_key: 'revolut', label: 'Revolut', methodValue: 'revolut', helpText: '5% discount available', sortOrder: 1},
      {_key: 'bank', label: 'Bank Transfer', methodValue: 'bank', helpText: 'Contact our team for terms', sortOrder: 2},
    ],
    formLabels: {
      businessNameLabel: 'Business Name', businessNameHelp: 'Your company or business name',
      contactNameLabel: 'Contact Name', contactNameHelp: 'Primary contact person',
      emailLabel: 'Email Address', emailHelp: "We'll send confirmation to this address",
      phoneLabel: 'Phone Number', phoneHelp: 'Your business or personal phone number',
      countryStateLabel: 'Country / State', countryStateHelp: 'Your location',
      productInterestsLabel: 'Product Interests', productInterestsHelp: 'Select at least one option',
      orderValueLabel: 'Estimated Order Value', orderValueHelp: 'Your typical monthly order range',
      paymentMethodLabel: 'Preferred Payment Method', paymentMethodHelp: "How you'd prefer to pay",
      notesLabel: 'Additional Notes (Optional)', notesHelp: 'Any additional information for our team',
      submitButtonText: 'Submit Inquiry',
    },
  })

  console.log('\n🎉 Seed complete! All THCPensBulk content has been created in Sanity.')
  console.log('   → Open Sanity Studio and publish each document to make it live.')
  console.log('   → Add a hero image to the About Page (required field — Studio will prompt you).')
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err)
  process.exit(1)
})
