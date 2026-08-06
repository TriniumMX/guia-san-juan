import { supabase } from '../../lib/supabase';
import FichaShell from '../../components/FichaShell';
import { imagenPublica } from '../../lib/imagenes';

export const revalidate = 3600;

export const metadata = {
  title: 'Rutas para recorrer San Juan del Río',
  description: 'Itinerarios y recorridos por lo mejor de San Juan del Río: centro histórico, cultura y más.',
  alternates: { canonical: '/rutas' },
};

export default async function RutasIndex() {
  const { data: rutas = [] } = await supabase
    .from('rutas').select('slug, nombre, resumen, duracion_texto, imagenes')
    .eq('estado', 'publicado').order('nombre');

  return (
    <FichaShell>
      <div className="wrap desc-page">
        <h1 className="ficha-h1">Rutas</h1>
        <p className="ficha-resumen">Recorridos armados para aprovechar tu visita: qué ver y en qué orden.</p>

        {rutas.length === 0 ? (
          <p className="ficha-vacio">Aún no hay rutas publicadas. Muy pronto.</p>
        ) : (
          <ul className="desc-grid">
            {rutas.map((r) => {
              const img = Array.isArray(r.imagenes) ? r.imagenes[0] : null;
              const url = img ? imagenPublica(img.ruta) : null;
              return (
                <li key={r.slug}>
                  <a className="desc-card" href={`/rutas/${r.slug}`}>
                    <span className="desc-card-media">
                      {url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={url} alt={img.alt || r.nombre} loading="lazy" />
                        : <span className="desc-card-ph" aria-hidden="true">🗺️</span>}
                    </span>
                    <span className="desc-card-body">
                      {r.duracion_texto && <span className="desc-chip">{r.duracion_texto}</span>}
                      <b>{r.nombre}</b>
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
