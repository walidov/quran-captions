import { useStudio } from '../../StudioContext'
import { displayArabicFamily } from '../../studio'
import SurahPicker from '../SurahPicker'

export default function VersesPanel() {
  const { state, t, actions, tr, rtl } = useStudio()

  const chapter = state.chapters.find((c) => c.id === state.surahNum)
  const surahNameFamily = displayArabicFamily(state.global.font)
  const ayahCount = state.versesCount || 1
  const denom = Math.max(1, ayahCount - 1)
  const fillLeft = ((state.fromAyah - 1) / denom) * 100
  const fillWidth = ((state.toAyah - state.fromAyah) / denom) * 100
  const totalWords = state.cards.reduce(
    (n, c) => n + c.tokens.filter((tk) => !tk.isEnd).length,
    0,
  )
  const cardCount = state.cards.length

  const label = { fontWeight: 700, fontSize: 12, letterSpacing: '.06em', color: t.faint }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        padding: '18px 16px',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>{tr('verses.title')}</div>
      <div style={{ fontWeight: 500, fontSize: 11.5, color: t.faint, marginTop: 3 }}>
        {tr('verses.subtitle')}
      </div>

      <div style={{ ...label, margin: '18px 0 6px' }}>{tr('verses.surah')}</div>
      <SurahPicker />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          margin: '20px 0 14px',
        }}
      >
        <span style={label}>{tr('verses.ayahRange')}</span>
        <span style={{ fontWeight: 700, fontSize: 12, color: t.accent }}>
          {tr('verses.ayah')} {state.fromAyah} – {state.toAyah}
        </span>
      </div>

      <div style={{ position: 'relative', height: 36, margin: '0 10px' }}>
        {/* Track + fill are inset by the thumb radius (10px) so their 0–100%
            range lines up with where the native thumb centers actually travel. */}
        <div style={{ position: 'absolute', top: 15, left: 10, right: 10, height: 6 }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 4,
              background: t.border,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              borderRadius: 4,
              background: t.accent,
              [rtl ? 'right' : 'left']: `${fillLeft}%`,
              width: `${fillWidth}%`,
            }}
          />
        </div>
        <input
          className="dualrange"
          type="range"
          min={1}
          max={ayahCount}
          step={1}
          value={state.fromAyah}
          onChange={(e) => actions.setFrom(+e.target.value)}
        />
        <input
          className="dualrange"
          type="range"
          min={1}
          max={ayahCount}
          step={1}
          value={state.toAyah}
          onChange={(e) => actions.setTo(+e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 10px 0' }}>
        <span style={{ fontWeight: 600, fontSize: 10, color: t.faint }}>{tr('verses.ayah')} 1</span>
        <span style={{ fontWeight: 600, fontSize: 10, color: t.faint }}>{tr('verses.ayah')} {ayahCount}</span>
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 14,
          borderRadius: 13,
          background: t.panel2,
          border: `1px solid ${t.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* Surah number in a rounded-diamond badge, to the left of the name */}
          <div
            style={{
              position: 'relative',
              width: 40,
              height: 40,
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: t.accent,
                borderRadius: 12,
                transform: 'rotate(45deg)',
              }}
            />
            <span
              style={{ position: 'relative', color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1 }}
            >
              {state.surahNum}
            </span>
          </div>

          <div style={{ minWidth: 0 }}>
            {state.surahFontReady ? (
              <div
                style={{
                  fontFamily: "'surah-name-v4'",
                  fontSize: 42,
                  color: t.text,
                  textAlign: 'right',
                  direction: 'rtl',
                  lineHeight: 1.1,
                  fontFeatureSettings: '"liga" 1, "calt" 1, "dlig" 1',
                  overflow: 'hidden',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  fontSmooth: 'always',
                  textRendering: 'optimizeLegibility',
                }}
              >
                {`surah${String(state.surahNum).padStart(3, '0')}`}
              </div>
            ) : (
              <div
                style={{
                  fontFamily: `"${surahNameFamily}", 'Amiri', serif`,
                  fontSize: 26,
                  color: t.text,
                  textAlign: 'right',
                  direction: 'rtl',
                  lineHeight: 1.3,
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  fontSmooth: 'always',
                  textRendering: 'optimizeLegibility',
                }}
              >
                {chapter?.nameArabic ?? ''}
              </div>
            )}
          </div>
        </div>
        <div style={{ fontWeight: 600, fontSize: 12, color: t.sub, marginTop: 4, textAlign: 'start' }}>
          {chapter?.nameSimple ?? `Surah ${state.surahNum}`} · {tr('verses.ayah')} {state.fromAyah}–{state.toAyah}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '9px 0',
              background: t.panel,
              border: `1px solid ${t.border}`,
              borderRadius: 9,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 17, color: t.text }}>{totalWords}</div>
            <div style={{ fontWeight: 600, fontSize: 10, color: t.faint, marginTop: 1 }}>{tr('verses.words')}</div>
          </div>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '9px 0',
              background: t.panel,
              border: `1px solid ${t.border}`,
              borderRadius: 9,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 17, color: t.accent }}>{cardCount}</div>
            <div style={{ fontWeight: 600, fontSize: 10, color: t.faint, marginTop: 1 }}>{tr('verses.cards')}</div>
          </div>
        </div>
        <button
          onClick={actions.resplit}
          style={{
            width: '100%',
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            padding: '9px 0',
            border: `1px solid ${t.accent}`,
            borderRadius: 9,
            background: 'transparent',
            color: t.accent,
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 12,
            fontFamily: 'inherit',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13.5 7A5.5 5.5 0 0 0 3.7 3.8M2.5 9A5.5 5.5 0 0 0 12.3 12.2" />
            <path d="M3.5 1.5v2.5h2.5" />
            <path d="M12.5 14.5v-2.5h-2.5" />
          </svg>
          {tr('verses.resplit')}
        </button>
      </div>

      <div style={{ marginTop: 12, fontWeight: 500, fontSize: 11, lineHeight: 1.5, color: t.faint }}>
        {tr('verses.help')}
      </div>
    </div>
  )
}
