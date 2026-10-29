import { useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, ArrowUpRight, BookOpenText } from '@phosphor-icons/react'
import Dock from './components/Dock.jsx'
import ProgressiveBlur from './components/Blur.jsx'
import Recomendaciones from './components/Recomendaciones.jsx'
import useSpotlight from './hooks/useSpotlight.js'
import useSmoothScroll from './hooks/useSmoothScroll.js'
import SplitWords from './components/SplitWords.jsx'
import './App.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const pasos = [
  {
    titulo: 'Año',
    texto: 'La biblioteca se ordena primero por año, para que encuentres rápido lo más reciente o lo de años anteriores.',
  },
  {
    titulo: 'Trimestre',
    texto: 'Dentro de cada año, los cuatro trimestres con sus lecciones.',
  },
  {
    titulo: 'Lección',
    texto: 'Cada lección se lee dentro de la página, con su número, su nombre y el pasaje bíblico a la vista.',
  },
  {
    titulo: 'Temas',
    texto: 'Dentro de la lección, el contenido se organiza por temas en lugar de por días.',
  },
]

const beneficios = [
  {
    titulo: 'Visión completa',
    texto: 'Ves cada tema de principio a fin, sin tener que armarlo a partir de siete lecturas separadas.',
  },
  {
    titulo: 'Todo en un solo lugar',
    texto: 'Las lecciones viven en la biblioteca: sin archivos sueltos que buscar, descargar o abrir aparte.',
  },
  {
    titulo: 'Pensado para enseñar',
    texto: 'La estructura sirve para dirigir una clase, no solo para lectura personal diaria.',
  },
]

const recomendaciones = [
  {
    titulo: 'Empieza por el pasaje',
    texto: 'Lee el texto bíblico completo antes de abrir la lección. Los temas cobran más sentido con el contexto.',
  },
  {
    titulo: 'Un tema por sesión de estudio',
    texto: 'Reparte la preparación durante la semana: un tema por sesión rinde más que estudiarlo todo de una vez.',
  },
  {
    titulo: 'Define un hilo central',
    texto: 'Aunque la lección tenga varios temas, elige cuál guiará la clase y usa los demás como apoyo.',
  },
  {
    titulo: 'Prepara preguntas abiertas',
    texto: 'Deja listas tres o cuatro preguntas para la discusión, junto con tu propia guía de respuesta.',
  },
  {
    titulo: 'Revísala en tu dispositivo',
    texto: 'Si vas a enseñar desde el celular, ábrela ahí antes de la clase para verificar que todo se lea bien.',
  },
]

// Cada lección vive como un archivo estático dentro de /public, así que se
// sirve desde el mismo dominio y el mismo deploy que el resto del sitio.
const lecciones = [
  {
    anio: 2026,
    trimestre: 4,
    numero: 1,
    titulo: 'El Creador habla',
    pasaje: 'Hebreos 1:1-2',
    archivo: '/lecciones/2026/T4/26_04_01 El Creador habla.html',
  },
  {
    anio: 2026,
    trimestre: 4,
    numero: 2,
    titulo: 'El llamado de un profeta',
    pasaje: 'Isaías 6:8',
    archivo: '/lecciones/2026/T4/26_04_02 El llamado de un profeta.html',
  },
  {
    anio: 2026,
    trimestre: 4,
    numero: 3,
    titulo: 'Profetas del Antiguo Testamento',
    pasaje: 'Jeremías 1:7-8',
    archivo: '/lecciones/2026/T4/26_04_03 Profetas del Antiguo Testamento.html',
  },
  {
    anio: 2026,
    trimestre: 4,
    numero: 4,
    titulo: 'Profetas del Nuevo Testamento',
    pasaje: '1 Corintios 12:4-6',
    archivo: '/lecciones/2026/T4/26_04_04 Profetas del Nuevo Testamento.html',
  },
  {
    anio: 2026,
    trimestre: 4,
    numero: 5,
    titulo: 'Revelación e inspiración',
    pasaje: 'Apocalipsis 1:1-2',
    archivo: '/lecciones/2026/T4/26_04_05 Revelacion e inspiracion.html',
  },
]

const leccionesOrdenadas = [...lecciones].sort(
  (a, b) => b.anio - a.anio || b.trimestre - a.trimestre || b.numero - a.numero
)


// La biblioteca se agrupa por año y trimestre, como el índice de un libro.
const grupos = leccionesOrdenadas.reduce((acc, l) => {
  const clave = `${l.anio}-${l.trimestre}`
  const grupo = acc.find((g) => g.clave === clave)
  if (grupo) grupo.lecciones.push(l)
  else acc.push({ clave, anio: l.anio, trimestre: l.trimestre, lecciones: [l] })
  return acc
}, [])

const manifiesto =
  'Quien enseña necesita ver el panorama completo: cada tema de principio a fin, reunido en un solo lugar y pensado para guiar una clase, no solo para la lectura de cada día.'

const num = (n) => String(n).padStart(2, '0')
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`

function Header() {
  return (
    <header className="header">
      <a href="/" className="brand">
        <span className="brand__mark" aria-hidden="true">
          <BookOpenText size={17} weight="fill" />
        </span>
        Escuela Sabática
      </a>
    </header>
  )
}

function LessonRow({ leccion }) {
  return (
    <li className="row">
      <a className="row__link" href={encodeURI(leccion.archivo)}>
        <span className="row__num" aria-hidden="true">{num(leccion.numero)}</span>
        <span className="row__main">
          <span className="row__title">
            <span className="sr-only">Lección {leccion.numero}: </span>
            {leccion.titulo}
          </span>
          <span className="row__pasaje">{leccion.pasaje}</span>
        </span>
        <span className="row__arrow" aria-hidden="true">
          <ArrowRight size={20} weight="regular" />
        </span>
      </a>
    </li>
  )
}

function Landing() {
  const scope = useRef(null)
  useSpotlight()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Todo el movimiento vive aquí: si el sistema pide reducir movimiento,
      // nada se anima y el contenido aparece completo desde el inicio.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // ---- Entrada de la portada ----
        const intro = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.5 } })
        intro
          .from('.hero__title .split__in', { yPercent: 115, rotate: 3, stagger: 0.07, duration: 1.6 })
          .from('.hero__eyebrow', { y: 16, opacity: 0, duration: 1.2 }, 0)
          .from('.hero [data-intro]:not(.hero__eyebrow)', { y: 28, opacity: 0, stagger: 0.1 }, 0.35)
          .from(
            '.hero__card',
            { y: 80, opacity: 0, rotateX: -8, transformPerspective: 1200, transformOrigin: 'center bottom', duration: 1.8 },
            0.3
          )

        // ---- Parallax suave al salir de la portada ----
        const salida = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('.hero__copy', { yPercent: -12, opacity: 0.35, ease: 'none', scrollTrigger: salida })
        gsap.to('.hero__card', { yPercent: -22, ease: 'none', scrollTrigger: salida })
        gsap.to('.hero__ambient', { yPercent: 18, ease: 'none', scrollTrigger: salida })

        // ---- Títulos de sección: las palabras suben desde una máscara ----
        gsap.utils.toArray('[data-split]').forEach((titulo) => {
          gsap.from(titulo.querySelectorAll('.split__in'), {
            yPercent: 115,
            rotate: 2.5,
            duration: 1.3,
            ease: 'expo.out',
            stagger: 0.06,
            scrollTrigger: { trigger: titulo, start: 'top 88%', once: true },
          })
        })

        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 28,
            opacity: 0,
            duration: 1.4,
            ease: 'expo.out',
            delay: 0.15,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })

        // ---- Biblioteca: filas en cascada ----
        gsap.utils.toArray('.rows').forEach((lista) => {
          gsap.from(lista.querySelectorAll('.row__link'), {
            y: 36,
            opacity: 0,
            duration: 1.3,
            ease: 'expo.out',
            stagger: 0.07,
            scrollTrigger: { trigger: lista, start: 'top 85%', once: true },
          })
        })

        // Las líneas divisorias se dibujan de izquierda a derecha.
        gsap.utils.toArray('[data-rule]').forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.6,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          })
        })

        // ---- Beneficios: cada fila entra con su contenido escalonado ----
        gsap.utils.toArray('.benefit').forEach((fila) => {
          gsap.from(fila.querySelectorAll(':scope > :not(.benefit__rule)'), {
            y: 24,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out',
            stagger: 0.08,
            delay: 0.2,
            scrollTrigger: { trigger: fila, start: 'top 88%', once: true },
          })
        })

        // ---- Manifiesto: se ilumina palabra por palabra con el scroll ----
        gsap.fromTo(
          '.manifesto__word',
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.08,
            scrollTrigger: { trigger: '.manifesto', start: 'top 78%', end: 'bottom 50%', scrub: true },
          }
        )

        // ---- Organización: progreso + niveles que se asientan ----
        gsap.fromTo(
          '.org__progress-fill',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: '.org__steps', start: 'top 70%', end: 'bottom 60%', scrub: true },
          }
        )

        // Se anima el contenido, no la tarjeta: así no choca con el hover en CSS.
        gsap.utils.toArray('.org__step').forEach((step) => {
          gsap.from(step.children, {
            opacity: 0,
            y: 30,
            ease: 'power2.out',
            stagger: 0.05,
            scrollTrigger: { trigger: step, start: 'top 90%', end: 'top 62%', scrub: true },
          })
        })

        // ---- Recomendaciones ----
        gsap.from('.accordion__item, .tip', {
          y: 40,
          opacity: 0,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '#recomendaciones .accordion, #recomendaciones .tips', start: 'top 85%', once: true },
        })
      })

      // ---- Interacciones con mouse (solo puntero fino y sin reducir movimiento) ----
      mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
        const limpiezas = []

        // Botones magnéticos: siguen un poco al cursor y vuelven con resorte.
        gsap.utils.toArray('[data-magnetic]').forEach((btn) => {
          btn.classList.add('is-magnetic')
          const icon = btn.querySelector('.btn__icon')
          const xTo = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'power3.out' })
          const yTo = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'power3.out' })
          const ixTo = icon && gsap.quickTo(icon, 'x', { duration: 0.5, ease: 'power3.out' })
          const iyTo = icon && gsap.quickTo(icon, 'y', { duration: 0.5, ease: 'power3.out' })

          const move = (e) => {
            const r = btn.getBoundingClientRect()
            const dx = e.clientX - (r.left + r.width / 2)
            const dy = e.clientY - (r.top + r.height / 2)
            xTo(dx * 0.22)
            yTo(dy * 0.3)
            ixTo?.(dx * 0.12)
            iyTo?.(dy * 0.18)
          }
          const leave = () => {
            gsap.to(btn, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.45)' })
            if (icon) gsap.to(icon, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.45)' })
          }
          const down = () => gsap.to(btn, { scale: 0.96, duration: 0.15, ease: 'power2.out' })
          const up = () => gsap.to(btn, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' })

          btn.addEventListener('pointermove', move)
          btn.addEventListener('pointerleave', leave)
          btn.addEventListener('pointerdown', down)
          btn.addEventListener('pointerup', up)
          limpiezas.push(() => {
            btn.classList.remove('is-magnetic')
            btn.removeEventListener('pointermove', move)
            btn.removeEventListener('pointerleave', leave)
            btn.removeEventListener('pointerdown', down)
            btn.removeEventListener('pointerup', up)
          })
        })

        // Tarjeta "Esta semana": se inclina hacia el cursor, como una hoja física.
        gsap.utils.toArray('[data-tilt]').forEach((card) => {
          card.classList.add('is-tilt')
          gsap.set(card, { transformPerspective: 1000 })
          const rx = gsap.quickTo(card, 'rotationX', { duration: 0.8, ease: 'power3.out' })
          const ry = gsap.quickTo(card, 'rotationY', { duration: 0.8, ease: 'power3.out' })

          const enter = () => gsap.to(card, { y: -6, duration: 0.8, ease: 'power3.out' })
          const move = (e) => {
            const r = card.getBoundingClientRect()
            const px = (e.clientX - r.left) / r.width - 0.5
            const py = (e.clientY - r.top) / r.height - 0.5
            ry(px * 7)
            rx(-py * 7)
          }
          const leave = () =>
            gsap.to(card, { rotationX: 0, rotationY: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)' })

          card.addEventListener('pointerenter', enter)
          card.addEventListener('pointermove', move)
          card.addEventListener('pointerleave', leave)
          limpiezas.push(() => {
            card.classList.remove('is-tilt')
            card.removeEventListener('pointerenter', enter)
            card.removeEventListener('pointermove', move)
            card.removeEventListener('pointerleave', leave)
          })
        })

        return () => limpiezas.forEach((fn) => fn())
      })

      return () => mm.revert()
    },
    { scope }
  )

  const masReciente = leccionesOrdenadas[0]

  return (
    <div ref={scope}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__ambient" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="hero__eyebrow" data-intro>
              Biblioteca para maestros
            </p>
            <h1 id="hero-title" className="hero__title">
              <SplitWords text="Cada lección, organizada" />{' '}
              <em>
                <SplitWords text="por temas" />
              </em>
            </h1>
            <p className="hero__lead" data-intro>
              Prepara la Escuela Sabática con una mirada más completa: cada lección se lee aquí mismo,
              reunida por temas y ordenada por año, trimestre y número.
            </p>
            <div className="hero__actions" data-intro>
              <a className="btn btn--primary" data-magnetic href="#biblioteca">
                Abrir la biblioteca
                <span className="btn__icon" aria-hidden="true">
                  <ArrowRight size={18} weight="bold" />
                </span>
              </a>
              <a className="link-arrow" href="#organizacion">
                Cómo funciona <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </a>
            </div>
          </div>

          {masReciente && (
            <div className="hero__card">
            <a className="week spot" data-spotlight data-tilt href={encodeURI(masReciente.archivo)}>
              <span className="week__label">
                <span className="week__dot" aria-hidden="true" />
                Esta semana
              </span>
              <span className="week__meta">
                Lección {num(masReciente.numero)} · {masReciente.trimestre}º trimestre {masReciente.anio}
              </span>
              <span className="week__title">{masReciente.titulo}</span>
              <span className="week__pasaje">{masReciente.pasaje}</span>
              <span className="week__cta">
                Leer la lección
                <span className="week__cta-icon" aria-hidden="true">
                  <ArrowUpRight size={18} weight="bold" />
                </span>
              </span>
            </a>
            </div>
          )}
        </div>
      </section>

      <section className="section" id="biblioteca" aria-labelledby="biblioteca-title">
        <div className="container">
          <header className="section__head">
            <h2 id="biblioteca-title" data-split>
              <SplitWords text="Biblioteca" />
            </h2>
            <p data-reveal>Todas las lecciones, de la más reciente a la más antigua.</p>
          </header>

          {grupos.length === 0 ? (
            <div className="empty">
              <p className="empty__title">Todavía no hay lecciones en la biblioteca</p>
              <p>
                Cuando agreguemos las primeras, aparecerán aquí ordenadas por año y trimestre, listas para
                leerse sin salir de la página.
              </p>
            </div>
          ) : (
            grupos.map((g) => (
              <div className="shelf" key={g.clave}>
                <div className="shelf__head">
                  <h3 className="shelf__title">
                    {g.trimestre}º trimestre <span>{g.anio}</span>
                  </h3>
                  <p className="shelf__count">{plural(g.lecciones.length, 'lección', 'lecciones')}</p>
                  <span className="shelf__rule" data-rule aria-hidden="true" />
                </div>
                <ol className="rows">
                  {g.lecciones.map((l) => (
                    <LessonRow key={l.archivo} leccion={l} />
                  ))}
                </ol>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section section--alt" id="organizacion" aria-labelledby="organizacion-title">
        <div className="container org">
          <div className="org__aside">
            <h2 id="organizacion-title" data-split>
              <SplitWords text="Cómo está organizada" />
            </h2>
            <p data-reveal>Cuatro niveles, de lo general a lo específico. Siempre sabes dónde estás y qué sigue.</p>
          </div>
          <div className="org__steps">
            <span className="org__progress" aria-hidden="true">
              <span className="org__progress-fill" />
            </span>
            <ol>
              {pasos.map((paso, i) => (
                <li className="org__step spot" data-spotlight key={paso.titulo}>
                  <span className="org__num" aria-hidden="true">{num(i + 1)}</span>
                  <div>
                    <h3>{paso.titulo}</h3>
                    <p>{paso.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section" id="temas" aria-labelledby="temas-title">
        <div className="container">
          <h2 id="temas-title" className="section__kicker" data-split>
            <SplitWords text="¿Por qué por temas y no por días?" />
          </h2>
          <p className="manifesto">
            {manifiesto.split(' ').map((palabra, i) => (
              <span className="manifesto__word" key={i}>
                {palabra}{' '}
              </span>
            ))}
          </p>
          <ul className="benefits">
            {beneficios.map((b, i) => (
              <li className="benefit" key={b.titulo}>
                <span className="benefit__rule" data-rule aria-hidden="true" />
                <span className="benefit__index" aria-hidden="true">{num(i + 1)}</span>
                <h3>{b.titulo}</h3>
                <p>{b.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--alt" id="recomendaciones" aria-labelledby="recomendaciones-title">
        <div className="container">
          <header className="section__head">
            <h2 id="recomendaciones-title" data-split>
              <SplitWords text="Recomendaciones para el maestro" />
            </h2>
            <p data-reveal>Ideas prácticas para sacarle más provecho a cada lección.</p>
          </header>
          <Recomendaciones items={recomendaciones} />
        </div>
      </section>

      {masReciente && (
        <section className="cta" aria-labelledby="cta-title">
          <div className="container cta__inner">
            <h2 id="cta-title" className="cta__title" data-split>
              <SplitWords text="Prepara tu" />{' '}
              <em>
                <SplitWords text="próxima clase" />
              </em>
            </h2>
            <div className="cta__side" data-reveal>
              <p className="cta__lead">
                La lección más reciente es <strong>{masReciente.titulo}</strong>, con {masReciente.pasaje} como
                pasaje central.
              </p>
              <div className="hero__actions">
                <a className="btn btn--primary btn--lg" data-magnetic href={encodeURI(masReciente.archivo)}>
                  Leer la lección {masReciente.numero}
                  <span className="btn__icon" aria-hidden="true">
                    <ArrowRight size={18} weight="bold" />
                  </span>
                </a>
                <a className="link-arrow" href="#biblioteca">
                  Ver toda la biblioteca <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__brand">
          <span className="brand__mark brand__mark--sm" aria-hidden="true">
            <BookOpenText size={14} weight="fill" />
          </span>
          Escuela Sabática
        </p>
        <nav aria-label="Pie de página">
          <ul className="footer__links">
            <li><a href="#biblioteca">Biblioteca</a></li>
            <li><a href="#organizacion">Organización</a></li>
            <li><a href="#temas">Temas</a></li>
            <li><a href="#recomendaciones">Guía</a></li>
          </ul>
        </nav>
        <p className="footer__copy">Lecciones por temas · {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}

export default function App() {
  useSmoothScroll()

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header />
      <main className="main" id="contenido" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ProgressiveBlur position="top" height="96px" blurAmount="6px" />
      <ProgressiveBlur position="bottom" height="150px" blurAmount="10px" />
      <Dock />
    </>
  )
}
