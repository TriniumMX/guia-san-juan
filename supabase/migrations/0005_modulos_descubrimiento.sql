-- ============================================================
-- 0005 — Módulos de descubrimiento (turismo)
-- Línea nueva de contenido para atraer visitantes: lugares, eventos, rutas y
-- recomendaciones. Formaliza lo que el home ya insinuaba (píldoras del hero).
--
-- MODELO LIGERO (decisión de producto): estado editorial + slug + imágenes + RLS
-- + reportes ciudadanos. A propósito NO llevan el aparato de verificación
-- (nada de *_verificaciones/_evidencias/_fuentes, ni verificacion_publica, ni
-- triggers de invalidación): la frescura por grupo crítico (B4) aplica al dato
-- cívico, no al contenido turístico. El aviso "confirma horarios antes de acudir"
-- (DisclaimerOficial) cubre el riesgo de datos que cambian.
--
-- SÍ se respetan las reglas duras: B2 (estado editorial en toda entidad
-- publicable), B7 (FK reales, sin polimorfismo — ver ruta_lugares), slugs
-- inmutables una vez publicados, RLS en todas las tablas.
--
-- Reutiliza el enum estado_editorial (0002). No toca el modelo congelado v1.
-- Aplicar con: supabase db push  (o SQL editor). Precondición: 0002.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Lugares (sitios de interés) — entidad base del módulo
-- ------------------------------------------------------------
create table lugares (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  categoria text,                                  -- ej. templo, plaza, museo, parque, mirador, mercado
  resumen text, descripcion_md text,
  direccion text, lat numeric, lng numeric,
  horario_texto text, costo_texto text, telefono text, sitio_web text,
  imagenes jsonb,                                  -- [{ruta, alt}] en bucket 'imagenes'
  estado estado_editorial not null default 'borrador',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table lugar_reportes (
  id uuid primary key default gen_random_uuid(),
  lugar_id uuid not null references lugares(id) on delete cascade,
  mensaje text, creado_en timestamptz not null default now(), atendido boolean not null default false
);

-- ------------------------------------------------------------
-- 2. Eventos (agenda / cartelera) — fechados
-- ------------------------------------------------------------
create table eventos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  resumen text, descripcion_md text,
  fecha_inicio date not null, fecha_fin date, hora_texto text,
  lugar_id uuid references lugares(id) on delete set null,   -- FK real opcional (B7)
  ubicacion_texto text,                            -- si no está ligado a un lugar del catálogo
  categoria text, costo_texto text, organizador text,
  imagenes jsonb,
  estado estado_editorial not null default 'borrador',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table evento_reportes (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references eventos(id) on delete cascade,
  mensaje text, creado_en timestamptz not null default now(), atendido boolean not null default false
);

-- ------------------------------------------------------------
-- 3. Rutas (itinerarios) + relación con lugares (FK real, sin polimorfismo — B7)
-- ------------------------------------------------------------
create table rutas (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  resumen text, descripcion_md text, duracion_texto text,
  imagenes jsonb,
  estado estado_editorial not null default 'borrador',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table ruta_lugares (
  id uuid primary key default gen_random_uuid(),
  ruta_id uuid not null references rutas(id) on delete cascade,
  lugar_id uuid not null references lugares(id) on delete cascade,
  orden int not null default 0,
  nota text
);

create table ruta_reportes (
  id uuid primary key default gen_random_uuid(),
  ruta_id uuid not null references rutas(id) on delete cascade,
  mensaje text, creado_en timestamptz not null default now(), atendido boolean not null default false
);

-- ------------------------------------------------------------
-- 4. Recomendaciones (artículos / tips en markdown, como guías, tono turístico)
-- ------------------------------------------------------------
create table recomendaciones (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  resumen text, cuerpo_md text, categoria text,
  imagenes jsonb,
  estado estado_editorial not null default 'borrador',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table recomendacion_reportes (
  id uuid primary key default gen_random_uuid(),
  recomendacion_id uuid not null references recomendaciones(id) on delete cascade,
  mensaje text, creado_en timestamptz not null default now(), atendido boolean not null default false
);

-- ============================================================
-- RLS — mismas reglas que 0002: público solo lee lo 'publicado';
-- hijas demuestran padre publicado; reportes privados (escritura service role).
-- ============================================================
alter table lugares                enable row level security;
alter table lugar_reportes         enable row level security;
alter table eventos                enable row level security;
alter table evento_reportes        enable row level security;
alter table rutas                  enable row level security;
alter table ruta_lugares           enable row level security;
alter table ruta_reportes          enable row level security;
alter table recomendaciones        enable row level security;
alter table recomendacion_reportes enable row level security;

-- Entidades publicables: lectura anónima solo si estado='publicado'
create policy pub_lugares         on lugares         for select to anon using (estado = 'publicado');
create policy pub_eventos         on eventos         for select to anon using (estado = 'publicado');
create policy pub_rutas           on rutas           for select to anon using (estado = 'publicado');
create policy pub_recomendaciones on recomendaciones for select to anon using (estado = 'publicado');

-- Hija pública: los lugares de una ruta se leen si la ruta está publicada
create policy pub_ruta_lugares on ruta_lugares for select to anon using (
  exists (select 1 from rutas r where r.id = ruta_id and r.estado = 'publicado')
);

-- *_reportes: RLS habilitado SIN política anon = sin lectura anónima.
-- La escritura (reporte ciudadano) es por service role tras validación en la server action.
