import { supabaseAdmin } from '../../../lib/supabase-admin';
import AdminChrome from '../AdminChrome';
import { calcularCola, DIAS_VENCE } from '../../../lib/cola-verificacion';
import { marcarReporteAtendido } from '../contenido-actions';

export const dynamic = 'force-dynamic';

const RUTA = { tramite: 'tramites', dependencia: 'dependencias', directorio: 'directorio' };
const TIPO_LABEL = { tramite: 'Trámite', dependencia: 'Dependencia', directorio: 'Directorio' };

async function nombres(tabla, ids) {
  if (!ids.length) return {};
  const { data = [] } = await supabaseAdmin.from(tabla).select('id, nombre').in('id', ids);
  return Object.fromEntries(data.map((r) => [r.id, r.nombre]));
}

function fechaCorta(iso) {
  return iso ? new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '';
}

export default async function ColaVerificacionPage() {
  const cola = await calcularCola(supabaseAdmin);
  const grupos = [...cola.invalidados, ...cola.vencidos];

  const ids = { tramite: new Set(), dependencia: new Set(), directorio: new Set() };
  for (const it of [...cola.reportes, ...grupos]) ids[it.tipo]?.add(it.id);
  const [nTram, nDep, nDir] = await Promise.all([
    nombres('tramites', [...ids.tramite]),
    nombres('dependencias', [...ids.dependencia]),
    nombres('directorio', [...ids.directorio]),
  ]);
  const nombreDe = (it) => (it.tipo === 'tramite' ? nTram : it.tipo === 'dependencia' ? nDep : nDir)[it.id] || it.id.slice(0, 8) + '…';

  return (
    <AdminChrome>
      <main className="admin-main">
        <div className="admin-page-head">
          <span className="eyebrow">Contenido</span>
          <h1>Cola de verificación <span className="admin-count">{cola.total}</span></h1>
          <p className="lead">Prioridad: <b>reportes ciudadanos</b>, luego grupos <b>invalidados</b> por edición o <b>vencidos</b> (más de {DIAS_VENCE} días). La fecha pública sale de estas verificaciones.</p>
        </div>

        {cola.total === 0 ? (
          <div className="admin-empty"><span className="admin-empty-icon">✅</span><p>Todo al día. No hay nada por atender.</p></div>
        ) : (
          <>
            {cola.reportes.length > 0 && (
              <section className="admin-section" style={{ marginTop: 8 }}>
                <h2 className="admin-section-title">Reportes ciudadanos <span className="admin-count">{cola.reportes.length}</span></h2>
                <ul className="admin-list">
                  {cola.reportes.map((r) => (
                    <li key={r.reporte_id} className="admin-list-row" style={{ alignItems: 'flex-start' }}>
                      <div>
                        <div><span className="admin-muted">{TIPO_LABEL[r.tipo]} · {fechaCorta(r.creado_en)}</span> · <a className="admin-link" href={`/admin/${RUTA[r.tipo]}/${r.id}`}>{nombreDe(r)} →</a></div>
                        <p style={{ margin: '4px 0 0' }}>“{r.mensaje}”</p>
                      </div>
                      <form action={marcarReporteAtendido}>
                        <input type="hidden" name="tipo" value={r.tipo} />
                        <input type="hidden" name="reporte_id" value={r.reporte_id} />
                        <button className="admin-link" type="submit">Marcar atendido</button>
                      </form>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {grupos.length > 0 && (
              <section className="admin-section" style={{ marginTop: cola.reportes.length ? undefined : 8 }}>
                <h2 className="admin-section-title">Grupos por reverificar <span className="admin-count">{grupos.length}</span></h2>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Tipo</th><th>Entidad</th><th>Grupo</th><th>Motivo</th><th></th></tr></thead>
                    <tbody>
                      {grupos.map((it, i) => (
                        <tr key={i}>
                          <td><span className="admin-muted">{TIPO_LABEL[it.tipo]}</span></td>
                          <td>{nombreDe(it)}</td>
                          <td>{it.grupo}</td>
                          <td>
                            {it.motivo === 'vencido'
                              ? <span className="estado-badge estado-vencido">vencido · {it.dias} días</span>
                              : <span className="estado-badge estado-retirado">invalidado</span>}
                          </td>
                          <td><a className="admin-link" href={`/admin/${RUTA[it.tipo]}/${it.id}`}>Reverificar →</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </AdminChrome>
  );
}
