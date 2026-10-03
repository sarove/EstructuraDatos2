import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { arbolMenu } from './menu.js';
import Sidebar from './components/Sidebar.jsx';
import Breadcrumbs from './components/Breadcrumbs.jsx';

/**
 * Componente raíz.
 * Las RUTAS no se escriben a mano: se generan recorriendo el árbol de
 * menús con DFS. Cada nodo aporta su "link" (path) y su "component".
 * Estudiante: Salvador Rodriguez Velasco
 */
const rutas = arbolMenu.dfs(() => {});

export default function App() {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // En pantallas pequeñas, cerrar el menú al navegar
  useEffect(() => {
    setMenuAbierto(false);
  }, [location.pathname]);

  return (
    <div className="layout">
      <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />

      <div className="main">
        <header className="topbar">
          <button
            className="menu-toggle"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <Breadcrumbs />
        </header>

        <main className="content">
          <Routes>
            {rutas.map(({ nodo, nivel }) => {
              const { id, link, component: Componente } = nodo.valor;
              return (
                <Route
                  key={id}
                  path={link}
                  element={<Componente nodo={nodo} nivel={nivel} />}
                />
              );
            })}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="footer">
          <strong>Salvador Rodriguez Velasco</strong> · Ingeniería Informática · Universidad Autónoma de
          Occidente · Estructuras de Datos y Algoritmos II · Challenge 09 – Árboles
        </footer>
      </div>
    </div>
  );
}
