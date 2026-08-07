import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import FichaShell from '../../../components/FichaShell';
import DisclaimerOficial from '../../../components/DisclaimerOficial';
import Markdown from '../../../components/Markdown';
import ReportarDato from '../../../components/ReportarDato';
import { imagenPublica, listaImagenes } from '../../../lib/imagenes';
import { comercioSchema, breadcrumbList } from '../../../lib/schema';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { data } = await supabase.from('comercios').select('slug').eq('estado', 'publicado');
  return (data ?? []).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: c } = await supabase.from('comercios').select('nombre, resumen').eq('slug', slug).eq('estado', 'publicado').maybeSingle();
  if (!c) return { title: 'Comercio no encontrado' };
  return {
    title: c.nombre,
    description: c.resumen || `${c.nombre} en San Juan del Río: qué ofrece, dónde está y cómo contactarlo.`,
    alternates: { canonical: `/comercios/${slug}` },
  };
}

export default async function ComercioPage({ params }) {
  const { slug } = await params;
  const { data: comercio } = await supabase.from('comercios').select('*').eq('slug', slug).eq('estado', 'publicado').maybeSingle();
  if (!comercio) notFound();

  const imagenes = listaImagenes(comercio.imagenes);
  const wa = comercio.whatsapp ? comercio.whatsapp.replace(/[^0-9]/g, '') : null;
  const waUrl = wa ? `https://wa.me/${wa.length === 10 ? '52' + wa : wa}` : null;
  const mapsUrl = comercio.lat != null && comercio.lng != null
    ? `https://www.google.com/maps/search/?api=1&query=${comercio.lat},${comercio.lng}`
    : comercio.direccion ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(comercio.direccion + ', San Juan del Río, Querétaro')}` : null;

  const jsonLd = [
    comercioSchema(comercio),
    breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Comercios', path: '/comercios' }, { name: comercio.nombre, path: `/comercios/${comercio.slug}` }]),
  ];

  return (
    <FichaShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="wrap ficha">
        <nav className="ficha-crumbs" aria-label="Ruta">
          <a href="/">Inicio</a> › <a href="/comercios">Comercios</a> › <span>{comercio.nombre}</span>
        </nav>

        <div className="ficha-chips-row">
          {comercio.giro && <span className="desc-chip">{comercio.giro}</span>}
          {comercio.destacado && <span className="desc-chip desc-chip--destacado">★ Destacado</span>}
        </div>
        <h1 className="ficha-h1">{comercio.nombre}</h1>
        {comercio.resumen && <p className="ficha-resumen">{comercio.resumen}</p>}

        <DisclaimerOficial />

        {imagenes.length > 0 && (
          <div className="desc-galeria">
            {imagenes.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={img.ruta} src={imagenPublica(img.ruta)} alt={img.alt || comercio.nombre} loading="lazy" />
            ))}
          </div>
        )}

        {comercio.descripcion_md && (
          <section className="ficha-sec">
            <h2>Sobre el negocio</h2>
            <Markdown>{comercio.descripcion_md}</Markdown>
          </section>
        )}

        <section className="ficha-sec">
          <h2>Información y contacto</h2>
          <table className="ficha-datos">
            <tbody>
              {comercio.direccion && <tr><th>Dirección</th><td>{comercio.direccion}</td></tr>}
              {comercio.horario_texto && <tr><th>Horario</th><td>{comercio.horario_texto}</td></tr>}
              {comercio.telefono && <tr><th>Teléfono</th><td><a href={`tel:${comercio.telefono.replace(/[^0-9+]/g, '')}`}>{comercio.telefono}</a></td></tr>}
              {waUrl && <tr><th>WhatsApp</th><td><a href={waUrl} target="_blank" rel="noopener noreferrer">{comercio.whatsapp}</a></td></tr>}
              {comercio.sitio_web && <tr><th>Sitio web</th><td><a href={comercio.sitio_web} target="_blank" rel="noopener noreferrer nofollow">{comercio.sitio_web}</a></td></tr>}
              {comercio.facebook && <tr><th>Facebook</th><td><a href={comercio.facebook} target="_blank" rel="noopener noreferrer nofollow">{comercio.facebook}</a></td></tr>}
              {comercio.instagram && <tr><th>Instagram</th><td><a href={comercio.instagram} target="_blank" rel="noopener noreferrer nofollow">{comercio.instagram}</a></td></tr>}
            </tbody>
          </table>
          <div className="ficha-acciones">
            {waUrl && <a className="btn btn--primary" href={waUrl} target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>}
            {mapsUrl && <a className="btn btn--ghost" href={mapsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar</a>}
          </div>
        </section>

        <ReportarDato tipo="comercio" id={comercio.id} />
      </article>
    </FichaShell>
  );
}
