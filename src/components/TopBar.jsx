import { useStudio } from '../StudioContext'
import Logo from './Logo'
import HeaderControls from './HeaderControls'

export default function TopBar() {
  const { state, t, actions, tr } = useStudio()

  const iconBtn = {
    height: 38,
    flex: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '0 11px',
    border: `1px solid ${t.border}`,
    borderRadius: 9,
    background: t.panel2,
    color: t.text,
    cursor: 'pointer',
  }

  return (
    <div
      style={{
        height: 64,
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 18px',
        background: t.topbar,
        borderBottom: `1px solid ${t.border}`,
        zIndex: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            background: t.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Logo size={25} color="#fff" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 17,
              color: t.text,
              letterSpacing: '-.01em',
              lineHeight: 1.1,
            }}
          >
            {tr('app.title')}
          </div>
          <div
            style={{
              fontWeight: 500,
              fontSize: 10.5,
              color: t.sub,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            {tr('app.slogan')}
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <HeaderControls />

      <div style={{ flex: 1 }} />

      {/* Theme toggle */}
      <button
        onClick={actions.toggleTheme}
        aria-label={tr(state.theme === 'light' ? 'theme.toDark' : 'theme.toLight')}
        title={tr(state.theme === 'light' ? 'theme.toDark' : 'theme.toLight')}
        style={{ ...iconBtn, width: 38, padding: 0 }}
      >
        {state.theme === 'light' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </button>

      {/* Language toggle */}
      <button
        onClick={actions.toggleLocale}
        aria-label={tr('lang.switch')}
        title={tr('lang.switch')}
        style={iconBtn}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={t.sub} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: 12.5, color: t.text }}>
          {state.locale === 'en' ? 'EN' : 'ع'}
        </span>
      </button>

    </div>
  )
}
