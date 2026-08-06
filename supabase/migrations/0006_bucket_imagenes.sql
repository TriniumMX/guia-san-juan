-- ============================================================
-- 0006 — Bucket público de imágenes (módulos de descubrimiento)
-- ============================================================
-- Fotos de lugares, eventos, rutas y recomendaciones. Contenido PÚBLICO (no
-- documentos personales). La subida la hace solo el admin vía service role (que
-- salta RLS); no se agregan políticas de escritura anónima. La lectura es pública
-- por ser un bucket public. Espeja 0004 (bucket 'formatos').

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagenes', 'imagenes', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
