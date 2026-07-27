import FichaShell from '../../components/FichaShell';

export const metadata = {
  title: 'Acerca de',
  description: 'Qué es Guía San Juan, quién lo hace y por qué no es un sitio oficial del gobierno.',
  alternates: { canonical: '/acerca-de' },
};

export default function AcercaDePage() {
  return (
    <FichaShell>
      <article className="wrap ficha legal">
        <nav className="ficha-crumbs" aria-label="Ruta"><a href="/">Inicio</a> › <span>Acerca de</span></nav>
        <h1 className="ficha-h1">Acerca de Guía San Juan</h1>

        <p className="ficha-resumen">
          Guía San Juan es una guía ciudadana que reúne, en un solo lugar y en lenguaje claro, la
          información práctica para hacer trámites y encontrar dependencias y servicios en San Juan
          del Río. Es un proyecto de <b>Trinium</b>, <b>independiente del Gobierno Municipal</b>: no es
          un sitio oficial.
        </p>

        <section className="ficha-sec">
          <h2>1. Por qué existe</h2>
          <p>
            La información para resolver un trámite suele estar dispersa, desactualizada o escrita en
            un lenguaje difícil de entender. Guía San Juan concentra esa información, la explica paso a
            paso y la mantiene verificada, para que sepas <b>qué necesitas, cuánto cuesta y a dónde ir</b> antes
            de salir de casa.
          </p>
        </section>

        <section className="ficha-sec">
          <h2>2. Qué NO es</h2>
          <ul className="ficha-checklist">
            <li><b>No es un sitio oficial</b> del Gobierno Municipal ni de ninguna dependencia pública.</li>
            <li><b>No realiza trámites</b> ni recibe pagos o documentos en tu nombre.</li>
            <li>No sustituye a las fuentes oficiales: siempre confirma los datos con la dependencia
              correspondiente antes de acudir.</li>
          </ul>
        </section>

        <section className="ficha-sec">
          <h2>3. Cómo cuidamos la información</h2>
          <p>
            Cada dato publicado se toma de fuentes oficiales o de una verificación directa, y lleva
            registrada la fecha en que se confirmó. La información se revisa de forma periódica y se
            marca cuando lleva demasiado tiempo sin actualizarse, para que sepas qué tan reciente es lo
            que estás leyendo.
          </p>
          <p>
            Si encuentras un dato incorrecto, cada ficha tiene un botón para <b>reportarlo</b>; los
            reportes de la ciudadanía entran directo a nuestra cola de verificación.
          </p>
        </section>

        <section className="ficha-sec">
          <h2>4. Quién lo hace</h2>
          <p>
            Guía San Juan es desarrollado y operado por <b>Trinium</b>. Puedes escribirnos a{' '}
            <a href="mailto:hola@trinium.mx">hola@trinium.mx</a> para dudas, correcciones o propuestas de
            contenido. También puedes enviar una propuesta desde el formulario “Envía tu propuesta” en la
            página principal.
          </p>
        </section>

        <section className="ficha-sec">
          <h2>5. Más información</h2>
          <p>
            Consulta el <a href="/terminos">Aviso legal y términos de uso</a> y el{' '}
            <a href="/privacidad">Aviso de privacidad</a>.
          </p>
        </section>
      </article>
    </FichaShell>
  );
}
