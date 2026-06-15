/**
 * Query Sanity for all programmaticPage documents and check them on localhost:3000
 */
import https from 'https'
import http from 'http'

const PROJECT_ID = '1iqwsryu'
const DATASET = 'production'
const API_VERSION = 'v2021-06-07'
const LOCAL_BASE = 'http://localhost:3000'

const GROQ = `*[_type == "programmaticPage"]{
  _id,
  "slug": slug.current,
  "category": category->slug.current,
  "categoryName": category->name,
  locationName,
  "hasBody": defined(body) && length(body) > 0,
  "hasIntro": defined(customIntro) && length(customIntro) > 0,
  "hasSeoDesc": defined(seoDescription)
} | order(category asc, slug asc)`

function fetchSanity(groq) {
  return new Promise((resolve, reject) => {
    const q = encodeURIComponent(groq)
    const url = `https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/data/query/${DATASET}?query=${q}`
    https.get(url, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try { resolve(JSON.parse(data).result) }
        catch (e) { reject(e) }
      })
    }).on('error', reject)
  })
}

function checkLocalUrl(path) {
  return new Promise((resolve) => {
    const req = http.get(`${LOCAL_BASE}${path}`, { timeout: 15000 }, (res) => {
      resolve({ path, status: res.statusCode, ok: res.statusCode < 400 })
      res.resume()
    })
    req.on('error', (e) => resolve({ path, status: 'ERR', ok: false, code: e.code }))
    req.on('timeout', () => { req.destroy(); resolve({ path, status: 'TIMEOUT', ok: false }) })
  })
}

async function main() {
  console.log('🔍 Querying Sanity for all programmaticPage documents...\n')
  const pages = await fetchSanity(GROQ)

  console.log(`Found ${pages.length} programmatic pages in Sanity\n`)

  if (pages.length === 0) {
    console.log('No programmatic pages found in the database.')
    return
  }

  // Group by category
  const byCategory = {}
  for (const p of pages) {
    const cat = p.category || 'unknown'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(p)
  }

  console.log('── SANITY INVENTORY ──────────────────────────────')
  for (const [cat, items] of Object.entries(byCategory)) {
    console.log(`\n${cat} (${items.length} pages):`)
    items.forEach(p => {
      const path = `/${p.category}/${p.slug}`
      const body = p.hasBody ? '✅body' : '❌body'
      const intro = p.hasIntro ? '✅intro' : '❌intro'
      const seo = p.hasSeoDesc ? '✅seo' : '❌seo'
      console.log(`  ${body} ${intro} ${seo}  ${path}`)
    })
  }

  // Build URL list
  const urlPaths = pages.map(p => `/${p.category}/${p.slug}`)

  console.log(`\n\n── HTTP CHECK on localhost:3000 (${urlPaths.length} pages) ───`)

  const results = []
  for (let i = 0; i < urlPaths.length; i += 5) {
    const batch = urlPaths.slice(i, i + 5)
    const batchResults = await Promise.all(batch.map(checkLocalUrl))
    results.push(...batchResults)
    process.stdout.write(`  Checked ${Math.min(i + 5, urlPaths.length)}/${urlPaths.length}...\r`)
    await new Promise(r => setTimeout(r, 200))
  }
  console.log()

  const ok = results.filter(r => r.ok)
  const bad = results.filter(r => !r.ok)

  console.log(`\n${'═'.repeat(55)}`)
  console.log(`  RESULTS: ${ok.length} ✅ OK  |  ${bad.length} ❌ FAILED  |  Total: ${results.length}`)
  console.log(`${'═'.repeat(55)}\n`)

  for (const [cat, items] of Object.entries(byCategory)) {
    const catResults = results.filter(r => r.path.startsWith(`/${cat}/`))
    const passCount = catResults.filter(r => r.ok).length
    const icon = passCount === items.length ? '✅' : '❌'
    console.log(`${icon} ${cat}: ${passCount}/${items.length} OK`)
    catResults.forEach(r => {
      console.log(`  ${r.ok ? '✅' : '❌'} [${r.status}] ${r.path}`)
    })
    console.log()
  }

  if (bad.length === 0) {
    console.log(`🎉 All ${pages.length} programmatic pages return HTTP 200 on localhost:3000\n`)
  } else {
    console.log(`\n⚠️  FAILED (${bad.length}):`)
    bad.forEach(r => console.log(`   [${r.status}${r.code ? '/'+r.code : ''}] ${r.path}`))
  }

  // Full URL list
  console.log(`\n── FULL URL INVENTORY (${pages.length} pages) ──────────────────`)
  pages.forEach((p, i) => {
    console.log(`${String(i+1).padStart(3)}. ${LOCAL_BASE}/${p.category}/${p.slug}`)
  })
}

main().catch(e => { console.error(e); process.exit(1) })
