'use client';
import { useActionState, useState } from 'react';
import { crearTramite, actualizarTramite } from './contenido-actions';

const GRUPOS = ['requisitos', 'costos', 'contacto', 'ubicacion', 'horarios_propios', 'representacion'];
const EDITORIALES = ['requisitos', 'costos', 'contacto', 'ubicacion', 'horarios_propios'];

// Normaliza el jsonb (retrocompatible: strings antiguos → { titulo, detalle }).
function normReqs(requisitos) {
  if (!Array.isArray(requisitos)) return [];
  return requisitos.map((r) =>
    typeof r === 'string' ? { titulo: r, detalle: '' } : { titulo: r?.titulo || '', detalle: r?.detalle || '' },
  );
}

export default function TramiteForm({ tramite, dependencias = [], categorias = [] }) {
  const editar = !!tramite;
  const [state, action, pending] = useActionState(editar ? actualizarTramite : crearTramite, null);
  const obligatorios = new Set(tramite?.grupos_obligatorios || []);

  const [reqs, setReqs] = useState(normReqs(tramite?.requisitos));
  const setReq = (i, campo, val) => setReqs((prev) => prev.map((r, j) => (j === i ? { ...r, [campo]: val } : r)));
  const addReq = () => setReqs((prev) => [...prev, { titulo: '', detalle: '' }]);
  const delReq = (i) => setReqs((prev) => prev.filter((_, j) => j !== i));
  // Se serializa limpio: sin renglones vacíos y sin campo detalle si está vacío.
  const reqsJson = JSON.stringify(
    reqs
      .map((r) => ({ titulo: r.titulo.trim(), detalle: r.detalle.trim() }))
      .filter((r) => r.titulo)
      .map((r) => (r.detalle ? r : { titulo: r.titulo })),
  );

  return (
    <form action={action} className="pf-form">
      {editar && <input type="hidden" name="id" value={tramite.id} />}

      <div className="pf-row">
        <label className="pf-label" htmlFor="t-nombre">Nombre</label>
        <input id="t-nombre" name="nombre" className="pf-field" defaultValue={tramite?.nombre || ''} maxLength={200} required />
      </div>

      {!editar && (
        <div className="pf-row">
          <label className="pf-label" htmlFor="t-slug">Slug (opcional)</label>
          <input id="t-slug" name="slug" className="pf-field" placeholder="se genera del nombre" />
        </div>
      )}

      <div className="pf-row">
        <label className="pf-label" htmlFor="t-dep">Dependencia</label>
        <select id="t-dep" name="dependencia_id" className="pf-field" defaultValue={tramite?.dependencia_id || ''}>
          <option value="">— sin asignar —</option>
          {dependencias.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
        </select>
      </div>

      {editar && (
        <>
          <div className="pf-row">
            <label className="pf-label" htmlFor="t-cat">Categoría</label>
            <select id="t-cat" name="categoria_id" className="pf-field" defaultValue={tramite.categoria_id || ''}>
              <option value="">— sin categoría —</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="t-resumen">Resumen</label>
            <input id="t-resumen" name="resumen" className="pf-field" defaultValue={tramite.resumen || ''} />
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="t-tiempo">Tiempo estimado</label>
            <input id="t-tiempo" name="tiempo_estimado" className="pf-field" defaultValue={tramite.tiempo_estimado || ''} placeholder="ej. 3 días hábiles" />
          </div>
          <div className="pf-row">
            <label className="pf-label">Requisitos</label>
            <input type="hidden" name="requisitos_json" value={reqsJson} />
            {reqs.length === 0 && <p className="pf-note">Sin requisitos aún. Agrega el primero.</p>}
            <div className="req-editor">
              {reqs.map((r, i) => (
                <div key={i} className="req-editor-row">
                  <input
                    className="pf-field"
                    aria-label={`Requisito ${i + 1}`}
                    placeholder="Nombre del requisito (ej. Acta de nacimiento)"
                    value={r.titulo}
                    onChange={(e) => setReq(i, 'titulo', e.target.value)}
                  />
                  <textarea
                    className="pf-field pf-textarea req-editor-detalle"
                    aria-label={`Detalle del requisito ${i + 1}`}
                    placeholder="Detalle (opcional): especificaciones, cantidad, condiciones…"
                    value={r.detalle}
                    onChange={(e) => setReq(i, 'detalle', e.target.value)}
                  />
                  <div className="req-editor-acciones">
                    <button type="button" className="admin-link admin-link--danger" onClick={() => delReq(i)}>Quitar</button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn--ghost" onClick={addReq}>+ Agregar requisito</button>
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="t-desc">Descripción (Markdown)</label>
            <textarea id="t-desc" name="descripcion_md" className="pf-field pf-textarea" defaultValue={tramite.descripcion_md || ''} />
          </div>
          <div className="pf-row">
            <label className="pf-label">Grupos obligatorios para publicar (B8)</label>
            <div className="admin-checks">
              {GRUPOS.map((g) => (
                <label key={g} className={`admin-check${EDITORIALES.includes(g) ? '' : ' admin-check--comercial'}`}>
                  <input type="checkbox" name={`grupo_${g}`} defaultChecked={obligatorios.has(g)} />
                  {g}{g === 'representacion' ? ' (comercial)' : ''}
                </label>
              ))}
            </div>
            <span className="pf-note">Marca los grupos editoriales que deben estar verificados para poder publicar la ficha.</span>
          </div>
        </>
      )}

      {state?.error && <p className="pf-file-err">{state.error}</p>}
      {state?.ok && <p className="admin-ok">✓ Guardado.</p>}

      <div className="pf-footer">
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? 'Guardando…' : editar ? 'Guardar cambios' : 'Crear trámite'}
        </button>
      </div>
    </form>
  );
}
