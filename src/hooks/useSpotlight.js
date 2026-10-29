import { useEffect } from 'react'

/**
 * Borde que se ilumina bajo el cursor. Un solo listener para toda la página:
 * guarda la posición del mouse, relativa a la tarjeta, en --mx / --my y el
 * CSS (.spot) dibuja el brillo. Solo con mouse; en táctil no hace nada.
 */
export default function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let frame = 0
    const onMove = (e) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const el = e.target.closest?.('[data-spotlight]')
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      })
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('pointermove', onMove)
    }
  }, [])
}
