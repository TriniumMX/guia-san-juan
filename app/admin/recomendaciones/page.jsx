import { supabaseAdmin } from '../../../lib/supabase-admin';
import AdminChrome from '../AdminChrome';

export const dynamic = 'force-dynamic';

export default async function RecomendacionesAdminPage() {
  const { data: recos = [] } = await supabaseAdmin
    .from('recomendaciones').select('id, titulo, categoria, estado').order('actualizado_en', { ascending: false });

  return (
    <AdminChrome>
      <main className="admin-main">
        <div className="admin-page-head admin-page-head--row">
          <div>
            <span className="eyebrow">Descubrimiento</span>
            <h1>Recomendaciones <span className="admin-count">{recos.length}</span></h1>
          </div>
          <a className="btn btn--primary" href="/admin/recomendaciones/nueva">+ Nueva recomendación</a>
        </div>

        {recos.length === 0 ? (
          <div className="admin-empty"><span className="admin-empty-icon">💡</span><p>Aún no hay recomendaciones. Crea la primera.</p></div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Título</th><th>Categoría</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {recos.map((r) => (
                  <tr key={r.id}>
                    <td>{r.titulo}</td>
                    <td className="admin-muted">{r.categoria || '—'}</td>
                    <td><span className={`estado-badge estado-${r.estado}`}>{r.estado}</span></td>
                    <td><a className="admin-link" href={`/admin/recomendaciones/${r.id}`}>Editar →</a></td>
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
