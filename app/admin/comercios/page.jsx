import { supabaseAdmin } from '../../../lib/supabase-admin';
import AdminChrome from '../AdminChrome';

export const dynamic = 'force-dynamic';

export default async function ComerciosAdminPage() {
  const { data: comercios = [] } = await supabaseAdmin
    .from('comercios').select('id, nombre, giro, destacado, estado')
    .order('destacado', { ascending: false }).order('nombre');

  return (
    <AdminChrome>
      <main className="admin-main">
        <div className="admin-page-head admin-page-head--row">
          <div>
            <span className="eyebrow">Descubrimiento</span>
            <h1>Comercios <span className="admin-count">{comercios.length}</span></h1>
          </div>
          <a className="btn btn--primary" href="/admin/comercios/nueva">+ Nuevo comercio</a>
        </div>

        {comercios.length === 0 ? (
          <div className="admin-empty"><span className="admin-empty-icon">🛍️</span><p>Aún no hay comercios. Crea el primero.</p></div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Nombre</th><th>Giro</th><th>Destacado</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {comercios.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td>
                    <td className="admin-muted">{c.giro || '—'}</td>
                    <td>{c.destacado ? <span className="estado-badge estado-publicado">★</span> : <span className="admin-muted">—</span>}</td>
                    <td><span className={`estado-badge estado-${c.estado}`}>{c.estado}</span></td>
                    <td><a className="admin-link" href={`/admin/comercios/${c.id}`}>Editar →</a></td>
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
