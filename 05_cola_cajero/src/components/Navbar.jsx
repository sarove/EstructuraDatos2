import { NavLink } from 'react-router-dom';
import { useAtmQueue } from '../context/AtmQueueContext.jsx';

export default function Navbar() {
  const { size } = useAtmQueue();
  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-badge">05</span>
          <span>Challenge · Colas</span>
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end className={linkClass}>
            🏧 Cola del cajero <span className="pill">{size}</span>
          </NavLink>
          <NavLink to="/nueva-persona" className={linkClass}>
            ➕ Nueva persona
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
