// QPC V4 (Tajweed) per-page COLOR fonts.
//
// Each Mushaf page (1..604) has its own woff2 whose glyphs carry tajweed colors
// baked in via COLR/CPAL. Loaded on demand from the tarteel CDN (CORS-open) and
// embedded as a data URL so the PNG exporter can rasterize them with colors.

const CDN = 'https://static-cdn.tarteel.ai/qul/fonts/quran_fonts/v4-tajweed/woff2'

export function v4Family(page) {
  return `qcf4-p${page}`
}
export function v4PageUrl(page) {
  return `${CDN}/p${page}.woff2?v=3.1`
}

const cache = new Map()

async function fontDataUrl(url) {
  const buf = await fetch(url).then((r) => {
    if (!r.ok) throw new Error(`font ${r.status}`)
    return r.arrayBuffer()
  })
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return `data:font/woff2;base64,${btoa(bin)}`
}

export function loadV4Page(page) {
  const hit = cache.get(page)
  if (hit) return hit
  const p = (async () => {
    const family = v4Family(page)
    const url = await fontDataUrl(v4PageUrl(page))
    const src = `url(${url}) format("woff2")`
    const face = new FontFace(family, src)
    await face.load()
    document.fonts.add(face)
    return { page, family, embedCss: `@font-face{font-family:"${family}";src:${src};font-display:block;}` }
  })().catch((e) => {
    cache.delete(page) // allow retry on transient CDN failure
    throw e
  })
  cache.set(page, p)
  return p
}

// Load several page fonts with bounded concurrency (a verse range can touch
// many pages; don't open 50 parallel font fetches).
export async function loadV4Pages(pages) {
  const uniq = [...new Set(pages)].sort((a, b) => a - b)
  const out = []
  let cursor = 0
  async function worker() {
    while (cursor < uniq.length) {
      const pg = uniq[cursor++]
      out.push(await loadV4Page(pg))
    }
  }
  await Promise.all(Array.from({ length: Math.min(6, uniq.length) }, worker))
  return out
}
