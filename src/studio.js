// Small stateless helpers shared across the studio UI.
import { PRESETS } from './data'

// The active canvas preset, resolving the special "custom" key to live W/H.
export function getPreset(state) {
  if (state.presetKey === 'custom') {
    return { key: 'custom', name: 'Custom', w: state.customW, h: state.customH }
  }
  return PRESETS.find((p) => p.key === state.presetKey) || PRESETS[0]
}

// Inline style object for the three preview-background modes. Export is always
// transparent regardless of this (the export node has no background).
export function bgStyle(mode) {
  if (mode === 'dark') return { background: '#0c0c0f' }
  if (mode === 'light') return { background: '#ffffff' }
  return {
    backgroundColor: '#e9ebef',
    backgroundImage: 'repeating-conic-gradient(#cfd2d8 0% 25%,#eef0f2 0% 50%)',
    backgroundSize: '64px 64px',
  }
}

// Font family used to display unicode Arabic UI text (e.g. the surah name) in a
// real Quranic typeface. The QCF "glyph" fonts can't render plain-unicode text
// (they only hold PUA word-glyphs keyed to the API's codes), so they fall back
// to UthmanicHafs — the closest authentic Hafs typeface that renders unicode.
export function displayArabicFamily(fontType) {
  if (fontType === 'indopak') return 'IndoPak'
  return 'UthmanicHafs'
}

// A card's effective style. A card override holds only the fields it overrides
// (currently just `size`), merged over the global style — so an overridden card
// still follows the global color, line height, etc.
export function effectiveStyle(card, global) {
  return card?.override ? { ...global, ...card.override } : global
}

// Fit-to-stage scale for a given stage element and preset.
export function computeScale(el, preset) {
  const aw = el.clientWidth - 64
  const ah = el.clientHeight - 64
  return Math.max(0.04, Math.min(aw / preset.w, ah / preset.h))
}
