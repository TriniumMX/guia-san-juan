'use client';
import { useActionState } from 'react';
import { crearEvento, actualizarEvento } from './descubrimiento-actions';

const CATEGORIAS = ['Cultural', 'Feria', 'Música', 'Deportivo', 'Familiar', 'Gastronómico', 'Religioso', 'Cívico', 'Otro'];

export default function EventoForm({ evento, lugares = [] }) {
  const editar = !!evento;
  const [state, action, pending] = useActionState(editar ? actualizarEvento : crearEvento, null);

  return (
    <form action={action} className="pf-form">
      {editar && <input type="hidden" name="id" value={evento.id} />}

      <div className="pf-row">
        <label className="pf-label" htmlFor="e-nombre">Nombre</label>
        <input id="e-nombre" name="nombre" className="pf-field" defaultValue={evento?.nombre || ''} maxLength={200} required />
      </div>

      {!editar && (
        <div className="pf-row">
          <label className="pf-label" htmlFor="e-slug">Slug (opcional)</label>
          <input id="e-slug" name="slug" className="pf-field" placeholder="se genera del nombre" />
        </div>
      )}

      <div className="pf-row pf-row--2">
        <div>
          <label className="pf-label" htmlFor="e-ini">Fecha de inicio</label>
          <input id="e-ini" name="fecha_inicio" type="date" className="pf-field" defaultValue={evento?.fecha_inicio || ''} required />
        </div>
        <div>
          <label className="pf-label" htmlFor="e-fin">Fecha de fin (opcional)</label>
          <input id="e-fin" name="fecha_fin" type="date" className="pf-field" defaultValue={evento?.fecha_fin || ''} />
        </div>
      </div>

      {editar && (
        <>
          <div className="pf-row">
            <label className="pf-label" htmlFor="e-hora">Hora (texto)</label>
            <input id="e-hora" name="hora_texto" className="pf-field" defaultValue={evento.hora_texto || ''} placeholder="ej. 18:00 a 22:00 hrs" />
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="e-lugar">Lugar del catálogo</label>
            <select id="e-lugar" name="lugar_id" className="pf-field" defaultValue={evento.lugar_id || ''}>
              <option value="">— sin lugar del catálogo —</option>
              {lugares.map((l) => <option key={l.id} value={l.id}>{l.nombre}</option>)}
            </select>
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="e-ubi">O ubicación en texto</label>
            <input id="e-ubi" name="ubicacion_texto" className="pf-field" defaultValue={evento.ubicacion_texto || ''} placeholder="si no está en el catálogo de lugares" />
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="e-cat">Categoría</label>
            <input id="e-cat" name="categoria" className="pf-field" defaultValue={evento.categoria || ''} list="cat-eventos" placeholder="ej. Cultural, Feria, Música…" />
            <datalist id="cat-eventos">{CATEGORIAS.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="e-resumen">Resumen</label>
            <input id="e-resumen" name="resumen" className="pf-field" defaultValue={evento.resumen || ''} />
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="e-desc">Detalles (Markdown)</label>
            <textarea id="e-desc" name="descripcion_md" className="pf-field pf-textarea" defaultValue={evento.descripcion_md || ''} />
          </div>
          <div className="pf-row pf-row--2">
            <div>
              <label className="pf-label" htmlFor="e-costo">Costo (texto)</label>
              <input id="e-costo" name="costo_texto" className="pf-field" defaultValue={evento.costo_texto || ''} placeholder="ej. Entrada libre / $50" />
            </div>
            <div>
              <label className="pf-label" htmlFor="e-org">Organiza</label>
              <input id="e-org" name="organizador" className="pf-field" defaultValue={evento.organizador || ''} />
            </div>
          </div>
        </>
      )}

      {state?.error && <p className="pf-file-err">{state.error}</p>}
      {state?.ok && <p className="admin-ok">✓ Guardado.</p>}

      <div className="pf-footer">
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? 'Guardando…' : editar ? 'Guardar cambios' : 'Crear evento'}
        </button>
      </div>
    </form>
  );
}
