import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'
import { THEMES } from './data'
import { getPreset, computeScale } from './studio'
import { fetchChapters, fetchSampleWord } from './quran/client'
import { getDriver } from './fonts/drivers'
import { loadPageFont } from './fonts/pageFonts'
import { measureTokens } from './caption/measure'
import { splitIntoCards, contentWidthFor, wrapTokens, groupUnits } from './caption/splitter'
import { renderNodeToPng } from './export/png'
import { downloadZip, downloadDataUrl } from './export/zip'
import { cardFilename } from './export/filename'
import { loadUnicodeFont, UNICODE_FONTS } from './fonts/unicodeFonts'
import { translate } from './i18n'
import { loadSettings, saveSettings } from './persistence'

const StudioContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useStudio = () => useContext(StudioContext)

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

const INITIAL = {
  theme: 'light',
  locale: 'en',
  tool: 'verses',
  presetKey: 'wide',
  customW: 1080,
  customH: 1350,

  chapters: [],
  chaptersStatus: 'idle',
  surahNum: 1, // chapter id
  versesCount: 7,
  fromAyah: 1,
  toAyah: 7,

  global: {
    font: 'qcf2', // real font-type (see src/fonts/drivers.js)
    size: 104,
    color: '#111114',
    linesPerCard: 1,
    lineHeight: 1.7,
    shadow: false,
    shadowSize: 22,
    shadowColor: '#000000',
    stroke: false,
    strokeW: 4,
    strokeColor: '#000000',
    showOrnament: true,
  },

  cards: [],
  sel: 0,
  previewBg: 'transparent',

  loadStatus: 'idle', // idle | loading | ready | error
  fontEmbedCss: '',
  exporting: false,
  exportMsg: null,
  toast: null,
  modal: null, // { title, message } | null
  share: false, // share dialog open
  donate: false, // donate dialog open

  // Per-font sample ("بِسْمِ") rendered in each font's own typeface on the
  // picker. QCF fonts need their glyph code; unicode fonts use the word itself.
  // Starts as a unicode fallback until the glyph codes + page fonts load.
  fontSamples: {
    qcf2: { text: 'بِسْمِ', family: 'UthmanicHafs' },
    qcf1: { text: 'بِسْمِ', family: 'UthmanicHafs' },
    uthmani: { text: 'بِسْمِ', family: 'UthmanicHafs' },
    indopak: { text: 'بِسْمِ', family: 'IndoPak' },
  },

  // Calligraphic surah-name font readiness — until it loads we show the plain
  // unicode name (rendering the ligature text early would flash "surah001").
  surahFontReady: false,
}

// Below this viewport width the studio switches from the 3-column desktop layout
// to a single-column mobile shell (full-bleed stage + bottom nav + sheets).
const MOBILE_QUERY = '(max-width: 1023px)'

export function StudioProvider({ children }) {
  // Restore persisted user settings over the defaults (cards/fonts rebuild on mount).
  const [state, setState] = useState(() => loadSettings(INITIAL))
  const [scale, setScale] = useState(0.3)
  const [stageEl, setStageEl] = useState(null)
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(MOBILE_QUERY).matches,
  )

  const streamRef = useRef([]) // measured flat token stream for the current load
  const stateRef = useRef(state)
  const loadReq = useRef(0)
  const toastTimer = useRef(null)
  stateRef.current = state

  const patch = useCallback(
    (p) => setState((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) })),
    [],
  )

  const flashToast = useCallback((msg, ms = 3000) => {
    setState((s) => ({ ...s, toast: msg }))
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setState((s) => ({ ...s, toast: null })), ms)
  }, [])

  // ── Load all 114 chapters once + preload the UI sample font ──────────────
  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, chaptersStatus: 'loading' }))
    fetchChapters('en')
      .then((chapters) => {
        if (cancelled) return
        setState((s) => {
          const ch = chapters.find((c) => c.id === s.surahNum)
          return { ...s, chapters, chaptersStatus: 'ready', versesCount: ch?.versesCount ?? s.versesCount }
        })
      })
      .catch((e) => {
        if (cancelled) return
        console.error('fetchChapters failed', e)
        setState((s) => ({ ...s, chaptersStatus: 'error' }))
      })
    loadUnicodeFont(UNICODE_FONTS.uthmani).catch(() => {})
    // Calligraphic surah-name font (declared via @font-face in index.css).
    if (document.fonts?.load) {
      document.fonts
        .load('24px "surah-name-v4"', 'surah001')
        .then(() => {
          if (!cancelled) setState((s) => ({ ...s, surahFontReady: true }))
        })
        .catch(() => {})
    }
    return () => {
      cancelled = true
    }
  }, [])

  // ── Build correct per-font samples for the font picker ───────────────────
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        loadUnicodeFont(UNICODE_FONTS.indopak).catch(() => {})
        const w = await fetchSampleWord()
        const [v2font, v1font] = await Promise.all([
          loadPageFont('v2', w.pageV2),
          loadPageFont('v1', w.pageV1),
        ])
        if (cancelled) return
        setState((s) => ({
          ...s,
          fontSamples: {
            qcf2: { text: w.codeV2 || 'بِسْمِ', family: v2font.family },
            qcf1: { text: w.codeV1 || 'بِسْمِ', family: v1font.family },
            uthmani: { text: 'بِسْمِ', family: 'UthmanicHafs' },
            indopak: { text: 'بِسْمِ', family: 'IndoPak' },
          },
        }))
      } catch (e) {
        console.error('font samples load failed', e)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // ── Fetch verses + load fonts + measure + split whenever the source changes ─
  useEffect(() => {
    let cancelled = false
    const id = ++loadReq.current
    setState((s) => ({ ...s, loadStatus: 'loading' }))
    ;(async () => {
      try {
        const { surahNum, fromAyah, toAyah, global } = stateRef.current
        const driver = getDriver(global.font)
        const verses = await driver.fetchRange(surahNum, fromAyah, toAyah, {
          showOrnament: global.showOrnament,
        })
        const { fontEmbedCss } = await driver.loadFonts(verses)
        let idc = 0
        const stream = verses.flatMap((v) => v.tokens.map((tk) => ({ ...tk, id: idc++ })))
        measureTokens(stream)
        if (cancelled || id !== loadReq.current) return
        streamRef.current = stream
        setState((s) => {
          if (id !== loadReq.current) return s
          const cards = splitIntoCards(stream, {
            fontSize: s.global.size,
            contentWidth: contentWidthFor(getPreset(s).w),
            linesPerCard: s.global.linesPerCard,
          })
          return { ...s, loadStatus: 'ready', fontEmbedCss, cards, sel: 0 }
        })
      } catch (e) {
        if (cancelled || id !== loadReq.current) return
        console.error('caption load failed', e)
        setState((s) => ({ ...s, loadStatus: 'error' }))
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.surahNum, state.fromAyah, state.toAyah, state.global.font, state.global.showOrnament])

  // ── Fit-to-stage scaling ─────────────────────────────────────────────────
  useEffect(() => {
    if (!stageEl) return
    const measure = () => {
      const sc = computeScale(stageEl, getPreset(stateRef.current))
      setScale((prev) => (Math.abs(sc - prev) > 0.0005 ? sc : prev))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stageEl)
    return () => ro.disconnect()
  }, [stageEl, state.presetKey, state.customW, state.customH])

  // ── Track the mobile/desktop breakpoint ──────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = () => setMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  // ── Persist user settings to localStorage (debounced) ────────────────────
  // `state.global` is a fresh object on any style change, so depending on it
  // catches every global edit; the scalars cover the rest. Debounced so dragging
  // a slider doesn't hammer storage. Saves the latest state via stateRef.
  useEffect(() => {
    const id = setTimeout(() => saveSettings(stateRef.current), 250)
    return () => clearTimeout(id)
  }, [
    state.theme,
    state.locale,
    state.tool,
    state.presetKey,
    state.customW,
    state.customH,
    state.surahNum,
    state.versesCount,
    state.fromAyah,
    state.toAyah,
    state.previewBg,
    state.global,
  ])

  // Re-split the current token stream into cards using the latest settings.
  const resplitState = (s) => ({
    ...s,
    sel: 0,
    cards: splitIntoCards(streamRef.current, {
      fontSize: s.global.size,
      contentWidth: contentWidthFor(getPreset(s).w),
      linesPerCard: s.global.linesPerCard,
    }),
  })

  // How many lines a token set wraps into at the current canvas width.
  const cardLines = (s, tokens, fontSize) =>
    wrapTokens(tokens, fontSize, contentWidthFor(getPreset(s).w)).length
  const overLimitModal = (s) => ({
    title: translate(s.locale, 'modal.lineLimit.title'),
    message: translate(s.locale, 'modal.lineLimit.msg', { n: s.global.linesPerCard }),
  })

  // ── Actions ──────────────────────────────────────────────────────────────
  const setTheme = (theme) => patch({ theme })
  const toggleTheme = () => patch((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' }))
  const toggleLocale = () => patch((s) => ({ locale: s.locale === 'en' ? 'ar' : 'en' }))
  const setTool = (tool) => patch({ tool })

  const setPreset = (presetKey) => patch({ presetKey })
  const setCustom = (dim, v) => {
    const val = clamp(parseInt(v, 10) || 0, 200, 4096)
    patch(dim === 'w' ? { customW: val } : { customH: val })
  }

  const setSurah = (num) =>
    setState((s) => {
      const ch = s.chapters.find((c) => c.id === num)
      const versesCount = ch?.versesCount ?? s.versesCount
      return { ...s, surahNum: num, versesCount, fromAyah: 1, toAyah: Math.min(7, versesCount) || 1 }
    })
  const setFrom = (v) =>
    setState((s) => {
      const from = clamp(v, 1, s.versesCount || 1)
      return { ...s, fromAyah: from, toAyah: Math.max(from, s.toAyah) }
    })
  const setTo = (v) =>
    setState((s) => {
      const to = clamp(v, 1, s.versesCount || 1)
      return { ...s, toAyah: Math.max(s.fromAyah, to) }
    })
  const resplit = () => setState((s) => resplitState(s))

  const setGlobal = (field, value) => patch((s) => ({ global: { ...s.global, [field]: value } }))
  const setFont = (k) => setGlobal('font', k) // triggers a refetch in the new font type
  const setSize = (v) =>
    setState((s) => {
      const nv = +v
      if (nv > s.global.size) {
        const exceeds = s.cards.some(
          (c) => cardLines(s, c.tokens, c.override?.size ?? nv) > s.global.linesPerCard,
        )
        if (exceeds) return { ...s, modal: overLimitModal(s) }
      }
      return { ...s, global: { ...s.global, size: nv } }
    })
  const setColor = (c) => setGlobal('color', c)
  const setLineHeight = (v) => setGlobal('lineHeight', +v)
  const setLines = (n) => setState((s) => resplitState({ ...s, global: { ...s.global, linesPerCard: n } }))

  const selectCard = (i) => patch({ sel: i })
  const prevCard = () => patch((s) => ({ sel: Math.max(0, s.sel - 1) }))
  const nextCard = () => patch((s) => ({ sel: Math.min(s.cards.length - 1, s.sel + 1) }))
  const toggleOverride = () =>
    patch((s) => ({
      cards: s.cards.map((c, i) =>
        i === s.sel ? { tokens: c.tokens, override: c.override ? null : { size: s.global.size } } : c,
      ),
    }))
  const setCardField = (f, v) =>
    setState((s) => {
      if (f === 'size') {
        const card = s.cards[s.sel]
        if (
          card &&
          +v > (card.override?.size ?? s.global.size) &&
          cardLines(s, card.tokens, +v) > s.global.linesPerCard
        ) {
          return { ...s, modal: overLimitModal(s) }
        }
      }
      return {
        ...s,
        cards: s.cards.map((c, i) =>
          i === s.sel ? { tokens: c.tokens, override: { ...(c.override || {}), [f]: v } } : c,
        ),
      }
    })
  const resetCard = () =>
    patch((s) => ({ cards: s.cards.map((c, i) => (i === s.sel ? { tokens: c.tokens, override: null } : c)) }))
  const deleteCard = () =>
    setState((s) => {
      if (s.cards.length <= 1) return s
      const cards = s.cards.slice()
      cards.splice(s.sel, 1)
      return { ...s, cards, sel: Math.max(0, s.sel - 1) }
    })

  // Move the last word unit (word + its ayah ornament) to the next card.
  const moveLast = () =>
    setState((s) => {
      const i = s.sel
      const cards = s.cards.map((c) => ({ tokens: c.tokens.slice(), override: c.override }))
      if (!cards[i]) return s
      const units = groupUnits(cards[i].tokens)
      if (units.length <= 1) return s
      const unit = units[units.length - 1]
      const target = cards[i + 1] || { tokens: [], override: null }
      const eff = target.override?.size ?? s.global.size
      if (cardLines(s, [...unit, ...target.tokens], eff) > s.global.linesPerCard) {
        return { ...s, modal: overLimitModal(s) }
      }
      cards[i].tokens.splice(cards[i].tokens.length - unit.length, unit.length)
      if (!cards[i + 1]) cards.splice(i + 1, 0, { tokens: [], override: null })
      cards[i + 1].tokens = [...unit, ...cards[i + 1].tokens]
      return { ...s, cards }
    })
  // Move the first word unit (word + its ayah ornament) to the previous card.
  const moveFirst = () =>
    setState((s) => {
      const i = s.sel
      if (i === 0) return s
      const cards = s.cards.map((c) => ({ tokens: c.tokens.slice(), override: c.override }))
      const units = groupUnits(cards[i].tokens)
      if (units.length <= 1) return s
      const unit = units[0]
      const target = cards[i - 1]
      const eff = target.override?.size ?? s.global.size
      if (cardLines(s, [...target.tokens, ...unit], eff) > s.global.linesPerCard) {
        return { ...s, modal: overLimitModal(s) }
      }
      cards[i].tokens.splice(0, unit.length)
      cards[i - 1].tokens = [...cards[i - 1].tokens, ...unit]
      return { ...s, cards }
    })

  const setPreviewBg = (m) => patch({ previewBg: m })
  const closeModal = () => patch({ modal: null })
  const openShare = () => patch({ share: true })
  const closeShare = () => patch({ share: false })
  const openDonate = () => patch({ donate: true })
  const closeDonate = () => patch({ donate: false })

  // ── Export (real transparent-PNG pipeline) ────────────────────────────────
  const exportFrame = async (node, preset, fontEmbedCss) => {
    const frame = node.firstElementChild || node
    return renderNodeToPng(frame, { width: preset.w, height: preset.h, fontEmbedCss })
  }

  const doExportAll = useCallback(async () => {
    const s = stateRef.current
    if (s.exporting || !s.cards.length) return
    const lc = s.locale
    setState((st) => ({ ...st, exporting: true, exportMsg: translate(lc, 'export.exporting') }))
    try {
      const preset = getPreset(s)
      const nodes = [...document.querySelectorAll('[data-export-node]')].sort(
        (a, b) => Number(a.dataset.cardIndex) - Number(b.dataset.cardIndex),
      )
      const items = []
      for (let i = 0; i < nodes.length; i++) {
        const dataUrl = await exportFrame(nodes[i], preset, s.fontEmbedCss)
        items.push({ filename: cardFilename(i, nodes.length, s.cards[i], s.surahNum), dataUrl })
        setState((st) => ({ ...st, exportMsg: translate(lc, 'export.rendering', { i: i + 1, n: nodes.length }) }))
      }
      await downloadZip(items, `quran-${String(s.surahNum).padStart(3, '0')}.zip`)
      flashToast(translate(lc, 'toast.exportedZip', { n: items.length }))
    } catch (e) {
      console.error('export failed', e)
      flashToast(translate(lc, 'toast.exportFailed'))
    } finally {
      setState((st) => ({ ...st, exporting: false, exportMsg: null }))
    }
  }, [flashToast])

  const doExportCard = useCallback(
    async (i) => {
      const s = stateRef.current
      if (s.exporting) return
      const node = document.querySelector(`[data-export-node][data-card-index="${i}"]`)
      if (!node) return
      setState((st) => ({ ...st, exporting: true }))
      try {
        const preset = getPreset(s)
        const dataUrl = await exportFrame(node, preset, s.fontEmbedCss)
        downloadDataUrl(dataUrl, cardFilename(i, s.cards.length, s.cards[i], s.surahNum))
        flashToast(translate(s.locale, 'toast.exportedCard'))
      } catch (e) {
        console.error('export failed', e)
        flashToast(translate(s.locale, 'toast.exportFailed'))
      } finally {
        setState((st) => ({ ...st, exporting: false }))
      }
    },
    [flashToast],
  )

  const value = {
    state,
    scale,
    mobile,
    t: THEMES[state.theme],
    locale: state.locale,
    rtl: state.locale === 'ar',
    tr: (key, vars) => translate(state.locale, key, vars),
    setStageEl,
    actions: {
      setTheme,
      toggleTheme,
      toggleLocale,
      setTool,
      setPreset,
      setCustom,
      setSurah,
      setFrom,
      setTo,
      resplit,
      setFont,
      setSize,
      setColor,
      setLines,
      setLineHeight,
      setGlobal,
      selectCard,
      prevCard,
      nextCard,
      toggleOverride,
      setCardField,
      resetCard,
      deleteCard,
      moveLast,
      moveFirst,
      setPreviewBg,
      closeModal,
      openShare,
      closeShare,
      openDonate,
      closeDonate,
      doExportAll,
      doExportCard,
    },
  }

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}
