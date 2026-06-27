import JSZip from 'jszip'
import { saveAs } from 'file-saver'

// ZIP + single-file download — ported from ayah-share/lib/export/zip.ts.

function dataUrlToBase64(dataUrl) {
  return dataUrl.split(',')[1] ?? ''
}

export async function downloadZip(items, zipName = 'quran-captions.zip', onProgress) {
  const zip = new JSZip()
  items.forEach((item, i) => {
    zip.file(item.filename, dataUrlToBase64(item.dataUrl), { base64: true })
    onProgress?.(i + 1, items.length)
  })
  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, zipName)
}

export function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}
