/**
 * Detalle de la persona seleccionada: ciudad (arista "vive en"),
 * amigos (aristas de amistad) y acciones sobre sus aristas.
 */
export default function PersonCard({ graph, personId, onMove, onRemove, onSelectPerson, onClose }) {
  const person = graph.searchNode(personId);
  if (!person) return null;
  const city = graph.cityOf(person.id);
  const friends = graph.friendsOf(person.id);

  return (
    <div className="panel person-card">
      <div className="person-head">
        <div className="avatar">{person.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
        <div className="person-info">
          <strong>{person.name}</strong>
          <span className="muted small">
            {person.age} años · id <code>{person.id}</code>
          </span>
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Cerrar detalle">
          ✕
        </button>
      </div>

      <label className="field inline">
        <span>Vive en</span>
        <select value={city?.id ?? ''} onChange={(e) => onMove(person.id, e.target.value)}>
          {graph.cities().map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <p className="small">
        <strong>Amigos ({friends.length}):</strong>{' '}
        {friends.length === 0
          ? 'ninguno'
          : friends.map((f, i) => (
              <span key={f.id}>
                <button className="link-btn" onClick={() => onSelectPerson(f.id)}>
                  {f.name}
                </button>
                {i < friends.length - 1 && ', '}
              </span>
            ))}
      </p>
      <p className="small muted">
        Grado del nodo: {graph.degree(person.id)} (1 ciudad + {friends.length} amigos)
      </p>

      <button className="btn btn-danger btn-small" onClick={() => onRemove(person.id)}>
        Eliminar persona del grafo
      </button>
    </div>
  );
}
