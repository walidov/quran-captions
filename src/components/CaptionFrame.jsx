import { wrapTokens, contentWidthFor } from '../caption/splitter'

// Renders a card's tokens as measured, wrapped lines — the same token/line model
// ayah-share's CaptionFrame uses, so the on-screen preview and the exported PNG
// are pixel-identical. `eff` is the effective style (card override or global).
// Each token carries its own font-family (page-specific for QCF glyph fonts).
export default function CaptionFrame({ tokens, eff, width, height }) {
  const lines = wrapTokens(tokens, eff.size, contentWidthFor(width))
  const textShadow = eff.shadow
    ? `0 ${Math.round(eff.size * 0.025)}px ${eff.shadowSize}px ${eff.shadowColor}`
    : undefined
  const stroke =
    eff.stroke && eff.strokeW > 0
      ? { WebkitTextStroke: `${eff.strokeW}px ${eff.strokeColor}`, paintOrder: 'stroke' }
      : {}

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
            {line.map((tk) =>
              tk.badge ? (
                <span
                  key={tk.id}
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
              ) : (
                <span key={tk.id} style={{ fontFamily: `"${tk.family}"` }}>
                  {tk.text}{' '}
                </span>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
