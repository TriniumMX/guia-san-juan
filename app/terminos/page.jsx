import FichaShell from '../../components/FichaShell';

export const metadata = {
  title: 'Aviso legal y términos de uso',
  description: 'Condiciones de uso del sitio informativo Guía San Juan y límites de responsabilidad.',
  alternates: { canonical: '/terminos' },
};

export default function TerminosPage() {
  return (
    <FichaShell>
      <article className="wrap ficha legal">
        <nav className="ficha-crumbs" aria-label="Ruta"><a href="/">Inicio</a> › <span>Términos de uso</span></nav>
        <h1 className="ficha-h1">Aviso legal y términos de uso</h1>
        <p className="admin-muted" style={{ fontSize: 14 }}>Versión 1 · vigente desde julio de 2026</p>

        <p className="ficha-resumen">
          Al usar Guía San Juan (guiasanjuan.mx) aceptas estas condiciones. Este es un <b>sitio
          informativo</b> operado por <b>Trinium</b>, independiente del Gobierno Municipal y de las
          dependencias públicas mencionadas; <b>no es un sitio oficial</b>.
        </p>

        <section className="ficha-sec">
          <h2>1. Responsable del sitio</h2>
          <p>
            Guía San Juan es un proyecto de <b>Trinium</b>. Contacto:{' '}
            <a href="mailto:hola@trinium.mx">hola@trinium.mx</a>. Conoce más en la página{' '}
            <a href="/acerca-de">Acerca de</a>.
          </p>
        </section>

        <section className="ficha-sec">
          <h2>2. Naturaleza informativa del contenido</h2>
          <ul className="ficha-checklist">
            <li>La información se ofrece con fines <b>orientativos</b>, para ayudarte a preparar un trámite
              o ubicar una dependencia o servicio.</li>
            <li>No constituye asesoría legal, fiscal ni administrativa, ni una fuente oficial.</li>
            <li>Los requisitos, costos, horarios y datos de contacto los define cada dependencia y
              <b> pueden cambiar sin previo aviso</b>. Confírmalos siempre con la fuente oficial antes de
              acudir o realizar un pago.</li>
          </ul>
        </section>

        <section className="ficha-sec">
          <h2>3. Verificación y actualidad</h2>
          <p>
            Hacemos un esfuerzo razonable por mantener la información correcta y actualizada: cada dato
            lleva la fecha en que fue verificado y se revisa de forma periódica. Aun así, no garantizamos
            que toda la información esté libre de errores o vigente en todo momento. Cada ficha incluye un
            botón para <b>reportar</b> datos incorrectos.
          </p>
        </section>

        <section className="ficha-sec">
          <h2>4. Límite de responsabilidad</h2>
          <p>
            Guía San Juan y Trinium no se hacen responsables por decisiones tomadas con base en la
            información del sitio, ni por trámites, pagos, tiempos de espera o resultados ante las
            dependencias. El uso de la información es bajo tu propia responsabilidad; la relación con cada
            dependencia se rige por sus propias reglas y horarios.
          </p>
        </section>

        <section className="ficha-sec">
          <h2>5. Enlaces y servicios de terceros</h2>
          <p>
            El sitio puede enlazar a páginas oficiales u otros servicios de terceros (por ejemplo,
            WhatsApp). No controlamos ni respondemos por su contenido, disponibilidad o políticas; al
            usarlos aceptas los términos de cada proveedor.
          </p>
        </section>

        <section className="ficha-sec">
          <h2>6. Propiedad intelectual y marcas</h2>
          <p>
            Los nombres, logotipos y marcas de las dependencias e instituciones mencionadas pertenecen a
            sus titulares y se usan únicamente con fines <b>informativos y de identificación</b>. Su
            aparición no implica afiliación, patrocinio ni respaldo oficial hacia Guía San Juan.
          </p>
        </section>

        <section className="ficha-sec">
          <h2>7. Propuestas y contenido enviado</h2>
          <p>
            Si nos envías una propuesta de contenido, autorizas su revisión y posible publicación en la
            guía. El tratamiento de tus datos se describe en el{' '}
            <a href="/privacidad">Aviso de privacidad</a>.
          </p>
        </section>

        <section className="ficha-sec">
          <h2>8. Cambios a estos términos</h2>
          <p>
            Podemos actualizar estas condiciones. La versión vigente siempre estará publicada en esta
            página con su número de versión y fecha.
          </p>
        </section>
      </article>
    </FichaShell>
  );
}
