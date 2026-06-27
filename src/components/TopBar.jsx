import { useStudio } from '../StudioContext'
import Logo from './Logo'
import HeaderControls from './HeaderControls'

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

export default function TopBar() {
  const { state, t, actions, tr, mobile } = useStudio()

  const iconBtn = {
    height: mobile ? 34 : 38,
    width: mobile ? 34 : undefined,
    flex: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: mobile ? 0 : '0 11px',
    border: `1px solid ${t.border}`,
    borderRadius: 9,
    background: t.panel2,
    color: t.text,
    cursor: 'pointer',
  }

  const themeBtn = (
    <button
      onClick={actions.toggleTheme}
      aria-label={tr(state.theme === 'light' ? 'theme.toDark' : 'theme.toLight')}
      title={tr(state.theme === 'light' ? 'theme.toDark' : 'theme.toLight')}
      style={{ ...iconBtn, width: mobile ? 34 : 38, padding: 0 }}
    >
      {state.theme === 'light' ? <SunIcon /> : <MoonIcon />}
    </button>
  )

  const langBtn = (
    <button
      onClick={actions.toggleLocale}
      aria-label={tr('lang.switch')}
      title={tr('lang.switch')}
      style={mobile ? { ...iconBtn, width: 34, padding: 0 } : iconBtn}
    >
      {mobile ? (
        <span style={{ fontWeight: 700, fontSize: 12.5, color: t.text }}>
          {state.locale === 'en' ? 'EN' : 'ع'}
        </span>
      ) : (
        <>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={t.sub} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: 12.5, color: t.text }}>
            {state.locale === 'en' ? 'EN' : 'ع'}
          </span>
        </>
      )}
    </button>
  )

  const brand = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      <div
        style={{
          width: mobile ? 32 : 36,
          height: mobile ? 32 : 36,
          flex: 'none',
          borderRadius: mobile ? 10 : 11,
          background: t.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Logo size={mobile ? 22 : 25} color="#fff" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: mobile ? 15 : 17,
            color: t.text,
            letterSpacing: '-.01em',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {tr('app.title')}
        </div>
        {!mobile && (
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
        )}
      </div>
    </div>
  )

  if (mobile) {
    return (
      <div
        style={{
          height: 56,
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
          background: t.topbar,
          borderBottom: `1px solid ${t.border}`,
          zIndex: 6,
        }}
      >
        {brand}
        <div style={{ flex: 1 }} />
        <button
          onClick={actions.openDonate}
          aria-label={tr('donate')}
          title={tr('donate.title')}
          style={{ ...iconBtn, width: 34, padding: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <button
          onClick={actions.openShare}
          aria-label={tr('share')}
          title={tr('share.title')}
          style={{ ...iconBtn, width: 34, padding: 0 }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98" />
            <path d="M15.41 6.51l-6.82 3.98" />
          </svg>
        </button>
        {themeBtn}
        {langBtn}
      </div>
    )
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
      {brand}

      <div style={{ flex: 1 }} />

      <HeaderControls />

      <div style={{ flex: 1 }} />

      {themeBtn}
      {langBtn}
    </div>
  )
}
