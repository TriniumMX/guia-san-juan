import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import FichaShell from '../../../components/FichaShell';
import DisclaimerOficial from '../../../components/DisclaimerOficial';
import Markdown from '../../../components/Markdown';
import ReportarDato from '../../../components/ReportarDato';
import { imagenPublica, listaImagenes } from '../../../lib/imagenes';
import { fechaLarga } from '../../../lib/contenido';
import { recomendacionSchema, breadcrumbList } from '../../../lib/schema';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { data } = await supabase.from('recomendaciones').select('slug').eq('estado', 'publicado');
  return (data ?? []).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: r } = await supabase.from('recomendaciones').select('titulo, resumen').eq('slug', slug).eq('estado', 'publicado').maybeSingle();
  if (!r) return { title: 'Recomendación no encontrada' };
  return {
    title: r.titulo,
    description: r.resumen || `${r.titulo} — recomendaciones para San Juan del Río.`,
    alternates: { canonical: `/recomendaciones/${slug}` },
  };
}

export default async function RecomendacionPage({ params }) {
  const { slug } = await params;
  const { data: reco } = await supabase.from('recomendaciones').select('*').eq('slug', slug).eq('estado', 'publicado').maybeSingle();
  if (!reco) notFound();

  const imagenes = listaImagenes(reco.imagenes);
  const jsonLd = [
    recomendacionSchema(reco),
    breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Recomendaciones', path: '/recomendaciones' }, { name: reco.titulo, path: `/recomendaciones/${reco.slug}` }]),
  ];

  return (
    <FichaShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="wrap ficha">
        <nav className="ficha-crumbs" aria-label="Ruta">
          <a href="/">Inicio</a> › <a href="/recomendaciones">Recomendaciones</a> › <span>{reco.titulo}</span>
        </nav>

        {reco.categoria && <span className="desc-chip">{reco.categoria}</span>}
        <h1 className="ficha-h1">{reco.titulo}</h1>
        {reco.resumen && <p className="ficha-resumen">{reco.resumen}</p>}
        {reco.actualizado_en && <p className="ficha-crumbs">Actualizado el {fechaLarga(reco.actualizado_en)}</p>}

        <DisclaimerOficial />

        {imagenes.length > 0 && (
          <div className="desc-galeria">
            {imagenes.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={img.ruta} src={imagenPublica(img.ruta)} alt={img.alt || reco.titulo} loading="lazy" />
            ))}
          </div>
        )}

        {reco.cuerpo_md && (
          <section className="ficha-sec ficha-articulo">
            <Markdown>{reco.cuerpo_md}</Markdown>
          </section>
        )}

        <ReportarDato tipo="recomendacion" id={reco.id} />
      </article>
    </FichaShell>
  );
}
