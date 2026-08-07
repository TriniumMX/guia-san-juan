-- ============================================================
-- 0007 — Comercios (directorio de negocios locales)
-- ============================================================
-- Unifica "guía de comercios locales" (cara consumidor) y "espacios para negocios"
-- (cara del dueño) en UN módulo de la línea Descubrimiento. Mismo modelo LIGERO que
-- 0005 (estado editorial + slug + imágenes + RLS + reportes, sin verificación).
-- Añade `destacado` (booleano, sin pagos): base para un plan de paga futuro; los
-- destacados salen primero y con sello. Reusa el bucket `imagenes` (path comercio/).
-- Precondición: 0002 (enum estado_editorial). Aplicar con supabase db push.

create table comercios (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  giro text,                                       -- Restaurante, Café, Tienda, Servicios…
  resumen text, descripcion_md text,
  direccion text, lat numeric, lng numeric,
  telefono text, whatsapp text, sitio_web text, facebook text, instagram text,
  horario_texto text,
  imagenes jsonb,
  destacado boolean not null default false,
  estado estado_editorial not null default 'borrador',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table comercio_reportes (
  id uuid primary key default gen_random_uuid(),
  comercio_id uuid not null references comercios(id) on delete cascade,
  mensaje text, creado_en timestamptz not null default now(), atendido boolean not null default false
);

alter table comercios         enable row level security;
alter table comercio_reportes enable row level security;

create policy pub_comercios on comercios for select to anon using (estado = 'publicado');
-- comercio_reportes: RLS sin política anon = sin lectura anónima; escritura por service role.
