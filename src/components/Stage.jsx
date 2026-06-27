import { useState } from 'react'
import { useStudio } from '../StudioContext'
import { getPreset, bgStyle, effectiveStyle } from '../studio'
import { PLATFORMS } from '../data'
import CaptionFrame from './CaptionFrame'
import PlatformIcon from './PlatformIcon'
import Filmstrip from './Filmstrip'

export default function Stage() {
  const { state, t, scale, setStageEl, tr, rtl } = useStudio()
  const g = state.global
  const preset = getPreset(state)

  const cards = state.cards.length ? state.cards : [{ tokens: [], override: null }]
  const sel = Math.min(state.sel, cards.length - 1)
  const selCard = cards[sel]
  const eff = effectiveStyle(selCard, g)

  // Transient "hold to preview on a solid background" — local only, never
  // touches global state, so exports stay transparent regardless.
  const [pressColor, setPressColor] = useState(null)
  const cardBg = pressColor ? { background: pressColor } : bgStyle(state.previewBg)
  const bgButtons = [
    { color: '#000000', label: tr('stage.bgBlack') },
    { color: '#ffffff', label: tr('stage.bgWhite') },
  ]

  const overlay = (text) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: t.faint,
        fontWeight: 600,
        fontSize: 13,
        zIndex: 2,
      }}
    >
      {text}
    </div>
  )

  return (
    <div
      style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, background: t.stage }}
    >
      <div
        ref={setStageEl}
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            [rtl ? 'right' : 'left']: 14,
            bottom: 14,
            height: 28,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 600,
            fontSize: 11,
            color: t.sub,
            background: t.panel,
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: '0 9px',
            zIndex: 3,
          }}
        >
          {(preset.platforms || []).length > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {preset.platforms.map((id) => (
                <PlatformIcon key={id} logo={PLATFORMS[id].logo} size={12} />
              ))}
            </span>
          )}
          {tr(`preset.${preset.key}`)} · {preset.w}×{preset.h} · {Math.round(scale * 100)}%
        </div>

        {/* Hold-to-preview background swatches — opposite corner from the badge */}
        <div
          style={{
            position: 'absolute',
            [rtl ? 'left' : 'right']: 14,
            bottom: 14,
            height: 28,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: t.panel,
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            padding: '0 8px',
            zIndex: 3,
            userSelect: 'none',
          }}
        >
          {/* eye = "hold to preview" affordance */}
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke={t.sub}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flex: 'none' }}
            aria-hidden="true"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {bgButtons.map((b) => (
            <button
              key={b.color}
              type="button"
              title={b.label}
              aria-label={b.label}
              onPointerDown={(e) => {
                setPressColor(b.color)
                try {
                  e.currentTarget.setPointerCapture(e.pointerId)
                } catch {
                  // pointer capture is best-effort; preview still works without it
                }
              }}
              onPointerUp={() => setPressColor(null)}
              onPointerCancel={() => setPressColor(null)}
              onLostPointerCapture={() => setPressColor(null)}
              style={{
                width: 18,
                height: 18,
                padding: 0,
                borderRadius: 5,
                background: b.color,
                border: `1px solid ${b.color === '#ffffff' ? t.border : 'transparent'}`,
                boxShadow: pressColor === b.color ? `0 0 0 2px ${t.accent}` : 'none',
                cursor: 'pointer',
                flex: 'none',
              }}
            />
          ))}
        </div>

        {state.loadStatus === 'loading' && overlay(tr('stage.loading'))}
        {state.loadStatus === 'error' && overlay(tr('stage.error'))}

        <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
          <div
            style={{
              position: 'relative',
              width: `${preset.w}px`,
              height: `${preset.h}px`,
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: '0 12px 55px rgba(0,0,0,.32)',
              ...cardBg,
            }}
          >
            {selCard.tokens.length > 0 && (
              <CaptionFrame tokens={selCard.tokens} eff={eff} width={preset.w} height={preset.h} />
            )}
          </div>
        </div>
      </div>

      <Filmstrip />
    </div>
  )
}
