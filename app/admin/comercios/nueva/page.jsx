import AdminChrome from '../../AdminChrome';
import ComercioForm from '../../ComercioForm';

export const dynamic = 'force-dynamic';

export default function NuevoComercioPage() {
  return (
    <AdminChrome>
      <main className="admin-main admin-main--narrow">
        <div className="admin-page-head">
          <a className="admin-link" href="/admin/comercios">← Comercios</a>
          <h1>Nuevo comercio</h1>
          <p className="lead">Se crea en <b>borrador</b>. Después agregas contacto, fotos y lo marcas como destacado si aplica.</p>
        </div>
        <ComercioForm comercio={null} />
      </main>
    </AdminChrome>
  );
}
