import { useStudio } from '../StudioContext'

// Pill toggle switch.
export function Toggle({ on, onToggle, w = 40, h = 23, knob = 17 }) {
  const { t } = useStudio()
  const pad = (h - knob) / 2
  return (
    <button
      onClick={onToggle}
      style={{
        width: w,
        height: h,
        flex: 'none',
        borderRadius: h / 2,
        border: 0,
        cursor: 'pointer',
        position: 'relative',
        background: on ? t.accent : t.border,
        transition: 'background .15s',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: pad,
          left: on ? w - knob - pad : pad,
          width: knob,
          height: knob,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,.3)',
          transition: 'left .15s',
        }}
      />
    </button>
  )
}

// Row of color swatches with an optional custom color picker.
export function Swatches({ colors, current, onPick, size = 30, gap = 9, custom, onCustom }) {
  const { t } = useStudio()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, flexWrap: 'wrap' }}>
      {colors.map((c) => {
        const active = (current || '').toLowerCase() === c.toLowerCase()
        return (
          <button
            key={c}
            onClick={() => onPick(c)}
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              background: c,
              border: `${active ? '2.5px' : '1.5px'} solid ${active ? t.accent : t.border}`,
              cursor: 'pointer',
            }}
          />
        )
      })}
      {onCustom && (
        <label
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            border: `1.5px solid ${t.border}`,
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            background:
              'conic-gradient(from 90deg,#ff4d4d,#ffd24d,#4dff88,#4dd2ff,#b14dff,#ff4d4d)',
          }}
        >
          <input
            type="color"
            value={custom}
            onChange={(e) => onCustom(e.target.value)}
            style={{ position: 'absolute', inset: -6, opacity: 0, cursor: 'pointer' }}
          />
        </label>
      )}
    </div>
  )
}

export const sectionLabel = (t) => ({
  fontWeight: 700,
  fontSize: 10,
  letterSpacing: '.06em',
  color: t.faint,
})
