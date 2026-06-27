// localStorage persistence for the studio's user settings.
//
// We persist only user *preferences* — never derived/fetched/transient state.
// Cards, tokens, the chapter list, load/export/modal flags, etc. are rebuilt on
// mount: the load effect re-fetches the selected verses and re-runs the
// deterministic auto-split, so restoring the settings reproduces the same cards.
// (Manual per-card word nudges and size overrides are therefore not persisted —
// they reset to the auto-split on reload.)

const KEY = 'quran-captions:settings:v1'

// Top-level scalar fields that are safe to restore.
const FIELDS = [
  'theme',
  'locale',
  'tool',
  'presetKey',
  'customW',
  'customH',
  'surahNum',
  'versesCount',
  'fromAyah',
  'toAyah',
  'previewBg',
]

// Extract just the persistable slice of state.
function pick(state) {
  const out = {}
  for (const k of FIELDS) out[k] = state[k]
  out.global = { ...state.global }
  return out
}

// Merge any saved settings over the defaults. Unknown/missing keys fall back to
// the default, so the schema can evolve without breaking old saved blobs.
export function loadSettings(initial) {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initial
    const saved = JSON.parse(raw)
    if (!saved || typeof saved !== 'object') return initial
    const merged = { ...initial }
    for (const k of FIELDS) {
      if (saved[k] !== undefined) merged[k] = saved[k]
    }
    if (saved.global && typeof saved.global === 'object') {
      merged.global = { ...initial.global, ...saved.global }
    }
    return merged
  } catch {
    // Corrupt JSON or storage disabled — fall back to defaults.
    return initial
  }
}

export function saveSettings(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(pick(state)))
  } catch {
    // Storage unavailable (private mode / quota) — persistence is best-effort.
  }
}
