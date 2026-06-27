import { useStudio } from '../StudioContext'

// Centered modal dialog driven by state.modal = { title, message }.
export default function Modal() {
  const { state, t, actions, tr } = useStudio()
  if (!state.modal) return null
  const { title, message } = state.modal

  return (
    <div
      onClick={actions.closeModal}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(10,12,16,.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420,
          maxWidth: '90%',
          background: t.panel,
          border: `1px solid ${t.border}`,
          borderRadius: 16,
          boxShadow: '0 24px 70px rgba(0,0,0,.34)',
          padding: 22,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div
            style={{
              width: 34,
              height: 34,
              flex: 'none',
              borderRadius: 10,
              background: t.dangerBorder,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.danger} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
            </svg>
          </div>
          <div style={{ fontWeight: 800, fontSize: 15, color: t.text }}>{title}</div>
        </div>

        <div
          style={{
            marginTop: 12,
            fontWeight: 500,
            fontSize: 13,
            lineHeight: 1.6,
            color: t.sub,
            whiteSpace: 'pre-line',
          }}
        >
          {message}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button
            onClick={actions.closeModal}
            style={{
              padding: '9px 20px',
              border: 0,
              borderRadius: 9,
              background: t.accent,
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 13,
              fontFamily: 'inherit',
            }}
          >
            {tr('modal.gotIt')}
          </button>
        </div>
      </div>
    </div>
  )
}
