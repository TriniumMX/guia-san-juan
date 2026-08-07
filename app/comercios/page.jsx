import { supabase } from '../../lib/supabase';
import FichaShell from '../../components/FichaShell';
import ProposalModal from '../../components/ProposalModal';
import { imagenPublica } from '../../lib/imagenes';

export const revalidate = 3600;

export const metadata = {
  title: 'Comercios y negocios de San Juan del Río',
  description: 'Directorio de negocios locales de San Juan del Río: restaurantes, tiendas, cafés y servicios. Encuentra y apoya lo de aquí.',
  alternates: { canonical: '/comercios' },
};

export default async function ComerciosIndex() {
  const { data: comercios = [] } = await supabase
    .from('comercios').select('slug, nombre, giro, resumen, imagenes, destacado')
    .eq('estado', 'publicado')
    .order('destacado', { ascending: false }).order('nombre');

  return (
    <FichaShell>
      <div className="wrap desc-page">
        <h1 className="ficha-h1">Comercios</h1>
        <p className="ficha-resumen">Encuentra y apoya los negocios de San Juan del Río: dónde comer, comprar y resolver.</p>

        {comercios.length === 0 ? (
          <p className="ficha-vacio">Aún no hay comercios publicados. Muy pronto.</p>
        ) : (
          <ul className="desc-grid">
            {comercios.map((c) => {
              const img = Array.isArray(c.imagenes) ? c.imagenes[0] : null;
              const url = img ? imagenPublica(img.ruta) : null;
              return (
                <li key={c.slug}>
                  <a className="desc-card" href={`/comercios/${c.slug}`}>
                    <span className="desc-card-media">
                      {url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={url} alt={img.alt || c.nombre} loading="lazy" />
                        : <span className="desc-card-ph" aria-hidden="true">🛍️</span>}
                      {c.destacado && <span className="desc-badge desc-badge--destacado" aria-hidden="true">★ Destacado</span>}
                    </span>
                    <span className="desc-card-body">
                      {c.giro && <span className="desc-chip">{c.giro}</span>}
                      <b>{c.nombre}</b>
                      {c.resumen && <span className="desc-card-sub">{c.resumen}</span>}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        <section className="ficha-sec" aria-label="Registra tu negocio">
          <h2>¿Tienes un negocio?</h2>
          <p>Aparece en la guía y llega a más sanjuanenses. Cuéntanos de tu negocio y lo revisamos antes de publicarlo.</p>
          <ProposalModal />
        </section>
      </div>
    </FichaShell>
  );
}
