import { StudioProvider, useStudio } from './StudioContext'
import TopBar from './components/TopBar'
import LeftRail from './components/LeftRail'
import VersesPanel from './components/panels/VersesPanel'
import StylePanel from './components/panels/StylePanel'
import Stage from './components/Stage'
import CardInspector from './components/CardInspector'
import Toast from './components/Toast'
import Modal from './components/Modal'
import ShareModal from './components/ShareModal'
import DonateModal from './components/DonateModal'
import ExportLayer from './components/ExportLayer'

function Studio() {
  const { state, t, rtl } = useStudio()

  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      style={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: t.appBg,
        color: t.text,
      }}
    >
      <TopBar />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <LeftRail />

        <div
          style={{
            width: 300,
            flex: 'none',
            background: t.panel,
            [rtl ? 'borderLeft' : 'borderRight']: `1px solid ${t.border}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {state.tool === 'verses' && <VersesPanel />}
          {state.tool === 'text' && <StylePanel />}
        </div>

        <Stage />

        <CardInspector />
      </div>

      <Toast />
      <Modal />
      <ShareModal />
      <DonateModal />
      <ExportLayer />
    </div>
  )
}

export default function App() {
  return (
    <StudioProvider>
      <Studio />
    </StudioProvider>
  )
}
