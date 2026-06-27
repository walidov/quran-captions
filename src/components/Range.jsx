import { useStudio } from '../StudioContext'

// Single-thumb range slider whose filled side (toward the start of the reading
// direction) is the accent green and the rest is the track grey. In RTL the
// native thumb travels from the right, so the fill is drawn from the right too.
export default function Range({ min, max, step, value, onChange, ...rest }) {
  const { t, rtl } = useStudio()
  const pct = Math.max(0, Math.min(100, max > min ? ((Number(value) - min) / (max - min)) * 100 : 0))
  const dir = rtl ? 'to left' : 'to right'
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      {...rest}
      style={{
        width: '100%',
        background: `linear-gradient(${dir}, ${t.accent} 0%, ${t.accent} ${pct}%, ${t.border} ${pct}%, ${t.border} 100%)`,
      }}
    />
  )
}
