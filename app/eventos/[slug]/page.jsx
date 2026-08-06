import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import FichaShell from '../../../components/FichaShell';
import DisclaimerOficial from '../../../components/DisclaimerOficial';
import Markdown from '../../../components/Markdown';
import ReportarDato from '../../../components/ReportarDato';
import { imagenPublica, listaImagenes } from '../../../lib/imagenes';
import { fechaLarga } from '../../../lib/contenido';
import { eventoSchema, breadcrumbList } from '../../../lib/schema';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { data } = await supabase.from('eventos').select('slug').eq('estado', 'publicado');
  return (data ?? []).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: e } = await supabase.from('eventos').select('nombre, resumen').eq('slug', slug).eq('estado', 'publicado').maybeSingle();
  if (!e) return { title: 'Evento no encontrado' };
  return {
    title: e.nombre,
    description: e.resumen || `${e.nombre} en San Juan del Río: fecha, lugar y detalles.`,
    alternates: { canonical: `/eventos/${slug}` },
  };
}

export default async function EventoPage({ params }) {
  const { slug } = await params;
  const { data: evento } = await supabase.from('eventos').select('*').eq('slug', slug).eq('estado', 'publicado').maybeSingle();
  if (!evento) notFound();

  const lugar = evento.lugar_id
    ? (await supabase.from('lugares').select('slug, nombre, direccion, lat, lng').eq('id', evento.lugar_id).eq('estado', 'publicado').maybeSingle()).data
    : null;

  const imagenes = listaImagenes(evento.imagenes);
  const fechaTxt = evento.fecha_fin && evento.fecha_fin !== evento.fecha_inicio
    ? `Del ${fechaLarga(evento.fecha_inicio)} al ${fechaLarga(evento.fecha_fin)}`
    : fechaLarga(evento.fecha_inicio);
  const mapsUrl = lugar && (lugar.lat != null && lugar.lng != null
    ? `https://www.google.com/maps/search/?api=1&query=${lugar.lat},${lugar.lng}`
    : lugar.direccion ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lugar.direccion + ', San Juan del Río, Querétaro')}` : null);

  const jsonLd = [
    eventoSchema(evento, lugar),
    breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Eventos', path: '/eventos' }, { name: evento.nombre, path: `/eventos/${evento.slug}` }]),
  ];

  return (
    <FichaShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="wrap ficha">
        <nav className="ficha-crumbs" aria-label="Ruta">
          <a href="/">Inicio</a> › <a href="/eventos">Eventos</a> › <span>{evento.nombre}</span>
        </nav>

        {evento.categoria && <span className="desc-chip">{evento.categoria}</span>}
        <h1 className="ficha-h1">{evento.nombre}</h1>
        {evento.resumen && <p className="ficha-resumen">{evento.resumen}</p>}

        <DisclaimerOficial />

        {imagenes.length > 0 && (
          <div className="desc-galeria">
            {imagenes.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={img.ruta} src={imagenPublica(img.ruta)} alt={img.alt || evento.nombre} loading="lazy" />
            ))}
          </div>
        )}

        <section className="ficha-sec">
          <h2>Cuándo y dónde</h2>
          <table className="ficha-datos">
            <tbody>
              <tr><th>Fecha</th><td>{fechaTxt}</td></tr>
              {evento.hora_texto && <tr><th>Hora</th><td>{evento.hora_texto}</td></tr>}
              <tr><th>Lugar</th><td>{lugar ? <a href={`/lugares/${lugar.slug}`}>{lugar.nombre} →</a> : (evento.ubicacion_texto || 'Por confirmar')}</td></tr>
              {evento.costo_texto && <tr><th>Costo</th><td>{evento.costo_texto}</td></tr>}
              {evento.organizador && <tr><th>Organiza</th><td>{evento.organizador}</td></tr>}
            </tbody>
          </table>
          {mapsUrl && (
            <div className="ficha-acciones">
              <a className="btn btn--primary" href={mapsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
            </div>
          )}
        </section>

        {evento.descripcion_md && (
          <section className="ficha-sec">
            <h2>Detalles</h2>
            <Markdown>{evento.descripcion_md}</Markdown>
          </section>
        )}

        <ReportarDato tipo="evento" id={evento.id} />
      </article>
    </FichaShell>
  );
}
