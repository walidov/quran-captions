// Per-page QCF font loading — ported from ayah-share/lib/fonts/pageFonts.ts.
// Each Mushaf page (1..604) has its own woff2; the right page font must be used
// for a word's glyph code or it renders as garbage.

export function pageFontFamily(version, page) {
  return `QCF${version === 'v2' ? 2 : 1}-p${page}`
}
export function pageFontUrl(version, page) {
  return `/fonts/hafs/${version}/woff2/p${page}.woff2`
}
export function uniquePages(pages) {
  return Array.from(new Set(pages)).sort((a, b) => a - b)
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

export function loadPageFont(version, page) {
  const key = `${version}:${page}`
  const hit = cache.get(key)
  if (hit) return hit
  const p = (async () => {
    const family = pageFontFamily(version, page)
    const url = await fontDataUrl(pageFontUrl(version, page))
    const src = `url(${url}) format("woff2")`
    const face = new FontFace(family, src)
    await face.load()
    document.fonts.add(face)
    return { page, family, embedCss: `@font-face{font-family:"${family}";src:${src};font-display:block;}` }
  })()
  cache.set(key, p)
  return p
}

export async function loadPageFonts(version, pages) {
  return Promise.all(uniquePages(pages).map((pg) => loadPageFont(version, pg)))
}
