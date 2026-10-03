import { NavLink } from 'react-router-dom';
import { useBookStack } from '../context/BookStackContext.jsx';

export default function Navbar() {
  const { size } = useBookStack();
  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-badge">04</span>
          <span>Challenge · Pilas</span>
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end className={linkClass}>
            📚 Pila de libros <span className="pill">{size}</span>
          </NavLink>
          <NavLink to="/nuevo-libro" className={linkClass}>
            ➕ Nuevo libro
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
