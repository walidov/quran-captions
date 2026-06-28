import { useStudio } from '../StudioContext'
import { getPreset, bgStyle, effectiveStyle } from '../studio'
import CaptionFrame from './CaptionFrame'

export default function Filmstrip() {
  const { state, t, actions, mobile } = useStudio()
  const g = state.global
  const p = getPreset(state)
  const cards = state.cards.length ? state.cards : [{ tokens: [], override: null }]
  const sel = Math.min(state.sel, cards.length - 1)

  const boxH = mobile ? 144 : 58
  const boxW = Math.max(24, Math.round((boxH * p.w) / p.h))
  const miniScale = boxH / p.h

  return (
    <div
      style={{
        flex: 'none',
        height: mobile ? 200 : 112,
        background: t.panel,
        borderTop: `1px solid ${t.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: mobile ? '0 14px' : '0 18px',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}
    >
      {cards.map((c, i) => {
        const e = effectiveStyle(c, g)
        const active = i === sel
        return (
          <button
            key={i}
            onClick={() => actions.selectCard(i)}
            style={{
              flex: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: boxW,
                height: boxH,
                border: `${active ? '2.5px' : '1px'} solid ${active ? t.accent : t.border}`,
                borderRadius: 5,
                overflow: 'hidden',
                ...bgStyle(state.previewBg),
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transform: `scale(${miniScale})`,
                  transformOrigin: 'top left',
                  width: p.w,
                  height: p.h,
                }}
              >
                <CaptionFrame tokens={c.tokens} eff={e} width={p.w} height={p.h} />
              </div>
              {c.override && (
                <div
                  style={{
                    position: 'absolute',
                    top: 3,
                    right: 3,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: t.accent,
                    border: '1.5px solid #fff',
                  }}
                />
              )}
            </div>
            <div style={{ fontWeight: 600, fontSize: 10.5, color: active ? t.accent : t.sub }}>
              {i + 1}
            </div>
          </button>
        )
      })}
    </div>
  )
}
