import { useRef, useState } from 'react'
import { useStudio } from '../StudioContext'

const DISMISS_THRESHOLD = 90 // px dragged down before the sheet closes

// A bottom sheet for the mobile shell. Slides up from the bottom edge, caps at
// 85% of the viewport, and lets its child panel scroll internally. Closes by
// tapping the dimmed backdrop or swiping the handle down.
export default function MobileSheet({ onClose, children, label }) {
  const { t } = useStudio()
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false) // drives the snap-back transition
  const drag = useRef({ active: false, startY: 0 }) // gates moves regardless of render timing

  const onPointerDown = (e) => {
    drag.current = { active: true, startY: e.clientY }
    setDragging(true)
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // pointer capture is best-effort
    }
  }
  const onPointerMove = (e) => {
    if (!drag.current.active) return
    setDragY(Math.max(0, e.clientY - drag.current.startY)) // only downward
  }
  const endDrag = (e) => {
    if (!drag.current.active) return
    drag.current.active = false
    setDragging(false)
    const dy = Math.max(0, e.clientY - drag.current.startY)
    if (dy > DISMISS_THRESHOLD) onClose()
    else setDragY(0) // snap back
  }

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
          transform: `translateY(${dragY}px)`,
          transition: dragging ? 'none' : 'transform .22s cubic-bezier(.22,.61,.36,1)',
          animation: 'sheetUp .24s cubic-bezier(.22,.61,.36,1)',
        }}
      >
        {/* Drag handle — swipe this down to dismiss */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{
            flex: 'none',
            position: 'relative',
            height: 36,
            touchAction: 'none',
            cursor: 'grab',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 44,
              height: 5,
              borderRadius: 3,
              background: t.border,
            }}
          />
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
