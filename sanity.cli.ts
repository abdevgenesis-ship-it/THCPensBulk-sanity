import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'as9s0n0w',
    dataset: 'production'
  },
  studioHost: 'thcpensbulk',
  deployment: {
    appId: 'g906g7udef0gjgmopchlmsqb',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
