// Quran Studio brand mark — renders public/quran.svg, recolored via CSS mask so
// it can be tinted (e.g. white inside the green app square) while keeping the
// original artwork as the single source of truth.
export default function Logo({ size = 18, color = 'currentColor' }) {
  return (
    <span
      role="img"
      aria-label="Quran Studio"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        background: color,
        WebkitMaskImage: 'url(/quran.svg)',
        maskImage: 'url(/quran.svg)',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  )
}
