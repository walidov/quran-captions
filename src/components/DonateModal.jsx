import { useStudio } from '../StudioContext'

const PAYPAL_URL = 'https://www.paypal.me/walidov'

export default function DonateModal() {
  const { state, t, actions, tr, rtl } = useStudio()
  if (!state.donate) return null

  const close = () => actions.closeDonate()

  return (
    <div
      onClick={close}
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
          width: 440,
          maxWidth: '92%',
          background: t.panel,
          border: `1px solid ${t.border}`,
          borderRadius: 16,
          boxShadow: '0 24px 70px rgba(0,0,0,.34)',
          padding: 22,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 36,
                height: 36,
                flex: 'none',
                borderRadius: '50%',
                background: t.accentSoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={t.accent} aria-hidden="true">
                <path d="M12 21s-6.7-4.35-9.33-8.07C1.1 10.6 1.5 7.5 3.9 6.2c1.9-1.03 4.2-.4 5.4 1.2L12 10l2.7-2.6c1.2-1.6 3.5-2.23 5.4-1.2 2.4 1.3 2.8 4.4 1.23 6.73C18.7 16.65 12 21 12 21z" />
              </svg>
            </span>
            <div style={{ fontWeight: 800, fontSize: 16, color: t.text }}>{tr('donate.title')}</div>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            style={{
              width: 30,
              height: 30,
              flex: 'none',
              border: 0,
              borderRadius: 8,
              background: t.panel2,
              color: t.sub,
              cursor: 'pointer',
              fontSize: 17,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <p
          style={{
            margin: '16px 0 0',
            fontWeight: 500,
            fontSize: 13,
            lineHeight: 1.65,
            color: t.sub,
            textAlign: rtl ? 'right' : 'left',
          }}
        >
          {tr('donate.body')}
        </p>

        <a
          href={PAYPAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            margin: '20px 0 10px',
            padding: '13px 0',
            borderRadius: 11,
            background: '#0070BA',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 14.5,
          }}
        >
          <svg width="18" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
          </svg>
          {tr('donate.paypal')}
        </a>

        <div
          style={{
            fontWeight: 500,
            fontSize: 11,
            lineHeight: 1.5,
            color: t.faint,
            textAlign: 'center',
          }}
        >
          {tr('donate.note')}
        </div>
      </div>
    </div>
  )
}
