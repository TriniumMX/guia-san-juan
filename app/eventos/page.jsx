import { supabase } from '../../lib/supabase';
import FichaShell from '../../components/FichaShell';
import { imagenPublica } from '../../lib/imagenes';
import { fechaLarga } from '../../lib/contenido';

export const revalidate = 3600;

export const metadata = {
  title: 'Eventos en San Juan del Río',
  description: 'Agenda de eventos, ferias, conciertos y actividades culturales en San Juan del Río, Querétaro.',
  alternates: { canonical: '/eventos' },
};

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
function badge(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return { dia: '', mes: '' };
  return { dia: String(Number(m[3])), mes: MESES[Number(m[2]) - 1] };
}

export default async function EventosIndex() {
  const { data: todos = [] } = await supabase
    .from('eventos').select('slug, nombre, resumen, fecha_inicio, fecha_fin, hora_texto, ubicacion_texto, imagenes')
    .eq('estado', 'publicado').order('fecha_inicio');

  // Solo próximos/vigentes: el evento sigue si su última fecha es hoy o después.
  const hoy = hoyISO();
  const eventos = todos.filter((e) => (e.fecha_fin || e.fecha_inicio) >= hoy);

  return (
    <FichaShell>
      <div className="wrap desc-page">
        <h1 className="ficha-h1">Eventos</h1>
        <p className="ficha-resumen">Qué hacer en San Juan del Río: ferias, cultura, música y actividades por venir.</p>

        {eventos.length === 0 ? (
          <p className="ficha-vacio">No hay eventos próximos por ahora. Vuelve pronto.</p>
        ) : (
          <ul className="desc-grid">
            {eventos.map((e) => {
              const img = Array.isArray(e.imagenes) ? e.imagenes[0] : null;
              const url = img ? imagenPublica(img.ruta) : null;
              const b = badge(e.fecha_inicio);
              return (
                <li key={e.slug}>
                  <a className="desc-card" href={`/eventos/${e.slug}`}>
                    <span className="desc-card-media">
                      {url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={url} alt={img.alt || e.nombre} loading="lazy" />
                        : <span className="desc-card-ph" aria-hidden="true">🎶</span>}
                      <span className="desc-badge" aria-hidden="true"><b>{b.dia}</b><span>{b.mes}</span></span>
                    </span>
                    <span className="desc-card-body">
                      <b>{e.nombre}</b>
                      <span className="desc-card-sub">
                        {fechaLarga(e.fecha_inicio)}{e.hora_texto ? ` · ${e.hora_texto}` : ''}
                        {e.ubicacion_texto ? ` · ${e.ubicacion_texto}` : ''}
                      </span>
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
