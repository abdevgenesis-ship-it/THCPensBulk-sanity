import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {supportingPageGeneratorPlugin} from './tools/supportingPageGenerator'
import {schemaTypes} from './schemaTypes'
import {deskStructure} from './schemaTypes/deskStructure'
import {
  aboutPageSingletonId,
  compliancePageSingletonId,
  contactPageSingletonId,
  homePageSingletonId,
  locationsPageSingletonId,
  moqPageSingletonId,
  shippingPageSingletonId,
  shopPageSingletonId,
  singletonTypes,
  wholesaleFormConfigSingletonId,
  wholesalePageSingletonId,
} from './schemaTypes/singletons'

export default defineConfig({
  name: 'default',
  title: 'Melatonin Gummies UK',

  projectId: '8fp9giy6',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(),
    supportingPageGeneratorPlugin(),
  ],

  document: {
    actions: (prev, context) => {
      const singletonDocumentIds = new Set([
        homePageSingletonId,
        shopPageSingletonId,
        wholesalePageSingletonId,
        wholesaleFormConfigSingletonId,
        shippingPageSingletonId,
        compliancePageSingletonId,
        moqPageSingletonId,
        locationsPageSingletonId,
        aboutPageSingletonId,
        contactPageSingletonId,
      ])

      if (singletonDocumentIds.has(context.documentId || '') && singletonTypes.has(context.schemaType)) {
        return prev.filter(
          ({action}) => action !== 'duplicate' && action !== 'delete' && action !== 'unpublish',
        )
      }

      return prev
    },
  },

  schema: {
    types: schemaTypes,
    templates: (prev) => prev.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },
})
