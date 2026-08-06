import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import AdminChrome from '../../AdminChrome';
import EstadoControl from '../../EstadoControl';
import RecomendacionForm from '../../RecomendacionForm';
import ImagenesAdmin from '../../ImagenesAdmin';

export const dynamic = 'force-dynamic';

export default async function EditarRecomendacionPage({ params, searchParams }) {
  const { id } = await params;
  const { img } = (await searchParams) || {};
  const { data: r } = await supabaseAdmin.from('recomendaciones').select('*').eq('id', id).single();
  if (!r) notFound();

  return (
    <AdminChrome>
      <main className="admin-main admin-main--narrow">
        <div className="admin-page-head">
          <a className="admin-link" href="/admin/recomendaciones">← Recomendaciones</a>
          <h1>{r.titulo} <span className={`estado-badge estado-${r.estado}`}>{r.estado}</span></h1>
          <p className="admin-mono admin-muted">/recomendaciones/{r.slug}</p>
        </div>

        <section className="admin-section">
          <h2 className="admin-section-title">Publicación</h2>
          <EstadoControl tipo="recomendacion" id={r.id} estado={r.estado} />
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">Datos</h2>
          <RecomendacionForm recomendacion={r} />
        </section>

        <ImagenesAdmin tipo="recomendacion" id={r.id} imagenes={r.imagenes} msg={img} />
      </main>
    </AdminChrome>
  );
}
