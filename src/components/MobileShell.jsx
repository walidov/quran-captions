import { useState } from 'react'
import { useStudio } from '../StudioContext'
import Stage from './Stage'
import VersesPanel from './panels/VersesPanel'
import StylePanel from './panels/StylePanel'
import CardInspector from './CardInspector'
import HeaderControls from './HeaderControls'
import MobileSheet from './MobileSheet'

// Bottom-nav icons --------------------------------------------------------
function VersesGlyph() {
  return (
    <span style={{ fontSize: 24, lineHeight: 1, fontFamily: "'Amiri', 'UthmanicHafs', serif" }}>۝</span>
  )
}
function StyleGlyph() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 1, lineHeight: 1, fontFamily: "'Amiri', serif" }}>
      <span style={{ fontSize: 21, fontWeight: 700 }}>ع</span>
      <span style={{ fontSize: 13, fontWeight: 700 }}>ع</span>
    </span>
  )
}
function CanvasGlyph() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="4" width="19" height="13" rx="2.2" />
      <path d="M8.5 20.5h7" />
      <path d="M12 17.2v3.3" />
    </svg>
  )
}
function CardGlyph() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="13" height="15" rx="2" />
      <path d="M8 3.5h10A1.5 1.5 0 0 1 19.5 5v12" />
    </svg>
  )
}
function ExportGlyph() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3.5h2.5A1.5 1.5 0 0 1 20 5v10" />
      <rect x="3.5" y="6.5" width="12" height="14" rx="1.8" />
      <path d="M9.5 10.5v5" />
      <path d="M7 13l2.5 2.5L12 13" />
    </svg>
  )
}

export default function MobileShell() {
  const { state, t, actions, tr } = useStudio()
  const [sheet, setSheet] = useState(null) // 'verses' | 'text' | 'canvas' | 'card' | null

  const open = (id) => {
    if (id === 'verses' || id === 'text') actions.setTool(id)
    setSheet((cur) => (cur === id ? null : id))
  }
  const close = () => setSheet(null)

  const exportDisabled = state.exporting || state.loadStatus !== 'ready'

  const items = [
    { id: 'verses', label: tr('tool.verses'), icon: <VersesGlyph /> },
    { id: 'text', label: tr('tool.style'), icon: <StyleGlyph /> },
    { id: 'canvas', label: tr('nav.canvas'), icon: <CanvasGlyph /> },
    { id: 'card', label: tr('nav.card'), icon: <CardGlyph /> },
    {
      id: 'export',
      label: state.exporting ? tr('export.exporting') : tr('nav.export'),
      icon: <ExportGlyph />,
      action: () => !exportDisabled && actions.doExportAll(),
      disabled: exportDisabled,
      primary: true,
    },
  ]

  const navBtn = (it) => {
    const active = sheet === it.id
    const accent = it.primary && !it.disabled
    return {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      padding: '8px 2px 10px',
      border: 0,
      background: 'transparent',
      cursor: it.disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit',
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: '.01em',
      opacity: it.disabled ? 0.45 : 1,
      color: active || accent ? t.accent : t.sub,
    }
  }

  const sheetContent = {
    verses: <VersesPanel />,
    text: <StylePanel />,
    card: <CardInspector />,
    canvas: (
      <div style={{ padding: '6px 18px 24px', overflowY: 'auto' }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>{tr('nav.canvas')}</div>
        <div style={{ fontWeight: 500, fontSize: 11.5, color: t.faint, margin: '3px 0 18px' }}>
          {tr('nav.canvasSub')}
        </div>
        <HeaderControls />
      </div>
    ),
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
      <Stage />

      {/* Bottom navigation */}
      <div
        style={{
          flex: 'none',
          display: 'flex',
          alignItems: 'stretch',
          background: t.panel,
          borderTop: `1px solid ${t.border}`,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          zIndex: 6,
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => (it.action ? it.action() : open(it.id))}
            disabled={it.disabled}
            aria-label={it.label}
            style={navBtn(it)}
          >
            <span style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {it.icon}
            </span>
            <span
              style={{
                marginTop: 4,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {it.label}
            </span>
          </button>
        ))}
      </div>

      {sheet && (
        <MobileSheet onClose={close} label={items.find((i) => i.id === sheet)?.label}>
          {sheetContent[sheet]}
        </MobileSheet>
      )}
    </div>
  )
}
