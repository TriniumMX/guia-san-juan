import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import AdminChrome from '../../AdminChrome';
import EstadoControl from '../../EstadoControl';
import LugarForm from '../../LugarForm';
import ImagenesAdmin from '../../ImagenesAdmin';
import { geocodificarYGuardarLugar } from '../../descubrimiento-actions';

export const dynamic = 'force-dynamic';

const GEO_MSG = {
  ok: { clase: 'admin-ok', texto: '✓ Coordenadas encontradas y guardadas.' },
  sindir: { clase: 'pf-file-err', texto: 'Guarda primero una dirección para poder buscar.' },
  notfound: { clase: 'pf-file-err', texto: 'No se encontraron coordenadas para esa dirección. Ajústala e intenta de nuevo.' },
  error: { clase: 'pf-file-err', texto: 'No se pudieron guardar las coordenadas. Intenta de nuevo.' },
};

export default async function EditarLugarPage({ params, searchParams }) {
  const { id } = await params;
  const { geo, img } = (await searchParams) || {};
  const geoMsg = GEO_MSG[geo];
  const { data: l } = await supabaseAdmin.from('lugares').select('*').eq('id', id).single();
  if (!l) notFound();

  return (
    <AdminChrome>
      <main className="admin-main admin-main--narrow">
        <div className="admin-page-head">
          <a className="admin-link" href="/admin/lugares">← Lugares</a>
          <h1>{l.nombre} <span className={`estado-badge estado-${l.estado}`}>{l.estado}</span></h1>
          <p className="admin-mono admin-muted">/lugares/{l.slug}</p>
        </div>

        <section className="admin-section">
          <h2 className="admin-section-title">Publicación</h2>
          <EstadoControl tipo="lugar" id={l.id} estado={l.estado} />
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Datos</h2>
          <LugarForm lugar={l} />
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Coordenadas del mapa</h2>
          <p className="admin-muted">Sirven para el botón “Cómo llegar” de la ficha. Búscalas automáticamente desde la dirección guardada.</p>
          {geoMsg && <p className={geoMsg.clase}>{geoMsg.texto}</p>}
          <p className="admin-muted admin-mono">lat: {l.lat ?? '—'} · lng: {l.lng ?? '—'}</p>
          <form action={geocodificarYGuardarLugar}>
            <input type="hidden" name="lugar_id" value={l.id} />
            <button className="btn btn--ghost" type="submit" disabled={!l.direccion}>Buscar coordenadas</button>
            {!l.direccion && <span className="pf-note">Guarda una dirección primero.</span>}
          </form>
        </section>

        <ImagenesAdmin tipo="lugar" id={l.id} imagenes={l.imagenes} msg={img} />
      </main>
    </AdminChrome>
  );
}
