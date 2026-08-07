// Generadores de JSON-LD desde filas de Supabase (PLAN.md §3.1).
// Uso semántico, no como promesa de rich results.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://guiasanjuan.mx';

export function breadcrumbList(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function tramiteSchema(tramite, dependencia) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: tramite.nombre,
    description: tramite.resumen || undefined,
    url: `${SITE_URL}/tramites/${tramite.slug}`,
    inLanguage: 'es-MX',
    areaServed: { '@type': 'City', name: 'San Juan del Río' },
  };
  if (dependencia) {
    schema.serviceOperator = {
      '@type': 'GovernmentOffice',
      name: dependencia.nombre,
      url: `${SITE_URL}/dependencias/${dependencia.slug}`,
    };
  }
  return schema;
}

export function guiaSchema(guia) {
  // Article semántico (§3.1: HowTo solo semántico, sin venderlo como rich result).
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guia.titulo,
    description: guia.resumen || undefined,
    url: `${SITE_URL}/guias/${guia.slug}`,
    inLanguage: 'es-MX',
    datePublished: guia.publicado_en || undefined,
    dateModified: guia.actualizado_en || undefined,
    author: { '@type': 'Organization', name: 'Guía San Juan' },
  };
}

// ── Módulos de descubrimiento (turismo) ─────────────────────────────────────
export function lugarSchema(lugar) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: lugar.nombre,
    description: lugar.resumen || undefined,
    url: `${SITE_URL}/lugares/${lugar.slug}`,
    inLanguage: 'es-MX',
  };
  if (lugar.direccion) {
    schema.address = { '@type': 'PostalAddress', streetAddress: lugar.direccion, addressLocality: 'San Juan del Río', addressRegion: 'Querétaro', addressCountry: 'MX' };
  }
  if (lugar.lat != null && lugar.lng != null) {
    schema.geo = { '@type': 'GeoCoordinates', latitude: lugar.lat, longitude: lugar.lng };
  }
  return schema;
}

export function eventoSchema(evento, lugar) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: evento.nombre,
    description: evento.resumen || undefined,
    url: `${SITE_URL}/eventos/${evento.slug}`,
    inLanguage: 'es-MX',
    startDate: evento.fecha_inicio || undefined,
    endDate: evento.fecha_fin || undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  };
  const nombreLugar = lugar?.nombre || evento.ubicacion_texto;
  if (nombreLugar) {
    schema.location = {
      '@type': 'Place',
      name: nombreLugar,
      address: { '@type': 'PostalAddress', addressLocality: 'San Juan del Río', addressRegion: 'Querétaro', addressCountry: 'MX' },
    };
  }
  if (evento.organizador) schema.organizer = { '@type': 'Organization', name: evento.organizador };
  return schema;
}

export function rutaSchema(ruta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: ruta.nombre,
    description: ruta.resumen || undefined,
    url: `${SITE_URL}/rutas/${ruta.slug}`,
    inLanguage: 'es-MX',
  };
}

export function comercioSchema(comercio) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: comercio.nombre,
    description: comercio.resumen || undefined,
    url: `${SITE_URL}/comercios/${comercio.slug}`,
    inLanguage: 'es-MX',
  };
  if (comercio.direccion) {
    schema.address = { '@type': 'PostalAddress', streetAddress: comercio.direccion, addressLocality: 'San Juan del Río', addressRegion: 'Querétaro', addressCountry: 'MX' };
  }
  if (comercio.lat != null && comercio.lng != null) {
    schema.geo = { '@type': 'GeoCoordinates', latitude: comercio.lat, longitude: comercio.lng };
  }
  if (comercio.telefono) schema.telephone = comercio.telefono;
  if (comercio.sitio_web) schema.sameAs = [comercio.sitio_web, comercio.facebook, comercio.instagram].filter(Boolean);
  return schema;
}

export function recomendacionSchema(rec) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: rec.titulo,
    description: rec.resumen || undefined,
    url: `${SITE_URL}/recomendaciones/${rec.slug}`,
    inLanguage: 'es-MX',
    dateModified: rec.actualizado_en || undefined,
    author: { '@type': 'Organization', name: 'Guía San Juan' },
  };
}

export function dependenciaSchema(dep, telefonos = []) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOffice',
    name: dep.nombre,
    description: dep.descripcion || undefined,
    url: `${SITE_URL}/dependencias/${dep.slug}`,
    inLanguage: 'es-MX',
  };
  if (dep.direccion) {
    schema.address = { '@type': 'PostalAddress', streetAddress: dep.direccion, addressLocality: 'San Juan del Río', addressRegion: 'Querétaro', addressCountry: 'MX' };
  }
  if (dep.lat != null && dep.lng != null) {
    schema.geo = { '@type': 'GeoCoordinates', latitude: dep.lat, longitude: dep.lng };
  }
  const tel = telefonos.find((t) => t.numero);
  if (tel) schema.telephone = tel.numero;
  return schema;
}
