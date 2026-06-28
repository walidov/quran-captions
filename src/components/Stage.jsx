import { useState } from 'react'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { useStudio } from '../StudioContext'
import { getPreset, bgStyle, effectiveStyle } from '../studio'
import { groupUnits } from '../caption/splitter'
import { PLATFORMS } from '../data'
import CaptionFrame from './CaptionFrame'
import CaptionSkeleton from './CaptionSkeleton'
import PlatformIcon from './PlatformIcon'
import Filmstrip from './Filmstrip'

// Directional chevron for the move tooltips — matches the card-inspector move
// buttons (points "back" for previous, "forward" for next; flips in RTL).
function TipChevron({ dir, rtl }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: rtl ? 'scaleX(-1)' : undefined, flexShrink: 0 }}
      aria-hidden="true"
    >
      {dir === 'prev' ? <path d="M9 3l-4 4 4 4" /> : <path d="M5 3l4 4-4 4" />}
    </svg>
  )
}

export default function Stage() {
  const { state, t, scale, setStageEl, tr, rtl, actions } = useStudio()
  const g = state.global
  const preset = getPreset(state)

  const cards = state.cards.length ? state.cards : [{ tokens: [], override: null }]
  const sel = Math.min(state.sel, cards.length - 1)
  const selCard = cards[sel]
  const eff = effectiveStyle(selCard, g)

  // First/last word units are clickable in the preview to move them to the
  // neighbouring card (mirrors the card inspector's move buttons).
  const units = groupUnits(selCard.tokens)
  const canMove = units.length > 1
  const canPrev = sel > 0
  const firstIds = canMove ? new Set(units[0].map((tk) => tk.id)) : null
  const lastIds = canMove ? new Set(units[units.length - 1].map((tk) => tk.id)) : null

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
            {state.loadStatus === 'loading' ? (
              <CaptionSkeleton width={preset.w} height={preset.h} eff={eff} />
            ) : (
              selCard.tokens.length > 0 && (
                <CaptionFrame
                  tokens={selCard.tokens}
                  eff={eff}
                  width={preset.w}
                  height={preset.h}
                  interactive
                  firstIds={firstIds}
                  lastIds={lastIds}
                  canMoveFirst={canPrev && canMove}
                  canMoveLast={canMove}
                  onMoveFirst={actions.moveFirst}
                  onMoveLast={actions.moveLast}
                  firstLabel={tr('word.movePrev')}
                  lastLabel={tr('word.moveNext')}
                  edgeColor={t.accent}
                />
              )
            )}
          </div>
        </div>
      </div>

      <Filmstrip />

      <Tooltip
        id="word-move-tip"
        place="top"
        offset={10}
        className="word-move-tip"
        noArrow={false}
        render={({ content, activeAnchor }) => {
          const isPrev = activeAnchor?.getAttribute('data-edge') === 'first'
          return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {isPrev && <TipChevron dir="prev" rtl={rtl} />}
              <span>{content}</span>
              {!isPrev && <TipChevron dir="next" rtl={rtl} />}
            </span>
          )
        }}
      />
    </div>
  )
}
