import { supabaseAdmin } from '../../../lib/supabase-admin';
import AdminChrome from '../AdminChrome';

export const dynamic = 'force-dynamic';

function fecha(iso) {
  if (!iso) return '—';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

export default async function EventosAdminPage() {
  const { data: eventos = [] } = await supabaseAdmin
    .from('eventos').select('id, nombre, fecha_inicio, estado').order('fecha_inicio', { ascending: false });

  return (
    <AdminChrome>
      <main className="admin-main">
        <div className="admin-page-head admin-page-head--row">
          <div>
            <span className="eyebrow">Descubrimiento</span>
            <h1>Eventos <span className="admin-count">{eventos.length}</span></h1>
          </div>
          <a className="btn btn--primary" href="/admin/eventos/nueva">+ Nuevo evento</a>
        </div>

        {eventos.length === 0 ? (
          <div className="admin-empty"><span className="admin-empty-icon">🎶</span><p>Aún no hay eventos. Crea el primero.</p></div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Nombre</th><th>Fecha</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {eventos.map((e) => (
                  <tr key={e.id}>
                    <td>{e.nombre}</td>
                    <td className="admin-muted admin-mono">{fecha(e.fecha_inicio)}</td>
                    <td><span className={`estado-badge estado-${e.estado}`}>{e.estado}</span></td>
                    <td><a className="admin-link" href={`/admin/eventos/${e.id}`}>Editar →</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </AdminChrome>
  );
}
