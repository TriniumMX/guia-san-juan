'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// Dos clasificaciones desplegables: contenido cívico y descubrimiento (turismo).
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
  const [abierto, setAbierto] = useState(null); // índice del grupo abierto
  const navRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setAbierto(null); };
    const onKey = (e) => { if (e.key === 'Escape') setAbierto(null); };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => { setAbierto(null); }, [path]); // cerrar al cambiar de ruta

  const activo = (href) => (href === '/admin' ? path === '/admin' : path.startsWith(href));

  return (
    <nav className="admin-nav" aria-label="Secciones del panel" ref={navRef}>
      {GRUPOS.map((grupo, i) => {
        const grupoActivo = grupo.items.some((s) => activo(s.href));
        const open = abierto === i;
        return (
          <div key={grupo.label} className="admin-dd">
            <button
              type="button"
              className={`admin-dd-btn${grupoActivo ? ' active' : ''}${open ? ' open' : ''}`}
              aria-haspopup="true"
              aria-expanded={open}
              onClick={() => setAbierto(open ? null : i)}
            >
              {grupo.label}
              <svg className="admin-dd-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {open && (
              <div className="admin-dd-panel" role="menu">
                {grupo.items.map((sec) => (
                  <a
                    key={sec.href}
                    href={sec.href}
                    role="menuitem"
                    className={`admin-dd-item${activo(sec.href) ? ' active' : ''}`}
                    onClick={() => setAbierto(null)}
                  >
                    {sec.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
