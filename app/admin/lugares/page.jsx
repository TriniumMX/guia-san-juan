import { supabaseAdmin } from '../../../lib/supabase-admin';
import AdminChrome from '../AdminChrome';

export const dynamic = 'force-dynamic';

export default async function LugaresAdminPage() {
  const { data: lugares = [] } = await supabaseAdmin
    .from('lugares').select('id, nombre, categoria, estado').order('nombre');

  return (
    <AdminChrome>
      <main className="admin-main">
        <div className="admin-page-head admin-page-head--row">
          <div>
            <span className="eyebrow">Descubrimiento</span>
            <h1>Lugares <span className="admin-count">{lugares.length}</span></h1>
          </div>
          <a className="btn btn--primary" href="/admin/lugares/nueva">+ Nuevo lugar</a>
        </div>

        {lugares.length === 0 ? (
          <div className="admin-empty"><span className="admin-empty-icon">📍</span><p>Aún no hay lugares. Crea el primero.</p></div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Nombre</th><th>Categoría</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {lugares.map((l) => (
                  <tr key={l.id}>
                    <td>{l.nombre}</td>
                    <td className="admin-muted">{l.categoria || '—'}</td>
                    <td><span className={`estado-badge estado-${l.estado}`}>{l.estado}</span></td>
                    <td><a className="admin-link" href={`/admin/lugares/${l.id}`}>Editar →</a></td>
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
