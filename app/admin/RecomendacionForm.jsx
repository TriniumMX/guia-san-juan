'use client';
import { useActionState } from 'react';
import { crearRecomendacion, actualizarRecomendacion } from './descubrimiento-actions';

const CATEGORIAS = ['Qué hacer', 'Dónde comer', 'Con niños', 'En pareja', 'Cómo moverte', 'Compras', 'Consejos', 'Otro'];

export default function RecomendacionForm({ recomendacion }) {
  const editar = !!recomendacion;
  const [state, action, pending] = useActionState(editar ? actualizarRecomendacion : crearRecomendacion, null);

  return (
    <form action={action} className="pf-form">
      {editar && <input type="hidden" name="id" value={recomendacion.id} />}

      <div className="pf-row">
        <label className="pf-label" htmlFor="rc-titulo">Título</label>
        <input id="rc-titulo" name="titulo" className="pf-field" defaultValue={recomendacion?.titulo || ''} maxLength={200} required />
      </div>

      {!editar && (
        <div className="pf-row">
          <label className="pf-label" htmlFor="rc-slug">Slug (opcional)</label>
          <input id="rc-slug" name="slug" className="pf-field" placeholder="se genera del título" />
        </div>
      )}

      {editar && (
        <>
          <div className="pf-row">
            <label className="pf-label" htmlFor="rc-cat">Categoría</label>
            <input id="rc-cat" name="categoria" className="pf-field" defaultValue={recomendacion.categoria || ''} list="cat-recos" placeholder="ej. Dónde comer, Con niños…" />
            <datalist id="cat-recos">{CATEGORIAS.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="rc-resumen">Resumen</label>
            <input id="rc-resumen" name="resumen" className="pf-field" defaultValue={recomendacion.resumen || ''} placeholder="Una línea que engancha" />
          </div>
          <div className="pf-row">
            <label className="pf-label" htmlFor="rc-cuerpo">Contenido (Markdown)</label>
            <textarea id="rc-cuerpo" name="cuerpo_md" className="pf-field pf-textarea pf-textarea--alto" defaultValue={recomendacion.cuerpo_md || ''} />
          </div>
        </>
      )}

      {state?.error && <p className="pf-file-err">{state.error}</p>}
      {state?.ok && <p className="admin-ok">✓ Guardado.</p>}

      <div className="pf-footer">
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? 'Guardando…' : editar ? 'Guardar cambios' : 'Crear recomendación'}
        </button>
      </div>
    </form>
  );
}
