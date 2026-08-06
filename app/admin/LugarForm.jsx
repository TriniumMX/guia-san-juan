'use client';
import { useActionState } from 'react';
import { crearLugar, actualizarLugar } from './descubrimiento-actions';

const CATEGORIAS = ['Templo', 'Plaza', 'Museo', 'Parque', 'Mirador', 'Mercado', 'Monumento', 'Restaurante', 'Otro'];

export default function LugarForm({ lugar }) {
  const editar = !!lugar;
  const [state, action, pending] = useActionState(editar ? actualizarLugar : crearLugar, null);

  return (
    <form action={action} className="pf-form">
      {editar && <input type="hidden" name="id" value={lugar.id} />}

      <div className="pf-row">
        <label className="pf-label" htmlFor="l-nombre">Nombre</label>
        <input id="l-nombre" name="nombre" className="pf-field" defaultValue={lugar?.nombre || ''} maxLength={160} required />
      </div>

      {!editar && (
        <div className="pf-row">
          <label className="pf-label" htmlFor="l-slug">Slug (opcional)</label>
          <input id="l-slug" name="slug" className="pf-field" placeholder="se genera del nombre" />
        </div>
      )}

      <div className="pf-row">
        <label className="pf-label" htmlFor="l-cat">Categoría</label>
        <input id="l-cat" name="categoria" className="pf-field" defaultValue={lugar?.categoria || ''} list="cat-lugares" placeholder="ej. Templo, Plaza, Parque…" />
        <datalist id="cat-lugares">{CATEGORIAS.map((c) => <option key={c} value={c} />)}</datalist>
      </div>

      {editar && (
        <>
          <div className="pf-row">
            <label className="pf-label" htmlFor="l-resumen">Resumen</label>
            <input id="l-resumen" name="resumen" className="pf-field" defaultValue={lugar.resumen || ''} placeholder="Una línea que describe el lugar" />
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="l-desc">Descripción (Markdown)</label>
            <textarea id="l-desc" name="descripcion_md" className="pf-field pf-textarea" defaultValue={lugar.descripcion_md || ''} />
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="l-dir">Dirección</label>
            <input id="l-dir" name="direccion" className="pf-field" defaultValue={lugar.direccion || ''} />
          </div>
          <div className="pf-row pf-row--2">
            <div>
              <label className="pf-label" htmlFor="l-lat">Latitud</label>
              <input id="l-lat" name="lat" className="pf-field" defaultValue={lugar.lat ?? ''} inputMode="decimal" />
            </div>
            <div>
              <label className="pf-label" htmlFor="l-lng">Longitud</label>
              <input id="l-lng" name="lng" className="pf-field" defaultValue={lugar.lng ?? ''} inputMode="decimal" />
            </div>
          </div>
          <span className="pf-note">Tip: guarda la dirección y usa el botón “Buscar coordenadas” de abajo para llenar lat/lng automáticamente.</span>
          <div className="pf-row">
            <label className="pf-label" htmlFor="l-hor">Horario (texto)</label>
            <input id="l-hor" name="horario_texto" className="pf-field" defaultValue={lugar.horario_texto || ''} placeholder="ej. Lun–Dom 9:00–18:00" />
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="l-costo">Costo (texto)</label>
            <input id="l-costo" name="costo_texto" className="pf-field" defaultValue={lugar.costo_texto || ''} placeholder="ej. Entrada libre / $30" />
          </div>
          <div className="pf-row pf-row--2">
            <div>
              <label className="pf-label" htmlFor="l-tel">Teléfono</label>
              <input id="l-tel" name="telefono" className="pf-field" defaultValue={lugar.telefono || ''} />
            </div>
            <div>
              <label className="pf-label" htmlFor="l-web">Sitio web</label>
              <input id="l-web" name="sitio_web" className="pf-field" defaultValue={lugar.sitio_web || ''} placeholder="https://" />
            </div>
          </div>
        </>
      )}

      {state?.error && <p className="pf-file-err">{state.error}</p>}
      {state?.ok && <p className="admin-ok">✓ Guardado.</p>}

      <div className="pf-footer">
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? 'Guardando…' : editar ? 'Guardar cambios' : 'Crear lugar'}
        </button>
      </div>
    </form>
  );
}
