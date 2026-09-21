import './Blur.css'

/**
 * Difumina el borde superior o inferior de la pantalla: el contenido que
 * se desplaza por debajo se ve borroso y se funde con var(--bg) en vez
 * de cortarse de golpe. No lleva color propio: toma siempre el fondo
 * real de la página, así que si cambia la paleta, el blur cambia solo.
 */
export default function ProgressiveBlur({
  position = 'top', // 'top' | 'bottom'
  height = '110px',
  blurAmount = '8px',
  className = '',
}) {
  const isTop = position === 'top'
  const bg = 'var(--bg)'

  return (
    <div
      aria-hidden="true"
      className={`progressive-blur progressive-blur--${position} ${className}`.trim()}
      style={{
        height,
        background: isTop
          ? `linear-gradient(to top, transparent, ${bg})`
          : `linear-gradient(to bottom, transparent, ${bg})`,
        maskImage: isTop
          ? `linear-gradient(to bottom, ${bg} 45%, transparent)`
          : `linear-gradient(to top, ${bg} 45%, transparent)`,
        WebkitMaskImage: isTop
          ? `linear-gradient(to bottom, ${bg} 45%, transparent)`
          : `linear-gradient(to top, ${bg} 45%, transparent)`,
        backdropFilter: `blur(${blurAmount})`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
      }}
    />
  )
}