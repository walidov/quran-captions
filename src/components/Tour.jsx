import { useEffect, useRef } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useStudio } from '../StudioContext'

// One-time onboarding tour (Driver.js). Runs once per visitor — guarded by a
// cookie — and only on the desktop layout (the steps reference the side panels
// and inspector, which become bottom sheets on mobile). It can be closed at any
// time; either way the cookie is set so it never shows again.
const COOKIE = 'qc_tour_v1'

const tourSeen = () =>
  typeof document !== 'undefined' && document.cookie.split('; ').some((c) => c.startsWith(`${COOKIE}=`))

const markTourSeen = () => {
  document.cookie = `${COOKIE}=1; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`
}

function startTour(actions, tr) {
  const switchTool = (which) => () => actions.setTool(which)
  const step = (element, key, side, onHighlightStarted) => ({
    element,
    ...(onHighlightStarted ? { onHighlightStarted } : {}),
    popover: {
      title: tr(`tour.${key}.title`),
      description: tr(`tour.${key}.desc`),
      side,
      align: 'start',
    },
  })

  const tour = driver({
    showProgress: true,
    allowClose: true,
    popoverClass: 'qc-tour',
    nextBtnText: tr('tour.next'),
    prevBtnText: tr('tour.prev'),
    doneBtnText: tr('tour.done'),
    steps: [
      step('[data-tour="size"]', 'size', 'bottom'),
      step('[data-tour="font"]', 'font', 'bottom'),
      step('[data-tour="leftpanel"]', 'verses', 'right', switchTool('verses')),
      step('[data-tour="leftpanel"]', 'style', 'right', switchTool('text')),
      step('[data-tour="adjust"]', 'adjust', 'left'),
      step('[data-tour="card-size"]', 'cardSize', 'left'),
      step('[data-tour="export"]', 'export', 'left'),
    ],
    onDestroyed: () => {
      markTourSeen()
      actions.setTool('verses') // leave the user on the default verses panel
    },
  })
  tour.drive()
}

export default function Tour() {
  const { state, mobile, actions, tr } = useStudio()
  const ran = useRef(false)

  useEffect(() => {
    // Run once, on desktop, for a new visitor, after the first verses have loaded
    // (so the card preview + inspector are populated). No cleanup that clears the
    // timer — under StrictMode's mount/unmount/mount that would cancel it.
    if (ran.current || mobile || tourSeen() || state.loadStatus !== 'ready') return
    ran.current = true
    setTimeout(() => startTour(actions, tr), 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.loadStatus, mobile])

  return null
}
