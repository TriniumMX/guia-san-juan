import { agregarImagen, eliminarImagen } from './descubrimiento-actions';
import { imagenPublica, listaImagenes } from '../../lib/imagenes';

const IMG_MSG = {
  ok: { clase: 'admin-ok', texto: '✓ Imagen subida.' },
  sinarchivo: { clase: 'pf-file-err', texto: 'Elige una imagen.' },
  tipo: { clase: 'pf-file-err', texto: 'El archivo debe ser JPG, PNG o WEBP.' },
  grande: { clase: 'pf-file-err', texto: 'La imagen supera el límite de 5 MB.' },
  error: { clase: 'pf-file-err', texto: 'No se pudo subir la imagen. Intenta de nuevo.' },
};

// Sección de imágenes reutilizable para los módulos de descubrimiento.
// tipo ∈ 'lugar' | 'evento' | 'ruta' | 'recomendacion'. Sin JS de cliente.
export default function ImagenesAdmin({ tipo, id, imagenes, msg }) {
  const lista = listaImagenes(imagenes);
  const aviso = IMG_MSG[msg];
  return (
    <section className="admin-section">
      <h2 className="admin-section-title">Imágenes</h2>
      <p className="admin-muted">Sube fotos (JPG, PNG o WEBP). Máx. 5 MB por imagen. La primera se usa como portada.</p>
      {aviso && <p className={aviso.clase}>{aviso.texto}</p>}
      {lista.length === 0 ? <p className="admin-muted">Sin imágenes.</p> : (
        <ul className="admin-galeria">
          {lista.map((img) => (
            <li key={img.ruta} className="admin-galeria-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagenPublica(img.ruta)} alt={img.alt || ''} />
              <form action={eliminarImagen}>
                <input type="hidden" name="tipo" value={tipo} />
                <input type="hidden" name="id" value={id} />
                <input type="hidden" name="ruta" value={img.ruta} />
                <button className="admin-link admin-link--danger" type="submit">Quitar</button>
              </form>
            </li>
          ))}
        </ul>
      )}
      <form action={agregarImagen} encType="multipart/form-data" className="req-add">
        <input type="hidden" name="tipo" value={tipo} />
        <input type="hidden" name="id" value={id} />
        <input name="archivo" aria-label="Imagen" type="file" accept="image/jpeg,image/png,image/webp" className="pf-field" required />
        <input name="alt" aria-label="Texto alternativo" className="pf-field" placeholder="Descripción de la imagen (accesibilidad, opcional)" />
        <button className="btn btn--ghost" type="submit">Subir imagen</button>
      </form>
    </section>
  );
}
