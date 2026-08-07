import ThemeToggle from '../components/ThemeToggle';
import ProposalModal from '../components/ProposalModal';
import ClientEffects from '../components/ClientEffects';
import Buscador from '../components/Buscador';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://guiasanjuan.mx';

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type':    'WebSite',
    name:        'Guía San Juan',
    url:         SITE_URL,
    description: 'Guía digital independiente de San Juan del Río, Querétaro.',
    inLanguage:  'es-MX',
    publisher: {
      '@type': 'Organization',
      name:    'Trinium',
      url:     'https://trinium.com.mx',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type':    'Organization',
    name:        'Trinium',
    url:         'https://trinium.com.mx',
    logo:        `${SITE_URL}/assets/trinium-logo.png`,
    contactPoint: {
      '@type':     'ContactPoint',
      telephone:   '+52-427-100-0100',
      email:       'hola@trinium.mx',
      contactType: 'customer service',
      areaServed:  'MX',
    },
    address: {
      '@type':           'PostalAddress',
      addressLocality:   'San Juan del Río',
      addressRegion:     'Querétaro',
      addressCountry:    'MX',
    },
  },
  {
    '@context':    'https://schema.org',
    '@type':       'TouristDestination',
    name:          'San Juan del Río',
    description:   'Ciudad del estado de Querétaro, México. Conocida por su historia, artesanías, vinos y la Feria San Juan.',
    url:           SITE_URL,
    touristType:   ['Familia', 'Cultura', 'Gastronomía'],
    containedInPlace: {
      '@type':    'State',
      name:       'Querétaro',
      addressCountry: 'MX',
    },
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientEffects />

      {/* HEADER */}
      <header className="site-header" id="siteHeader">
        <div className="wrap nav">
          <a className="brand" href="#top" aria-label="Guía San Juan, inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-GS.png" alt="" className="brand-logo" width={38} height={38} />
            <span>
              <span className="brand-name">Guía San Juan</span>
              <span className="brand-sub">San Juan del Río</span>
            </span>
          </a>
          <nav className="nav-links" aria-label="Secciones">
            <a className="navlink" href="/lugares">Lugares</a>
            <a className="navlink" href="/eventos">Eventos</a>
            <a className="navlink" href="/rutas">Rutas</a>
            <a className="navlink" href="/comercios">Comercios</a>
            <a className="navlink" href="/tramites">Trámites</a>
            <a className="navlink" href="/directorio">Directorio</a>
          </nav>
          <div className="nav-cta">
            <a className="btn btn--primary" href="#descubre">
              Conoce la guía <span className="arrow">→</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero section" aria-label="Presentación">
          <svg className="route-line" viewBox="0 0 380 320" aria-hidden="true">
            <path d="M10,300 C90,250 60,170 150,150 C240,130 210,60 330,30" />
            <circle className="node" cx="10" cy="300" r="4" />
            <circle className="node" cx="150" cy="150" r="4" />
            <circle className="node" cx="330" cy="30" r="4" />
          </svg>
          <div className="wrap hero-grid">
            <div className="hero-copy hero-entrance" style={{ animationDelay: '0.1s' }}>
              <span className="hero-badge">
                <span className="dot"></span>{' '}
                Guía digital independiente — <b>hecha en San Juan del Río</b>
              </span>
              <h1>Guía <span className="accentword">San Juan</span></h1>
              <p className="hero-sub">Eventos, lugares y lo mejor de San Juan del Río.</p>
              <p className="hero-support">
                Encuentra qué hacer este fin de semana, a dónde ir con la familia, los eventos que
                no te puedes perder y resuelve tus trámites municipales. Todo en un solo lugar,
                claro y fácil de usar.
              </p>
              <div className="hero-actions">
                <a className="btn btn--primary" href="#descubre">
                  Descubre San Juan <span className="arrow">→</span>
                </a>
                <a className="btn btn--ghost" href="#tramites-servicios">Trámites y servicios</a>
              </div>
              <div className="hero-meta">
                <div className="item"><b>Gratis</b><span>Toda la info, sin costo</span></div>
                <div className="divider"></div>
                <div className="item"><b>Actualizada</b><span>Eventos y horarios al día</span></div>
                <div className="divider"></div>
                <div className="item"><b>Independiente</b><span>Hecha por gente de aquí</span></div>
              </div>
            </div>

            <div className="hero-media hero-entrance" style={{ animationDelay: '0.25s' }}>
              <div className="hero-frame">
                <img
                  src="/assets/puente_san_juan.webp"
                  alt="Puente de la Historia, San Juan del Río"
                  className="slot-fill"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
                <div className="hero-tag">
                  <span className="pin" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  <span>
                    <span className="t">Puente de la Historia</span>
                    <span className="s">Símbolo de San Juan del Río</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DESCUBRE — accesos a los módulos de descubrimiento */}
        <section className="section" id="descubre" aria-label="Descubre San Juan del Río">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Descubre San Juan</span>
              <h2>Qué visitar, qué hacer y por dónde empezar</h2>
              <p className="lead">
                Lugares con encanto, los eventos que no te puedes perder, rutas listas para caminar
                y recomendaciones de gente de aquí.
              </p>
            </div>
            <div className="accesos-grid accesos-grid--4">
              <a className="acceso" href="/lugares" style={{ '--cat': 'oklch(0.6 0.13 40)' }}>
                <span className="acceso-ico" aria-hidden="true">📍</span>
                <span className="acceso-txt"><b>Lugares</b><span>Sitios de interés, plazas, templos y rincones para conocer.</span></span>
                <span className="acceso-arrow" aria-hidden="true">→</span>
              </a>
              <a className="acceso" href="/eventos" style={{ '--cat': 'oklch(0.58 0.14 300)' }}>
                <span className="acceso-ico" aria-hidden="true">🎶</span>
                <span className="acceso-txt"><b>Eventos</b><span>La agenda de ferias, cultura y actividades por venir.</span></span>
                <span className="acceso-arrow" aria-hidden="true">→</span>
              </a>
              <a className="acceso" href="/rutas" style={{ '--cat': 'oklch(0.56 0.12 200)' }}>
                <span className="acceso-ico" aria-hidden="true">🗺️</span>
                <span className="acceso-txt"><b>Rutas</b><span>Recorridos armados para aprovechar tu visita.</span></span>
                <span className="acceso-arrow" aria-hidden="true">→</span>
              </a>
              <a className="acceso" href="/comercios" style={{ '--cat': 'oklch(0.6 0.13 20)' }}>
                <span className="acceso-ico" aria-hidden="true">🛍️</span>
                <span className="acceso-txt"><b>Comercios</b><span>Negocios locales: dónde comer, comprar y resolver.</span></span>
                <span className="acceso-arrow" aria-hidden="true">→</span>
              </a>
              <a className="acceso" href="/recomendaciones" style={{ '--cat': 'oklch(0.58 0.12 90)' }}>
                <span className="acceso-ico" aria-hidden="true">💡</span>
                <span className="acceso-txt"><b>Recomendaciones</b><span>Tips y consejos para disfrutar y moverte por la ciudad.</span></span>
                <span className="acceso-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* TRÁMITES Y SERVICIOS — accesos directos al contenido real */}
        <section className="section band--soft" id="tramites-servicios" aria-label="Trámites y servicios">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Trámites y servicios</span>
              <h2>Resuelve tu trámite sin dar vueltas</h2>
              <p className="lead">
                Consulta el catálogo de trámites municipales o encuentra el teléfono de la dependencia
                que necesitas. Información verificada, clara y en un solo lugar.
              </p>
            </div>
            <div className="buscador-centrado reveal">
              <Buscador placeholder="¿Qué trámite necesitas?" />
            </div>
            <div className="accesos-grid">
              <a className="acceso" href="/tramites">
                <span className="acceso-ico">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" />
                    <path d="M9 12h6M9 16h4" />
                  </svg>
                </span>
                <span className="acceso-txt">
                  <b>Trámites</b>
                  <span>Consulta requisitos, costos y a dónde ir para cada trámite municipal.</span>
                </span>
                <span className="acceso-arrow" aria-hidden="true">→</span>
              </a>
              <a className="acceso" href="/directorio">
                <span className="acceso-ico">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
                  </svg>
                </span>
                <span className="acceso-txt">
                  <b>Directorio</b>
                  <span>Teléfonos y datos de contacto de las dependencias.</span>
                </span>
                <span className="acceso-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* MUY PRONTO */}
        <section className="section" id="pronto" aria-label="Muy pronto">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">En camino</span>
              <h2>Esto se pone mejor</h2>
              <p className="lead">Estamos construyendo la guía sección por sección. Sé de los primeros en enterarte.</p>
            </div>
            <div className="soon-grid">
              <div className="soon reveal"><span className="n">01</span><span className="label">Respuestas al instante por WhatsApp</span><span className="chip">Pronto</span></div>
              <div className="soon reveal"><span className="n">02</span><span className="label">La guía en tu celular</span><span className="chip">Pronto</span></div>
            </div>
            <p className="soon-note reveal">
              <span className="pulse"></span> Estamos construyendo esta guía paso a paso, con información útil todo el año.
            </p>
            <ProposalModal />
          </div>
        </section>

        {/* EMOCIONAL */}
        <section className="section band--deep on-deep" aria-label="San Juan merece una guía a su altura">
          <div className="wrap">
            <div className="emotive reveal">
              <span className="eyebrow">Hecho aquí</span>
              <h2>Información útil, hecha con cariño</h2>
              <p>
                Una herramienta digital para San Juan. Esta guía existe para que encuentres lo
                que buscas sin complicaciones — y para que la ciudad se sienta más conectada.
              </p>
              <p className="pullquote">Práctica, bonita y <span>hecha por gente de aquí.</span></p>
            </div>
          </div>
        </section>

        {/* INDEPENDENCIA + TRINIUM */}
        <section className="section" id="trinium" aria-label="Sobre Guía San Juan">
          <div className="wrap">
            <div className="indie reveal">
              <span className="shield" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M12 3 5 6v5c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z" />
                  <path d="m9 11.5 2 2 4-4" />
                </svg>
              </span>
              <div>
                <h3>Iniciativa independiente</h3>
                <p>
                  Guía San Juan es una iniciativa independiente creada por Trinium. No somos un sitio oficial.
                  Nuestro objetivo es acercar información útil, clara y accesible para habitantes, visitantes y negocios de San Juan del Río.
                </p>
              </div>
            </div>

            <div className="signature reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="trinium-logo-img"
                src="/assets/trinium-logo.png"
                alt="Trinium"
                width={1527}
                height={597}
              />
              <p>
                Guía San Juan es un proyecto de <a href="https://trinium.com.mx" target="_blank" rel="noopener noreferrer"><b>Trinium.</b></a>
              </p>
              <p>Creamos sitios web, software y soluciones digitales con corazón.</p>
              <a
                className="sig-link sig-link--wa"
                href="https://wa.me/524271000100?text=Hola%2C%20vi%20Gu%C3%ADa%20San%20Juan%20y%20me%20interesa%20una%20p%C3%A1gina%20similar%20para%20mi%20negocio."
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.37 17.04 14.27C16.97 14.17 16.81 14.1 16.56 13.98C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.31C14.13 13.56 13.67 14.1 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.22 11.94 13.96 11 13.12C10.26 12.47 9.77 11.67 9.62 11.42C9.48 11.17 9.61 11.04 9.73 10.92C9.84 10.81 9.98 10.63 10.1 10.48C10.21 10.34 10.25 10.23 10.33 10.07C10.41 9.9 10.37 9.76 10.31 9.64C10.25 9.52 9.77 8.3 9.56 7.81C9.36 7.34 9.16 7.4 9 7.39C8.86 7.39 8.7 7.33 8.53 7.33Z"/>
                </svg>
                ¿Quieres una página como esta? Escríbenos <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer" aria-label="Pie de página">
        <div className="footer-bloom footer-bloom--1" aria-hidden="true" />
        <div className="footer-bloom footer-bloom--2" aria-hidden="true" />
        <div className="footer-bloom footer-bloom--3" aria-hidden="true" />
        <span className="fdot fdot--1" aria-hidden="true" />
        <span className="fdot fdot--2" aria-hidden="true" />
        <span className="fdot fdot--3" aria-hidden="true" />
        <span className="fdot fdot--4" aria-hidden="true" />
        <span className="fdot fdot--5" aria-hidden="true" />
        <span className="fdot fdot--6" aria-hidden="true" />
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">
              <a className="brand footer-brand-link" href="#top" aria-label="Guía San Juan, inicio">
                <span className="footer-logo-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo-GS.png" alt="" className="brand-logo" width={36} height={36} />
                </span>
                <span>
                  <span className="brand-name">Guía San Juan</span>
                  <span className="brand-sub brand-sub--grad">San Juan del Río</span>
                </span>
              </a>
              <p className="footer-blurb">
                Hecha por y para los sanjuanenses. Toda la información de San Juan del Río en un solo lugar.
              </p>
              <span className="footer-coords">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" />
                </svg>
                20°23′ N · 100°00′ O
              </span>
            </div>
            <nav className="footer-nav" aria-label="Secciones del sitio">
              <h4 className="footer-nav-label">Explora</h4>
              <ul>
                <li><a href="/lugares">Lugares</a></li>
                <li><a href="/eventos">Eventos</a></li>
                <li><a href="/rutas">Rutas</a></li>
                <li><a href="/comercios">Comercios</a></li>
                <li><a href="/recomendaciones">Recomendaciones</a></li>
                <li><a href="/tramites">Trámites</a></li>
                <li><a href="/directorio">Directorio</a></li>
              </ul>
            </nav>
            <div className="footer-right">
              <p className="footer-by">Un proyecto de</p>
              <a
                className="footer-trinium"
                href="https://trinium.com.mx"
                target="_blank"
                rel="noopener noreferrer"
              >
                TRINIUM
              </a>
              <a
                className="footer-cta"
                href="https://wa.me/524271000100?text=Hola%2C%20vi%20Gu%C3%ADa%20San%20Juan%20y%20me%20interesa%20una%20p%C3%A1gina%20similar%20para%20mi%20negocio."
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.37 17.04 14.27C16.97 14.17 16.81 14.1 16.56 13.98C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.31C14.13 13.56 13.67 14.1 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.22 11.94 13.96 11 13.12C10.26 12.47 9.77 11.67 9.62 11.42C9.48 11.17 9.61 11.04 9.73 10.92C9.84 10.81 9.98 10.63 10.1 10.48C10.21 10.34 10.25 10.23 10.33 10.07C10.41 9.9 10.37 9.76 10.31 9.64C10.25 9.52 9.77 8.3 9.56 7.81C9.36 7.34 9.16 7.4 9 7.39C8.86 7.39 8.7 7.33 8.53 7.33Z"/>
                </svg>
                Quiero una página así
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 Guía San Juan · Proyecto ciudadano no oficial · <a href="/acerca-de">Acerca de</a> · <a href="/terminos">Términos</a> · <a href="/privacidad">Aviso de privacidad</a></span>
            <span className="made">Hecho con <span className="heart" aria-hidden="true">♥</span> por <a href="https://trinium.com.mx/" target="_blank" rel="noopener noreferrer"><b>TRINIUM</b></a></span>
          </div>
        </div>
      </footer>
    </>
  );
}
