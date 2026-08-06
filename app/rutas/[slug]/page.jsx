import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import FichaShell from '../../../components/FichaShell';
import DisclaimerOficial from '../../../components/DisclaimerOficial';
import Markdown from '../../../components/Markdown';
import ReportarDato from '../../../components/ReportarDato';
import { imagenPublica, listaImagenes } from '../../../lib/imagenes';
import { rutaSchema, breadcrumbList } from '../../../lib/schema';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { data } = await supabase.from('rutas').select('slug').eq('estado', 'publicado');
  return (data ?? []).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: r } = await supabase.from('rutas').select('nombre, resumen').eq('slug', slug).eq('estado', 'publicado').maybeSingle();
  if (!r) return { title: 'Ruta no encontrada' };
  return {
    title: r.nombre,
    description: r.resumen || `${r.nombre}: un recorrido por San Juan del Río.`,
    alternates: { canonical: `/rutas/${slug}` },
  };
}

export default async function RutaPage({ params }) {
  const { slug } = await params;
  const { data: ruta } = await supabase.from('rutas').select('*').eq('slug', slug).eq('estado', 'publicado').maybeSingle();
  if (!ruta) notFound();

  const { data: paradas = [] } = await supabase
    .from('ruta_lugares')
    .select('orden, nota, lugares(slug, nombre, categoria, resumen, imagenes)')
    .eq('ruta_id', ruta.id).order('orden');
  const lugares = paradas.filter((p) => p.lugares); // solo lugares publicados (RLS)

  const imagenes = listaImagenes(ruta.imagenes);
  const jsonLd = [
    rutaSchema(ruta),
    breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Rutas', path: '/rutas' }, { name: ruta.nombre, path: `/rutas/${ruta.slug}` }]),
  ];

  return (
    <FichaShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="wrap ficha">
        <nav className="ficha-crumbs" aria-label="Ruta">
          <a href="/">Inicio</a> › <a href="/rutas">Rutas</a> › <span>{ruta.nombre}</span>
        </nav>

        {ruta.duracion_texto && <span className="desc-chip">{ruta.duracion_texto}</span>}
        <h1 className="ficha-h1">{ruta.nombre}</h1>
        {ruta.resumen && <p className="ficha-resumen">{ruta.resumen}</p>}

        <DisclaimerOficial />

        {imagenes.length > 0 && (
          <div className="desc-galeria">
            {imagenes.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={img.ruta} src={imagenPublica(img.ruta)} alt={img.alt || ruta.nombre} loading="lazy" />
            ))}
          </div>
        )}

        {ruta.descripcion_md && (
          <section className="ficha-sec">
            <h2>Sobre esta ruta</h2>
            <Markdown>{ruta.descripcion_md}</Markdown>
          </section>
        )}

        {lugares.length > 0 && (
          <section className="ficha-sec">
            <h2>El recorrido</h2>
            <ol className="ruta-paradas">
              {lugares.map((p, i) => (
                <li key={p.lugares.slug} className="ruta-parada">
                  <span className="ruta-num" aria-hidden="true">{i + 1}</span>
                  <div className="ruta-parada-cuerpo">
                    <a className="ruta-parada-nombre" href={`/lugares/${p.lugares.slug}`}>{p.lugares.nombre} →</a>
                    {p.lugares.categoria && <span className="ruta-parada-cat">{p.lugares.categoria}</span>}
                    {(p.nota || p.lugares.resumen) && <p className="ruta-parada-nota">{p.nota || p.lugares.resumen}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <ReportarDato tipo="ruta" id={ruta.id} />
      </article>
    </FichaShell>
  );
}
