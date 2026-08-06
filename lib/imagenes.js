import { supabase } from './supabase';

// URL pública de una imagen del bucket 'imagenes' (los módulos de descubrimiento).
// getPublicUrl solo arma la cadena; no hace red. Devuelve null si no hay ruta.
export function imagenPublica(ruta) {
  if (!ruta) return null;
  return supabase.storage.from('imagenes').getPublicUrl(ruta).data.publicUrl;
}

// Normaliza el jsonb `imagenes` a un array de { ruta, alt } válidos.
export function listaImagenes(imagenes) {
  return (Array.isArray(imagenes) ? imagenes : []).filter((x) => x && x.ruta);
}
