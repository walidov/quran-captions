import { useStudio } from '../StudioContext'
import { PRESETS, FONTS } from '../data'

// A header dropdown "pill": the current label + a down-chevron, with a
// transparent full-size <select> overlaying it so the whole pill is clickable.
function Field({ t, rtl, value, onChange, options, displayLabel, ariaLabel }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: 34,
        padding: rtl ? '0 12px 0 30px' : '0 30px 0 12px',
        background: t.panel2,
        border: `1px solid ${t.border}`,
        borderRadius: 9,
        cursor: 'pointer',
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 12.5, color: t.text, whiteSpace: 'nowrap' }}>
        {displayLabel}
      </span>
      <svg
        style={{ position: 'absolute', [rtl ? 'left' : 'right']: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke={t.faint}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 4.5L6 7.5L9 4.5" />
      </svg>
      <select
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          border: 0,
          opacity: 0,
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          fontSize: 16,
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function ScreenIcon({ color }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: 'none' }}
      aria-hidden="true"
    >
      <rect x="2.5" y="4" width="19" height="13" rx="2.2" />
      <path d="M8.5 20.5h7" />
      <path d="M12 17.2v3.3" />
    </svg>
  )
}

function FontIcon({ color }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: 'none' }}
      aria-hidden="true"
    >
      <path d="M5 6.5V5h14v1.5" />
      <path d="M12 5v14" />
      <path d="M9.5 19h5" />
    </svg>
  )
}

export default function HeaderControls() {
  const { state, t, actions, tr, rtl } = useStudio()

  const dims = (p) => (p.key === 'custom' ? `${state.customW}×${state.customH}` : `${p.w}×${p.h}`)
  const presetName = (p) => tr(`preset.${p.key}`)
  const sizeOptions = PRESETS.map((p) => ({ value: p.key, label: `${presetName(p)} · ${dims(p)}` }))
  const curPreset = PRESETS.find((p) => p.key === state.presetKey) || PRESETS[0]
  const sizeLabel = `${presetName(curPreset)} · ${dims(curPreset)}`

  const fontOptions = FONTS.map((f) => ({ value: f.key, label: `${f.label} · ${f.sub}` }))
  const curFont = FONTS.find((f) => f.key === state.global.font) || FONTS[0]
  const fontLabel = `${curFont.label} · ${curFont.sub}`

  const numInput = {
    width: 62,
    height: 34,
    padding: '0 8px',
    border: `1px solid ${t.border}`,
    borderRadius: 9,
    background: t.input,
    color: t.text,
    fontWeight: 600,
    fontSize: 12,
    fontFamily: 'inherit',
  }
  const group = { display: 'flex', alignItems: 'center', gap: 8 }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {/* Canvas size */}
      <div style={group}>
        <ScreenIcon color={t.sub} />
        <Field
          t={t}
          rtl={rtl}
          ariaLabel="Canvas size"
          value={state.presetKey}
          onChange={(e) => actions.setPreset(e.target.value)}
          options={sizeOptions}
          displayLabel={sizeLabel}
        />
        {state.presetKey === 'custom' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="number"
              value={state.customW}
              onChange={(e) => actions.setCustom('w', e.target.value)}
              style={numInput}
              aria-label="Custom width"
            />
            <span style={{ color: t.faint, fontWeight: 600, fontSize: 12 }}>×</span>
            <input
              type="number"
              value={state.customH}
              onChange={(e) => actions.setCustom('h', e.target.value)}
              style={numInput}
              aria-label="Custom height"
            />
          </div>
        )}
      </div>

      {/* Vertical separator */}
      <div style={{ width: 1, height: 24, background: t.border, flex: 'none' }} />

      {/* Quranic font */}
      <div style={group}>
        <FontIcon color={t.sub} />
        <Field
          t={t}
          rtl={rtl}
          ariaLabel="Quranic font"
          value={state.global.font}
          onChange={(e) => actions.setFont(e.target.value)}
          options={fontOptions}
          displayLabel={fontLabel}
        />
      </div>
    </div>
  )
}
