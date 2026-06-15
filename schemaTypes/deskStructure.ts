import type {StructureResolver} from 'sanity/structure'

import {
  aboutPageSingletonId,
  contactPageSingletonId,
  compliancePageSingletonId,
  homePageSingletonId,
  locationsPageSingletonId,
  moqPageSingletonId,
  shippingPageSingletonId,
  shopPageSingletonId,
  singletonTypes,
  wholesaleFormConfigSingletonId,
  wholesalePageSingletonId,
} from './singletons'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .id(homePageSingletonId)
        .title('Homepage')
        .child(S.document().schemaType('homePage').documentId(homePageSingletonId)),
      S.listItem()
        .id(shopPageSingletonId)
        .title('Shop Page')
        .child(S.document().schemaType('shopPage').documentId(shopPageSingletonId)),
      S.listItem()
        .id(wholesalePageSingletonId)
        .title('Wholesale Page')
        .child(S.document().schemaType('wholesalePage').documentId(wholesalePageSingletonId)),
      S.listItem()
        .id(wholesaleFormConfigSingletonId)
        .title('Wholesale Form Configuration')
        .child(S.document().schemaType('wholesaleFormConfig').documentId(wholesaleFormConfigSingletonId)),
      S.listItem()
        .id(shippingPageSingletonId)
        .title('Shipping Page')
        .child(S.document().schemaType('shippingPage').documentId(shippingPageSingletonId)),
      S.listItem()
        .id(compliancePageSingletonId)
        .title('Compliance Page')
        .child(S.document().schemaType('compliancePage').documentId(compliancePageSingletonId)),
      S.listItem()
        .id(moqPageSingletonId)
        .title('MOQ Page')
        .child(S.document().schemaType('moqPage').documentId(moqPageSingletonId)),
      S.listItem()
        .id(locationsPageSingletonId)
        .title('Locations Page')
        .child(S.document().schemaType('locationsPage').documentId(locationsPageSingletonId)),
      S.listItem()
        .id(aboutPageSingletonId)
        .title('About Page')
        .child(S.document().schemaType('aboutPage').documentId(aboutPageSingletonId)),
      S.listItem()
        .id(contactPageSingletonId)
        .title('Contact Page')
        .child(S.document().schemaType('contactPage').documentId(contactPageSingletonId)),
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId()
        return id ? !singletonTypes.has(id) : true
      }),
    ])
