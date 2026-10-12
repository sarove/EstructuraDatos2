import { useState } from 'react';

/**
 * Las dos representaciones vistas en clase:
 *   - Lista de adyacencia (printGraph)
 *   - Matriz de adyacencia (simétrica en un grafo no dirigido)
 * Estudiante: Salvador Rodriguez Velasco
 */

// Abreviatura para las columnas: "Cali" -> CAL, "Ana María Gómez" -> AMG
const initials = (name) => {
  const words = name.split(' ').filter(Boolean);
  const text = words.length === 1 ? words[0].slice(0, 3) : words.map((w) => w[0]).join('').slice(0, 3);
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
};

export default function AdjacencyPanel({ graph }) {
  const [tab, setTab] = useState('lista');
  const name = (id) => graph.searchNode(id)?.name ?? id;

  // Orden: primero ciudades, luego personas
  const ordered = [...graph.cities(), ...graph.people()];
  const { ids, matrix } = graph.adjacencyMatrix(ordered.map((n) => n.id));

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Representación del grafo</h3>
        <div className="segmented" role="tablist">
          <button role="tab" aria-selected={tab === 'lista'} className={tab === 'lista' ? 'active' : ''} onClick={() => setTab('lista')}>
            Lista de adyacencia
          </button>
          <button role="tab" aria-selected={tab === 'matriz'} className={tab === 'matriz' ? 'active' : ''} onClick={() => setTab('matriz')}>
            Matriz de adyacencia
          </button>
        </div>
      </div>

      {tab === 'lista' ? (
        <div className="adj-list">
          {ordered.map((n) => (
            <div key={n.id} className="adj-row">
              <span className={`adj-node ${n.type}`}>
                {n.type === 'city' ? '🏙' : '👤'} {n.name}
              </span>
              <span className="arrow">→</span>
              <span className="adj-neighbors">
                {graph.adjList[n.id].length === 0
                  ? '[ ]'
                  : graph.adjList[n.id].map((v) => (
                      <span key={v} className={`adj-chip ${graph.searchNode(v)?.type}`}>
                        {name(v)}
                      </span>
                    ))}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th />
                {ids.map((id) => (
                  <th key={id} title={name(id)} className={graph.isCity(id) ? 'city' : ''}>
                    {initials(name(id))}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ids.map((row, i) => (
                <tr key={row}>
                  <th title={name(row)} className={graph.isCity(row) ? 'city' : ''}>
                    {name(row)}
                  </th>
                  {matrix[i].map((v, j) => (
                    <td key={ids[j]} className={v ? 'one' : ''}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="muted small">
        {tab === 'lista'
          ? 'Cada nodo guarda la lista de ids de sus vecinos (objeto adjList). Es la representación que usa la clase Graph.'
          : 'Fila y columna por nodo: 1 si hay arista, 0 si no. La matriz es simétrica porque el grafo es no dirigido. Pase el mouse sobre las iniciales para ver el nombre.'}
      </p>
    </div>
  );
}
