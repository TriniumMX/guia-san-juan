# Módulos de descubrimiento — nota de modelo (2026-08-06)

Complemento a `modelo-contenido-v1.md`. Documenta las entidades de la **línea de descubrimiento**
(turismo) y por qué adoptan un **modelo ligero** distinto al cívico.

## Entidades (migración `0005_modulos_descubrimiento.sql`)

- `lugares` — sitios de interés (entidad base). Campos de contenido + `imagenes jsonb` +
  `estado estado_editorial`. Satélite: `lugar_reportes`.
- `eventos` — fechados (`fecha_inicio` NOT NULL, `fecha_fin`). FK real opcional `lugar_id → lugares`.
  El índice público muestra solo próximos (`coalesce(fecha_fin,fecha_inicio) >= hoy`). Satélite:
  `evento_reportes`.
- `rutas` + `ruta_lugares` — itinerario = lista ordenada de lugares. `ruta_lugares` usa **FK reales**
  a `rutas` y `lugares` (B7, sin polimorfismo). Satélite: `ruta_reportes`.
- `recomendaciones` — artículos/tips en markdown (`cuerpo_md`), como `guias` pero tono turístico.
  Satélite: `recomendacion_reportes`.
- Bucket `imagenes` (migración `0006`, público, 5 MB, jpeg/png/webp) para las fotos.

## Decisión: modelo LIGERO (a propósito)

Estas entidades **NO** implementan el aparato de verificación del modelo cívico:
sin `*_verificaciones`, `*_evidencias`, `*_fuentes`; **no** se agregan al check de
`verificacion_publica`; **no** tienen triggers de invalidación (`0003`).

**Razón**: la frescura por grupo crítico (B4) y la proveniencia con fuente/evidencia (§3.4) existen
porque un dato cívico erróneo (requisito, costo, teléfono de una dependencia) tiene consecuencias
para el ciudadano. El contenido turístico es de menor riesgo; su frescura se comunica con
`<DisclaimerOficial />` ("confirma horarios antes de acudir") y, donde importa, con
`actualizado_en`. Cargar el aparato completo encarecería la captura sin beneficio proporcional.

**Qué SÍ se respeta** (reglas duras, no negociables):
- **B2** — `estado estado_editorial` en toda entidad publicable; público solo lee `'publicado'`.
- **B7** — sin FKs polimórficas: `ruta_lugares` con FK reales.
- **RLS** — habilitado en todas las tablas; `pub_*` para anon sobre `estado='publicado'`;
  `ruta_lugares` demuestra ruta publicada; `*_reportes` privados (escritura por service role).
- **Slugs** inmutables una vez publicados.

> Para una auditoría: la ausencia de `*_verificaciones` en estos módulos **no** es un incumplimiento
> de B4/B7 — es una decisión de producto documentada aquí. B4 aplica al modelo cívico congelado v1.
