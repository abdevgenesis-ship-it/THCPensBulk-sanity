import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import {resolve} from 'node:path'

loadEnv({path: resolve(process.cwd(), '.env')})
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN
const client = createClient({projectId: '8fp9giy6', dataset: 'production', apiVersion: '2024-02-01', token, useCdn: false})
const count = await client.fetch('count(*[])')
console.log('CONNECTED. documentCount =', count)
const types = await client.fetch('array::unique(*[]._type)')
console.log('types =', types)
