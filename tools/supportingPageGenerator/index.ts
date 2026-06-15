import {definePlugin} from 'sanity'

import {SupportingPageGeneratorTool} from './SupportingPageGeneratorTool'

export const supportingPageGeneratorPlugin = definePlugin({
  name: 'supporting-page-generator',
  tools: [
    {
      name: 'supporting-page-generator',
      title: 'Supporting Page Generator',
      component: SupportingPageGeneratorTool,
    },
  ],
})
