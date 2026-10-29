import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Curva de salida exponencial: arranca con decisión y frena con suavidad.
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

/**
 * Scroll con inercia (Lenis) sincronizado con GSAP/ScrollTrigger.
 * - Si el sistema pide reducir movimiento, no se activa: scroll nativo.
 * - El margen bajo el header lo pone scroll-padding-top en CSS (Lenis lo respeta).
 * - Los enlaces internos (#seccion) se deslizan con la misma curva y, al
 *   llegar, mueven el foco a la sección para que el teclado continúe ahí.
 */
export default function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: easeOutExpo,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = e.target.closest('a[href^="#"]')
      if (!link || link.classList.contains('skip-link')) return
      const id = decodeURIComponent(link.getAttribute('href').slice(1))
      const target = id && document.getElementById(id)
      if (!target) return

      e.preventDefault()
      lenis.scrollTo(target, {
        duration: 1.4,
        onComplete: () => {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
          target.focus({ preventScroll: true })
        },
      })
      history.pushState(null, '', `#${id}`)
    }

    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}
