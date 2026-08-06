import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import FichaShell from '../../../components/FichaShell';
import DisclaimerOficial from '../../../components/DisclaimerOficial';
import Markdown from '../../../components/Markdown';
import ReportarDato from '../../../components/ReportarDato';
import { imagenPublica, listaImagenes } from '../../../lib/imagenes';
import { lugarSchema, breadcrumbList } from '../../../lib/schema';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { data } = await supabase.from('lugares').select('slug').eq('estado', 'publicado');
  return (data ?? []).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: l } = await supabase.from('lugares').select('nombre, resumen').eq('slug', slug).eq('estado', 'publicado').maybeSingle();
  if (!l) return { title: 'Lugar no encontrado' };
  return {
    title: l.nombre,
    description: l.resumen || `${l.nombre}: qué es, dónde está y cómo llegar en San Juan del Río.`,
    alternates: { canonical: `/lugares/${slug}` },
  };
}

export default async function LugarPage({ params }) {
  const { slug } = await params;
  const { data: lugar } = await supabase.from('lugares').select('*').eq('slug', slug).eq('estado', 'publicado').maybeSingle();
  if (!lugar) notFound();

  const imagenes = listaImagenes(lugar.imagenes);
  const mapsUrl = lugar.lat != null && lugar.lng != null
    ? `https://www.google.com/maps/search/?api=1&query=${lugar.lat},${lugar.lng}`
    : lugar.direccion ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lugar.direccion + ', San Juan del Río, Querétaro')}` : null;

  const jsonLd = [
    lugarSchema(lugar),
    breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Lugares', path: '/lugares' }, { name: lugar.nombre, path: `/lugares/${lugar.slug}` }]),
  ];

  return (
    <FichaShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="wrap ficha">
        <nav className="ficha-crumbs" aria-label="Ruta">
          <a href="/">Inicio</a> › <a href="/lugares">Lugares</a> › <span>{lugar.nombre}</span>
        </nav>

        {lugar.categoria && <span className="desc-chip">{lugar.categoria}</span>}
        <h1 className="ficha-h1">{lugar.nombre}</h1>
        {lugar.resumen && <p className="ficha-resumen">{lugar.resumen}</p>}

        <DisclaimerOficial />

        {imagenes.length > 0 && (
          <div className="desc-galeria">
            {imagenes.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={img.ruta} src={imagenPublica(img.ruta)} alt={img.alt || lugar.nombre} loading="lazy" />
            ))}
          </div>
        )}

        {lugar.descripcion_md && (
          <section className="ficha-sec">
            <h2>Sobre este lugar</h2>
            <Markdown>{lugar.descripcion_md}</Markdown>
          </section>
        )}

        <section className="ficha-sec">
          <h2>Información</h2>
          <table className="ficha-datos">
            <tbody>
              {lugar.direccion && <tr><th>Dirección</th><td>{lugar.direccion}</td></tr>}
              {lugar.horario_texto && <tr><th>Horario</th><td>{lugar.horario_texto}</td></tr>}
              {lugar.costo_texto && <tr><th>Costo</th><td>{lugar.costo_texto}</td></tr>}
              {lugar.telefono && <tr><th>Teléfono</th><td><a href={`tel:${lugar.telefono.replace(/[^0-9+]/g, '')}`}>{lugar.telefono}</a></td></tr>}
              {lugar.sitio_web && <tr><th>Sitio web</th><td><a href={lugar.sitio_web} target="_blank" rel="noopener noreferrer nofollow">{lugar.sitio_web}</a></td></tr>}
            </tbody>
          </table>
          {mapsUrl && (
            <div className="ficha-acciones">
              <a className="btn btn--primary" href={mapsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
            </div>
          )}
        </section>

        <ReportarDato tipo="lugar" id={lugar.id} />
      </article>
    </FichaShell>
  );
}
