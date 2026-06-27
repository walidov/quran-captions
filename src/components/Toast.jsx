import { useStudio } from '../StudioContext'

export default function Toast() {
  const { state, t } = useStudio()
  if (!state.toast) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 130,
        left: '50%',
        transform: 'translateX(-50%)',
        background: t.text,
        color: t.panel,
        padding: '12px 20px',
        borderRadius: 11,
        fontWeight: 600,
        fontSize: 13,
        boxShadow: '0 10px 34px rgba(0,0,0,.28)',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 9,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke={t.accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8.5l3 3 7-7" />
      </svg>
      {state.toast}
    </div>
  )
}
