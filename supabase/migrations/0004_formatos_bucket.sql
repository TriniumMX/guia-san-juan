-- ============================================================
-- 0004 — Bucket público de formatos descargables por trámite
-- ============================================================
-- Formatos oficiales en PDF (en blanco) que la ciudadanía descarga e imprime.
-- Es contenido PÚBLICO (no documentos personales del ciudadano). La subida la
-- hace solo el admin vía service role (que salta RLS); no se agregan políticas
-- de escritura anónima. La lectura es pública por ser un bucket public.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('formatos', 'formatos', true, 10485760, array['application/pdf'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
