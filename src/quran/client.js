// quran.com API v4 client — ported from ayah-share/lib/quran/client.ts.
// No API key required.

export const BASE = 'https://api.quran.com/api/v4'

export async function getJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`quran.com ${res.status}: ${url}`)
  return res.json()
}

// All 114 chapters (surahs) for the given UI locale.
export async function fetchChapters(locale = 'en') {
  const data = await getJson(`${BASE}/chapters?language=${encodeURIComponent(locale)}`)
  return data.chapters.map((c) => ({
    id: c.id,
    nameArabic: c.name_arabic,
    nameSimple: c.name_simple,
    translatedName: c.translated_name?.name ?? '',
    versesCount: c.verses_count,
  }))
}

// Bounded-concurrency map (default 6 parallel), used for range fetches.
export async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length)
  let cursor = 0
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++
      results[i] = await fn(items[i], i)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

// Glyph-coded fetch (QCF1/QCF2). Words carry page-specific glyph strings —
// NOT readable Arabic; they only render correctly in the matching page font.
export async function fetchVerseGlyph(verseKey, wordFields) {
  const p = new URLSearchParams({ words: 'true', word_fields: wordFields })
  const v = (await getJson(`${BASE}/verses/by_key/${encodeURIComponent(verseKey)}?${p}`)).verse
  return {
    verseKey: v.verse_key,
    chapterId: Number(v.verse_key.split(':')[0]),
    verseNumber: v.verse_number,
    words: (v.words ?? []).map((w) => ({
      codeV1: w.code_v1,
      codeV2: w.code_v2,
      pageV1: w.v1_page,
      pageV2: w.v2_page,
      isEnd: w.char_type_name === 'end',
    })),
  }
}

// Unicode text fetch (Uthmani / IndoPak). The ayah-end ornament is already
// embedded in the text, so there is no separate end token.
export async function fetchVerseText(verseKey, field) {
  const p = new URLSearchParams({ fields: field })
  const v = (await getJson(`${BASE}/verses/by_key/${encodeURIComponent(verseKey)}?${p}`)).verse
  return {
    verseKey: v.verse_key,
    chapterId: Number(v.verse_key.split(':')[0]),
    verseNumber: v.verse_number,
    words: [],
    textUthmani: v.text_uthmani,
    textIndopak: v.text_indopak,
  }
}

export function rangeKeys(chapterId, from, to) {
  const keys = []
  for (let n = from; n <= to; n++) keys.push(`${chapterId}:${n}`)
  return keys
}

// First word of the Qur'an (1:1:1, "بِسْمِ") with its QCF1/QCF2 glyph codes and
// pages — used to render a correct, font-specific sample on the font picker.
export async function fetchSampleWord() {
  const p = new URLSearchParams({ words: 'true', word_fields: 'code_v1,code_v2,v1_page,v2_page' })
  const v = (await getJson(`${BASE}/verses/by_key/1:1?${p}`)).verse
  const w = (v.words ?? [])[0] ?? {}
  return { codeV1: w.code_v1, codeV2: w.code_v2, pageV1: w.v1_page ?? 1, pageV2: w.v2_page ?? 1 }
}
