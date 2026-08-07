import { supabase } from '../../lib/supabase';

// Índice JSON de fichas publicadas para el buscador client-side (§4).
// Cacheado (ISR): pocos cientos de registros, se sirve estático entre revalidaciones.
export const revalidate = 3600;

export async function GET() {
  const [
    { data: tramites = [] }, { data: deps = [] },
    { data: lugares = [] }, { data: eventos = [] }, { data: rutas = [] }, { data: recos = [] }, { data: comercios = [] },
  ] = await Promise.all([
    supabase.from('tramites').select('slug, nombre, resumen').eq('estado', 'publicado'),
    supabase.from('dependencias').select('slug, nombre, descripcion').eq('estado', 'publicado'),
    supabase.from('lugares').select('slug, nombre, resumen').eq('estado', 'publicado'),
    supabase.from('eventos').select('slug, nombre, resumen').eq('estado', 'publicado'),
    supabase.from('rutas').select('slug, nombre, resumen').eq('estado', 'publicado'),
    supabase.from('recomendaciones').select('slug, titulo, resumen').eq('estado', 'publicado'),
    supabase.from('comercios').select('slug, nombre, resumen').eq('estado', 'publicado'),
  ]);

  const items = [
    ...tramites.map((t) => ({ tipo: 'tramite', nombre: t.nombre, detalle: t.resumen || '', url: `/tramites/${t.slug}` })),
    ...deps.map((d) => ({ tipo: 'dependencia', nombre: d.nombre, detalle: d.descripcion || '', url: `/dependencias/${d.slug}` })),
    ...lugares.map((l) => ({ tipo: 'lugar', nombre: l.nombre, detalle: l.resumen || '', url: `/lugares/${l.slug}` })),
    ...eventos.map((e) => ({ tipo: 'evento', nombre: e.nombre, detalle: e.resumen || '', url: `/eventos/${e.slug}` })),
    ...rutas.map((r) => ({ tipo: 'ruta', nombre: r.nombre, detalle: r.resumen || '', url: `/rutas/${r.slug}` })),
    ...recos.map((r) => ({ tipo: 'recomendacion', nombre: r.titulo, detalle: r.resumen || '', url: `/recomendaciones/${r.slug}` })),
    ...comercios.map((c) => ({ tipo: 'comercio', nombre: c.nombre, detalle: c.resumen || '', url: `/comercios/${c.slug}` })),
  ];

  return Response.json({ items }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600' } });
}
