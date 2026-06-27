import { useStudio } from '../StudioContext'
import { getPreset, effectiveStyle } from '../studio'
import CaptionFrame from './CaptionFrame'

// Off-screen, full-resolution frames the PNG exporter rasterizes. One per card,
// tagged with data-card-index so the exporter can order them. Mirrors
// ayah-share's hidden `data-export-node` pattern.
export default function ExportLayer() {
  const { state } = useStudio()
  const p = getPreset(state)
  const g = state.global

  return (
    <div aria-hidden style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none' }}>
      {state.cards.map((c, i) => (
        <div key={i} data-export-node data-card-index={i}>
          <CaptionFrame tokens={c.tokens} eff={effectiveStyle(c, g)} width={p.w} height={p.h} />
        </div>
      ))}
    </div>
  )
}
