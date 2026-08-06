import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import AdminChrome from '../../AdminChrome';
import EstadoControl from '../../EstadoControl';
import RutaForm from '../../RutaForm';
import ImagenesAdmin from '../../ImagenesAdmin';
import { agregarLugarARuta, quitarLugarDeRuta, actualizarOrdenRutaLugar } from '../../descubrimiento-actions';

export const dynamic = 'force-dynamic';

export default async function EditarRutaPage({ params, searchParams }) {
  const { id } = await params;
  const { img } = (await searchParams) || {};
  const [{ data: r }, { data: paradas = [] }, { data: lugares = [] }] = await Promise.all([
    supabaseAdmin.from('rutas').select('*').eq('id', id).single(),
    supabaseAdmin.from('ruta_lugares').select('id, orden, nota, lugares(nombre)').eq('ruta_id', id).order('orden'),
    supabaseAdmin.from('lugares').select('id, nombre').order('nombre'),
  ]);
  if (!r) notFound();

  return (
    <AdminChrome>
      <main className="admin-main admin-main--narrow">
        <div className="admin-page-head">
          <a className="admin-link" href="/admin/rutas">← Rutas</a>
          <h1>{r.nombre} <span className={`estado-badge estado-${r.estado}`}>{r.estado}</span></h1>
          <p className="admin-mono admin-muted">/rutas/{r.slug}</p>
        </div>

        <section className="admin-section">
          <h2 className="admin-section-title">Publicación</h2>
          <EstadoControl tipo="ruta" id={r.id} estado={r.estado} />
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Datos</h2>
          <RutaForm ruta={r} />
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Lugares del recorrido</h2>
          <p className="admin-muted">Agrega lugares del catálogo en el orden del recorrido. Solo aparecerán en la ficha los que estén publicados.</p>
          {paradas.length === 0 ? <p className="admin-muted">Sin lugares aún.</p> : (
            <ul className="admin-list">
              {paradas.map((p) => (
                <li key={p.id} className="admin-list-row">
                  <span><b>{p.lugares?.nombre || '(lugar eliminado)'}</b>{p.nota ? <span className="admin-muted"> — {p.nota}</span> : ''}</span>
                  <span className="admin-inline">
                    <form action={actualizarOrdenRutaLugar} className="admin-inline">
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="ruta_id" value={r.id} />
                      <input name="orden" type="number" defaultValue={p.orden} aria-label="Orden" className="pf-field" style={{ maxWidth: 72 }} />
                      <button className="admin-link" type="submit">Orden</button>
                    </form>
                    <form action={quitarLugarDeRuta}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="ruta_id" value={r.id} />
                      <button className="admin-link admin-link--danger" type="submit">Quitar</button>
                    </form>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <form action={agregarLugarARuta} className="req-add">
            <input type="hidden" name="ruta_id" value={r.id} />
            <select name="lugar_id" aria-label="Lugar" className="pf-field" required defaultValue="">
              <option value="" disabled>— elige un lugar —</option>
              {lugares.map((l) => <option key={l.id} value={l.id}>{l.nombre}</option>)}
            </select>
            <input name="nota" aria-label="Nota" className="pf-field" placeholder="Nota para esta parada (opcional)" />
            <button className="btn btn--ghost" type="submit">Agregar al recorrido</button>
          </form>
        </section>

        <ImagenesAdmin tipo="ruta" id={r.id} imagenes={r.imagenes} msg={img} />
      </main>
    </AdminChrome>
  );
}
