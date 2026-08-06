import AdminChrome from '../../AdminChrome';
import RecomendacionForm from '../../RecomendacionForm';

export const dynamic = 'force-dynamic';

export default function NuevaRecomendacionPage() {
  return (
    <AdminChrome>
      <main className="admin-main admin-main--narrow">
        <div className="admin-page-head">
          <a className="admin-link" href="/admin/recomendaciones">← Recomendaciones</a>
          <h1>Nueva recomendación</h1>
          <p className="lead">Se crea en <b>borrador</b>. Al editar escribes el contenido en Markdown y agregas imágenes.</p>
        </div>
        <RecomendacionForm recomendacion={null} />
      </main>
    </AdminChrome>
  );
}
