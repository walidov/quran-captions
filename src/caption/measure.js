// Canvas text measurement — ported from ayah-share/lib/caption/measure.ts.
// Returns a per-token width in *em units* (width at 1px font-size), measured in
// the token's own font family. Fonts must be loaded (FontFace registered)
// before measuring, or measureText falls back to default metrics.

export function measureTokens(tokens, probePx = 100) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    tokens.forEach((t) => (t.unit = t.text.length))
    return tokens
  }
  for (const t of tokens) {
    // Badge tokens (ayah markers for unicode fonts) render as a fixed-size
    // circle, not as glyph text — give them an approximate em width.
    if (t.badge) {
      t.unit = 1.2
      continue
    }
    ctx.font = `${probePx}px "${t.family}"`
    t.unit = ctx.measureText(t.text).width / probePx
  }
  return tokens
}
