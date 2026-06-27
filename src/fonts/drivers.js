// Font-driver architecture — ported from ayah-share/lib/fonts/drivers/*.
//
// Four font types, each backed by a driver implementing the same interface and
// emitting a generic RenderVerse { tokens }. The measurer, splitter, and
// renderer are token-generic and never branch on font type.
//
// Token: { text, family, isEnd, verseKey, ayah }
//   - glyph fonts (qcf1/qcf2): text is a page-specific glyph code; family is
//     QCF{1,2}-p{page}. Ayah-end ornament is its own `isEnd` token.
//   - unicode fonts (uthmani/indopak): text is a real Arabic word; ornament is
//     embedded in the verse text, so showOrnament is a no-op.

import {
  fetchVerseGlyph,
  fetchVerseText,
  rangeKeys,
  mapWithConcurrency,
} from '../quran/client'
import { pageFontFamily, loadPageFonts } from './pageFonts'
import { UNICODE_FONTS, loadUnicodeFont } from './unicodeFonts'

function makeGlyphDriver(type, version) {
  const wordFields = version === 'v2' ? 'code_v2,v2_page' : 'code_v1,v1_page'
  return {
    type,
    async fetchRange(chapterId, from, to, opts) {
      const raws = await mapWithConcurrency(rangeKeys(chapterId, from, to), 6, (k) =>
        fetchVerseGlyph(k, wordFields),
      )
      return raws.map((v) => ({
        verseKey: v.verseKey,
        chapterId: v.chapterId,
        verseNumber: v.verseNumber,
        tokens: v.words
          .filter((w) => opts.showOrnament || !w.isEnd)
          .map((w) => {
            const page = (version === 'v2' ? w.pageV2 : w.pageV1) ?? 1
            return {
              text: (version === 'v2' ? w.codeV2 : w.codeV1) ?? '',
              family: pageFontFamily(version, page),
              isEnd: w.isEnd,
              verseKey: v.verseKey,
              ayah: v.verseNumber,
            }
          }),
      }))
    },
    async loadFonts(verses) {
      const pages = verses.flatMap((v) => v.tokens.map((t) => Number(t.family.split('-p')[1])))
      const loaded = await loadPageFonts(version, pages)
      return { fontEmbedCss: loaded.map((f) => f.embedCss).join('\n') }
    },
  }
}

const toArabicDigits = (n) => String(n).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d])

function makeUnicodeDriver(type) {
  const def = UNICODE_FONTS[type]
  const field = type === 'uthmani' ? 'text_uthmani' : 'text_indopak'
  return {
    type,
    async fetchRange(chapterId, from, to, opts) {
      const raws = await mapWithConcurrency(rangeKeys(chapterId, from, to), 6, (k) =>
        fetchVerseText(k, field),
      )
      return raws.map((v) => {
        const text = (type === 'uthmani' ? v.textUthmani : v.textIndopak) ?? ''
        const tokens = text
          .split(/\s+/)
          .filter(Boolean)
          .map((w) => ({ text: w, family: def.family, verseKey: v.verseKey, ayah: v.verseNumber }))
        // The unicode text fields carry no ayah-end number, and these fonts
        // don't reliably render the U+06DD ornament (IndoPak drops the digit,
        // Uthmani doubles the glyph). So emit a `badge` token that CaptionFrame
        // draws as a clean circle with the Arabic-Indic number — matching the
        // QCF fonts' circular ayah marker.
        if (opts?.showOrnament) {
          tokens.push({
            text: toArabicDigits(v.verseNumber),
            family: def.family,
            isEnd: true,
            badge: true,
            verseKey: v.verseKey,
            ayah: v.verseNumber,
          })
        }
        return { verseKey: v.verseKey, chapterId: v.chapterId, verseNumber: v.verseNumber, tokens }
      })
    },
    async loadFonts() {
      const { embedCss } = await loadUnicodeFont(def)
      return { fontEmbedCss: embedCss }
    },
  }
}

const drivers = {
  qcf2: makeGlyphDriver('qcf2', 'v2'),
  qcf1: makeGlyphDriver('qcf1', 'v1'),
  uthmani: makeUnicodeDriver('uthmani'),
  indopak: makeUnicodeDriver('indopak'),
}

export function getDriver(type) {
  return drivers[type] || drivers.uthmani
}
