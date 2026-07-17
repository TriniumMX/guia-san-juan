'use client';
import { useId, useState } from 'react';
import { reportarDato } from '../app/reportes-actions';

export default function ReportarDato({ tipo, id }) {
  const [abierto, setAbierto] = useState(false);
  const [msg, setMsg] = useState('');
  const [estado, setEstado] = useState('idle'); // idle | enviando | ok | error
  const [error, setError] = useState('');
  const campoId = useId();

  async function enviar(e) {
    e.preventDefault();
    if (e.currentTarget.sitio_web.value) { setEstado('ok'); return; } // honeypot
    setEstado('enviando'); setError('');
    const res = await reportarDato(tipo, id, msg, false);
    if (res.ok) setEstado('ok');
    else { setEstado('error'); setError(res.error || 'No se pudo enviar.'); }
  }

  if (estado === 'ok') {
    return (
      <div className="reportar reportar--ok" role="status">
        ✓ Gracias por avisar. Revisaremos este dato.
      </div>
    );
  }

  return (
    <div className="reportar">
      {!abierto ? (
        <button type="button" className="reportar-toggle" onClick={() => setAbierto(true)}>
          ¿Encontraste un dato incorrecto? Repórtalo
        </button>
      ) : (
        <form className="reportar-form" onSubmit={enviar}>
          <label className="pf-label" htmlFor={campoId}>¿Qué dato está mal?</label>
          <textarea
            id={campoId}
            className="pf-field pf-textarea"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Ej. el teléfono ya no funciona, el costo cambió…"
            rows={3}
            required
            minLength={5}
            maxLength={1000}
          />
          {/* Honeypot anti-spam */}
          <input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
          {error && <p className="pf-file-err">{error}</p>}
          <div className="reportar-acciones">
            <button type="button" className="btn btn--ghost" onClick={() => setAbierto(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={estado === 'enviando'}>
              {estado === 'enviando' ? 'Enviando…' : 'Enviar reporte'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
