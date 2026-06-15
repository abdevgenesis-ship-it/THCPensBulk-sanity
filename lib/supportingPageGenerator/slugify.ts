/** Convert exact keyword to URL slug (must match keyword phrase). */
export function slugifyKeyword(keyword: string): string {
  return keyword
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function startsWithKeyword(value: string | undefined, keyword: string | undefined): boolean {
  const v = value?.trim()
  const k = keyword?.trim()
  if (!v || !k) return false
  return v.toLowerCase().startsWith(k.toLowerCase())
}
