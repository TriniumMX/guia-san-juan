import { supabase } from '../../lib/supabase';
import FichaShell from '../../components/FichaShell';
import { imagenPublica } from '../../lib/imagenes';

export const revalidate = 3600;

export const metadata = {
  title: 'Lugares que visitar en San Juan del Río',
  description: 'Sitios de interés, plazas, templos, parques y rincones para descubrir en San Juan del Río, Querétaro.',
  alternates: { canonical: '/lugares' },
};

export default async function LugaresIndex() {
  const { data: lugares = [] } = await supabase
    .from('lugares').select('slug, nombre, categoria, resumen, imagenes')
    .eq('estado', 'publicado').order('categoria', { nullsFirst: false }).order('nombre');

  return (
    <FichaShell>
      <div className="wrap desc-page">
        <h1 className="ficha-h1">Lugares</h1>
        <p className="ficha-resumen">Sitios de interés, plazas, templos y rincones para descubrir en San Juan del Río.</p>

        {lugares.length === 0 ? (
          <p className="ficha-vacio">Aún no hay lugares publicados. Muy pronto.</p>
        ) : (
          <ul className="desc-grid">
            {lugares.map((l) => {
              const img = Array.isArray(l.imagenes) ? l.imagenes[0] : null;
              const url = img ? imagenPublica(img.ruta) : null;
              return (
                <li key={l.slug}>
                  <a className="desc-card" href={`/lugares/${l.slug}`}>
                    <span className="desc-card-media">
                      {url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={url} alt={img.alt || l.nombre} loading="lazy" />
                        : <span className="desc-card-ph" aria-hidden="true">📍</span>}
                    </span>
                    <span className="desc-card-body">
                      {l.categoria && <span className="desc-chip">{l.categoria}</span>}
                      <b>{l.nombre}</b>
                      {l.resumen && <span className="desc-card-sub">{l.resumen}</span>}
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
