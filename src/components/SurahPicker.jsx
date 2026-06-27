import { useState, useRef, useEffect } from 'react'
import { useStudio } from '../StudioContext'

// Searchable autocomplete combobox for picking a surah. Filters all 114 by
// number, English name, or Arabic name.
export default function SurahPicker() {
  const { state, t, actions, tr, rtl } = useStudio()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const wrapRef = useRef(null)
  const listRef = useRef(null)

  const current = state.chapters.find((c) => c.id === state.surahNum)
  const currentLabel = current
    ? `${current.id}. ${rtl ? current.nameArabic : current.nameSimple}`
    : `${tr('verses.surah')} ${state.surahNum}`

  const q = query.trim().toLowerCase()
  const results = state.chapters.filter((c) => {
    if (!q) return true
    return (
      String(c.id).includes(q) ||
      c.nameSimple.toLowerCase().includes(q) ||
      (c.translatedName || '').toLowerCase().includes(q) ||
      (c.nameArabic || '').includes(query.trim())
    )
  })

  // Close on outside click.
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Keep the active option in view.
  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.children[active]
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const openPicker = () => {
    setQuery('')
    setActive(Math.max(0, results.findIndex((c) => c.id === state.surahNum)))
    setOpen(true)
  }
  const choose = (c) => {
    actions.setSurah(c.id)
    setOpen(false)
    setQuery('')
  }
  const onKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      openPicker()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(results.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[active]) choose(results[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const ready = state.chaptersStatus === 'ready'

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <input
        value={open ? query : currentLabel}
        placeholder={ready ? tr('surah.search') : tr('surah.loading')}
        disabled={!ready}
        onFocus={openPicker}
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(0)
          if (!open) setOpen(true)
        }}
        onKeyDown={onKeyDown}
        aria-label="Surah"
        style={{
          width: '100%',
          padding: rtl ? '10px 11px 10px 32px' : '10px 32px 10px 11px',
          border: `1px solid ${open ? t.accent : t.border}`,
          borderRadius: 9,
          background: t.input,
          color: t.text,
          fontWeight: 600,
          fontSize: 12.5,
          fontFamily: 'inherit',
          cursor: 'pointer',
          outline: 'none',
        }}
      />
      <svg
        style={{ position: 'absolute', [rtl ? 'left' : 'right']: 11, top: 15, pointerEvents: 'none' }}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke={t.faint}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 4.5L6 7.5L9 4.5" />
      </svg>

      {open && (
        <div
          ref={listRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            maxHeight: 264,
            overflowY: 'auto',
            background: t.panel,
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            boxShadow: t.shadow,
            zIndex: 30,
            padding: 4,
          }}
        >
          {results.length === 0 && (
            <div style={{ padding: '10px 11px', fontSize: 12, color: t.faint }}>{tr('surah.noMatches')}</div>
          )}
          {results.map((c, i) => {
            const selected = c.id === state.surahNum
            const isActive = i === active
            return (
              <button
                key={c.id}
                onMouseDown={(e) => {
                  e.preventDefault()
                  choose(c)
                }}
                onMouseEnter={() => setActive(i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  border: 0,
                  borderRadius: 7,
                  cursor: 'pointer',
                  textAlign: 'left',
                  background: isActive ? t.accentSoft : 'transparent',
                  color: selected ? t.accent : t.text,
                }}
              >
                <span
                  style={{
                    flex: 'none',
                    width: 22,
                    fontWeight: 700,
                    fontSize: 11,
                    color: selected ? t.accent : t.faint,
                  }}
                >
                  {c.id}
                </span>
                <span style={{ flex: 1, fontWeight: 600, fontSize: 12.5 }}>{c.nameSimple}</span>
                <span
                  style={{
                    fontFamily: "'UthmanicHafs', 'Amiri', serif",
                    fontSize: 15,
                    color: t.sub,
                    direction: 'rtl',
                  }}
                >
                  {c.nameArabic}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
