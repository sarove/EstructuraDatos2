// Muestra el MinHeap de tamaño K usado en la búsqueda: como arreglo y como árbol.
const ANCHO = 420;
const ALTO_NIVEL = 62;

export default function HeapVista({ heap, k }) {
  const niveles = heap.length ? Math.floor(Math.log2(heap.length)) + 1 : 0;

  // Posición de cada índice en un árbol binario completo.
  const pos = (i) => {
    const nivel = Math.floor(Math.log2(i + 1));
    const primero = 2 ** nivel - 1;
    const enNivel = 2 ** nivel;
    return { x: ((i - primero + 0.5) / enNivel) * ANCHO, y: 28 + nivel * ALTO_NIVEL };
  };

  return (
    <div className="heap">
      <h2>MinHeap interno (tamaño K = {k})</h2>
      <p className="nota">
        Guarda los K más populares vistos hasta el momento. La raíz (índice 0) es el menos popular de ellos: es el que
        sale con <code>pop()</code> cuando el heap pasa de K elementos.
      </p>
      {heap.length === 0 ? (
        <p className="vacio">Heap vacío.</p>
      ) : (
        <>
          <div className="arreglo">
            {heap.map((p, i) => (
              <div key={p.name} className={i === 0 ? 'celda raiz' : 'celda'}>
                <small>[{i}]</small>
                <strong>{p.popularity}</strong>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
          <svg viewBox={`0 0 ${ANCHO} ${niveles * ALTO_NIVEL + 10}`} className="arbol-heap" role="img" aria-label="Heap como árbol">
            {heap.map((_, i) => {
              if (i === 0) return null;
              const a = pos(i);
              const b = pos(Math.floor((i - 1) / 2));
              return <line key={'l' + i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
            })}
            {heap.map((p, i) => {
              const { x, y } = pos(i);
              return (
                <g key={p.name} className={i === 0 ? 'nodo raiz' : 'nodo'}>
                  <circle cx={x} cy={y} r="19" />
                  <text x={x} y={y} dy="0.35em" textAnchor="middle">{p.popularity}</text>
                </g>
              );
            })}
          </svg>
        </>
      )}
    </div>
  );
}
