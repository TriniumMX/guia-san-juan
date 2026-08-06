import { supabaseAdmin } from '../../../lib/supabase-admin';
import AdminChrome from '../AdminChrome';

export const dynamic = 'force-dynamic';

export default async function RutasAdminPage() {
  const { data: rutas = [] } = await supabaseAdmin
    .from('rutas').select('id, nombre, estado').order('nombre');

  return (
    <AdminChrome>
      <main className="admin-main">
        <div className="admin-page-head admin-page-head--row">
          <div>
            <span className="eyebrow">Descubrimiento</span>
            <h1>Rutas <span className="admin-count">{rutas.length}</span></h1>
          </div>
          <a className="btn btn--primary" href="/admin/rutas/nueva">+ Nueva ruta</a>
        </div>

        {rutas.length === 0 ? (
          <div className="admin-empty"><span className="admin-empty-icon">🗺️</span><p>Aún no hay rutas. Crea la primera.</p></div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Nombre</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {rutas.map((r) => (
                  <tr key={r.id}>
                    <td>{r.nombre}</td>
                    <td><span className={`estado-badge estado-${r.estado}`}>{r.estado}</span></td>
                    <td><a className="admin-link" href={`/admin/rutas/${r.id}`}>Editar →</a></td>
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
