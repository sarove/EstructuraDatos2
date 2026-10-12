import { Link, useLocation } from 'react-router-dom';
import { rutaPorLink } from '../menu.js';

/**
 * Migas de pan: camino desde la raíz hasta el ítem actual,
 * calculado con rutaHasta() sobre el árbol N-ario.
 */
export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const ruta = rutaPorLink(pathname);

  return (
    <nav className="breadcrumbs" aria-label="Ruta en el árbol">
      {ruta.map((nodo, i) => {
        const ultimo = i === ruta.length - 1;
        return (
          <span key={nodo.valor.id} className="crumb">
            {ultimo ? (
              <strong>{nodo.valor.title}</strong>
            ) : (
              <Link to={nodo.valor.link}>{nodo.valor.title}</Link>
            )}
            {!ultimo && <span className="sep">›</span>}
          </span>
        );
      })}
    </nav>
  );
}
