import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { arbolMenu, rutaPorLink } from '../menu.js';
import SidebarItem from './SidebarItem.jsx';

/**
 * MENÚ LATERAL (sidebar)
 * Se construye IMPRIMIENDO el árbol N-ario: por cada hijo de la raíz se
 * dibuja un <SidebarItem>, que a su vez se llama a sí mismo para sus
 * hijos (recorrido DFS recursivo).
 * Estudiante: Salvador Rodriguez Velasco
 */

// ids de todos los nodos que tienen hijos (menús con submenús)
const idsConHijos = arbolMenu
  .dfs(() => {})
  .filter(({ nodo }) => !nodo.esHoja())
  .map(({ nodo }) => nodo.valor.id);

export default function Sidebar({ abierto, onCerrar }) {
  const location = useLocation();
  const raiz = arbolMenu.raiz;

  // Conjunto de ids de los submenús desplegados
  const [expandidos, setExpandidos] = useState(() => new Set());

  // Al cambiar de URL se despliegan los ancestros del ítem activo
  useEffect(() => {
    const ruta = rutaPorLink(location.pathname);
    if (ruta.length === 0) return;
    setExpandidos((prev) => {
      const next = new Set(prev);
      ruta.forEach((nodo) => {
        if (!nodo.esHoja()) next.add(nodo.valor.id);
      });
      return next;
    });
  }, [location.pathname]);

  const alternar = (id) =>
    setExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const abrir = (id) => setExpandidos((prev) => new Set(prev).add(id));

  return (
    <>
      <div className={abierto ? 'backdrop show' : 'backdrop'} onClick={onCerrar} />
      <aside className={abierto ? 'sidebar open' : 'sidebar'} aria-label="Menú lateral">
        <div className="sidebar-brand">
          <span className="brand-badge">09</span>
          <div>
            <strong>Challenge · Árboles</strong>
            <small>Menú desde un árbol N-ario</small>
          </div>
          <button className="sidebar-close" onClick={onCerrar} aria-label="Cerrar menú">
            ✕
          </button>
        </div>

        {/* La raíz del árbol: página de inicio */}
        <NavLink to={raiz.valor.link} end className={({ isActive }) => (isActive ? 'root-link active' : 'root-link')}>
          <span className="item-icon">{raiz.valor.icon}</span>
          {raiz.valor.title}
          <span className="root-tag">raíz</span>
        </NavLink>

        {/* Impresión del árbol: cada hijo de la raíz y, recursivamente, sus submenús */}
        <nav className="sidebar-nav">
          <ul className="menu-list">
            {raiz.hijos.map((hijo) => (
              <SidebarItem
                key={hijo.valor.id}
                nodo={hijo}
                nivel={1}
                expandidos={expandidos}
                onAlternar={alternar}
                onAbrir={abrir}
              />
            ))}
          </ul>
        </nav>

        <div className="sidebar-tools">
          <button onClick={() => setExpandidos(new Set(idsConHijos))}>⊞ Expandir todo</button>
          <button onClick={() => setExpandidos(new Set())}>⊟ Colapsar todo</button>
        </div>

        <div className="sidebar-footer">
          <span>
            {arbolMenu.tamano()} nodos · altura {arbolMenu.altura()} · {arbolMenu.hojas().length} hojas
          </span>
          <span>Salvador Rodriguez Velasco</span>
        </div>
      </aside>
    </>
  );
}
