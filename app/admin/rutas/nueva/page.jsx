import AdminChrome from '../../AdminChrome';
import RutaForm from '../../RutaForm';

export const dynamic = 'force-dynamic';

export default function NuevaRutaPage() {
  return (
    <AdminChrome>
      <main className="admin-main admin-main--narrow">
        <div className="admin-page-head">
          <a className="admin-link" href="/admin/rutas">← Rutas</a>
          <h1>Nueva ruta</h1>
          <p className="lead">Se crea en <b>borrador</b>. Al editar agregas los lugares del recorrido en orden.</p>
        </div>
        <RutaForm ruta={null} />
      </main>
    </AdminChrome>
  );
}
