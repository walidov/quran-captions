// Token wrapping + card splitting.
//
// Reuses ayah-share's greedy line-wrap algorithm (lib/caption/splitter.ts), but
// adapted to the new design's "cards" model. By default each card holds exactly
// one verse (ayah): the stream is grouped by verse first, then each verse is
// wrapped and only spills into extra cards if it can't fit within `linesPerCard`
// lines. After this default split the user can nudge boundary tokens between
// neighbouring cards to rearrange freely.

const SPACE_EM = 0.25 // matches ayah-share's spaceWidth

// Rendered width (px) of a word unit (word + optional glued ayah ornament).
const unitWidth = (unit, fontSize) =>
  unit.reduce((w, tk, i) => w + (tk.unit ?? 0) * fontSize + (i > 0 ? SPACE_EM * fontSize : 0), 0)

// Group tokens into "word units": each ayah-end ornament (isEnd) is attached to
// the word directly before it, so a verse number is never treated as a separate
// word — it stays glued to its word when wrapping, moving, and counting.
export function groupUnits(tokens) {
  const units = []
  for (const tok of tokens) {
    if (tok.isEnd && units.length) units[units.length - 1].push(tok)
    else units.push([tok])
  }
  return units
}

// Greedy wrap a token list into lines that each fit `contentWidth` px at the
// given font size. `unit` is the token's measured em-width (token.unit). Word
// units (word + its ayah ornament) never break across lines.
export function wrapTokens(tokens, fontSize, contentWidth) {
  const units = groupUnits(tokens)
  const lines = []
  let current = []
  let used = 0
  for (const u of units) {
    const w = unitWidth(u, fontSize)
    const add = current.length === 0 ? w : SPACE_EM * fontSize + w
    if (current.length > 0 && used + add > contentWidth) {
      lines.push(current)
      current = [...u]
      used = w
    } else {
      current.push(...u)
      used += add
    }
  }
  if (current.length > 0) lines.push(current)
  return lines
}

// Split a continuous token stream into cards. Each card holds at most one verse
// (ayah): the stream is grouped by verse first, so a card never mixes two ayahs.
// A verse only spills into additional cards when its wrapped lines exceed
// `linesPerCard` — i.e. it's too long to fit the allowed size. The user can
// still nudge boundary words between any cards afterward.
// How many of units[start..] fit within `maxLines` lines at the given width.
function unitsFitting(units, start, fontSize, contentWidth, maxLines) {
  let lines = 1
  let used = 0
  let count = 0
  for (let j = start; j < units.length; j++) {
    const w = unitWidth(units[j], fontSize)
    const add = used === 0 ? w : SPACE_EM * fontSize + w
    if (used > 0 && used + add > contentWidth) {
      lines++
      if (lines > maxLines) break
      used = w
    } else {
      used += add
    }
    count++
  }
  return count
}

// Distribute a verse's word units into exactly K cards, as evenly as possible by
// count, never exceeding `linesPerCard` lines per card. Returns null when K is
// too small (units left over) so the caller can retry with one more card.
function distributeEven(units, K, fontSize, contentWidth, linesPerCard) {
  const n = units.length
  const groups = []
  let i = 0
  for (let c = 0; c < K; c++) {
    const remCards = K - c
    const remUnits = n - i
    if (remUnits < remCards) return null // can't fill K non-empty cards
    const fit = unitsFitting(units, i, fontSize, contentWidth, linesPerCard)
    const fitCap = fit > 0 ? fit : 1 // a lone oversized unit still gets its own card
    const target = Math.ceil(remUnits / remCards) // even share of what remains
    const maxTake = remUnits - (remCards - 1) // leave ≥1 unit for each later card
    const take = Math.max(1, Math.min(target, fitCap, maxTake))
    groups.push(units.slice(i, i + take))
    i += take
  }
  return i === n ? groups : null // leftover ⇒ K too small
}

// Split one verse into one or more cards. When it doesn't fit in a single card,
// its words are spread evenly across the fewest cards that hold them — so we
// never get one full card followed by a card holding just a word or two.
function splitVerse(verseTokens, fontSize, contentWidth, linesPerCard) {
  const units = groupUnits(verseTokens)
  if (units.length === 0) return [verseTokens]
  const greedyLines = wrapTokens(verseTokens, fontSize, contentWidth).length
  if (greedyLines <= linesPerCard) return [verseTokens]
  const minCards = Math.max(2, Math.ceil(greedyLines / linesPerCard))
  for (let K = minCards; K <= units.length; K++) {
    const groups = distributeEven(units, K, fontSize, contentWidth, linesPerCard)
    if (groups) return groups.map((g) => g.flat())
  }
  return units.map((u) => u.slice()) // fallback: one unit per card
}

export function splitIntoCards(tokens, { fontSize, contentWidth, linesPerCard }) {
  // Group the stream into contiguous per-verse runs. Every token carries its
  // verseKey (the ayah-end ornament included), so a verse's marker stays with it.
  const verses = []
  let key
  for (const tok of tokens) {
    const k = tok.verseKey ?? tok.ayah
    if (verses.length === 0 || k !== key) {
      verses.push([])
      key = k
    }
    verses[verses.length - 1].push(tok)
  }

  const cards = []
  for (const verseTokens of verses) {
    for (const cardTokens of splitVerse(verseTokens, fontSize, contentWidth, linesPerCard)) {
      cards.push({ tokens: cardTokens, override: null })
    }
  }
  if (!cards.length) cards.push({ tokens: [], override: null })
  return cards
}

// The text-block content width for a given canvas width (matches CaptionFrame's
// horizontal padding of 6% per side).
export function contentWidthFor(canvasWidth) {
  return canvasWidth * 0.88
}
