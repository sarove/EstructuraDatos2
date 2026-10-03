import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

/**
 * PÁGINA DE SECCIÓN: la usan los nodos que tienen hijos (submenús).
 * Lista los hijos del nodo como tarjetas navegables.
 */
export default function SectionPage({ nodo, nivel }) {
  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        Este menú es un nodo <strong>rama</strong> con {nodo.hijos.length} hijos. Seleccione un
        submenú:
      </PageHeader>

      <div className="cards">
        {nodo.hijos.map((hijo) => (
          <Link key={hijo.valor.id} to={hijo.valor.link} className="card">
            <span className="card-icon">{hijo.valor.icon}</span>
            <strong>{hijo.valor.title}</strong>
            <span className="mono small muted">{hijo.valor.link}</span>
            <span className="small muted">
              {hijo.esHoja() ? 'Hoja' : `Rama · ${hijo.hijos.length} submenús`}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
