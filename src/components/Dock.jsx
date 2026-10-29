import { useEffect, useRef, useState } from 'react'
import { Books, ListNumbers, BookOpenText, ChalkboardTeacher } from '@phosphor-icons/react'
import './Dock.css'

// Un ítem por cada sección de la landing, en el mismo orden en que aparecen.
const items = [
  { id: 'biblioteca', label: 'Biblioteca', Icon: Books },
  { id: 'organizacion', label: 'Organización', Icon: ListNumbers },
  { id: 'temas', label: 'Temas', Icon: BookOpenText },
  { id: 'recomendaciones', label: 'Guía', Icon: ChalkboardTeacher },
]

export default function Dock() {
  const [active, setActive] = useState(items[0].id)
  const observerRef = useRef(null)

  // Resalta el ítem de la sección que se está viendo al hacer scroll.
  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)

    if (sections.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
        // De vuelta en la portada (antes de la primera sección): primer ítem.
        else if (window.scrollY + window.innerHeight * 0.5 < sections[0].offsetTop) setActive(items[0].id)
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    sections.forEach((section) => observerRef.current.observe(section))
    return () => observerRef.current?.disconnect()
  }, [])

  const activeIndex = items.findIndex((item) => item.id === active)

  return (
    <nav className="dock" aria-label="Secciones de la página">
      <ul className="dock__list" style={{ '--active': activeIndex }}>
        {/* Fondo del ítem activo: se desliza de un ítem a otro en vez de saltar. */}
        <li className="dock__indicator" aria-hidden="true" />
        {items.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <li key={id} className="dock__li">
              <a
                href={`#${id}`}
                className={`dock__item${isActive ? ' dock__item--active' : ''}`}
                aria-current={isActive ? 'location' : undefined}
              >
                <Icon className="dock__icon" size={22} weight={isActive ? 'fill' : 'regular'} aria-hidden="true" />
                <span className="dock__label">{label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
