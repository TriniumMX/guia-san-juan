'use client';
import { usePathname } from 'next/navigation';

// Dos clasificaciones: contenido cívico (trámites y servicios) y descubrimiento (turismo).
const GRUPOS = [
  {
    label: 'Trámites y servicios',
    items: [
      { href: '/admin', label: 'Propuestas' },
      { href: '/admin/dependencias', label: 'Dependencias' },
      { href: '/admin/tramites', label: 'Trámites' },
      { href: '/admin/directorio', label: 'Directorio' },
      { href: '/admin/guias', label: 'Guías' },
      { href: '/admin/verificacion', label: 'Verificación' },
    ],
  },
  {
    label: 'Descubrimiento',
    items: [
      { href: '/admin/lugares', label: 'Lugares' },
      { href: '/admin/eventos', label: 'Eventos' },
      { href: '/admin/rutas', label: 'Rutas' },
      { href: '/admin/recomendaciones', label: 'Recomendaciones' },
    ],
  },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav className="admin-nav" aria-label="Secciones del panel">
      {GRUPOS.map((grupo) => (
        <div key={grupo.label} className="admin-nav-grupo">
          <span className="admin-nav-label">{grupo.label}</span>
          {grupo.items.map((sec) => {
            const activo = sec.href === '/admin' ? path === '/admin' : path.startsWith(sec.href);
            return (
              <a key={sec.href} href={sec.href} className={`admin-nav-link${activo ? ' active' : ''}`}>
                {sec.label}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
