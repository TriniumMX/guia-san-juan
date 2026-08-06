import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import AdminChrome from '../../AdminChrome';
import EstadoControl from '../../EstadoControl';
import EventoForm from '../../EventoForm';
import ImagenesAdmin from '../../ImagenesAdmin';

export const dynamic = 'force-dynamic';

export default async function EditarEventoPage({ params, searchParams }) {
  const { id } = await params;
  const { img } = (await searchParams) || {};
  const [{ data: e }, { data: lugares = [] }] = await Promise.all([
    supabaseAdmin.from('eventos').select('*').eq('id', id).single(),
    supabaseAdmin.from('lugares').select('id, nombre').order('nombre'),
  ]);
  if (!e) notFound();

  return (
    <AdminChrome>
      <main className="admin-main admin-main--narrow">
        <div className="admin-page-head">
          <a className="admin-link" href="/admin/eventos">← Eventos</a>
          <h1>{e.nombre} <span className={`estado-badge estado-${e.estado}`}>{e.estado}</span></h1>
          <p className="admin-mono admin-muted">/eventos/{e.slug}</p>
        </div>

        <section className="admin-section">
          <h2 className="admin-section-title">Publicación</h2>
          <EstadoControl tipo="evento" id={e.id} estado={e.estado} />
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Datos</h2>
          <EventoForm evento={e} lugares={lugares} />
        </section>

        <ImagenesAdmin tipo="evento" id={e.id} imagenes={e.imagenes} msg={img} />
      </main>
    </AdminChrome>
  );
}
