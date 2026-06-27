import { useStudio } from '../StudioContext'

// A bottom sheet for the mobile shell. Slides up from the bottom edge, caps at
// 85% of the viewport, and lets its child panel scroll internally. Tapping the
// dimmed backdrop or the × closes it.
export default function MobileSheet({ onClose, children, label }) {
  const { t, rtl } = useStudio()

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(10,12,16,.45)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        zIndex: 50,
        animation: 'sheetFade .18s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={label}
        style={{
          position: 'relative',
          background: t.panel,
          borderTop: `1px solid ${t.border}`,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          boxShadow: '0 -16px 50px rgba(0,0,0,.28)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          animation: 'sheetUp .24s cubic-bezier(.22,.61,.36,1)',
        }}
      >
        {/* Grab handle + close */}
        <div style={{ flex: 'none', position: 'relative', height: 34 }}>
          <div
            style={{
              position: 'absolute',
              top: 9,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 40,
              height: 4,
              borderRadius: 3,
              background: t.border,
            }}
          />
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 6,
              [rtl ? 'left' : 'right']: 10,
              width: 28,
              height: 28,
              border: 0,
              borderRadius: 8,
              background: t.panel2,
              color: t.sub,
              cursor: 'pointer',
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
