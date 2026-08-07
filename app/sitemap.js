import { supabase } from '../lib/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://guiasanjuan.mx';

export const revalidate = 3600;

export default async function sitemap() {
  const base = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/tramites`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/dependencias`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/directorio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/guias`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/lugares`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/eventos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/rutas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/comercios`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/recomendaciones`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/acerca-de`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/terminos`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacidad`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/#descubre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const [
    { data: tramites = [] }, { data: deps = [] }, { data: guias = [] },
    { data: lugares = [] }, { data: eventos = [] }, { data: rutas = [] }, { data: recos = [] }, { data: comercios = [] },
  ] = await Promise.all([
    supabase.from('tramites').select('slug, actualizado_en').eq('estado', 'publicado'),
    supabase.from('dependencias').select('slug, actualizado_en').eq('estado', 'publicado'),
    supabase.from('guias').select('slug, actualizado_en').eq('estado', 'publicado'),
    supabase.from('lugares').select('slug, actualizado_en').eq('estado', 'publicado'),
    supabase.from('eventos').select('slug, actualizado_en').eq('estado', 'publicado'),
    supabase.from('rutas').select('slug, actualizado_en').eq('estado', 'publicado'),
    supabase.from('recomendaciones').select('slug, actualizado_en').eq('estado', 'publicado'),
    supabase.from('comercios').select('slug, actualizado_en').eq('estado', 'publicado'),
  ]);

  const fichas = [
    ...tramites.map((t) => ({ url: `${SITE_URL}/tramites/${t.slug}`, lastModified: new Date(t.actualizado_en || Date.now()), changeFrequency: 'monthly', priority: 0.9 })),
    ...deps.map((d) => ({ url: `${SITE_URL}/dependencias/${d.slug}`, lastModified: new Date(d.actualizado_en || Date.now()), changeFrequency: 'monthly', priority: 0.7 })),
    ...guias.map((g) => ({ url: `${SITE_URL}/guias/${g.slug}`, lastModified: new Date(g.actualizado_en || Date.now()), changeFrequency: 'monthly', priority: 0.6 })),
    ...lugares.map((l) => ({ url: `${SITE_URL}/lugares/${l.slug}`, lastModified: new Date(l.actualizado_en || Date.now()), changeFrequency: 'monthly', priority: 0.7 })),
    ...eventos.map((e) => ({ url: `${SITE_URL}/eventos/${e.slug}`, lastModified: new Date(e.actualizado_en || Date.now()), changeFrequency: 'weekly', priority: 0.7 })),
    ...rutas.map((r) => ({ url: `${SITE_URL}/rutas/${r.slug}`, lastModified: new Date(r.actualizado_en || Date.now()), changeFrequency: 'monthly', priority: 0.6 })),
    ...recos.map((r) => ({ url: `${SITE_URL}/recomendaciones/${r.slug}`, lastModified: new Date(r.actualizado_en || Date.now()), changeFrequency: 'monthly', priority: 0.6 })),
    ...comercios.map((c) => ({ url: `${SITE_URL}/comercios/${c.slug}`, lastModified: new Date(c.actualizado_en || Date.now()), changeFrequency: 'monthly', priority: 0.7 })),
  ];

  return [...base, ...fichas];
}
