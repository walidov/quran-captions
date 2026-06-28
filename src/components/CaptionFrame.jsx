import { useState } from 'react'
import { wrapTokens, contentWidthFor } from '../caption/splitter'

// Renders a card's tokens as measured, wrapped lines — the same token/line model
// ayah-share's CaptionFrame uses, so the on-screen preview and the exported PNG
// are pixel-identical. `eff` is the effective style (card override or global).
// Each token carries its own font-family (page-specific for QCF glyph fonts).
//
// When `interactive` is set (the on-screen Stage only — never the export), the
// first and last word units are clickable to move them to the neighbouring card,
// with a hover highlight + tooltip. `firstIds`/`lastIds` mark which token ids
// belong to those edge units (a unit = word + its glued ayah ornament).
export default function CaptionFrame({
  tokens,
  eff,
  width,
  height,
  interactive = false,
  firstIds,
  lastIds,
  canMoveFirst = false,
  canMoveLast = false,
  onMoveFirst,
  onMoveLast,
  firstLabel,
  lastLabel,
  edgeColor = '#1F8A5B',
}) {
  const [hovered, setHovered] = useState(null) // 'first' | 'last' | null
  const lines = wrapTokens(tokens, eff.size, contentWidthFor(width))
  const textShadow = eff.shadow
    ? `0 ${Math.round(eff.size * 0.025)}px ${eff.shadowSize}px ${eff.shadowColor}`
    : undefined
  const stroke =
    eff.stroke && eff.strokeW > 0
      ? { WebkitTextStroke: `${eff.strokeW}px ${eff.strokeColor}`, paintOrder: 'stroke' }
      : {}

  const badgeContent = (tk) => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.42em',
        height: '1.42em',
        margin: '0 .5em',
        border: '.08em solid currentColor',
        borderRadius: '50%',
        fontSize: '.5em',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
        direction: 'ltr',
        verticalAlign: 'middle',
        WebkitTextStroke: '0',
      }}
    >
      {tk.text}
    </span>
  )

  const renderToken = (tk) => {
    const edge = interactive
      ? firstIds?.has(tk.id)
        ? 'first'
        : lastIds?.has(tk.id)
          ? 'last'
          : null
      : null

    const base = tk.badge ? (
      badgeContent(tk)
    ) : (
      <span style={{ fontFamily: `"${tk.family}"` }}>
        {tk.text}
        {' '}
      </span>
    )

    if (!edge) return <span key={tk.id}>{base}</span>

    const enabled = edge === 'first' ? canMoveFirst : canMoveLast
    const active = enabled && hovered === edge
    const tipProps = enabled
      ? {
          'data-tooltip-id': 'word-move-tip',
          'data-tooltip-content': edge === 'first' ? firstLabel : lastLabel,
          'data-edge': edge,
        }
      : {}
    return (
      <span
        key={tk.id}
        {...tipProps}
        onClick={
          enabled
            ? (e) => {
                e.stopPropagation()
                ;(edge === 'first' ? onMoveFirst : onMoveLast)?.()
              }
            : undefined
        }
        onMouseEnter={() => enabled && setHovered(edge)}
        onMouseLeave={() => setHovered((h) => (h === edge ? null : h))}
        style={{
          cursor: enabled ? 'pointer' : 'default',
          borderRadius: '0.16em',
          background: active ? `${edgeColor}26` : 'transparent',
          boxShadow: active ? `0 0 0 0.07em ${edgeColor}26` : 'none',
          transition: 'background .12s ease, box-shadow .12s ease',
          WebkitTextStroke: 'inherit',
        }}
      >
        {base}
      </span>
    )
  }

  return (
    <div style={{ width: `${width}px`, height: `${height}px`, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          padding: `0 ${Math.round(width * 0.06)}px`,
          textAlign: 'center',
          color: eff.color,
          direction: 'rtl',
          textShadow,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          fontSmooth: 'always',
          textRendering: 'optimizeLegibility',
          ...stroke,
        }}
      >
        {lines.map((line, li) => (
          <div
            key={li}
            style={{ fontSize: `${eff.size}px`, lineHeight: eff.lineHeight, whiteSpace: 'nowrap' }}
          >
            {line.map(renderToken)}
          </div>
        ))}
      </div>
    </div>
  )
}
