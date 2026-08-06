'use client';
import { useActionState } from 'react';
import { crearRuta, actualizarRuta } from './descubrimiento-actions';

export default function RutaForm({ ruta }) {
  const editar = !!ruta;
  const [state, action, pending] = useActionState(editar ? actualizarRuta : crearRuta, null);

  return (
    <form action={action} className="pf-form">
      {editar && <input type="hidden" name="id" value={ruta.id} />}

      <div className="pf-row">
        <label className="pf-label" htmlFor="r-nombre">Nombre</label>
        <input id="r-nombre" name="nombre" className="pf-field" defaultValue={ruta?.nombre || ''} maxLength={160} required />
      </div>

      {!editar && (
        <div className="pf-row">
          <label className="pf-label" htmlFor="r-slug">Slug (opcional)</label>
          <input id="r-slug" name="slug" className="pf-field" placeholder="se genera del nombre" />
        </div>
      )}

      {editar && (
        <>
          <div className="pf-row">
            <label className="pf-label" htmlFor="r-dur">Duración (texto)</label>
            <input id="r-dur" name="duracion_texto" className="pf-field" defaultValue={ruta.duracion_texto || ''} placeholder="ej. 2 horas / medio día" />
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="r-resumen">Resumen</label>
            <input id="r-resumen" name="resumen" className="pf-field" defaultValue={ruta.resumen || ''} />
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="r-desc">Descripción (Markdown)</label>
            <textarea id="r-desc" name="descripcion_md" className="pf-field pf-textarea" defaultValue={ruta.descripcion_md || ''} />
          </div>
        </>
      )}

      {state?.error && <p className="pf-file-err">{state.error}</p>}
      {state?.ok && <p className="admin-ok">✓ Guardado.</p>}

      <div className="pf-footer">
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? 'Guardando…' : editar ? 'Guardar cambios' : 'Crear ruta'}
        </button>
      </div>
    </form>
  );
}
