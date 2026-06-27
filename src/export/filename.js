// Per-card export filename, e.g. "001_002_255-256.png" =
// <order>_<surah>_<fromAyah>-<toAyah>.png. Adapted from ayah-share's
// captionFilename for the new design's ayah-spanning cards.

export function cardFilename(index, total, card, chapterId) {
  const width = Math.max(3, String(total).length)
  const order = String(index + 1).padStart(width, '0')
  const surah = String(chapterId).padStart(3, '0')
  const ayahs = card.tokens.map((t) => t.ayah)
  const from = ayahs.length ? Math.min(...ayahs) : 0
  const to = ayahs.length ? Math.max(...ayahs) : 0
  const range = from === to ? String(from) : `${from}-${to}`
  return `${order}_${surah}_${range}.png`
}
