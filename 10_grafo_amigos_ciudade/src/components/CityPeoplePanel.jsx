import { cityColorMap } from '../data/toD3Data.js';

/**
 * Imprime la lista de personas que viven en la ciudad seleccionada.
 * La lista sale de graph.peopleInCity(ciudad): los vecinos de tipo
 * persona del nodo ciudad en la lista de adyacencia.
 */
export default function CityPeoplePanel({ graph, cityId, selectedPersonId, onSelectCity, onSelectPerson, onPrint }) {
  const colors = cityColorMap(graph);
  const cities = graph.cities();
  const city = cityId ? graph.searchNode(cityId) : null;
  const people = city ? graph.peopleInCity(city.id) : [];
  const promedio = people.length ? (people.reduce((s, p) => s + p.age, 0) / people.length).toFixed(1) : null;

  return (
    <div className="panel city-panel">
      <h3>Personas por ciudad</h3>
      <div className="chips" role="tablist" aria-label="Ciudades">
        {cities.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={c.id === cityId}
            className={c.id === cityId ? 'chip active' : 'chip'}
            style={{ '--c': colors[c.id] }}
            onClick={() => onSelectCity(c.id)}
          >
            <span className="swatch" />
            {c.name}
            <span className="count">{graph.peopleInCity(c.id).length}</span>
          </button>
        ))}
      </div>

      {city ? (
        <>
          <div className="city-title" style={{ '--c': colors[city.id] }}>
            <span className="swatch big" />
            <div>
              <strong>Viven en {city.name}</strong>
              <span className="muted small">
                {people.length} persona(s){promedio && ` · edad promedio ${promedio} años`}
              </span>
            </div>
          </div>

          {people.length === 0 ? (
            <p className="muted small empty">Nadie vive todavía en {city.name}.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>Amigos</th>
                </tr>
              </thead>
              <tbody>
                {people.map((p, i) => (
                  <tr
                    key={p.id}
                    className={p.id === selectedPersonId ? 'row-selected' : ''}
                    onClick={() => onSelectPerson(p.id)}
                  >
                    <td>{i + 1}</td>
                    <td>
                      <button className="link-btn" onClick={() => onSelectPerson(p.id)}>
                        {p.name}
                      </button>
                    </td>
                    <td>{p.age}</td>
                    <td>{graph.friendsOf(p.id).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button className="btn btn-small" onClick={() => onPrint(city.id)}>
            🖨 Imprimir en consola
          </button>
        </>
      ) : (
        <p className="muted small">Seleccione una ciudad (aquí o en el grafo).</p>
      )}
    </div>
  );
}
