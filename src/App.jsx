import { Routes, Route, Navigate } from 'react-router-dom'
import Dock from './components/Dock.jsx'
import ProgressiveBlur from './components/Blur.jsx'
import './App.css'

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
    trimestre: 3,
    numero: 12,
    titulo: 'Cómo lidiar con falsos maestros',
    pasaje: '2 Corintios 10–13',
    archivo: '/lecciones/2026/t3/leccion-12-como-lidiar-con-falsos-maestros.html',
  },
]

function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <a href="/" className="brand">Escuela Sabática</a>
      </div>
    </header>
  )
}

function Landing() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <span className="eyebrow">Biblioteca para maestros</span>
          <h1>Cada lección, organizada por temas</h1>
          <p className="hero__lead">
            Una biblioteca para preparar la Escuela Sabática con una mirada más completa:
            cada lección se lee aquí mismo, reunida por temas y ordenada por año, trimestre y número.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#biblioteca">Abrir la biblioteca →</a>
            <a className="btn btn--ghost" href="#organizacion">Cómo funciona</a>
          </div>
        </div>
      </section>

      <section className="section" id="biblioteca">
        <div className="container">
          <header className="section__head">
            <h2>Biblioteca</h2>
            <p>Lecciones disponibles, ordenadas por año, trimestre y número.</p>
          </header>

          {lecciones.length === 0 ? (
            <div className="empty">
              <p className="empty__title">Todavía no hay lecciones en la biblioteca</p>
              <p>Cuando agreguemos las primeras, aparecerán aquí ordenadas por año y trimestre, listas para leerse sin salir de la página.</p>
            </div>
          ) : (
            <ul className="lessons">
              {lecciones.map((l) => (
                <li className="lesson" key={l.archivo}>
                  <a className="lesson__link" href={l.archivo}>
                    <span className="lesson__meta">
                      {l.anio} · {l.trimestre}º trimestre · Lección {String(l.numero).padStart(2, '0')}
                    </span>
                    <h3 className="lesson__title">{l.titulo}</h3>
                    <p className="lesson__pasaje">{l.pasaje}</p>
                    <span className="lesson__cta">Leer lección →</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section section--alt" id="organizacion">
        <div className="container">
          <header className="section__head">
            <h2>Cómo está organizada</h2>
            <p>Cuatro niveles, de lo general a lo específico.</p>
          </header>
          <ol className="steps">
            {pasos.map((paso, i) => (
              <li className="step" key={paso.titulo}>
                <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{paso.titulo}</h3>
                <p>{paso.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="temas">
        <div className="container">
          <header className="section__head">
            <h2>¿Por qué por temas y no por días?</h2>
            <p>Porque quien enseña necesita ver el panorama completo.</p>
          </header>
          <ul className="cards">
            {beneficios.map((b) => (
              <li className="card" key={b.titulo}>
                <h3>{b.titulo}</h3>
                <p>{b.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--alt" id="recomendaciones">
        <div className="container">
          <header className="section__head">
            <h2>Recomendaciones para el maestro</h2>
            <p>Ideas prácticas para sacarle más provecho a cada lección.</p>
          </header>
          <ul className="tips">
            {recomendaciones.map((r) => (
              <li className="tip" key={r.titulo}>
                <span className="tip__check" aria-hidden="true">✓</span>
                <div>
                  <h3>{r.titulo}</h3>
                  <p>{r.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>Escuela Sabática · Lecciones por temas</p>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ProgressiveBlur position="top" height="70px" blurAmount="6px" />
      <ProgressiveBlur position="bottom" height="150px" blurAmount="10px" />
      <Dock />
    </>
  )
}