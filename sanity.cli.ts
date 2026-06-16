import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'as9s0n0w',
    dataset: 'production'
  },
  studioHost: 'thcpensbulk',
  deployment: {
    appId: 'cltbqadknswifytfrxocjzhf',
    autoUpdates: true,
  }
})
