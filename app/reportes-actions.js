'use server';
import { supabaseAdmin } from '../lib/supabase-admin';

// Reporte ciudadano de dato incorrecto (§3.4). Alimenta la cola de verificación.
// Público (anónimo) → escribe por service role en la tabla privada de reportes.
const TABLA = {
  tramite: 'tramite_reportes', dependencia: 'dependencia_reportes',
  lugar: 'lugar_reportes', evento: 'evento_reportes', ruta: 'ruta_reportes', recomendacion: 'recomendacion_reportes',
  comercio: 'comercio_reportes',
};
const COL = {
  tramite: 'tramite_id', dependencia: 'dependencia_id',
  lugar: 'lugar_id', evento: 'evento_id', ruta: 'ruta_id', recomendacion: 'recomendacion_id',
  comercio: 'comercio_id',
};

export async function reportarDato(tipo, id, mensaje, honeypot) {
  if (honeypot) return { ok: true }; // bot: éxito silencioso
  const tabla = TABLA[tipo]; const col = COL[tipo];
  if (!tabla || !id) return { error: 'Datos inválidos.' };

  const msg = String(mensaje || '').trim().slice(0, 1000);
  if (msg.length < 5) return { error: 'Cuéntanos brevemente qué dato está mal (mín. 5 caracteres).' };

  const { error } = await supabaseAdmin.from(tabla).insert({ [col]: id, mensaje: msg });
  if (error) { console.error(error); return { error: 'No se pudo enviar. Intenta de nuevo.' }; }
  return { ok: true };
}
