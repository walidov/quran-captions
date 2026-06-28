// QPC V4 (Tajweed) word→glyph dataset, lazy-loaded on first V4 use.
//
// Shape: { "<surah>:<ayah>": { w: [glyphCode, …], p: [page, …] } }
// `w[i]` is the V4 glyph code for word i (1–2 PUA chars), `p[i]` its Mushaf
// page (so we know which page font renders it). The LAST word of every verse is
// the ayah-end ornament. Derived from QUL's word-by-word export (see
// scripts/build-v4-data.mjs).
let promise = null

export function loadV4Words() {
  if (!promise) {
    promise = fetch('/data/v4-tajweed.json')
      .then((r) => {
        if (!r.ok) throw new Error(`v4 data ${r.status}`)
        return r.json()
      })
      .catch((e) => {
        promise = null // allow retry
        throw e
      })
  }
  return promise
}
