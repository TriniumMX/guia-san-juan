import AdminChrome from '../../AdminChrome';
import EventoForm from '../../EventoForm';

export const dynamic = 'force-dynamic';

export default function NuevoEventoPage() {
  return (
    <AdminChrome>
      <main className="admin-main admin-main--narrow">
        <div className="admin-page-head">
          <a className="admin-link" href="/admin/eventos">← Eventos</a>
          <h1>Nuevo evento</h1>
          <p className="lead">Se crea en <b>borrador</b>. Solo necesitas nombre y fecha de inicio; el resto lo agregas al editar.</p>
        </div>
        <EventoForm evento={null} />
      </main>
    </AdminChrome>
  );
}
