import {useCallback, useEffect, useState, type ChangeEvent} from 'react'
import {useClient} from 'sanity'
import {Box, Button, Card, Flex, Label, Radio, Select, Spinner, Stack, Text, TextArea} from '@sanity/ui'

type ParentType = 'root' | 'wholesalePage' | 'category'

type CategoryOption = {
  _id: string
  name: string
  slug: string
}

type GenerationResult = {
  keyword: string
  slug: string
  url: string
  status: 'success' | 'error' | 'dry_run'
  errors?: string[]
  categoryIds?: string[]
  productIds?: string[]
}

const CATEGORIES_QUERY = `*[_type == "category" && defined(slug.current)] | order(name asc) {
  _id,
  name,
  "slug": slug.current
}`

function getApiUrl() {
  return (
    (import.meta.env.SANITY_STUDIO_GENERATOR_API_URL as string | undefined) ||
    'http://localhost:3000/api/admin/generate-supporting-pages'
  )
}

function getSecret() {
  return (import.meta.env.SANITY_STUDIO_GENERATOR_SECRET as string | undefined) || ''
}

export function SupportingPageGeneratorTool() {
  const client = useClient({apiVersion: '2025-03-01'})
  const [parentType, setParentType] = useState<ParentType>('root')
  const [categoryId, setCategoryId] = useState('')
  const [keywordsText, setKeywordsText] = useState('')
  const [dryRun, setDryRun] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<GenerationResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])

  useEffect(() => {
    client.fetch<CategoryOption[]>(CATEGORIES_QUERY).then(setCategories).catch(() => setCategories([]))
  }, [client])

  const selectedCategory = categories.find((category) => category._id === categoryId)
  const parentHelp =
    parentType === 'root'
      ? 'Live URL: /{keyword-slug}'
      : parentType === 'wholesalePage'
        ? 'Live URL: /wholesale/{keyword-slug}'
        : 'Live URL: /category/{categorySlug}/{keyword-slug}'

  const canGenerate =
    keywordsText.trim().length > 0 && (parentType !== 'category' || Boolean(categoryId)) && !loading

  const handleGenerate = useCallback(async () => {
    setLoading(true)
    setError(null)
    setResults([])

    const keywords = keywordsText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    const secret = getSecret()
    if (!secret) {
      setError('Missing SANITY_STUDIO_GENERATOR_SECRET in Studio environment.')
      setLoading(false)
      return
    }

    const parent =
      parentType === 'root'
        ? {type: 'root' as const}
        : parentType === 'wholesalePage'
          ? {type: 'wholesalePage' as const}
          : {type: 'category' as const, categoryId}

    try {
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({
          keywords,
          parent,
          categorySlug: selectedCategory?.slug,
          options: {
            dryRun,
          },
        }),
      })

      const payload = (await response.json()) as {error?: string; results?: GenerationResult[]}
      if (!response.ok) {
        throw new Error(payload.error || `Request failed (${response.status})`)
      }

      setResults(payload.results || [])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }, [categoryId, dryRun, keywordsText, parentType, selectedCategory?.slug])

  return (
    <Box padding={4} sizing="border">
      <Stack space={4}>
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={4}>
            <Text size={2} weight="semibold">
              Supporting Page Generator
            </Text>
            <Text muted size={1}>
              Paste keywords (one per line). AI generates content and publishes supporting pages. Categories (4) and
              products (4) are picked randomly from your catalog.
            </Text>

            <Stack space={3}>
              <Label>Parent page (optional)</Label>
              <Flex gap={3} wrap="wrap">
                {(
                  [
                    ['root', 'None — root /{slug}'],
                    ['wholesalePage', 'Wholesale'],
                    ['category', 'Category'],
                  ] as const
                ).map(([value, label]) => (
                  <Flex key={value} align="center" gap={2}>
                    <Radio
                      checked={parentType === value}
                      onChange={() => setParentType(value)}
                      name="parentType"
                    />
                    <Text size={1}>{label}</Text>
                  </Flex>
                ))}
              </Flex>
              <Text muted size={1}>
                {parentHelp}
              </Text>
              {parentType === 'category' ? (
                <Select
                  value={categoryId}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    setCategoryId(event.currentTarget.value)
                  }
                >
                  <option value="">Select category…</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              ) : null}
            </Stack>

            <Stack space={2}>
              <Label htmlFor="keywords">Keywords (one per line)</Label>
              <TextArea
                id="keywords"
                rows={8}
                value={keywordsText}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setKeywordsText(event.currentTarget.value)
                }
                placeholder={'510 cart wholesale\n510 carts wholesale'}
              />
              <Label htmlFor="csvUpload">Optional CSV upload (column: keyword)</Label>
              <input
                id="csvUpload"
                type="file"
                accept=".csv,text/csv"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const file = event.currentTarget.files?.[0]
                  if (!file) return
                  file
                    .text()
                    .then((text) => {
                      const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
                      if (lines.length === 0) return
                      const header = lines[0].split(',').map((cell) => cell.trim().toLowerCase())
                      const keywordIndex = header.indexOf('keyword')
                      const keywords =
                        keywordIndex >= 0
                          ? lines
                              .slice(1)
                              .map((line) => line.split(',')[keywordIndex]?.trim())
                              .filter(Boolean)
                          : lines
                      if (keywords.length > 0) {
                        setKeywordsText(keywords.join('\n'))
                      }
                    })
                    .catch(() => setError('Could not read CSV file'))
                }}
              />
            </Stack>

            <Flex align="center" gap={2}>
              <input
                id="dryRun"
                type="checkbox"
                checked={dryRun}
                onChange={(event) => setDryRun(event.currentTarget.checked)}
              />
              <Label htmlFor="dryRun">Dry run (validate + preview, no Sanity write)</Label>
            </Flex>

            <Button
              text={loading ? 'Generating…' : dryRun ? 'Dry run' : 'Generate pages'}
              tone="primary"
              disabled={!canGenerate}
              onClick={handleGenerate}
            />
            {loading ? <Spinner muted /> : null}
            {error ? (
              <Text size={1} style={{color: 'var(--card-badge-critical-fg-color)'}}>
                {error}
              </Text>
            ) : null}
          </Stack>
        </Card>

        {results.length > 0 ? (
          <Card padding={4} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={2} weight="semibold">
                Results
              </Text>
              {results.map((result) => (
                <Card key={`${result.keyword}-${result.slug}`} padding={3} radius={2} tone="transparent" border>
                  <Stack space={2}>
                    <Flex justify="space-between" align="center" gap={3} wrap="wrap">
                      <Text size={1} weight="medium">
                        {result.status === 'success' ? '✓' : result.status === 'dry_run' ? '◌' : '✗'} {result.keyword}
                      </Text>
                      {result.url ? (
                        <a href={result.url} target="_blank" rel="noreferrer">
                          Open live page
                        </a>
                      ) : null}
                    </Flex>
                    <Text muted size={1}>
                      {result.url}
                    </Text>
                    {result.categoryIds?.length ? (
                      <Text muted size={1}>
                        Random categories: {result.categoryIds.length} · Random products:{' '}
                        {result.productIds?.length ?? 0}
                      </Text>
                    ) : null}
                    {result.errors?.length ? (
                      <Text size={1} style={{color: 'var(--card-badge-critical-fg-color)'}}>
                        {result.errors.join(' · ')}
                      </Text>
                    ) : null}
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Card>
        ) : null}
      </Stack>
    </Box>
  )
}
