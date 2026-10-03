import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-badge">03</span>
          <span>Challenge · Listas</span>
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end className={linkClass}>
            Inicio
          </NavLink>
          <NavLink to="/lista-enlazada" className={linkClass}>
            Lista enlazada
          </NavLink>
          <NavLink to="/lista-doblemente-enlazada" className={linkClass}>
            Lista doblemente enlazada
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
