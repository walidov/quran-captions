import { useStudio } from '../../StudioContext'
import { COLORS } from '../../data'
import { Toggle, Swatches, sectionLabel } from '../ui'
import Range from '../Range'

export default function StylePanel() {
  const { t, state, actions, tr } = useStudio()
  const g = state.global
  const label = sectionLabel(t)
  // Full-bleed separator: negative horizontal margin reaches the panel borders.
  const sep = { height: 1, background: t.line, margin: '24px -16px', flex: 'none' }
  const rowBetween = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '18px 16px 24px',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>{tr('style.title')}</div>
      <div style={{ fontWeight: 500, fontSize: 11.5, color: t.faint, marginTop: 3 }}>
        {tr('style.subtitle')}
      </div>

      <div style={sep} />

      {/* Font size */}
      <div style={{ ...rowBetween, marginBottom: 8 }}>
        <span style={label}>{tr('style.fontSize')}</span>
        <span style={{ fontWeight: 700, fontSize: 11, color: t.sub }}>{g.size}px</span>
      </div>
      <Range min={40} max={180} step={2} value={g.size} onChange={(e) => actions.setSize(e.target.value)} />

      <div style={sep} />

      {/* Color */}
      <div style={{ ...label, marginBottom: 9 }}>{tr('style.color')}</div>
      {g.font === 'qcf4' ? (
        <div
          style={{
            padding: '11px 12px',
            borderRadius: 10,
            background: t.panel2,
            border: `1px dashed ${t.border}`,
            fontWeight: 500,
            fontSize: 11,
            lineHeight: 1.5,
            color: t.sub,
          }}
        >
          {tr('style.colorBaked')}
        </div>
      ) : (
        <Swatches
          colors={COLORS}
          current={g.color}
          onPick={actions.setColor}
          custom={g.color}
          onCustom={actions.setColor}
        />
      )}

      <div style={sep} />

      {/* Max lines per card */}
      <div style={{ ...label, marginBottom: 8 }}>{tr('style.maxLines')}</div>
      <div
        style={{
          display: 'flex',
          background: t.panel2,
          border: `1px solid ${t.border}`,
          borderRadius: 9,
          padding: 3,
          gap: 3,
        }}
      >
        {[1, 2, 3, 4].map((n) => {
          const active = g.linesPerCard === n
          return (
            <button
              key={n}
              onClick={() => actions.setLines(n)}
              style={{
                flex: 1,
                padding: '8px 0',
                border: 0,
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 13,
                fontFamily: 'inherit',
                background: active ? t.accent : 'transparent',
                color: active ? '#fff' : t.sub,
              }}
            >
              {n}
            </button>
          )
        })}
      </div>

      <div style={sep} />

      {/* Line height */}
      <div style={{ ...rowBetween, marginBottom: 8 }}>
        <span style={label}>{tr('style.lineHeight')}</span>
        <span style={{ fontWeight: 700, fontSize: 11, color: t.sub }}>{g.lineHeight.toFixed(2)}</span>
      </div>
      <Range
        min={1}
        max={2.6}
        step={0.05}
        value={g.lineHeight}
        onChange={(e) => actions.setLineHeight(e.target.value)}
      />

      <div style={sep} />

      {/* Border / stroke */}
      <div style={rowBetween}>
        <span style={label}>{tr('style.border')}</span>
        <Toggle on={g.stroke} onToggle={() => actions.setGlobal('stroke', !g.stroke)} />
      </div>
      {g.stroke && (
        <>
          <div style={{ ...rowBetween, margin: '12px 0 7px' }}>
            <span style={{ fontWeight: 600, fontSize: 10.5, color: t.sub }}>{tr('style.thickness')}</span>
            <span style={{ fontWeight: 700, fontSize: 11, color: t.sub }}>{g.strokeW}px</span>
          </div>
          <Range
            min={1}
            max={12}
            step={1}
            value={g.strokeW}
            onChange={(e) => actions.setGlobal('strokeW', +e.target.value)}
          />
          <div style={{ marginTop: 11 }}>
            <Swatches
              colors={['#000000', '#FFFFFF', '#D4A437']}
              current={g.strokeColor}
              onPick={(c) => actions.setGlobal('strokeColor', c)}
              size={26}
              gap={8}
              custom={g.strokeColor}
              onCustom={(c) => actions.setGlobal('strokeColor', c)}
            />
          </div>
        </>
      )}

      <div style={sep} />

      {/* Shadow */}
      <div style={rowBetween}>
        <span style={label}>{tr('style.shadow')}</span>
        <Toggle on={g.shadow} onToggle={() => actions.setGlobal('shadow', !g.shadow)} />
      </div>
      {g.shadow && (
        <>
          <div style={{ ...rowBetween, margin: '12px 0 7px' }}>
            <span style={{ fontWeight: 600, fontSize: 10.5, color: t.sub }}>{tr('style.blur')}</span>
            <span style={{ fontWeight: 700, fontSize: 11, color: t.sub }}>{g.shadowSize}px</span>
          </div>
          <Range
            min={0}
            max={48}
            step={2}
            value={g.shadowSize}
            onChange={(e) => actions.setGlobal('shadowSize', +e.target.value)}
          />
          <div style={{ marginTop: 11 }}>
            <Swatches
              colors={['#000000', '#3a3a3a', '#FFFFFF']}
              current={g.shadowColor}
              onPick={(c) => actions.setGlobal('shadowColor', c)}
              size={26}
              gap={8}
              custom={g.shadowColor}
              onCustom={(c) => actions.setGlobal('shadowColor', c)}
            />
          </div>
        </>
      )}
    </div>
  )
}
