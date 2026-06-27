// Token wrapping + card splitting.
//
// Reuses ayah-share's greedy line-wrap algorithm (lib/caption/splitter.ts), but
// adapted to the new design's "cards" model. By default each card holds exactly
// one verse (ayah): the stream is grouped by verse first, then each verse is
// wrapped and only spills into extra cards if it can't fit within `linesPerCard`
// lines. After this default split the user can nudge boundary tokens between
// neighbouring cards to rearrange freely.

const SPACE_EM = 0.25 // matches ayah-share's spaceWidth

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
  const unitWidth = (u) =>
    u.reduce((w, tk, i) => w + (tk.unit ?? 0) * fontSize + (i > 0 ? SPACE_EM * fontSize : 0), 0)

  const lines = []
  let current = []
  let used = 0
  for (const u of units) {
    const w = unitWidth(u)
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
    const lines = wrapTokens(verseTokens, fontSize, contentWidth)
    for (let i = 0; i < lines.length; i += linesPerCard) {
      cards.push({ tokens: lines.slice(i, i + linesPerCard).flat(), override: null })
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
