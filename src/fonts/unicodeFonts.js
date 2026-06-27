// Single-file unicode fonts (Uthmani / IndoPak) — ported from
// ayah-share/lib/fonts/unicodeFonts.ts.

export const UNICODE_FONTS = {
  uthmani: { family: 'UthmanicHafs', url: '/fonts/uthmanic-hafs/UthmanicHafs.woff2' },
  indopak: { family: 'IndoPak', url: '/fonts/indopak/IndoPak.woff2' },
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

export function loadUnicodeFont(def) {
  const hit = cache.get(def.family)
  if (hit) return hit
  const p = (async () => {
    const dataUrl = await fontDataUrl(def.url)
    const src = `url(${dataUrl}) format("woff2")`
    const face = new FontFace(def.family, src)
    await face.load()
    document.fonts.add(face)
    return { embedCss: `@font-face{font-family:"${def.family}";src:${src};font-display:block;}` }
  })()
  cache.set(def.family, p)
  return p
}
