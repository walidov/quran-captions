import { toSvg } from 'html-to-image'

// Rasterizes an element to a transparent PNG data URL at an exact pixel size.
// Ported verbatim from ayah-share/lib/export/png.ts.
//
// We use html-to-image's `toSvg` (reliable DOM clone + font embedding via
// `fontEmbedCSS`) and draw the result onto a canvas ourselves. We deliberately
// avoid `toPng`/`toCanvas`, whose internal `createImage` waits on
// `img.decode()` + `requestAnimationFrame` with no error handling — that step
// stalls indefinitely for large SVGs (1080×1920) or when the tab is
// backgrounded. A plain `onload` draw is reliable.
export async function renderNodeToPng(node, opts) {
  const svgUrl = await toSvg(node, {
    width: opts.width,
    height: opts.height,
    fontEmbedCSS: opts.fontEmbedCss,
  })
  const img = await loadImage(svgUrl)
  const canvas = document.createElement('canvas')
  canvas.width = opts.width
  canvas.height = opts.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d canvas context unavailable')
  // Canvas starts fully transparent; the SVG has no background, so the
  // exported PNG keeps a transparent backdrop.
  ctx.drawImage(img, 0, 0, opts.width, opts.height)
  return canvas.toDataURL('image/png')
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('failed to rasterize caption SVG'))
    img.src = src
  })
}
