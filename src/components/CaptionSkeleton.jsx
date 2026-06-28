// Shimmer placeholder shown in the canvas while verses load — mimics a line of
// caption words. Rendered inside the (scaled) canvas so it sizes like the text.
export default function CaptionSkeleton({ width, height, eff }) {
  const barH = Math.round(eff.size * 0.58)
  const contentW = width * 0.88
  const gap = Math.round(eff.size * 0.42)
  // Word-like bar widths, as fractions of the content width.
  const widths = [0.17, 0.1, 0.21, 0.12, 0.16]

  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap,
          direction: 'rtl',
          padding: `0 ${Math.round(width * 0.06)}px`,
        }}
      >
        {widths.map((w, i) => (
          <div
            key={i}
            className="caption-skeleton-bar"
            style={{ width: Math.round(contentW * w), height: barH, borderRadius: barH / 2 }}
          />
        ))}
      </div>
    </div>
  )
}
