import { useEffect, useState } from 'react'
import './Recomendaciones.css'

const DESKTOP = '(min-width: 1000px)'

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

const num = (n) => String(n).padStart(2, '0')

/**
 * En escritorio: acordeón horizontal (cada franja se expande al pasar el
 * mouse, al enfocarla con teclado o al hacer clic). En pantallas pequeñas:
 * lista normal con todo el texto visible, sin nada que abrir.
 */
export default function Recomendaciones({ items }) {
  const isDesktop = useMediaQuery(DESKTOP)
  const [open, setOpen] = useState(0)

  if (!isDesktop) {
    return (
      <ol className="tips">
        {items.map((r, i) => (
          <li className="tip" key={r.titulo}>
            <span className="tip__num" aria-hidden="true">{num(i + 1)}</span>
            <div>
              <h3>{r.titulo}</h3>
              <p>{r.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <ol className="accordion">
      {items.map((r, i) => {
        const isOpen = open === i
        const panelId = `tip-panel-${i}`
        const btnId = `tip-btn-${i}`
        return (
          <li
            key={r.titulo}
            className={`accordion__item${isOpen ? ' accordion__item--open' : ''}`}
            onMouseEnter={() => setOpen(i)}
          >
            <h3 className="accordion__heading">
              <button
                id={btnId}
                type="button"
                className="accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(i)}
                onFocus={() => setOpen(i)}
              >
                <span className="accordion__num" aria-hidden="true">{num(i + 1)}</span>
                <span className="accordion__title">{r.titulo}</span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className="accordion__panel"
              hidden={!isOpen}
            >
              <p>{r.texto}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
