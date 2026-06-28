import { useStudio } from '../StudioContext'
import { effectiveStyle } from '../studio'
import { groupUnits } from '../caption/splitter'
import { Toggle, sectionLabel } from './ui'
import Range from './Range'

export default function CardInspector() {
  const { state, t, actions, tr, rtl, mobile } = useStudio()
  const g = state.global
  const label = sectionLabel(t)

  const cards = state.cards.length ? state.cards : [{ tokens: [], override: null }]
  const sel = Math.min(state.sel, cards.length - 1)
  const selCard = cards[sel]
  const eff = effectiveStyle(selCard, g)
  const overridden = !!selCard.override

  const ayahs = [...new Set(selCard.tokens.map((tk) => tk.ayah))]
  const cardAyahLabel = ayahs.length
    ? tr('verses.ayah') + ' ' + (ayahs.length > 1 ? `${ayahs[0]}–${ayahs[ayahs.length - 1]}` : ayahs[0])
    : '—'
  const inh = tr('card.inherits').split('{b}')

  const units = groupUnits(selCard.tokens)
  const wordCount = units.length
  const canMove = units.length > 1
  const canPrev = sel > 0
  const firstTok = units[0]?.[0]
  const lastTok = units[units.length - 1]?.[0]

  const glyph = (tk) =>
    tk ? (
      <span
        style={{
          fontFamily: `"${tk.family}"`,
          fontSize: 24,
          color: t.text,
          direction: 'rtl',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          fontSmooth: 'always',
          textRendering: 'optimizeLegibility',
        }}
      >
        {tk.text}
      </span>
    ) : (
      <span style={{ fontSize: 22, color: t.faint }}>—</span>
    )

  const moveBtn = (enabled) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    border: `1px solid ${t.border}`,
    borderRadius: 9,
    background: t.panel,
    color: enabled ? t.accent : t.faint,
    cursor: enabled ? 'pointer' : 'not-allowed',
    fontWeight: 700,
    fontSize: 11.5,
    fontFamily: "'Plus Jakarta Sans'",
    opacity: enabled ? 1 : 0.5,
  })

  const navBtn = {
    width: 30,
    height: 30,
    flex: 'none',
    border: `1px solid ${t.border}`,
    borderRadius: 8,
    background: t.panel2,
    color: t.text,
    cursor: 'pointer',
    fontSize: 16,
    lineHeight: 1,
  }

  const wordBox = {
    marginTop: 9,
    padding: '11px 12px',
    borderRadius: 11,
    background: t.panel2,
    border: `1px solid ${t.border}`,
  }

  return (
    <div
      style={{
        width: mobile ? '100%' : 328,
        flex: 'none',
        height: '100%',
        background: t.panel,
        [rtl ? 'borderRight' : 'borderLeft']: mobile ? 'none' : `1px solid ${t.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Card navigation */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: `1px solid ${t.line}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <button onClick={actions.prevCard} style={navBtn}>
          ‹
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: t.text }}>
            {tr('card.of', { n: sel + 1, m: cards.length })}
          </div>
          <div style={{ fontWeight: 500, fontSize: 11, color: t.faint, marginTop: 1 }}>
            {cardAyahLabel} · {tr('card.words', { n: wordCount })}
          </div>
        </div>
        <button onClick={actions.nextCard} style={navBtn}>
          ›
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: 16 }}>
        {/* Override toggle */}
        <div
          data-tour="card-size"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: t.text }}>{tr('card.customSize')}</div>
            <div style={{ fontWeight: 500, fontSize: 10.5, color: t.faint, marginTop: 1 }}>
              {tr('card.overrideSize')}
            </div>
          </div>
          <Toggle on={overridden} onToggle={actions.toggleOverride} w={44} h={25} knob={19} />
        </div>

        {!overridden && (
          <div
            style={{
              marginTop: 12,
              padding: '11px 12px',
              borderRadius: 10,
              background: t.panel2,
              border: `1px dashed ${t.border}`,
              fontWeight: 500,
              fontSize: 11,
              lineHeight: 1.5,
              color: t.sub,
            }}
          >
            {inh[0]}
            <b style={{ color: t.text }}>{tr('card.customSize')}</b>
            {inh[1]}
          </div>
        )}

        {overridden && (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '0 0 7px',
              }}
            >
              <span style={label}>{tr('card.size')}</span>
              <span style={{ fontWeight: 700, fontSize: 11, color: t.sub }}>{eff.size}px</span>
            </div>
            <Range
              min={40}
              max={180}
              step={2}
              value={eff.size}
              onChange={(e) => actions.setCardField('size', +e.target.value)}
            />

            <button
              onClick={actions.resetCard}
              style={{
                marginTop: 14,
                width: '100%',
                padding: '8px 0',
                border: `1px solid ${t.border}`,
                borderRadius: 9,
                background: 'transparent',
                color: t.sub,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 11.5,
                fontFamily: 'inherit',
              }}
            >
              {tr('card.reset')}
            </button>
          </div>
        )}

        <div style={{ height: 1, background: t.line, margin: '18px -16px' }} />

        {/* Adjust words */}
        <div data-tour="adjust">
        <div style={{ fontWeight: 700, fontSize: 12.5, color: t.text }}>{tr('card.adjustWords')}</div>
        <div style={{ fontWeight: 500, fontSize: 10.5, color: t.faint, marginTop: 2 }}>
          {tr('card.adjustHelp')}
        </div>

        <div style={{ ...wordBox, marginTop: 12 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 10,
              color: t.faint,
              textTransform: 'uppercase',
              letterSpacing: '.05em',
            }}
          >
            {tr('card.firstWord')}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              marginTop: 7,
            }}
          >
            {glyph(firstTok)}
            <button
              onClick={actions.moveFirst}
              disabled={!(canPrev && canMove)}
              style={moveBtn(canPrev && canMove)}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: rtl ? 'scaleX(-1)' : undefined }}
              >
                <path d="M9 3l-4 4 4 4" />
              </svg>
              {tr('card.prev')}
            </button>
          </div>
        </div>

        <div style={wordBox}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 10,
              color: t.faint,
              textTransform: 'uppercase',
              letterSpacing: '.05em',
            }}
          >
            {tr('card.lastWord')}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              marginTop: 7,
            }}
          >
            {glyph(lastTok)}
            <button onClick={actions.moveLast} disabled={!canMove} style={moveBtn(canMove)}>
              {tr('card.next')}
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: rtl ? 'scaleX(-1)' : undefined }}
              >
                <path d="M5 3l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>
        </div>

        <div style={{ height: 1, background: t.line, margin: '18px -16px' }} />

        <button
          onClick={() => actions.doExportCard(sel)}
          disabled={state.exporting || !selCard.tokens.length}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            padding: '9px 0',
            border: `1px solid ${t.accent}`,
            borderRadius: 9,
            background: 'transparent',
            color: t.accent,
            cursor: state.exporting ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: 12,
            fontFamily: 'inherit',
            opacity: state.exporting || !selCard.tokens.length ? 0.5 : 1,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2.5v7" />
            <path d="M5 6.5l3 3 3-3" />
            <path d="M3 12.5h10" />
          </svg>
          {tr('card.exportPng')}
        </button>

        {cards.length > 1 && (
          <button
            onClick={actions.deleteCard}
            style={{
              marginTop: 9,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              padding: '9px 0',
              border: `1px solid ${t.dangerBorder}`,
              borderRadius: 9,
              background: 'transparent',
              color: t.danger,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 12,
              fontFamily: 'inherit',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
            {tr('card.delete')}
          </button>
        )}
      </div>

      {/* Export all — pinned footer */}
      <div data-tour="export" style={{ flex: 'none', padding: 14, borderTop: `1px solid ${t.line}` }}>
        <button
          onClick={actions.doExportAll}
          disabled={state.exporting || state.loadStatus !== 'ready'}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            padding: '14px 0',
            border: 0,
            borderRadius: 11,
            background: t.accent,
            color: '#fff',
            cursor: state.exporting || state.loadStatus !== 'ready' ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: 14.5,
            fontFamily: 'inherit',
            opacity: state.exporting || state.loadStatus !== 'ready' ? 0.6 : 1,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* back card of the stack */}
            <path d="M16 3.5h2.5A1.5 1.5 0 0 1 20 5v10" />
            {/* front card */}
            <rect x="3.5" y="6.5" width="12" height="14" rx="1.8" />
            {/* download arrow into the front card */}
            <path d="M9.5 10.5v5" />
            <path d="M7 13l2.5 2.5L12 13" />
          </svg>
          {state.exporting ? state.exportMsg || tr('export.exporting') : tr('export.all')}
        </button>
      </div>
    </div>
  )
}
