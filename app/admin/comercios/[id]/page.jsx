import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import AdminChrome from '../../AdminChrome';
import EstadoControl from '../../EstadoControl';
import ComercioForm from '../../ComercioForm';
import ImagenesAdmin from '../../ImagenesAdmin';
import { geocodificarYGuardarComercio } from '../../descubrimiento-actions';

export const dynamic = 'force-dynamic';

const GEO_MSG = {
  ok: { clase: 'admin-ok', texto: '✓ Coordenadas encontradas y guardadas.' },
  sindir: { clase: 'pf-file-err', texto: 'Guarda primero una dirección para poder buscar.' },
  notfound: { clase: 'pf-file-err', texto: 'No se encontraron coordenadas para esa dirección. Ajústala e intenta de nuevo.' },
  error: { clase: 'pf-file-err', texto: 'No se pudieron guardar las coordenadas. Intenta de nuevo.' },
};

export default async function EditarComercioPage({ params, searchParams }) {
  const { id } = await params;
  const { geo, img } = (await searchParams) || {};
  const geoMsg = GEO_MSG[geo];
  const { data: c } = await supabaseAdmin.from('comercios').select('*').eq('id', id).single();
  if (!c) notFound();

  return (
    <AdminChrome>
      <main className="admin-main admin-main--narrow">
        <div className="admin-page-head">
          <a className="admin-link" href="/admin/comercios">← Comercios</a>
          <h1>{c.nombre} <span className={`estado-badge estado-${c.estado}`}>{c.estado}</span>{c.destacado && <span className="estado-badge estado-publicado"> ★ destacado</span>}</h1>
          <p className="admin-mono admin-muted">/comercios/{c.slug}</p>
        </div>

        <section className="admin-section">
          <h2 className="admin-section-title">Publicación</h2>
          <EstadoControl tipo="comercio" id={c.id} estado={c.estado} />
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Datos</h2>
          <ComercioForm comercio={c} />
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Coordenadas del mapa</h2>
          <p className="admin-muted">Sirven para el botón “Cómo llegar” de la ficha. Búscalas automáticamente desde la dirección guardada.</p>
          {geoMsg && <p className={geoMsg.clase}>{geoMsg.texto}</p>}
          <p className="admin-muted admin-mono">lat: {c.lat ?? '—'} · lng: {c.lng ?? '—'}</p>
          <form action={geocodificarYGuardarComercio}>
            <input type="hidden" name="comercio_id" value={c.id} />
            <button className="btn btn--ghost" type="submit" disabled={!c.direccion}>Buscar coordenadas</button>
            {!c.direccion && <span className="pf-note">Guarda una dirección primero.</span>}
          </form>
        </section>

        <ImagenesAdmin tipo="comercio" id={c.id} imagenes={c.imagenes} msg={img} />
      </main>
    </AdminChrome>
  );
}
