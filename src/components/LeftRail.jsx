import { useStudio } from '../StudioContext'

export default function LeftRail() {
  const { state, t, actions, tr, rtl } = useStudio()

  const railBtn = (active) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    width: 58,
    padding: '10px 4px',
    border: 0,
    borderRadius: 13,
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans'",
    fontWeight: 600,
    fontSize: 10,
    letterSpacing: '.02em',
    background: active ? t.accentSoft : 'transparent',
    color: active ? t.accent : t.sub,
  })

  return (
    <div
      style={{
        width: 74,
        flex: 'none',
        background: t.rail,
        [rtl ? 'borderLeft' : 'borderRight']: `1px solid ${t.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '12px 0',
      }}
    >
      <button onClick={() => actions.setTool('verses')} style={railBtn(state.tool === 'verses')}>
        <span style={{ fontSize: 25, lineHeight: 1, fontFamily: "'Amiri', 'UthmanicHafs', serif" }}>
          ۝
        </span>
        <span>{tr('tool.verses')}</span>
      </button>

      <button onClick={() => actions.setTool('text')} style={railBtn(state.tool === 'text')}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 1,
            lineHeight: 1,
            fontFamily: "'Amiri', serif",
          }}
        >
          <span style={{ fontSize: 21, fontWeight: 700 }}>ع</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>ع</span>
        </span>
        <span>{tr('tool.style')}</span>
      </button>

      <div style={{ flex: 1 }} />

      <button
        onClick={actions.openDonate}
        style={{ ...railBtn(false), color: t.sub }}
        title={tr('donate.title')}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>{tr('donate')}</span>
      </button>

      <button
        onClick={actions.openShare}
        style={{ ...railBtn(false), color: t.sub }}
        title={tr('share.title')}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51l6.83 3.98" />
          <path d="M15.41 6.51l-6.82 3.98" />
        </svg>
        <span>{tr('share')}</span>
      </button>
    </div>
  )
}
