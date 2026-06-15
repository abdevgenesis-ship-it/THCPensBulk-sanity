import {defineField, defineType} from 'sanity'

export const productSpecs = defineType({
  name: 'productSpecs',
  title: 'Product Specifications',
  type: 'object',
  fields: [
    defineField({
      name: 'battery',
      title: 'Battery',
      type: 'string',
      description: 'Battery capacity and type (e.g., "650mAh, Rechargeable").',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'batteryLife',
      title: 'Battery Life',
      type: 'string',
      description: 'How long battery lasts (e.g., "Up to 600 puffs").',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'chargingType',
      title: 'Charging Type',
      type: 'string',
      description: 'Charging method (e.g., "USB-C Rechargeable", "Non-rechargeable").',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'chargingTime',
      title: 'Charging Time',
      type: 'string',
      description: 'Time to fully charge (e.g., "30-45 minutes").',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'fillVolume',
      title: 'Fill Volume',
      type: 'string',
      description: 'Liquid capacity (e.g., "2mL", "10mL").',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      description: 'Product size (e.g., "90mm x 20mm x 10mm").',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'weight',
      title: 'Weight',
      type: 'string',
      description: 'Product weight (e.g., "35g").',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
      description: 'Device material composition (e.g., "Aluminum & Plastic").',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'warranty',
      title: 'Warranty',
      type: 'string',
      description: 'Warranty information (e.g., "1-Year Limited Warranty").',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'string',
      description: 'Quality certifications (e.g., "CE, RoHS, FCC").',
      validation: (rule) => rule.max(200),
    }),
  ],
  preview: {
    select: {
      battery: 'battery',
      charging: 'chargingType',
      volume: 'fillVolume',
    },
    prepare({battery, charging, volume}) {
      const parts = [battery, charging, volume].filter(Boolean)
      return {
        title: 'Product Specifications',
        subtitle: parts.join(' • '),
      }
    },
  },
})
