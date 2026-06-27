// Static design data ported verbatim from the Quran Studio design canvas.

export const THEMES = {
  light: {
    appBg: '#e9ebef',
    topbar: '#ffffff',
    rail: '#ffffff',
    panel: '#ffffff',
    panel2: '#f4f5f8',
    text: '#181a1f',
    sub: '#5f6571',
    faint: '#9aa0ab',
    border: '#e6e8ed',
    line: '#eef0f3',
    hover: '#f2f3f6',
    accent: '#1F8A5B',
    accentSoft: '#e7f6ee',
    stage: '#e3e6ec',
    input: '#ffffff',
    shadow: '0 1px 4px rgba(20,24,40,.10)',
    danger: '#c2453d',
    dangerBorder: '#eccac7',
  },
  dark: {
    appBg: '#0e0f12',
    topbar: '#16171c',
    rail: '#16171c',
    panel: '#17181e',
    panel2: '#1d1f26',
    text: '#eaebef',
    sub: '#9a9fab',
    faint: '#6a6e79',
    border: '#292b33',
    line: '#22242b',
    hover: '#22242b',
    accent: '#2BA56E',
    accentSoft: '#14302322',
    stage: '#0b0c0f',
    input: '#1d1f26',
    shadow: '0 2px 8px rgba(0,0,0,.45)',
    danger: '#e2685f',
    dangerBorder: '#3a2a2a',
  },
}

// Platforms that share each canvas size (logo ids map to PlatformIcon).
export const PLATFORMS = {
  youtube: { name: 'YouTube', logo: 'youtube' },
  instagram: { name: 'Instagram', logo: 'instagram' },
  tiktok: { name: 'TikTok', logo: 'tiktok' },
  facebook: { name: 'Facebook', logo: 'facebook' },
  twitter: { name: 'X', logo: 'twitter' },
}

// Presets are grouped by exact pixel size; each lists the platforms that use it.
export const PRESETS = [
  { key: 'wide', name: 'Wide', w: 1920, h: 1080, platforms: ['youtube'] },
  {
    key: 'short',
    name: 'Short / Reel',
    w: 1080,
    h: 1920,
    platforms: ['youtube', 'instagram', 'tiktok', 'facebook'],
  },
  { key: 'square', name: 'Square', w: 1080, h: 1080, platforms: ['instagram'] },
  { key: 'portrait', name: 'Portrait', w: 1080, h: 1350, platforms: ['instagram'] },
  { key: 'landscape', name: 'Landscape', w: 1280, h: 720, platforms: ['twitter'] },
  { key: 'custom', name: 'Custom', w: 1080, h: 1080, platforms: [] },
]

// `key` is the real font-type that drives the quran.com fetch + font driver
// (see src/fonts/drivers.js). Order matches the design's 2×2 grid.
export const FONTS = [
  { key: 'qcf2', label: 'QCF2', sub: 'Madani v2' },
  { key: 'qcf1', label: 'QCF1', sub: 'Madani v1' },
  { key: 'indopak', label: 'IndoPak', sub: 'Naskh' },
  { key: 'uthmani', label: 'Uthmanic', sub: 'Hafs' },
]

export const COLORS = ['#FFFFFF', '#111114', '#F4D58D', '#D4A437', '#1F8A5B', '#1E66D0']

// Decorative Arabic sample shown on the font cards. QCF fonts can't render
// plain Arabic (they need glyph codes), so the picker samples use this unicode
// font purely as a style hint.
export const SAMPLE_FONT = 'UthmanicHafs'
