import { Fragment } from 'react'

/**
 * Divide un texto en palabras, cada una dentro de una "ventana" con
 * overflow oculto, para que GSAP las haga subir como si salieran de una
 * máscara. El texto sigue siendo texto normal para lectores de pantalla.
 */
export default function SplitWords({ text }) {
  const palabras = text.split(' ')
  return palabras.map((palabra, i) => (
    <Fragment key={i}>
      <span className="split">
        <span className="split__in">{palabra}</span>
      </span>
      {i < palabras.length - 1 ? ' ' : null}
    </Fragment>
  ))
}
