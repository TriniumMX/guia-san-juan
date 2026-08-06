'use server';
import { randomUUID } from 'crypto';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '../../lib/supabase-admin';
import { requireAdmin, registrarBitacora } from '../../lib/auth';

// Server actions de los módulos de descubrimiento (lugares, eventos, rutas,
// recomendaciones). MODELO LIGERO: sin verificación por grupo; publicar solo
// exige nombre/título + slug. Mismo patrón que contenido-actions.js.

const ESTADOS = ['borrador', 'en_revision', 'publicado', 'vencido', 'retirado'];

const s = (fd, k) => String(fd.get(k) ?? '').trim();
const nulo = (v) => (v === '' ? null : v);
const coord = (v, max) => {
  if (v === '' || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) && Math.abs(n) <= max ? n : null;
};
function slugify(txt) {
  return txt.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Mapa tipo → { tabla, seg (segmento de ruta pública/admin) } para imágenes y reportes.
const MODULOS = {
  lugar:         { tabla: 'lugares',         seg: 'lugares' },
  evento:        { tabla: 'eventos',         seg: 'eventos' },
  ruta:          { tabla: 'rutas',           seg: 'rutas' },
  recomendacion: { tabla: 'recomendaciones', seg: 'recomendaciones' },
};

// ============================================================
// LUGARES
// ============================================================
export async function crearLugar(prevState, fd) {
  const { admin } = await requireAdmin({ escritura: true });
  const nombre = s(fd, 'nombre');
  if (!nombre || nombre.length > 160) return { error: 'El nombre es obligatorio (máx. 160).' };
  const slug = slugify(s(fd, 'slug') || nombre);
  if (!slug) return { error: 'No se pudo generar un slug válido.' };
  const { data, error } = await supabaseAdmin.from('lugares')
    .insert({ nombre, slug, categoria: nulo(s(fd, 'categoria')) }).select('id').single();
  if (error) return { error: error.code === '23505' ? 'Ya existe un lugar con ese slug.' : error.message };
  await registrarBitacora(admin.id, 'crear', 'lugares', data.id, { nombre, slug });
  revalidatePath('/admin/lugares');
  redirect(`/admin/lugares/${data.id}`);
}

export async function actualizarLugar(prevState, fd) {
  const { admin } = await requireAdmin({ escritura: true });
  const id = s(fd, 'id');
  const nombre = s(fd, 'nombre');
  if (!id) return { error: 'Falta el id.' };
  if (!nombre) return { error: 'El nombre es obligatorio.' };
  const { error } = await supabaseAdmin.from('lugares').update({
    nombre,
    categoria: nulo(s(fd, 'categoria')),
    resumen: nulo(s(fd, 'resumen')),
    descripcion_md: nulo(s(fd, 'descripcion_md')),
    direccion: nulo(s(fd, 'direccion')),
    lat: coord(s(fd, 'lat'), 90), lng: coord(s(fd, 'lng'), 180),
    horario_texto: nulo(s(fd, 'horario_texto')),
    costo_texto: nulo(s(fd, 'costo_texto')),
    telefono: nulo(s(fd, 'telefono')),
    sitio_web: nulo(s(fd, 'sitio_web')),
    actualizado_en: new Date().toISOString(),
  }).eq('id', id);
  if (error) return { error: error.message };
  await registrarBitacora(admin.id, 'actualizar', 'lugares', id, null);
  revalidatePath(`/admin/lugares/${id}`);
  await revalidarPublico('lugares', id);
  return { ok: true };
}

export async function cambiarEstadoLugar(prevState, fd) {
  return cambiarEstadoGenerico(fd, 'lugar');
}

// Geocodifica la dirección guardada del lugar (OpenStreetMap/Nominatim, sin API key).
export async function geocodificarYGuardarLugar(fd) {
  const { admin } = await requireAdmin({ escritura: true });
  const id = s(fd, 'lugar_id');
  if (!id) throw new Error('Falta el id del lugar');
  const { data: lug } = await supabaseAdmin.from('lugares').select('direccion').eq('id', id).single();
  const dir = String(lug?.direccion ?? '').trim();
  if (dir.length < 4) redirect(`/admin/lugares/${id}?geo=sindir`);
  const punto = await geocodeNominatim(dir);
  if (!punto) redirect(`/admin/lugares/${id}?geo=notfound`);
  const { error } = await supabaseAdmin.from('lugares')
    .update({ lat: punto.lat, lng: punto.lng, actualizado_en: new Date().toISOString() }).eq('id', id);
  if (error) redirect(`/admin/lugares/${id}?geo=error`);
  await registrarBitacora(admin.id, 'geocodificar', 'lugares', id, punto);
  redirect(`/admin/lugares/${id}?geo=ok`);
}

// ============================================================
// EVENTOS
// ============================================================
export async function crearEvento(prevState, fd) {
  const { admin } = await requireAdmin({ escritura: true });
  const nombre = s(fd, 'nombre');
  if (!nombre || nombre.length > 200) return { error: 'El nombre es obligatorio (máx. 200).' };
  const fecha_inicio = s(fd, 'fecha_inicio');
  if (!fecha_inicio) return { error: 'La fecha de inicio es obligatoria.' };
  const slug = slugify(s(fd, 'slug') || nombre);
  if (!slug) return { error: 'No se pudo generar un slug válido.' };
  const { data, error } = await supabaseAdmin.from('eventos')
    .insert({ nombre, slug, fecha_inicio }).select('id').single();
  if (error) return { error: error.code === '23505' ? 'Ya existe un evento con ese slug.' : error.message };
  await registrarBitacora(admin.id, 'crear', 'eventos', data.id, { nombre, slug });
  revalidatePath('/admin/eventos');
  redirect(`/admin/eventos/${data.id}`);
}

export async function actualizarEvento(prevState, fd) {
  const { admin } = await requireAdmin({ escritura: true });
  const id = s(fd, 'id');
  const nombre = s(fd, 'nombre');
  const fecha_inicio = s(fd, 'fecha_inicio');
  if (!id) return { error: 'Falta el id.' };
  if (!nombre) return { error: 'El nombre es obligatorio.' };
  if (!fecha_inicio) return { error: 'La fecha de inicio es obligatoria.' };
  const { error } = await supabaseAdmin.from('eventos').update({
    nombre,
    resumen: nulo(s(fd, 'resumen')),
    descripcion_md: nulo(s(fd, 'descripcion_md')),
    fecha_inicio,
    fecha_fin: nulo(s(fd, 'fecha_fin')),
    hora_texto: nulo(s(fd, 'hora_texto')),
    lugar_id: nulo(s(fd, 'lugar_id')),
    ubicacion_texto: nulo(s(fd, 'ubicacion_texto')),
    categoria: nulo(s(fd, 'categoria')),
    costo_texto: nulo(s(fd, 'costo_texto')),
    organizador: nulo(s(fd, 'organizador')),
    actualizado_en: new Date().toISOString(),
  }).eq('id', id);
  if (error) return { error: error.message };
  await registrarBitacora(admin.id, 'actualizar', 'eventos', id, null);
  revalidatePath(`/admin/eventos/${id}`);
  await revalidarPublico('eventos', id);
  return { ok: true };
}

export async function cambiarEstadoEvento(prevState, fd) {
  return cambiarEstadoGenerico(fd, 'evento');
}

// ============================================================
// RUTAS
// ============================================================
export async function crearRuta(prevState, fd) {
  const { admin } = await requireAdmin({ escritura: true });
  const nombre = s(fd, 'nombre');
  if (!nombre || nombre.length > 160) return { error: 'El nombre es obligatorio (máx. 160).' };
  const slug = slugify(s(fd, 'slug') || nombre);
  if (!slug) return { error: 'No se pudo generar un slug válido.' };
  const { data, error } = await supabaseAdmin.from('rutas').insert({ nombre, slug }).select('id').single();
  if (error) return { error: error.code === '23505' ? 'Ya existe una ruta con ese slug.' : error.message };
  await registrarBitacora(admin.id, 'crear', 'rutas', data.id, { nombre, slug });
  revalidatePath('/admin/rutas');
  redirect(`/admin/rutas/${data.id}`);
}

export async function actualizarRuta(prevState, fd) {
  const { admin } = await requireAdmin({ escritura: true });
  const id = s(fd, 'id');
  const nombre = s(fd, 'nombre');
  if (!id) return { error: 'Falta el id.' };
  if (!nombre) return { error: 'El nombre es obligatorio.' };
  const { error } = await supabaseAdmin.from('rutas').update({
    nombre,
    resumen: nulo(s(fd, 'resumen')),
    descripcion_md: nulo(s(fd, 'descripcion_md')),
    duracion_texto: nulo(s(fd, 'duracion_texto')),
    actualizado_en: new Date().toISOString(),
  }).eq('id', id);
  if (error) return { error: error.message };
  await registrarBitacora(admin.id, 'actualizar', 'rutas', id, null);
  revalidatePath(`/admin/rutas/${id}`);
  await revalidarPublico('rutas', id);
  return { ok: true };
}

export async function cambiarEstadoRuta(prevState, fd) {
  return cambiarEstadoGenerico(fd, 'ruta');
}

// Sub-editor de lugares de una ruta (server actions por renglón, sin JS de cliente).
export async function agregarLugarARuta(fd) {
  const { admin } = await requireAdmin({ escritura: true });
  const ruta_id = s(fd, 'ruta_id'); const lugar_id = s(fd, 'lugar_id');
  if (!ruta_id || !lugar_id) throw new Error('Datos incompletos');
  const { count } = await supabaseAdmin.from('ruta_lugares')
    .select('id', { count: 'exact', head: true }).eq('ruta_id', ruta_id);
  const { error } = await supabaseAdmin.from('ruta_lugares')
    .insert({ ruta_id, lugar_id, orden: (count ?? 0) + 1, nota: nulo(s(fd, 'nota')) });
  if (error) throw error;
  await registrarBitacora(admin.id, 'agregar_lugar_ruta', 'rutas', ruta_id, { lugar_id });
  revalidatePath(`/admin/rutas/${ruta_id}`);
  await revalidarPublico('rutas', ruta_id);
}

export async function quitarLugarDeRuta(fd) {
  await requireAdmin({ escritura: true });
  const id = s(fd, 'id'); const ruta_id = s(fd, 'ruta_id');
  const { error } = await supabaseAdmin.from('ruta_lugares').delete().eq('id', id);
  if (error) throw error;
  revalidatePath(`/admin/rutas/${ruta_id}`);
  await revalidarPublico('rutas', ruta_id);
}

export async function actualizarOrdenRutaLugar(fd) {
  await requireAdmin({ escritura: true });
  const id = s(fd, 'id'); const ruta_id = s(fd, 'ruta_id');
  const orden = Number(s(fd, 'orden'));
  if (!id || !Number.isInteger(orden)) throw new Error('Datos inválidos');
  const { error } = await supabaseAdmin.from('ruta_lugares').update({ orden }).eq('id', id);
  if (error) throw error;
  revalidatePath(`/admin/rutas/${ruta_id}`);
  await revalidarPublico('rutas', ruta_id);
}

// ============================================================
// RECOMENDACIONES (artículos / tips)
// ============================================================
export async function crearRecomendacion(prevState, fd) {
  const { admin } = await requireAdmin({ escritura: true });
  const titulo = s(fd, 'titulo');
  if (!titulo || titulo.length > 200) return { error: 'El título es obligatorio (máx. 200).' };
  const slug = slugify(s(fd, 'slug') || titulo);
  if (!slug) return { error: 'No se pudo generar un slug válido.' };
  const { data, error } = await supabaseAdmin.from('recomendaciones').insert({ titulo, slug }).select('id').single();
  if (error) return { error: error.code === '23505' ? 'Ya existe una recomendación con ese slug.' : error.message };
  await registrarBitacora(admin.id, 'crear', 'recomendaciones', data.id, { titulo, slug });
  revalidatePath('/admin/recomendaciones');
  redirect(`/admin/recomendaciones/${data.id}`);
}

export async function actualizarRecomendacion(prevState, fd) {
  const { admin } = await requireAdmin({ escritura: true });
  const id = s(fd, 'id');
  const titulo = s(fd, 'titulo');
  if (!id) return { error: 'Falta el id.' };
  if (!titulo) return { error: 'El título es obligatorio.' };
  const { error } = await supabaseAdmin.from('recomendaciones').update({
    titulo,
    categoria: nulo(s(fd, 'categoria')),
    resumen: nulo(s(fd, 'resumen')),
    cuerpo_md: nulo(s(fd, 'cuerpo_md')),
    actualizado_en: new Date().toISOString(),
  }).eq('id', id);
  if (error) return { error: error.message };
  await registrarBitacora(admin.id, 'actualizar', 'recomendaciones', id, null);
  revalidatePath(`/admin/recomendaciones/${id}`);
  await revalidarPublico('recomendaciones', id);
  return { ok: true };
}

export async function cambiarEstadoRecomendacion(prevState, fd) {
  return cambiarEstadoGenerico(fd, 'recomendacion');
}

// ============================================================
// IMÁGENES (bucket público 'imagenes') — por renglón, sin JS de cliente
// ============================================================
const MAX_IMG = 5 * 1024 * 1024; // 5 MB
const normImagenes = (v) => (Array.isArray(v) ? v : []).filter((x) => x && x.ruta);

// Detecta el tipo real por magic bytes; devuelve { ext, mime } o null.
function tipoImagen(b) {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: 'jpg', mime: 'image/jpeg' };
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { ext: 'png', mime: 'image/png' };
  if (b.length >= 12 && b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP') return { ext: 'webp', mime: 'image/webp' };
  return null;
}

export async function agregarImagen(fd) {
  const { admin } = await requireAdmin({ escritura: true });
  const tipo = s(fd, 'tipo'); const id = s(fd, 'id');
  const mod = MODULOS[tipo];
  if (!mod || !id) throw new Error('Datos inválidos');
  const volver = (m) => redirect(`/admin/${mod.seg}/${id}?img=${m}`);
  const archivo = fd.get('archivo');
  const alt = s(fd, 'alt');
  if (!archivo || typeof archivo === 'string' || archivo.size === 0) volver('sinarchivo');
  if (archivo.size > MAX_IMG) volver('grande');

  const buffer = Buffer.from(await archivo.arrayBuffer());
  const t = tipoImagen(buffer);
  if (!t) volver('tipo');

  const ruta = `${tipo}/${randomUUID()}.${t.ext}`;
  const up = await supabaseAdmin.storage.from('imagenes').upload(ruta, buffer, { contentType: t.mime, upsert: false });
  if (up.error) { console.error(up.error); volver('error'); }

  const { data: row } = await supabaseAdmin.from(mod.tabla).select('imagenes, slug').eq('id', id).single();
  const actuales = normImagenes(row?.imagenes);
  const { error } = await supabaseAdmin.from(mod.tabla)
    .update({ imagenes: [...actuales, { ruta, alt: alt || null }], actualizado_en: new Date().toISOString() })
    .eq('id', id);
  if (error) { await supabaseAdmin.storage.from('imagenes').remove([ruta]); volver('error'); }
  await registrarBitacora(admin.id, 'agregar_imagen', mod.tabla, id, { ruta });
  revalidatePath(`/admin/${mod.seg}/${id}`);
  revalidatePath(`/${mod.seg}`);
  if (row?.slug) revalidatePath(`/${mod.seg}/${row.slug}`);
  volver('ok');
}

export async function eliminarImagen(fd) {
  const { admin } = await requireAdmin({ escritura: true });
  const tipo = s(fd, 'tipo'); const id = s(fd, 'id'); const ruta = s(fd, 'ruta');
  const mod = MODULOS[tipo];
  if (!mod || !id || !ruta) throw new Error('Datos inválidos');
  const { data: row } = await supabaseAdmin.from(mod.tabla).select('imagenes, slug').eq('id', id).single();
  const restantes = normImagenes(row?.imagenes).filter((x) => x.ruta !== ruta);
  const { error } = await supabaseAdmin.from(mod.tabla)
    .update({ imagenes: restantes.length ? restantes : null, actualizado_en: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  await supabaseAdmin.storage.from('imagenes').remove([ruta]);
  await registrarBitacora(admin.id, 'eliminar_imagen', mod.tabla, id, { ruta });
  revalidatePath(`/admin/${mod.seg}/${id}`);
  revalidatePath(`/${mod.seg}`);
  if (row?.slug) revalidatePath(`/${mod.seg}/${row.slug}`);
}

// ============================================================
// Helpers internos
// ============================================================
async function cambiarEstadoGenerico(fd, tipo) {
  const { admin } = await requireAdmin({ escritura: true });
  const mod = MODULOS[tipo];
  const id = s(fd, 'id'); const estado = s(fd, 'estado');
  if (!mod || !id) return { error: 'Datos inválidos' };
  if (!ESTADOS.includes(estado)) return { error: 'Estado inválido' };
  const { data: row, error } = await supabaseAdmin.from(mod.tabla).update({ estado }).eq('id', id).select('slug').single();
  if (error) return { error: error.message };
  await registrarBitacora(admin.id, 'cambiar_estado', mod.tabla, id, { estado });
  revalidatePath(`/admin/${mod.seg}/${id}`);
  revalidatePath(`/admin/${mod.seg}`);
  revalidatePath(`/${mod.seg}`);                       // índice público
  revalidatePath(`/${mod.seg}`);
  if (row?.slug) revalidatePath(`/${mod.seg}/${row.slug}`); // ficha pública
  return { ok: true };
}

// Refresca el índice y la ficha públicos de un módulo (ISR) tras un cambio de contenido.
async function revalidarPublico(seg, id) {
  const { data } = await supabaseAdmin.from(seg).select('slug').eq('id', id).single();
  revalidatePath(`/${seg}`);
  if (data?.slug) revalidatePath(`/${seg}/${data.slug}`);
}

async function geocodeNominatim(direccion) {
  const query = String(direccion ?? '').trim();
  if (query.length < 4) return null;
  const url = 'https://nominatim.openstreetmap.org/search?' + new URLSearchParams({
    q: `${query}, San Juan del Río, Querétaro, México`,
    format: 'json', limit: '1', countrycodes: 'mx',
  });
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'GuiaSanJuan/1.0 (hola@trinium.mx)', 'Accept-Language': 'es' } });
    if (!r.ok) return null;
    const arr = await r.json();
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const lat = Number(arr[0].lat), lng = Number(arr[0].lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}
