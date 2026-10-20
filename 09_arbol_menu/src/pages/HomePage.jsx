import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArbolNario } from '../structures/ArbolNario.js';
import PageHeader from '../components/PageHeader.jsx';

/**
 * PÁGINA DE LA RAÍZ: explorador del árbol N-ario de menús.
 * Muestra la terminología (tamaño, altura, hojas, grado), la impresión
 * del árbol y los recorridos DFS y BFS vistos en clase.
 * Estudiante: Salvador Rodriguez Velasco
 */
export default function HomePage({ nodo, nivel }) {
  // El nodo raíz llega por props; con él se arma el árbol a explorar
  const arbol = useMemo(() => new ArbolNario(nodo), [nodo]);
  const [recorrido, setRecorrido] = useState('dfs');

  const formato = (v) => `${v.icon} ${v.title}   (${v.link})`;
  const impresion = arbol.imprimir(formato);

  // Se ejecuta el recorrido elegido; también se imprime en la consola del navegador
  const pasos = useMemo(() => {
    const visitar = (n, nv) => console.log(`${'  '.repeat(nv)}${n.valor.title}`);
    return recorrido === 'dfs' ? arbol.dfs(visitar) : arbol.bfs(visitar);
  }, [arbol, recorrido]);

  const todos = arbol.dfs(() => {});

  const stats = [
    { label: 'tamano()', value: arbol.tamano(), hint: 'nodos en total' },
    { label: 'altura()', value: arbol.altura(), hint: 'nivel máximo' },
    { label: 'hojas()', value: arbol.hojas().length, hint: 'nodos sin hijos' },
    { label: 'grado()', value: arbol.grado(), hint: 'máx. hijos por nodo' },
    { label: 'raiz.hijos', value: nodo.hijos.length, hint: 'menús principales' },
  ];

  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        El menú lateral se genera imprimiendo este árbol N-ario. Cada ítem es un nodo con{' '}
        <code>title</code>, <code>link</code> y <code>component</code>; los submenús son sus hijos.
      </PageHeader>

      <div className="stats">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-hint">{s.hint}</span>
          </div>
        ))}
      </div>

      <div className="grid-2 grid-home">
        <div className="panel">
          <h3>Impresión del árbol</h3>
          <pre className="tree-print">{impresion}</pre>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Recorrido</h3>
            <div className="segmented" role="tablist">
              <button
                className={recorrido === 'dfs' ? 'active' : ''}
                onClick={() => setRecorrido('dfs')}
                role="tab"
                aria-selected={recorrido === 'dfs'}
              >
                DFS · profundidad
              </button>
              <button
                className={recorrido === 'bfs' ? 'active' : ''}
                onClick={() => setRecorrido('bfs')}
                role="tab"
                aria-selected={recorrido === 'bfs'}
              >
                BFS · por niveles
              </button>
            </div>
          </div>
          <p className="muted small">
            {recorrido === 'dfs'
              ? 'Baja lo más profundo posible por una rama antes de continuar con la siguiente (recursivo). Es el mismo orden en que se imprime el menú lateral.'
              : 'Recorre nivel por nivel, de izquierda a derecha, usando una cola.'}
          </p>
          <ol className="walk">
            {pasos.map(({ nodo: n, nivel: nv }) => (
              <li key={n.valor.id} style={{ paddingLeft: recorrido === 'dfs' ? nv * 16 : 0 }}>
                <span className={`lvl lvl-${nv}`}>N{nv}</span>
                {n.valor.icon} {n.valor.title}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="panel">
        <h3>Ítems del menú (nodos del árbol)</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>title</th>
                <th>link</th>
                <th>component</th>
                <th>Nivel</th>
                <th>Hijos</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {todos.map(({ nodo: n, nivel: nv }) => (
                <tr key={n.valor.id}>
                  <td style={{ paddingLeft: 12 + nv * 14 }}>
                    {n.valor.icon} {n.valor.title}
                  </td>
                  <td>
                    <Link to={n.valor.link} className="mono">
                      {n.valor.link}
                    </Link>
                  </td>
                  <td className="mono">
                    &lt;{n.valor.component.displayName || n.valor.component.name} /&gt;
                  </td>
                  <td>{nv}</td>
                  <td>{n.hijos.length}</td>
                  <td>
                    <span className={`tag tag-${nv === 0 ? 'raiz' : n.esHoja() ? 'hoja' : 'rama'}`}>
                      {nv === 0 ? 'raíz' : n.esHoja() ? 'hoja' : 'rama'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
