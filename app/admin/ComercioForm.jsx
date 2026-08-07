'use client';
import { useActionState } from 'react';
import { crearComercio, actualizarComercio } from './descubrimiento-actions';

const GIROS = ['Restaurante', 'Café', 'Bar', 'Tienda', 'Abarrotes', 'Servicios', 'Belleza', 'Salud', 'Hospedaje', 'Taller', 'Otro'];

export default function ComercioForm({ comercio }) {
  const editar = !!comercio;
  const [state, action, pending] = useActionState(editar ? actualizarComercio : crearComercio, null);

  return (
    <form action={action} className="pf-form">
      {editar && <input type="hidden" name="id" value={comercio.id} />}

      <div className="pf-row">
        <label className="pf-label" htmlFor="c-nombre">Nombre</label>
        <input id="c-nombre" name="nombre" className="pf-field" defaultValue={comercio?.nombre || ''} maxLength={160} required />
      </div>

      {!editar && (
        <div className="pf-row">
          <label className="pf-label" htmlFor="c-slug">Slug (opcional)</label>
          <input id="c-slug" name="slug" className="pf-field" placeholder="se genera del nombre" />
        </div>
      )}

      <div className="pf-row">
        <label className="pf-label" htmlFor="c-giro">Giro</label>
        <input id="c-giro" name="giro" className="pf-field" defaultValue={comercio?.giro || ''} list="giros-comercio" placeholder="ej. Restaurante, Tienda, Servicios…" />
        <datalist id="giros-comercio">{GIROS.map((g) => <option key={g} value={g} />)}</datalist>
      </div>

      {editar && (
        <>
          <label className="admin-check">
            <input type="checkbox" name="destacado" defaultChecked={!!comercio.destacado} />
            Destacado (aparece primero, con sello)
          </label>
          <div className="pf-row">
            <label className="pf-label" htmlFor="c-resumen">Resumen</label>
            <input id="c-resumen" name="resumen" className="pf-field" defaultValue={comercio.resumen || ''} placeholder="Una línea que describe el negocio" />
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="c-desc">Descripción (Markdown)</label>
            <textarea id="c-desc" name="descripcion_md" className="pf-field pf-textarea" defaultValue={comercio.descripcion_md || ''} />
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="c-dir">Dirección</label>
            <input id="c-dir" name="direccion" className="pf-field" defaultValue={comercio.direccion || ''} />
          </div>
          <div className="pf-row pf-row--2">
            <div>
              <label className="pf-label" htmlFor="c-lat">Latitud</label>
              <input id="c-lat" name="lat" className="pf-field" defaultValue={comercio.lat ?? ''} inputMode="decimal" />
            </div>
            <div>
              <label className="pf-label" htmlFor="c-lng">Longitud</label>
              <input id="c-lng" name="lng" className="pf-field" defaultValue={comercio.lng ?? ''} inputMode="decimal" />
            </div>
          </div>
          <span className="pf-note">Tip: guarda la dirección y usa “Buscar coordenadas” abajo para llenar lat/lng.</span>
          <div className="pf-row">
            <label className="pf-label" htmlFor="c-hor">Horario (texto)</label>
            <input id="c-hor" name="horario_texto" className="pf-field" defaultValue={comercio.horario_texto || ''} placeholder="ej. Lun–Sáb 9:00–20:00" />
          </div>
          <div className="pf-row pf-row--2">
            <div>
              <label className="pf-label" htmlFor="c-tel">Teléfono</label>
              <input id="c-tel" name="telefono" className="pf-field" defaultValue={comercio.telefono || ''} />
            </div>
            <div>
              <label className="pf-label" htmlFor="c-wa">WhatsApp</label>
              <input id="c-wa" name="whatsapp" className="pf-field" defaultValue={comercio.whatsapp || ''} placeholder="10 dígitos" />
            </div>
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="c-web">Sitio web</label>
            <input id="c-web" name="sitio_web" className="pf-field" defaultValue={comercio.sitio_web || ''} placeholder="https://" />
          </div>
          <div className="pf-row pf-row--2">
            <div>
              <label className="pf-label" htmlFor="c-fb">Facebook</label>
              <input id="c-fb" name="facebook" className="pf-field" defaultValue={comercio.facebook || ''} placeholder="https://facebook.com/…" />
            </div>
            <div>
              <label className="pf-label" htmlFor="c-ig">Instagram</label>
              <input id="c-ig" name="instagram" className="pf-field" defaultValue={comercio.instagram || ''} placeholder="https://instagram.com/…" />
            </div>
          </div>
        </>
      )}

      {state?.error && <p className="pf-file-err">{state.error}</p>}
      {state?.ok && <p className="admin-ok">✓ Guardado.</p>}

      <div className="pf-footer">
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? 'Guardando…' : editar ? 'Guardar cambios' : 'Crear comercio'}
        </button>
      </div>
    </form>
  );
}
