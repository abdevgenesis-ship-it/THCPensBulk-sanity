import {defineArrayMember, defineField, defineType} from 'sanity'

export const wholesaleFormConfig = defineType({
  name: 'wholesaleFormConfig',
  title: 'Wholesale Form Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'productInterestCategories',
      title: 'Product Interest Categories',
      type: 'array',
      description: 'Select categories to show as product interest options in the form',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'category'}],
        }),
      ],
      validation: (rule) => rule.required().min(1).max(10),
    }),
    defineField({
      name: 'estimatedOrderValues',
      title: 'Estimated Order Value Options',
      type: 'array',
      description: 'Order value ranges shown in the form dropdown',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'rangeLabel',
              title: 'Range Label',
              type: 'string',
              validation: (rule) => rule.required().min(3).max(50),
              description: 'e.g. "$750 - $2,000"',
            }),
            defineField({
              name: 'rangeValue',
              title: 'Range Value (key)',
              type: 'string',
              validation: (rule) => rule.required().min(2).max(30),
              description: 'Internal identifier, e.g. "750-2000"',
            }),
            defineField({
              name: 'sortOrder',
              title: 'Sort Order',
              type: 'number',
              validation: (rule) => rule.required().integer().min(0),
              initialValue: 0,
            }),
          ],
          preview: {
            select: {
              title: 'rangeLabel',
              subtitle: 'rangeValue',
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(10),
    }),
    defineField({
      name: 'paymentMethods',
      title: 'Payment Method Options',
      type: 'array',
      description: 'Payment methods shown in the form dropdown',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Display Label',
              type: 'string',
              validation: (rule) => rule.required().min(3).max(100),
              description: 'e.g. "Cryptocurrency (BTC, ETH, USDT) - 10% off"',
            }),
            defineField({
              name: 'methodValue',
              title: 'Method Value (key)',
              type: 'string',
              validation: (rule) => rule.required().min(2).max(30),
              description: 'Internal identifier, e.g. "crypto"',
            }),
            defineField({
              name: 'helpText',
              title: 'Help Text (optional)',
              type: 'text',
              rows: 2,
              description: 'Additional info shown as a hint',
            }),
            defineField({
              name: 'sortOrder',
              title: 'Sort Order',
              type: 'number',
              validation: (rule) => rule.required().integer().min(0),
              initialValue: 0,
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'methodValue',
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(10),
    }),
    defineField({
      name: 'formLabels',
      title: 'Form Field Labels & Help Text',
      type: 'object',
      fields: [
        defineField({
          name: 'businessNameLabel',
          title: 'Business Name - Label',
          type: 'string',
          initialValue: 'Business Name',
          validation: (rule) => rule.required().max(50),
        }),
        defineField({
          name: 'businessNameHelp',
          title: 'Business Name - Help Text',
          type: 'string',
          initialValue: 'Your company or business name',
        }),
        defineField({
          name: 'contactNameLabel',
          title: 'Contact Name - Label',
          type: 'string',
          initialValue: 'Contact Name',
          validation: (rule) => rule.required().max(50),
        }),
        defineField({
          name: 'contactNameHelp',
          title: 'Contact Name - Help Text',
          type: 'string',
          initialValue: 'Primary contact person',
        }),
        defineField({
          name: 'emailLabel',
          title: 'Email - Label',
          type: 'string',
          initialValue: 'Email Address',
          validation: (rule) => rule.required().max(50),
        }),
        defineField({
          name: 'emailHelp',
          title: 'Email - Help Text',
          type: 'string',
          initialValue: 'We\'ll send confirmation to this address',
        }),
        defineField({
          name: 'phoneLabel',
          title: 'Phone - Label',
          type: 'string',
          initialValue: 'Phone Number',
          validation: (rule) => rule.required().max(50),
        }),
        defineField({
          name: 'phoneHelp',
          title: 'Phone - Help Text',
          type: 'string',
          initialValue: 'Your business or personal phone number',
        }),
        defineField({
          name: 'countryStateLabel',
          title: 'Country/State - Label',
          type: 'string',
          initialValue: 'Country / State',
          validation: (rule) => rule.required().max(50),
        }),
        defineField({
          name: 'countryStateHelp',
          title: 'Country/State - Help Text',
          type: 'string',
          initialValue: 'Your location',
        }),
        defineField({
          name: 'productInterestsLabel',
          title: 'Product Interests - Label',
          type: 'string',
          initialValue: 'Product Interests',
          validation: (rule) => rule.required().max(50),
        }),
        defineField({
          name: 'productInterestsHelp',
          title: 'Product Interests - Help Text',
          type: 'string',
          initialValue: 'Select at least one product category',
        }),
        defineField({
          name: 'orderValueLabel',
          title: 'Estimated Order Value - Label',
          type: 'string',
          initialValue: 'Estimated Monthly Order Value',
          validation: (rule) => rule.required().max(50),
        }),
        defineField({
          name: 'orderValueHelp',
          title: 'Estimated Order Value - Help Text',
          type: 'string',
          initialValue: 'Your typical monthly order range',
        }),
        defineField({
          name: 'paymentMethodLabel',
          title: 'Payment Method - Label',
          type: 'string',
          initialValue: 'Preferred Payment Method',
          validation: (rule) => rule.required().max(50),
        }),
        defineField({
          name: 'paymentMethodHelp',
          title: 'Payment Method - Help Text',
          type: 'string',
          initialValue: 'How you\'d prefer to pay',
        }),
        defineField({
          name: 'notesLabel',
          title: 'Notes - Label',
          type: 'string',
          initialValue: 'Additional Notes (Optional)',
          validation: (rule) => rule.required().max(50),
        }),
        defineField({
          name: 'notesHelp',
          title: 'Notes - Help Text',
          type: 'string',
          initialValue: 'Any additional information for our team',
        }),
        defineField({
          name: 'submitButtonText',
          title: 'Submit Button Text',
          type: 'string',
          initialValue: 'Submit Inquiry',
          validation: (rule) => rule.required().max(50),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Wholesale Form Configuration',
        subtitle: 'Manage form fields, options, and category links',
      }
    },
  },
})
