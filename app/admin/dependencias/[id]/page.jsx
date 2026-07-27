import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import AdminChrome from '../../AdminChrome';
import DependenciaForm from '../../DependenciaForm';
import EstadoControl from '../../EstadoControl';
import VerificacionForm from '../../VerificacionForm';
import {
  agregarTelefonoDependencia, eliminarTelefonoDependencia,
  agregarHorarioDependencia, eliminarHorarioDependencia,
  agregarExcepcionDependencia, eliminarExcepcionDependencia,
  geocodificarYGuardarDependencia,
} from '../../contenido-actions';

const GEO_MSG = {
  ok: { clase: 'admin-ok', texto: '✓ Coordenadas actualizadas desde la dirección.' },
  notfound: { clase: 'pf-file-err', texto: 'No encontramos la dirección en el mapa. Ajusta el texto o captura las coordenadas a mano.' },
  sindir: { clase: 'pf-file-err', texto: 'Primero captura y guarda la dirección.' },
  error: { clase: 'pf-file-err', texto: 'No se pudieron guardar las coordenadas. Intenta de nuevo.' },
};
import { DIAS } from '../../../../lib/contenido';

export const dynamic = 'force-dynamic';

const GRUPOS_DEP = ['contacto', 'ubicacion', 'horarios'];
const DIAS_ABREV = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function fecha(iso) {
  return iso ? new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
}

export default async function EditarDependenciaPage({ params, searchParams }) {
  const { id } = await params;
  const { geo } = (await searchParams) || {};
  const geoMsg = GEO_MSG[geo];
  const { data: dep } = await supabaseAdmin.from('dependencias').select('*').eq('id', id).single();
  if (!dep) notFound();

  const [{ data: tels = [] }, { data: horarios = [] }, { data: excepciones = [] }, { data: vers = [] }] = await Promise.all([
    supabaseAdmin.from('dependencia_telefonos').select('*').eq('dependencia_id', id),
    supabaseAdmin.from('dependencia_horarios').select('*').eq('dependencia_id', id).order('dia_semana'),
    supabaseAdmin.from('dependencia_horarios_excepciones').select('*').eq('dependencia_id', id).order('fecha'),
    supabaseAdmin.from('dependencia_verificaciones').select('*').eq('dependencia_id', id).order('verificado_en', { ascending: false }),
  ]);

  return (
    <AdminChrome>
      <main className="admin-main admin-main--narrow">
        <div className="admin-page-head">
          <a className="admin-link" href="/admin/dependencias">← Dependencias</a>
          <h1>{dep.nombre} <span className={`estado-badge estado-${dep.estado}`}>{dep.estado}</span></h1>
          <p className="admin-mono admin-muted">/dependencias/{dep.slug}</p>
        </div>

        <section className="admin-section">
          <h2 className="admin-section-title">Estado editorial</h2>
          <EstadoControl tipo="dependencia" id={dep.id} estado={dep.estado} />
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Datos</h2>
          <DependenciaForm dependencia={dep} />
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Coordenadas del mapa</h2>
          <p className="admin-muted">
            Opcional. La dirección basta para el botón “Cómo llegar”; las coordenadas solo dan un pin más preciso.
            Guarda primero la dirección y luego búscalas automáticamente (OpenStreetMap).
          </p>
          {geoMsg && <p className={geoMsg.clase}>{geoMsg.texto}</p>}
          <p className="admin-muted admin-mono">
            {dep.lat != null && dep.lng != null ? `Actuales: ${dep.lat}, ${dep.lng}` : 'Sin coordenadas.'}
          </p>
          <form action={geocodificarYGuardarDependencia}>
            <input type="hidden" name="dependencia_id" value={dep.id} />
            <button className="btn btn--ghost" type="submit" disabled={!dep.direccion}>
              Buscar y guardar coordenadas desde la dirección
            </button>
          </form>
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Teléfonos</h2>
          {tels.length === 0 ? <p className="admin-muted">Sin teléfonos.</p> : (
            <ul className="admin-list">
              {tels.map((t) => (
                <li key={t.id} className="admin-list-row">
                  <span><b>{t.numero}</b>{t.extension ? ` ext. ${t.extension}` : ''}{t.etiqueta ? ` · ${t.etiqueta}` : ''}{t.confirmado ? ' ✓' : ''}</span>
                  <form action={eliminarTelefonoDependencia}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="dependencia_id" value={dep.id} />
                    <button className="admin-link admin-link--danger" type="submit">Quitar</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <form action={agregarTelefonoDependencia} className="admin-inline admin-inline--wrap">
            <input type="hidden" name="dependencia_id" value={dep.id} />
            <input name="numero" aria-label="Número de teléfono" className="pf-field" placeholder="Número" required />
            <input name="extension" aria-label="Extensión" className="pf-field" placeholder="Ext." style={{ maxWidth: 90 }} />
            <input name="etiqueta" aria-label="Etiqueta" className="pf-field" placeholder="Etiqueta (ej. Recepción)" />
            <button className="btn btn--ghost" type="submit">Agregar teléfono</button>
          </form>
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Horarios</h2>
          <p className="admin-muted">Editar horarios invalida la verificación del grupo <b>horarios</b> (y se refleja en los trámites que la consumen). Marca varios días para agregarlos con el mismo horario; para un turno partido, agrega otra franja.</p>
          {horarios.length === 0 ? <p className="admin-muted">Sin horarios.</p> : (
            <ul className="admin-list">
              {horarios.map((h) => (
                <li key={h.id} className="admin-list-row">
                  <span><b>{DIAS[h.dia_semana]}</b> · {h.abre?.slice(0, 5)}–{h.cierra?.slice(0, 5)}</span>
                  <form action={eliminarHorarioDependencia}>
                    <input type="hidden" name="id" value={h.id} />
                    <input type="hidden" name="dependencia_id" value={dep.id} />
                    <button className="admin-link admin-link--danger" type="submit">Quitar</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <form action={agregarHorarioDependencia} className="admin-inline admin-inline--wrap">
            <input type="hidden" name="dependencia_id" value={dep.id} />
            <div className="admin-dias" role="group" aria-label="Días">
              {DIAS_ABREV.map((d, i) => (
                <label key={i} className="admin-check">
                  <input type="checkbox" name="dias" value={i} defaultChecked={i >= 1 && i <= 5} /> {d}
                </label>
              ))}
            </div>
            <input name="abre" aria-label="Hora de apertura" type="time" className="pf-field" style={{ maxWidth: 130 }} required />
            <input name="cierra" aria-label="Hora de cierre" type="time" className="pf-field" style={{ maxWidth: 130 }} required />
            <button className="btn btn--ghost" type="submit">Agregar horario(s)</button>
          </form>
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Excepciones (días especiales)</h2>
          {excepciones.length === 0 ? <p className="admin-muted">Sin excepciones.</p> : (
            <ul className="admin-list">
              {excepciones.map((e) => (
                <li key={e.id} className="admin-list-row">
                  <span><b>{e.fecha}</b> · {e.cerrado ? 'Cerrado' : `${e.abre?.slice(0, 5)}–${e.cierra?.slice(0, 5)}`}{e.motivo ? ` · ${e.motivo}` : ''}</span>
                  <form action={eliminarExcepcionDependencia}>
                    <input type="hidden" name="id" value={e.id} />
                    <input type="hidden" name="dependencia_id" value={dep.id} />
                    <button className="admin-link admin-link--danger" type="submit">Quitar</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <form action={agregarExcepcionDependencia} className="admin-inline admin-inline--wrap">
            <input type="hidden" name="dependencia_id" value={dep.id} />
            <input name="fecha" aria-label="Fecha" type="date" className="pf-field" style={{ maxWidth: 170 }} required />
            <label className="admin-check"><input type="checkbox" name="cerrado" defaultChecked /> Cerrado</label>
            <input name="abre" aria-label="Hora de apertura" type="time" className="pf-field" style={{ maxWidth: 120 }} />
            <input name="cierra" aria-label="Hora de cierre" type="time" className="pf-field" style={{ maxWidth: 120 }} />
            <input name="motivo" aria-label="Motivo" className="pf-field" placeholder="Motivo (ej. Día festivo)" />
            <button className="btn btn--ghost" type="submit">Agregar excepción</button>
          </form>
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Verificaciones por grupo</h2>
          {vers.length === 0 ? <p className="admin-muted">Sin verificaciones aún.</p> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Grupo</th><th>Resultado</th><th>Fecha</th><th>Vigencia</th></tr></thead>
                <tbody>
                  {vers.map((v) => (
                    <tr key={v.id}>
                      <td>{v.grupo}</td>
                      <td>{v.resultado}</td>
                      <td>{fecha(v.verificado_en)}</td>
                      <td>{v.invalidada_en ? <span className="estado-badge estado-vencido">invalidada</span> : <span className="estado-badge estado-publicado">vigente</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <h3 className="admin-subtitle">Registrar verificación</h3>
          <VerificacionForm tipo="dependencia" id={dep.id} grupos={GRUPOS_DEP} />
        </section>
      </main>
    </AdminChrome>
  );
}
