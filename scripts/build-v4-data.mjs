// Build the compact QPC V4 (Tajweed) word→glyph dataset used by the app.
//
//   node scripts/build-v4-data.mjs
//
// Input:  data/v4-words.json — QUL "V4 Glyphs (With Tajweed) · Word by word"
//         export (qul.tarteel.ai/resources/quran-script/47). Each entry:
//         { id, surah, ayah, word, location, text }  where `text` is the V4
//         glyph code (1–2 PUA chars in U+FC41..U+FCFF).
// Output: public/data/v4-tajweed.json — { "<s>:<a>": { w:[code…], p:[page…] } }
//
// The export has no page number, but each page font re-encodes its glyphs from
// U+FC41 in reading order, so the page is recovered by counting code resets in
// the global (id-ordered) glyph stream. This was verified exact against the
// tarteel page fonts: 604 pages, every page contiguous from U+FC41, and per-page
// glyph counts match the fonts.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = JSON.parse(readFileSync(join(root, 'data/v4-words.json'), 'utf8'))

const words = Object.values(src).sort((a, b) => Number(a.id) - Number(b.id))

// Recover the Mushaf page for every word by detecting code resets.
let page = 1
let prev = null
for (const w of words) {
  const cps = [...w.text].map((c) => c.codePointAt(0))
  if (prev !== null && cps[0] < prev) page++
  w._page = page
  prev = cps[cps.length - 1]
}
if (page !== 604) throw new Error(`expected 604 pages, derived ${page}`)

// Group by verse, preserving reading order. Last word of each verse = ornament.
const out = {}
for (const w of words) {
  const vk = `${w.surah}:${w.ayah}`
  ;(out[vk] ??= { w: [], p: [] })
  out[vk].w.push(w.text)
  out[vk].p.push(w._page)
}

const verseCount = Object.keys(out).length
if (verseCount !== 6236) throw new Error(`expected 6236 verses, got ${verseCount}`)

mkdirSync(join(root, 'public/data'), { recursive: true })
const dest = join(root, 'public/data/v4-tajweed.json')
writeFileSync(dest, JSON.stringify(out))
console.log(`wrote ${dest} — ${verseCount} verses, ${words.length} words, ${page} pages`)
