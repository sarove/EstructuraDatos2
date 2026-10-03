import { NavLink } from 'react-router-dom';

/**
 * ÍTEM DEL MENÚ LATERAL - componente RECURSIVO
 * Imprime un nodo del árbol y, si tiene hijos y está desplegado,
 * se llama a sí mismo para cada hijo (DFS en preorden: primero el
 * nodo padre y luego sus hijos, de izquierda a derecha).
 * Estudiante: Salvador Rodriguez Velasco
 */
export default function SidebarItem({ nodo, nivel, expandidos, onAlternar, onAbrir }) {
  const { id, title, link, icon } = nodo.valor;
  const tieneHijos = !nodo.esHoja();
  const abierto = expandidos.has(id);

  // Sangría según el nivel del nodo en el árbol
  const sangria = { paddingLeft: `${14 + (nivel - 1) * 18}px` };
  const claseLink = ({ isActive }) =>
    ['menu-link', `nivel-${nivel}`, isActive ? 'active' : ''].join(' ');

  // Caso base: nodo HOJA -> solo un enlace
  if (!tieneHijos) {
    return (
      <li>
        <NavLink to={link} end className={claseLink} style={sangria}>
          <span className="item-icon">{icon}</span>
          <span className="item-title">{title}</span>
        </NavLink>
      </li>
    );
  }

  // Caso recursivo: nodo con HIJOS -> enlace + flecha + submenú
  return (
    <li className={abierto ? 'has-children open' : 'has-children'}>
      <div className="menu-row">
        <NavLink to={link} end className={claseLink} style={sangria} onClick={() => onAbrir(id)}>
          <span className="item-icon">{icon}</span>
          <span className="item-title">{title}</span>
          <span className="child-count">{nodo.hijos.length}</span>
        </NavLink>
        <button
          className="caret"
          onClick={() => onAlternar(id)}
          aria-expanded={abierto}
          aria-label={`${abierto ? 'Contraer' : 'Desplegar'} ${title}`}
        >
          ▾
        </button>
      </div>

      {abierto && (
        <ul className="menu-list submenu">
          {nodo.hijos.map((hijo) => (
            <SidebarItem
              key={hijo.valor.id}
              nodo={hijo}
              nivel={nivel + 1}
              expandidos={expandidos}
              onAlternar={onAlternar}
              onAbrir={onAbrir}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
