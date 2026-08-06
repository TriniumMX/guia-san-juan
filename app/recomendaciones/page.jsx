import { supabase } from '../../lib/supabase';
import FichaShell from '../../components/FichaShell';
import { imagenPublica } from '../../lib/imagenes';

export const revalidate = 3600;

export const metadata = {
  title: 'Recomendaciones y tips de San Juan del Río',
  description: 'Consejos, ideas y recomendaciones para disfrutar y moverte por San Juan del Río, Querétaro.',
  alternates: { canonical: '/recomendaciones' },
};

export default async function RecomendacionesIndex() {
  const { data: recos = [] } = await supabase
    .from('recomendaciones').select('slug, titulo, categoria, resumen, imagenes')
    .eq('estado', 'publicado').order('actualizado_en', { ascending: false });

  return (
    <FichaShell>
      <div className="wrap desc-page">
        <h1 className="ficha-h1">Recomendaciones</h1>
        <p className="ficha-resumen">Ideas y consejos para aprovechar San Juan del Río, escritos por gente de aquí.</p>

        {recos.length === 0 ? (
          <p className="ficha-vacio">Aún no hay recomendaciones publicadas. Muy pronto.</p>
        ) : (
          <ul className="desc-grid">
            {recos.map((r) => {
              const img = Array.isArray(r.imagenes) ? r.imagenes[0] : null;
              const url = img ? imagenPublica(img.ruta) : null;
              return (
                <li key={r.slug}>
                  <a className="desc-card" href={`/recomendaciones/${r.slug}`}>
                    <span className="desc-card-media">
                      {url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={url} alt={img.alt || r.titulo} loading="lazy" />
                        : <span className="desc-card-ph" aria-hidden="true">💡</span>}
                    </span>
                    <span className="desc-card-body">
                      {r.categoria && <span className="desc-chip">{r.categoria}</span>}
                      <b>{r.titulo}</b>
                      {r.resumen && <span className="desc-card-sub">{r.resumen}</span>}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </FichaShell>
  );
}
