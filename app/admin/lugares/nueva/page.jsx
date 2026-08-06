import AdminChrome from '../../AdminChrome';
import LugarForm from '../../LugarForm';

export const dynamic = 'force-dynamic';

export default function NuevoLugarPage() {
  return (
    <AdminChrome>
      <main className="admin-main admin-main--narrow">
        <div className="admin-page-head">
          <a className="admin-link" href="/admin/lugares">← Lugares</a>
          <h1>Nuevo lugar</h1>
          <p className="lead">Se crea en <b>borrador</b>. Después agregas descripción, fotos y datos de contacto.</p>
        </div>
        <LugarForm lugar={null} />
      </main>
    </AdminChrome>
  );
}
